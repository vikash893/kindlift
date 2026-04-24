/**
 * @fileoverview Direct Message Routes
 *
 * Manages direct messaging between friends.
 * Only accepted friends can exchange messages.
 *
 * @requires express          - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../models/DirectMessage - DirectMessage model
 * @requires ../models/Friendship - Friendship model
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { DirectMessage } = require('../models/DirectMessage');
const { Friendship } = require('../models/Friendship');
const { User } = require('../models/User');

const router = express.Router();

/**
 * Middleware: verify two users are accepted friends
 */
const requireFriendship = async (req, res, next) => {
  const otherUserId = req.body.receiverId || req.params.userId;
  if (!otherUserId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const friendship = await Friendship.findOne({
    $or: [
      { requester: req.user.id, recipient: otherUserId, status: 'accepted' },
      { requester: otherUserId, recipient: req.user.id, status: 'accepted' }
    ]
  });

  if (!friendship) {
    return res.status(403).json({ message: 'You can only message accepted friends' });
  }

  next();
};

/**
 * POST /send — Send a direct message to a friend
 */
router.post('/send', authMiddleware, requireFriendship, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = new DirectMessage({
      senderId: req.user.id,
      receiverId,
      text: text.substring(0, 2000).trim(),
    });

    await message.save();

    const msgPayload = {
      _id: message._id,
      senderId: message.senderId.toString(),
      receiverId: message.receiverId.toString(),
      text: message.text,
      read: message.read,
      reactions: message.reactions || [],
      createdAt: message.createdAt,
    };

    // Real-time delivery — emit to BOTH sender and receiver rooms
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('dm_message', msgPayload);
      io.to(req.user.id).emit('dm_message', msgPayload);
    }

    res.status(201).json(msgPayload);
  } catch (err) {
    console.error('DM send error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /conversations — Get all conversations (list of friends with latest message)
 */
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    // Get all accepted friend IDs
    const friendships = await Friendship.find({
      $or: [
        { requester: req.user.id, status: 'accepted' },
        { recipient: req.user.id, status: 'accepted' }
      ]
    }).lean();

    const friendIds = friendships.map(f =>
      f.requester.toString() === req.user.id ? f.recipient : f.requester
    );

    if (friendIds.length === 0) {
      return res.json([]);
    }

    // For each friend, get the latest message and unread count
    const conversations = await Promise.all(
      friendIds.map(async (friendId) => {
        const [latestMessage, unreadCount, friend] = await Promise.all([
          DirectMessage.findOne({
            $or: [
              { senderId: req.user.id, receiverId: friendId },
              { senderId: friendId, receiverId: req.user.id }
            ]
          }).sort({ createdAt: -1 }).lean(),
          DirectMessage.countDocuments({
            senderId: friendId,
            receiverId: req.user.id,
            read: false
          }),
          User.findById(friendId)
            .select('name email profilePhoto isDriverVerified driverVerificationStatus')
            .lean()
        ]);

        return {
          friend,
          latestMessage,
          unreadCount
        };
      })
    );

    // Sort by latest message time (most recent first), conversations with messages first
    conversations.sort((a, b) => {
      if (!a.latestMessage && !b.latestMessage) return 0;
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;
      return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
    });

    res.json(conversations);
  } catch (err) {
    console.error('Conversations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /:userId/messages — Get messages with a specific friend
 */
router.get('/:userId/messages', authMiddleware, requireFriendship, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await DirectMessage.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Mark unread messages as read
    await DirectMessage.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user.id,
        read: false
      },
      { $set: { read: true } }
    );

    // Return in chronological order
    res.json(messages.reverse());
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /unread-count — Get total unread message count
 */
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const count = await DirectMessage.countDocuments({
      receiverId: req.user.id,
      read: false
    });
    res.json({ count });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /:userId/read — Mark all messages from a user as read
 */
router.put('/:userId/read', authMiddleware, async (req, res) => {
  try {
    await DirectMessage.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user.id,
        read: false
      },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /react — Toggle an emoji reaction on a message
 * If the user already reacted with the same emoji, remove it (toggle off).
 * If the user reacted with a different emoji, replace it.
 * If no reaction exists, add it.
 */
router.put('/react', authMiddleware, async (req, res) => {
  try {
    const { messageId, emoji } = req.body;

    if (!messageId || !emoji) {
      return res.status(400).json({ message: 'messageId and emoji are required' });
    }

    const message = await DirectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify the current user is either sender or receiver
    const userId = req.user.id;
    if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to react to this message' });
    }

    // Check if user already has a reaction
    const existingIdx = message.reactions.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingIdx !== -1) {
      if (message.reactions[existingIdx].emoji === emoji) {
        // Same emoji — toggle off (remove)
        message.reactions.splice(existingIdx, 1);
      } else {
        // Different emoji — replace
        message.reactions[existingIdx].emoji = emoji;
      }
    } else {
      // No existing reaction — add new
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    const reactionPayload = {
      messageId: message._id,
      reactions: message.reactions,
    };

    // Real-time delivery to both parties
    const io = req.app.get('io');
    if (io) {
      io.to(message.senderId.toString()).emit('dm_reaction', reactionPayload);
      io.to(message.receiverId.toString()).emit('dm_reaction', reactionPayload);
    }

    res.json(reactionPayload);
  } catch (err) {
    console.error('React error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
