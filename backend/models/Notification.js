/**
 * @fileoverview Notification Schema — MongoDB Model
 *
 * Stores role-based notifications for users and admins.
 * Supports real-time delivery via Socket.IO and
 * persistent read/unread state management.
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Who receives this notification
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },

  // Role-targeted (null = specific user, 'admin' = all admins, 'all' = broadcast)
  recipientRole: {
    type: String,
    enum: ['user', 'admin', 'all', null],
    default: null,
  },

  // Notification type
  type: {
    type: String,
    enum: [
      'ride_accepted',      // Passenger: your ride request was accepted
      'ride_rejected',      // Passenger: your ride request was rejected
      'ride_completed',     // Driver & passenger: ride marked complete
      'ride_request',       // Driver: someone requested your ride
      'verification_approved', // User: your driver verification was approved
      'verification_rejected', // User: your driver verification was rejected
      'new_verification',  // Admin: new driver verification pending
      'new_user',          // Admin: new user registered
      'new_feedback',      // Admin: new feedback submitted
      'new_rating',        // User: you received a new rating
      'friend_request',    // User: someone sent you a friend request
      'friend_accepted',   // User: someone accepted your friend request
      'dm_message',        // User: new direct message
      'system',            // System-wide announcement
    ],
    required: true,
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  // Optional metadata (ride ID, user ID, etc.)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Optional action link
  actionUrl: { type: String },

  read: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
}, { timestamps: true });

// ─── Performance Indexes ─────────────────────────────
notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

// Auto-cleanup: TTL index to delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification };
