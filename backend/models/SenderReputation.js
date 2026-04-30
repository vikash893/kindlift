/**
 * @fileoverview SenderReputation Schema — MongoDB Model
 *
 * Tracks each user's gifting reputation, badge tier, streak data,
 * and unlocked perks. Updated atomically after each gift send.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * Badge tier thresholds and their display properties
 */
const BADGE_TIERS = [
  { name: 'Bronze Giver',    minRep: 0,     auraColor: '#CD7F32' },
  { name: 'Silver Giver',    minRep: 100,   auraColor: '#C0C0C0' },
  { name: 'Gold Giver',      minRep: 500,   auraColor: '#FFD700' },
  { name: 'Platinum Giver',  minRep: 2000,  auraColor: '#E5E4E2' },
  { name: 'Diamond Giver',   minRep: 10000, auraColor: '#B9F2FF' },
];

const senderReputationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  totalReputation: { type: Number, default: 0 },
  badgeTier: { type: String, default: 'Bronze Giver' },
  giftsSentCount: { type: Number, default: 0 },
  uniqueReceiversCount: { type: Number, default: 0 },
  giftingStreakDays: { type: Number, default: 0 },
  lastGiftDate: { type: Date, default: null },
  perksUnlocked: { type: [String], default: [] },
  uniqueReceivers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
}, { timestamps: true });

// Performance indexes
senderReputationSchema.index({ totalReputation: -1 });
senderReputationSchema.index({ giftsSentCount: -1 });

/**
 * Compute the badge tier from total reputation
 * @param {number} rep - Total reputation points
 * @returns {Object} { name, auraColor }
 */
senderReputationSchema.statics.computeTier = function (rep) {
  let tier = BADGE_TIERS[0];
  for (const t of BADGE_TIERS) {
    if (rep >= t.minRep) tier = t;
  }
  return tier;
};

/**
 * Compute progress to next badge tier
 * @param {number} rep - Total reputation points
 * @returns {Object} { current, next, progressPct }
 */
senderReputationSchema.statics.computeProgress = function (rep) {
  let currentIdx = 0;
  for (let i = 0; i < BADGE_TIERS.length; i++) {
    if (rep >= BADGE_TIERS[i].minRep) currentIdx = i;
  }
  const current = BADGE_TIERS[currentIdx];
  const next = BADGE_TIERS[currentIdx + 1] || null;
  const progressPct = next
    ? Math.min(100, Math.round(((rep - current.minRep) / (next.minRep - current.minRep)) * 100))
    : 100;

  return {
    current: current.name,
    next: next ? next.name : null,
    progressPct,
    auraColor: current.auraColor,
  };
};

/**
 * Compute unlockable perks based on stats
 * @param {Object} stats - { giftsSentCount, totalReputation, badgeTier }
 * @returns {string[]} Array of perk keys
 */
senderReputationSchema.statics.computePerks = function (stats) {
  const perks = [];
  const tier = BADGE_TIERS.findIndex(t => t.name === stats.badgeTier);

  if (tier >= 1) perks.push('animated_border');          // Silver+
  if (tier >= 2) perks.push('profile_highlight');         // Gold+
  if (tier >= 2) perks.push('priority_suggestions');      // Gold+
  if (tier >= 3) perks.push('exclusive_skins');           // Platinum+
  if (tier >= 4) perks.push('legendary_gift_type');       // Diamond+
  if (stats.giftsSentCount >= 50) perks.push('anonymous_gifting');
  if (stats.giftsSentCount >= 100) perks.push('message_templates');

  return perks;
};

const SenderReputation = mongoose.model('SenderReputation', senderReputationSchema);
module.exports = { SenderReputation, BADGE_TIERS };
