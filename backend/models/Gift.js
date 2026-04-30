/**
 * @fileoverview Gift Schema — MongoDB Model
 *
 * Core gift record linking sender → receiver with wallet debit,
 * gift type metadata, mood tags, privacy flags, and reveal state.
 * Atomic with wallet operations via Mongoose sessions.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  giftTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiftType',
    required: true,
  },
  coinValue: {
    type: Number,
    required: true,
    min: [5, 'Minimum gift value is 5 coins'],
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: '',
  },
  moodTag: {
    type: String,
    enum: ['joyful', 'grateful', 'proud', 'supportive', 'playful', null],
    default: null,
  },
  isPublic: { type: Boolean, default: true },
  isAnonymous: { type: Boolean, default: false },

  // Receiver interaction state
  receiverReaction: {
    type: String,
    enum: ['loved', 'moved', 'laughing', null],
    default: null,
  },
  openedAt: { type: Date, default: null },
  bookmarkedAt: { type: Date, default: null },
  showcasedAt: { type: Date, default: null },
  showcaseOrder: { type: Number, default: null },

  // Extensibility
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Prevent self-gifting at schema level
giftSchema.pre('validate', function () {
  if (this.senderId && this.receiverId &&
      this.senderId.toString() === this.receiverId.toString()) {
    throw new Error('Cannot send a gift to yourself');
  }
});

// Performance indexes
giftSchema.index({ receiverId: 1, createdAt: -1 });
giftSchema.index({ senderId: 1, createdAt: -1 });
giftSchema.index({ receiverId: 1, openedAt: 1 });
giftSchema.index({ receiverId: 1, showcasedAt: 1, showcaseOrder: 1 });

const Gift = mongoose.model('Gift', giftSchema);
module.exports = { Gift };
