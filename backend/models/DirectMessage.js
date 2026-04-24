/**
 * @fileoverview DirectMessage Schema — MongoDB Model
 *
 * Stores direct messages between friends (separate from ride chat).
 * Messages are scoped to a conversation between two users.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} DirectMessage
 * @property {ObjectId} senderId    - The User who sent this message
 * @property {ObjectId} receiverId  - The User who receives this message
 * @property {string}   text        - Message content
 * @property {boolean}  read        - Whether the recipient has read the message
 * @property {Array}    reactions   - Emoji reactions on this message
 * @property {Date}     createdAt   - Auto-generated timestamp
 * @property {Date}     updatedAt   - Auto-generated timestamp
 */
const directMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  },
  read: {
    type: Boolean,
    default: false
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    emoji: {
      type: String,
      required: true,
      maxlength: 10
    }
  }],
}, { timestamps: true });

// ─── Performance Indexes ─────────────────────────────
// Conversation lookup: messages between two users sorted by time
directMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
// Unread count for a user
directMessageSchema.index({ receiverId: 1, read: 1 });

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

module.exports = { DirectMessage };
