/**
 * @fileoverview Message Schema — MongoDB Model
 *
 * Stores real-time chat messages exchanged between drivers and passengers.
 * Messages are scoped to a specific RideRequest, enabling per-ride conversations.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Message
 * @property {ObjectId} requestId - The RideRequest this message belongs to
 * @property {ObjectId} senderId  - The User who sent this message
 * @property {string}   text      - Message content
 * @property {Date}     createdAt - Auto-generated timestamp
 * @property {Date}     updatedAt - Auto-generated timestamp
 */
const messageSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideRequest',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
}, { timestamps: true });

// ─── Performance Indexes ─────────────────────────────
messageSchema.index({ requestId: 1, createdAt: 1 });    // Chat messages for a ride (sorted)

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message };