/**
 * @fileoverview Friendship Schema — MongoDB Model
 *
 * Manages friend connections between KindLift users.
 * Supports send, accept, reject, and block workflows.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Friendship
 * @property {ObjectId} requester - User who sent the friend request
 * @property {ObjectId} recipient - User who received the request
 * @property {string}   status    - Current state: pending, accepted, rejected, blocked
 * @property {Date}     createdAt - Auto-generated timestamp
 * @property {Date}     updatedAt - Auto-generated timestamp
 */
const friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
}, { timestamps: true });

// ─── Performance Indexes ─────────────────────────────
// Unique constraint prevents duplicate friend requests
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ recipient: 1, status: 1 });    // Incoming requests lookup
friendshipSchema.index({ status: 1 });                   // Filter by status

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = { Friendship };
