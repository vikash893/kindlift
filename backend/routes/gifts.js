/**
 * @fileoverview Gift Routes — Full gifting API
 *
 * Endpoints:
 *   POST   /api/gifts/send              - Send a gift (atomic wallet debit+credit)
 *   GET    /api/gifts/received           - Paginated received gifts
 *   GET    /api/gifts/sent               - Paginated sent gifts
 *   GET    /api/gifts/types              - Gift type catalog
 *   GET    /api/gifts/:giftId            - Single gift detail
 *   PATCH  /api/gifts/:giftId/open       - Mark gift as opened
 *   PATCH  /api/gifts/:giftId/bookmark   - Toggle bookmark
 *   PATCH  /api/gifts/:giftId/showcase   - Toggle showcase
 *   POST   /api/gifts/:giftId/react      - Add reaction
 *   GET    /api/gifts/wall/:userId       - Public gift wall
 *   GET    /api/gifts/leaderboard        - Top givers
 *   GET    /api/gifts/reputation         - Current user reputation
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Gift } = require('../models/Gift');
const { GiftType } = require('../models/GiftType');
const { SenderReputation, BADGE_TIERS } = require('../models/SenderReputation');
const { Notification } = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

// ─── In-memory daily limit tracking (production would use Redis) ──────
const dailyLimits = new Map(); // key: `${userId}:${date}` → { count, spend }

function getDailyKey(userId) {
  const date = new Date().toISOString().slice(0, 10);
  return `${userId}:${date}`;
}

function getDailyStats(userId) {
  const key = getDailyKey(userId);
  if (!dailyLimits.has(key)) {
    dailyLimits.set(key, { count: 0, spend: 0 });
  }
  return dailyLimits.get(key);
}

// Clean old entries every hour
setInterval(() => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [key] of dailyLimits) {
    if (!key.endsWith(today)) dailyLimits.delete(key);
  }
}, 3600000);

// ─── Anti-Abuse Validation ───────────────────────────────────────────
async function validateGiftRules(senderId, receiverId, coinValue) {
  const errors = [];

  // Self-gifting
  if (senderId === receiverId) {
    errors.push({ code: 'SELF_GIFT_FORBIDDEN', message: 'You cannot send a gift to yourself' });
    return errors;
  }

  // Minimum threshold
  if (coinValue < 5) {
    errors.push({ code: 'BELOW_MINIMUM_COIN_VALUE', message: 'Minimum gift value is 5 coins' });
  }

  // Daily send limit (20/day)
  const stats = getDailyStats(senderId);
  if (stats.count >= 20) {
    errors.push({ code: 'DAILY_LIMIT_REACHED', message: 'You\'ve reached your daily gift limit (20). Resets at midnight UTC.' });
  }

  // Daily spend limit (2000 coins/day)
  if (stats.spend + coinValue > 2000) {
    errors.push({ code: 'DAILY_SPEND_LIMIT', message: `Daily spend limit is 2000 coins. You have ${2000 - stats.spend} remaining.` });
  }

  // Velocity check: >5 gifts to same receiver in 1 hour
  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentToSame = await Gift.countDocuments({
    senderId, receiverId, createdAt: { $gte: oneHourAgo },
  });
  if (recentToSame >= 5) {
    errors.push({ code: 'VELOCITY_LIMIT_RECEIVER', message: 'Too many gifts to this person recently. Please wait.' });
  }

  return errors;
}

// ─── Reputation Calculation ──────────────────────────────────────────
async function processReputation(senderId, receiverId, giftType, coinValue) {
  let rep = await SenderReputation.findOne({ userId: senderId });
  if (!rep) {
    rep = new SenderReputation({ userId: senderId });
  }

  // Base points
  const basePoints = Math.ceil(coinValue / 10) + (giftType.baseWeightBonus || 0);

  // Streak bonus
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = rep.lastGiftDate ? rep.lastGiftDate.toISOString().slice(0, 10) : null;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (lastDate === yesterday) {
    rep.giftingStreakDays = Math.min(rep.giftingStreakDays + 1, 30);
  } else if (lastDate !== today) {
    rep.giftingStreakDays = 1;
  }
  const streakMultiplier = 1 + Math.min(rep.giftingStreakDays, 20) * 0.1;

  // First-time gift to this receiver bonus
  const isFirstToReceiver = !rep.uniqueReceivers.some(
    r => r.toString() === receiverId.toString()
  );
  const noveltyBonus = isFirstToReceiver ? 25 : 0;

  // Total reputation delta
  const delta = Math.round(basePoints * streakMultiplier) + noveltyBonus;

  // Update stats
  rep.totalReputation += delta;
  rep.giftsSentCount += 1;
  rep.lastGiftDate = new Date();
  if (isFirstToReceiver) {
    rep.uniqueReceivers.push(receiverId);
    rep.uniqueReceiversCount = rep.uniqueReceivers.length;
  }

  // Compute new badge tier
  const tier = SenderReputation.computeTier(rep.totalReputation);
  rep.badgeTier = tier.name;

  // Compute perks
  rep.perksUnlocked = SenderReputation.computePerks({
    giftsSentCount: rep.giftsSentCount,
    totalReputation: rep.totalReputation,
    badgeTier: rep.badgeTier,
  });

  await rep.save();
  return rep;
}

// ═══════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════

/**
 * GET /api/gifts/types — Gift type catalog
 */
router.get('/types', async (req, res) => {
  try {
    let types = await GiftType.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    // Auto-seed if DB has no gift types (first deploy / no seed script run)
    if (types.length === 0) {
      console.log('🎁 No gift types in DB — auto-seeding...');
      const SEED = [
        { key: 'thank_you',   category: 'Appreciation', displayName: 'Thank You',          icon: '🤍', colorHex: '#D4A038', minCoins: 5,   maxCoins: 50,   baseWeightBonus: 2,  sortOrder: 1 },
        { key: 'respect',     category: 'Appreciation', displayName: 'Deep Respect',       icon: '🌿', colorHex: '#2D6A4F', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 5,  sortOrder: 2 },
        { key: 'recognition', category: 'Appreciation', displayName: 'Recognition',        icon: '⭐', colorHex: '#F59E0B', minCoins: 20,  maxCoins: 200,  baseWeightBonus: 8,  sortOrder: 3 },
        { key: 'congrats',    category: 'Celebration',  displayName: 'Congrats',            icon: '🎊', colorHex: '#7C3AED', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 4,  sortOrder: 4 },
        { key: 'achievement', category: 'Celebration',  displayName: 'Achievement Unlocked',icon: '🏆', colorHex: '#B8860B', minCoins: 50,  maxCoins: 500,  baseWeightBonus: 15, sortOrder: 5 },
        { key: 'milestone',   category: 'Celebration',  displayName: 'Milestone',           icon: '🎯', colorHex: '#1E40AF', minCoins: 25,  maxCoins: 250,  baseWeightBonus: 10, sortOrder: 6 },
        { key: 'stay_strong', category: 'Support',      displayName: 'Stay Strong',         icon: '💙', colorHex: '#4682B4', minCoins: 5,   maxCoins: 50,   baseWeightBonus: 6,  sortOrder: 7 },
        { key: 'we_got_you',  category: 'Support',      displayName: 'We Got You',          icon: '🤝', colorHex: '#C07850', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 5,  sortOrder: 8 },
        { key: 'believe',     category: 'Support',      displayName: 'I Believe In You',    icon: '🌱', colorHex: '#6B8E23', minCoins: 10,  maxCoins: 75,   baseWeightBonus: 5,  sortOrder: 9 },
        { key: 'hype',        category: 'Playful',      displayName: 'Hype Train',          icon: '🚀', colorHex: '#FF6B35', minCoins: 5,   maxCoins: 30,   baseWeightBonus: 1,  sortOrder: 10 },
        { key: 'vibes',       category: 'Playful',      displayName: 'Good Vibes',          icon: '🌊', colorHex: '#06B6D4', minCoins: 5,   maxCoins: 25,   baseWeightBonus: 1,  sortOrder: 11 },
        { key: 'legendary',   category: 'Exclusive',    displayName: 'Legendary',           icon: '👑', colorHex: '#9333EA', minCoins: 500, maxCoins: null,  baseWeightBonus: 50, sortOrder: 12 },
      ];
      await GiftType.insertMany(SEED.map(s => ({ ...s, isActive: true, emotionalWeight: 'Medium' })));
      types = await GiftType.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
      console.log(`🎁 Auto-seeded ${types.length} gift types`);
    }

    res.json({ status: 'success', data: types });
  } catch (err) {
    console.error('Gift types fetch error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * GET /api/gifts/leaderboard — Top givers by reputation
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const page = parseInt(req.query.page) || 1;

    const leaders = await SenderReputation.find()
      .sort({ totalReputation: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name profilePhoto')
      .lean();

    const total = await SenderReputation.countDocuments();

    res.json({
      status: 'success',
      data: leaders.map(l => ({
        userId: l.userId?._id,
        name: l.userId?.name,
        profilePhoto: l.userId?.profilePhoto,
        totalReputation: l.totalReputation,
        badgeTier: l.badgeTier,
        giftsSentCount: l.giftsSentCount,
        giftingStreakDays: l.giftingStreakDays,
      })),
      meta: { page, total, hasMore: page * limit < total },
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * GET /api/gifts/reputation — Current user's reputation & badge progress
 */
router.get('/reputation', authMiddleware, async (req, res) => {
  try {
    let rep = await SenderReputation.findOne({ userId: req.user.id }).lean();
    if (!rep) {
      rep = { totalReputation: 0, badgeTier: 'Bronze Giver', giftsSentCount: 0, giftingStreakDays: 0, perksUnlocked: [] };
    }

    const progress = SenderReputation.computeProgress(rep.totalReputation);

    res.json({
      status: 'success',
      data: { ...rep, badgeProgress: progress },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * POST /api/gifts/send — Send a gift (atomic)
 */
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, gift_type_key, message, mood_tag, is_anonymous, is_public } = req.body;
    const coin_value = parseInt(req.body.coin_value) || 0;

    console.log('🎁 Gift send request:', { senderId, receiver_id, coin_value, gift_type_key, hasMessage: !!message });

    // Validate required fields
    if (!receiver_id || coin_value <= 0 || !gift_type_key) {
      console.log('🎁 Validation failed — missing fields:', { receiver_id: !!receiver_id, coin_value, gift_type_key: !!gift_type_key });
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${!receiver_id ? 'receiver_id ' : ''}${coin_value <= 0 ? 'coin_value ' : ''}${!gift_type_key ? 'gift_type_key' : ''}`.trim(),
      });
    }

    // Anti-abuse validation
    const abuseErrors = await validateGiftRules(senderId, receiver_id, coin_value);
    if (abuseErrors.length > 0) {
      return res.status(403).json({
        status: 'error',
        errors: abuseErrors,
        message: abuseErrors[0].message,
      });
    }

    // Validate gift type exists — auto-seed if known key is missing from DB
    let giftType = await GiftType.findOne({ key: gift_type_key, isActive: true });
    if (!giftType) {
      // Attempt to auto-create from known catalog
      const KNOWN_TYPES = {
        thank_you:    { category: 'Appreciation', displayName: 'Thank You',          icon: '🤍', colorHex: '#D4A038', minCoins: 5,   maxCoins: 50,   baseWeightBonus: 2,  emotionalWeight: 'Medium' },
        respect:      { category: 'Appreciation', displayName: 'Deep Respect',       icon: '🌿', colorHex: '#2D6A4F', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 5,  emotionalWeight: 'High' },
        recognition:  { category: 'Appreciation', displayName: 'Recognition',        icon: '⭐', colorHex: '#F59E0B', minCoins: 20,  maxCoins: 200,  baseWeightBonus: 8,  emotionalWeight: 'High' },
        congrats:     { category: 'Celebration',  displayName: 'Congrats',            icon: '🎊', colorHex: '#7C3AED', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 4,  emotionalWeight: 'Medium' },
        achievement:  { category: 'Celebration',  displayName: 'Achievement Unlocked',icon: '🏆', colorHex: '#B8860B', minCoins: 50,  maxCoins: 500,  baseWeightBonus: 15, emotionalWeight: 'Very High' },
        milestone:    { category: 'Celebration',  displayName: 'Milestone',           icon: '🎯', colorHex: '#1E40AF', minCoins: 25,  maxCoins: 250,  baseWeightBonus: 10, emotionalWeight: 'High' },
        stay_strong:  { category: 'Support',      displayName: 'Stay Strong',         icon: '💙', colorHex: '#4682B4', minCoins: 5,   maxCoins: 50,   baseWeightBonus: 6,  emotionalWeight: 'Very High' },
        we_got_you:   { category: 'Support',      displayName: 'We Got You',          icon: '🤝', colorHex: '#C07850', minCoins: 10,  maxCoins: 100,  baseWeightBonus: 5,  emotionalWeight: 'High' },
        believe:      { category: 'Support',      displayName: 'I Believe In You',    icon: '🌱', colorHex: '#6B8E23', minCoins: 10,  maxCoins: 75,   baseWeightBonus: 5,  emotionalWeight: 'High' },
        hype:         { category: 'Playful',      displayName: 'Hype Train',          icon: '🚀', colorHex: '#FF6B35', minCoins: 5,   maxCoins: 30,   baseWeightBonus: 1,  emotionalWeight: 'Low' },
        vibes:        { category: 'Playful',      displayName: 'Good Vibes',          icon: '🌊', colorHex: '#06B6D4', minCoins: 5,   maxCoins: 25,   baseWeightBonus: 1,  emotionalWeight: 'Low' },
        legendary:    { category: 'Exclusive',    displayName: 'Legendary',           icon: '👑', colorHex: '#9333EA', minCoins: 500, maxCoins: null,  baseWeightBonus: 50, emotionalWeight: 'Maximum' },
      };
      const known = KNOWN_TYPES[gift_type_key];
      if (known) {
        giftType = await GiftType.findOneAndUpdate(
          { key: gift_type_key },
          { $setOnInsert: { key: gift_type_key, ...known, isActive: true, sortOrder: 0 } },
          { upsert: true, new: true }
        );
        console.log(`🎁 Auto-seeded gift type: ${gift_type_key}`);
      } else {
        return res.status(400).json({ status: 'error', message: `Unknown gift type: "${gift_type_key}"` });
      }
    }

    // Validate coin range
    if (coin_value < giftType.minCoins) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum for ${giftType.displayName} is ${giftType.minCoins} coins`,
      });
    }
    if (giftType.maxCoins && coin_value > giftType.maxCoins) {
      return res.status(400).json({
        status: 'error',
        message: `Maximum for ${giftType.displayName} is ${giftType.maxCoins} coins`,
      });
    }

    // Validate sender has enough coins
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ status: 'error', message: 'Sender not found' });
    if (sender.coins < coin_value) {
      return res.status(400).json({
        status: 'error',
        code: 'INSUFFICIENT_FUNDS',
        message: `Not enough coins. You have ${sender.coins} coins.`,
      });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiver_id);
    if (!receiver) return res.status(404).json({ status: 'error', message: 'Receiver not found' });

    // ─── Atomic Debit + Credit (no session required) ───
    // Step 1: Atomically debit sender (only if they have enough coins)
    const debitResult = await User.findOneAndUpdate(
      { _id: senderId, coins: { $gte: coin_value } },
      { $inc: { coins: -coin_value } },
      { new: true }
    );
    if (!debitResult) {
      return res.status(400).json({
        status: 'error',
        code: 'INSUFFICIENT_FUNDS',
        message: `Not enough coins. You have ${sender.coins} coins.`,
      });
    }

    let gift;
    try {
      // Step 2: Credit receiver
      await User.findByIdAndUpdate(
        receiver_id,
        { $inc: { coins: coin_value } }
      );

      // Step 3: Create gift record
      gift = new Gift({
        senderId,
        receiverId: receiver_id,
        giftTypeId: giftType._id,
        coinValue: coin_value,
        message: (message || '').substring(0, 500),
        moodTag: mood_tag || null,
        isAnonymous: is_anonymous || false,
        isPublic: is_public !== false,
      });
      await gift.save();
    } catch (innerErr) {
      // Rollback: refund sender if credit or gift creation failed
      console.error('🎁 Gift creation failed, rolling back debit:', innerErr.message);
      await User.findByIdAndUpdate(senderId, { $inc: { coins: coin_value } });
      throw innerErr;
    }

    // ─── Post-commit side effects ──────────────────────

    // Update daily limits
    const dailyStats = getDailyStats(senderId);
    dailyStats.count += 1;
    dailyStats.spend += coin_value;

    // Process reputation
    const rep = await processReputation(senderId, receiver_id, giftType, coin_value);
    const progress = SenderReputation.computeProgress(rep.totalReputation);

    // Create notification for receiver
    const senderName = req.body.is_anonymous ? 'Someone' : sender.name;
    const notif = new Notification({
      recipientId: receiver_id,
      type: 'gift_received',
      title: `${senderName} sent you a gift!`,
      message: `You received a ${giftType.displayName} ${giftType.icon} gift!`,
      metadata: {
        giftId: gift._id,
        giftTypeKey: giftType.key,
        giftTypeIcon: giftType.icon,
        giftTypeColor: giftType.colorHex,
        coinValue: coin_value,
        senderName: senderName,
        senderAvatar: req.body.is_anonymous ? null : sender.profilePhoto,
        isAnonymous: req.body.is_anonymous || false,
      },
      actionUrl: `/gifts/${gift._id}`,
    });
    await notif.save();

    // Socket.IO real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(receiver_id).emit('notification', notif);
      io.to(receiver_id).emit('gift_received', {
        giftId: gift._id,
        senderName,
        senderAvatar: req.body.is_anonymous ? null : sender.profilePhoto,
        giftType: giftType.displayName,
        giftTypeIcon: giftType.icon,
        giftTypeColor: giftType.colorHex,
        coinValue: coin_value,
        messagePreview: message ? message.substring(0, 60) : '',
        timestamp: gift.createdAt,
      });
    }

    // ─── Email notification (fire-and-forget) ──────────
    if (receiver.email) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const emailSubject = `${senderName} sent you a gift 🎁`;
      const emailHtml = `
        <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f0f0f0">
          <div style="background:linear-gradient(135deg,${giftType.colorHex},${giftType.colorHex}cc);padding:32px;text-align:center">
            <span style="font-size:48px;display:block;margin-bottom:8px">${giftType.icon}</span>
            <h1 style="color:#fff;font-size:22px;margin:0">${senderName} sent you a gift!</h1>
          </div>
          <div style="padding:32px;text-align:center">
            <p style="font-size:16px;color:#333;margin:0 0 8px">You received a <b style="color:${giftType.colorHex}">${giftType.displayName}</b> gift</p>
            <p style="font-size:28px;font-weight:bold;color:#d4a038;margin:16px 0">${coin_value} 🪙 coins</p>
            ${message ? `<div style="background:#fafafa;border-radius:12px;padding:16px;margin:16px 0;text-align:left"><p style="font-size:14px;color:#555;margin:0;font-style:italic">"${message.substring(0, 200)}"</p></div>` : ''}
            <a href="${frontendUrl}/gifts" style="display:inline-block;margin-top:20px;padding:14px 32px;background:${giftType.colorHex};color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;font-size:16px">Open your gift 🎁</a>
          </div>
          <div style="background:#fafafa;padding:16px;text-align:center;border-top:1px solid #f0f0f0">
            <p style="font-size:12px;color:#999;margin:0">KindLift — Spread kindness, one gift at a time</p>
          </div>
        </div>
      `;
      sendEmail(receiver.email, emailSubject, emailHtml)
        .catch(err => console.error('Gift email failed:', err.message));
    }

    // Remaining balance
    const updatedSender = await User.findById(senderId).select('coins').lean();

    res.status(201).json({
      status: 'success',
      data: {
        gift_id: gift._id,
        sender_new_reputation: rep.totalReputation,
        badge_progress: progress,
        wallet_balance_remaining: updatedSender.coins,
        gift_type: {
          key: giftType.key,
          displayName: giftType.displayName,
          icon: giftType.icon,
          colorHex: giftType.colorHex,
          animation: giftType.animation,
        },
      },
    });
  } catch (err) {
    console.error('Gift send error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to send gift' });
  }
});

/**
 * GET /api/gifts/received — Paginated received gifts
 */
router.get('/received', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const filter = req.query.filter; // 'bookmarked', 'showcased', 'unopened'

    const query = { receiverId: req.user.id };
    if (filter === 'bookmarked') query.bookmarkedAt = { $ne: null };
    if (filter === 'showcased') query.showcasedAt = { $ne: null };
    if (filter === 'unopened') query.openedAt = null;

    const [gifts, total] = await Promise.all([
      Gift.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('senderId', 'name profilePhoto')
        .populate('giftTypeId')
        .lean(),
      Gift.countDocuments(query),
    ]);

    // Mask sender info for anonymous gifts
    const maskedGifts = gifts.map(g => {
      if (g.isAnonymous) {
        g.senderId = { name: 'Anonymous', profilePhoto: null };
      }
      return g;
    });

    res.json({
      status: 'success',
      data: maskedGifts,
      meta: { page, total, hasMore: page * limit < total },
    });
  } catch (err) {
    console.error('Received gifts error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * GET /api/gifts/sent — Paginated sent gifts
 */
router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const [gifts, total] = await Promise.all([
      Gift.find({ senderId: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('receiverId', 'name profilePhoto')
        .populate('giftTypeId')
        .lean(),
      Gift.countDocuments({ senderId: req.user.id }),
    ]);

    res.json({
      status: 'success',
      data: gifts,
      meta: { page, total, hasMore: page * limit < total },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * GET /api/gifts/:giftId — Single gift detail
 */
router.get('/:giftId', authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId)
      .populate('senderId', 'name profilePhoto')
      .populate('receiverId', 'name profilePhoto')
      .populate('giftTypeId')
      .lean();

    if (!gift) return res.status(404).json({ status: 'error', message: 'Gift not found' });

    // Only sender or receiver can view
    const userId = req.user.id;
    if (gift.senderId._id.toString() !== userId && gift.receiverId._id.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    // Mask anonymous sender
    if (gift.isAnonymous && gift.receiverId._id.toString() === userId) {
      gift.senderId = { name: 'Anonymous', profilePhoto: null };
    }

    res.json({ status: 'success', data: gift });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * PATCH /api/gifts/:giftId/open — Mark gift as opened
 */
router.patch('/:giftId/open', authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findOneAndUpdate(
      { _id: req.params.giftId, receiverId: req.user.id, openedAt: null },
      { $set: { openedAt: new Date() } },
      { new: true }
    );
    if (!gift) return res.status(404).json({ status: 'error', message: 'Gift not found or already opened' });
    res.json({ status: 'success', data: gift });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * PATCH /api/gifts/:giftId/bookmark — Toggle bookmark
 */
router.patch('/:giftId/bookmark', authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findOne({ _id: req.params.giftId, receiverId: req.user.id });
    if (!gift) return res.status(404).json({ status: 'error', message: 'Gift not found' });

    gift.bookmarkedAt = gift.bookmarkedAt ? null : new Date();
    await gift.save();
    res.json({ status: 'success', data: { bookmarked: !!gift.bookmarkedAt } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * PATCH /api/gifts/:giftId/showcase — Toggle showcase
 */
router.patch('/:giftId/showcase', authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findOne({ _id: req.params.giftId, receiverId: req.user.id });
    if (!gift) return res.status(404).json({ status: 'error', message: 'Gift not found' });

    if (gift.showcasedAt) {
      gift.showcasedAt = null;
      gift.showcaseOrder = null;
    } else {
      const maxOrder = await Gift.findOne({ receiverId: req.user.id, showcasedAt: { $ne: null } })
        .sort({ showcaseOrder: -1 }).select('showcaseOrder').lean();
      gift.showcasedAt = new Date();
      gift.showcaseOrder = (maxOrder?.showcaseOrder || 0) + 1;
    }
    await gift.save();
    res.json({ status: 'success', data: { showcased: !!gift.showcasedAt } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * POST /api/gifts/:giftId/react — Add receiver reaction
 */
router.post('/:giftId/react', authMiddleware, async (req, res) => {
  try {
    const { reaction } = req.body;
    if (!['loved', 'moved', 'laughing'].includes(reaction)) {
      return res.status(400).json({ status: 'error', message: 'Invalid reaction' });
    }

    const gift = await Gift.findOneAndUpdate(
      { _id: req.params.giftId, receiverId: req.user.id },
      { $set: { receiverReaction: reaction } },
      { new: true }
    ).populate('senderId', 'name');

    if (!gift) return res.status(404).json({ status: 'error', message: 'Gift not found' });

    // Notify sender of reaction
    const receiver = await User.findById(req.user.id).select('name').lean();
    const io = req.app.get('io');
    if (io && !gift.isAnonymous) {
      io.to(gift.senderId._id.toString()).emit('notification', {
        type: 'gift_reaction',
        title: `${receiver.name} reacted to your gift!`,
        message: `They reacted with ${reaction} to your gift`,
      });
    }

    res.json({ status: 'success', data: { reaction } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

/**
 * GET /api/gifts/wall/:userId — Public gift wall (showcased gifts)
 */
router.get('/wall/:userId', async (req, res) => {
  try {
    const gifts = await Gift.find({
      receiverId: req.params.userId,
      showcasedAt: { $ne: null },
      isPublic: true,
    })
      .sort({ showcaseOrder: 1 })
      .populate('senderId', 'name profilePhoto')
      .populate('giftTypeId')
      .lean();

    // Mask anonymous
    const masked = gifts.map(g => {
      if (g.isAnonymous) g.senderId = { name: 'Anonymous', profilePhoto: null };
      return g;
    });

    res.json({ status: 'success', data: masked });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
