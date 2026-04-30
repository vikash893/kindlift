/**
 * @fileoverview GiftType Schema — MongoDB Model
 *
 * Seed-able catalog of gift types. New types can be added via seed script
 * without requiring schema migrations. Each type carries display metadata,
 * animation references, coin bounds, and unlock conditions.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

const giftTypeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  category: {
    type: String,
    enum: ['Appreciation', 'Celebration', 'Support', 'Playful', 'Exclusive'],
    required: true,
  },
  displayName: { type: String, required: true },
  icon: { type: String, required: true },           // emoji
  colorHex: { type: String, required: true },        // primary accent
  animation: { type: String, default: '' },          // CSS animation name / description
  lottieUrl: { type: String, default: '' },          // optional Lottie JSON CDN URL
  soundCueKey: { type: String, default: '' },        // mapped to CDN audio asset
  baseWeightBonus: { type: Number, default: 0 },     // extra rep per gift
  minCoins: { type: Number, default: 5 },
  maxCoins: { type: Number, default: null },
  emotionalWeight: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High', 'Maximum'],
    default: 'Medium',
  },
  unlockCondition: { type: mongoose.Schema.Types.Mixed, default: null },
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

// Performance indexes
giftTypeSchema.index({ category: 1, sortOrder: 1 });
giftTypeSchema.index({ isActive: 1 });

const GiftType = mongoose.model('GiftType', giftTypeSchema);
module.exports = { GiftType };
