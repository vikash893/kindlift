/**
 * @fileoverview Gift Type Seed Script
 *
 * Seeds the GiftType collection with the full catalog of gift types.
 * Idempotent — uses upsert so re-running won't create duplicates.
 *
 * Usage: node utils/seedGiftTypes.js
 *
 * @requires mongoose
 * @requires dotenv
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { GiftType } = require('../models/GiftType');

const GIFT_TYPES = [
  // ─── Appreciation ────────────────────────────────────
  {
    key: 'thank_you',
    category: 'Appreciation',
    displayName: 'Thank You',
    icon: '🤍',
    colorHex: '#D4A038',
    animation: 'float-sparkle',
    baseWeightBonus: 2,
    minCoins: 5,
    maxCoins: 50,
    emotionalWeight: 'Medium',
    sortOrder: 1,
  },
  {
    key: 'respect',
    category: 'Appreciation',
    displayName: 'Deep Respect',
    icon: '🌿',
    colorHex: '#2D6A4F',
    animation: 'slow-pulse',
    baseWeightBonus: 5,
    minCoins: 10,
    maxCoins: 100,
    emotionalWeight: 'High',
    sortOrder: 2,
  },
  {
    key: 'recognition',
    category: 'Appreciation',
    displayName: 'Recognition',
    icon: '⭐',
    colorHex: '#F59E0B',
    animation: 'star-burst',
    baseWeightBonus: 8,
    minCoins: 20,
    maxCoins: 200,
    emotionalWeight: 'High',
    sortOrder: 3,
  },

  // ─── Celebration ─────────────────────────────────────
  {
    key: 'congrats',
    category: 'Celebration',
    displayName: 'Congrats',
    icon: '🎊',
    colorHex: '#7C3AED',
    animation: 'confetti-burst',
    baseWeightBonus: 4,
    minCoins: 10,
    maxCoins: 100,
    emotionalWeight: 'Medium',
    sortOrder: 4,
  },
  {
    key: 'achievement',
    category: 'Celebration',
    displayName: 'Achievement Unlocked',
    icon: '🏆',
    colorHex: '#B8860B',
    animation: 'trophy-shine',
    baseWeightBonus: 15,
    minCoins: 50,
    maxCoins: 500,
    emotionalWeight: 'Very High',
    sortOrder: 5,
  },
  {
    key: 'milestone',
    category: 'Celebration',
    displayName: 'Milestone',
    icon: '🎯',
    colorHex: '#1E40AF',
    animation: 'ring-ripple',
    baseWeightBonus: 10,
    minCoins: 25,
    maxCoins: 250,
    emotionalWeight: 'High',
    sortOrder: 6,
  },

  // ─── Support ─────────────────────────────────────────
  {
    key: 'stay_strong',
    category: 'Support',
    displayName: 'Stay Strong',
    icon: '💙',
    colorHex: '#4682B4',
    animation: 'heartbeat',
    baseWeightBonus: 6,
    minCoins: 5,
    maxCoins: 50,
    emotionalWeight: 'Very High',
    sortOrder: 7,
  },
  {
    key: 'we_got_you',
    category: 'Support',
    displayName: 'We Got You',
    icon: '🤝',
    colorHex: '#C07850',
    animation: 'handshake-lock',
    baseWeightBonus: 5,
    minCoins: 10,
    maxCoins: 100,
    emotionalWeight: 'High',
    sortOrder: 8,
  },
  {
    key: 'believe',
    category: 'Support',
    displayName: 'I Believe In You',
    icon: '🌱',
    colorHex: '#6B8E23',
    animation: 'growing-sprout',
    baseWeightBonus: 5,
    minCoins: 10,
    maxCoins: 75,
    emotionalWeight: 'High',
    sortOrder: 9,
  },

  // ─── Playful ─────────────────────────────────────────
  {
    key: 'hype',
    category: 'Playful',
    displayName: 'Hype Train',
    icon: '🚀',
    colorHex: '#FF6B35',
    animation: 'rocket-launch',
    baseWeightBonus: 1,
    minCoins: 5,
    maxCoins: 30,
    emotionalWeight: 'Low',
    sortOrder: 10,
  },
  {
    key: 'vibes',
    category: 'Playful',
    displayName: 'Good Vibes',
    icon: '🌊',
    colorHex: '#06B6D4',
    animation: 'wave-oscillate',
    baseWeightBonus: 1,
    minCoins: 5,
    maxCoins: 25,
    emotionalWeight: 'Low',
    sortOrder: 11,
  },

  // ─── Exclusive ───────────────────────────────────────
  {
    key: 'legendary',
    category: 'Exclusive',
    displayName: 'Legendary',
    icon: '👑',
    colorHex: '#9333EA',
    animation: 'full-screen-takeover',
    baseWeightBonus: 50,
    minCoins: 500,
    maxCoins: null,
    emotionalWeight: 'Maximum',
    isPremium: false,
    unlockCondition: { minReputation: 10000 },
    sortOrder: 12,
  },
];

async function seedGiftTypes() {
  try {
    await connectDB();

    for (const gt of GIFT_TYPES) {
      await GiftType.findOneAndUpdate(
        { key: gt.key },
        { $set: gt },
        { upsert: true, new: true }
      );
      console.log(`  ✅ ${gt.icon}  ${gt.displayName} (${gt.key})`);
    }

    console.log(`\n🎁 Seeded ${GIFT_TYPES.length} gift types successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedGiftTypes();
