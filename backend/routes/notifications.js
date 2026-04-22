/**
 * @fileoverview Notification Routes
 *
 * Endpoints for role-based notification management.
 * Users get their own notifications, admins get admin-targeted ones.
 *
 * Routes:
 *   GET    /api/notifications           - Get paginated notifications for current user
 *   GET    /api/notifications/unread/count - Get unread count (fast)
 *   PUT    /api/notifications/:id/read  - Mark single notification as read
 *   PUT    /api/notifications/read-all  - Mark all notifications as read
 *   DELETE /api/notifications/:id       - Delete a notification
 *   POST   /api/notifications           - Create notification (admin only)
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Notification } = require('../models/Notification');
const { User } = require('../models/User');

const router = express.Router();

// ─── Helper: Build query for user's notifications ─────────────────────────────
function buildNotificationQuery(user) {
  const isAdmin = user.isAdmin || user.role === 'admin' || user.role === 'superadmin';
  
  const orConditions = [
    // Direct notifications to this user
    { recipientId: user._id },
    // Broadcast to all users
    { recipientRole: 'all' },
  ];

  // Admin-targeted notifications
  if (isAdmin) {
    orConditions.push({ recipientRole: 'admin' });
  } else {
    // User-targeted broadcasts
    orConditions.push({ recipientRole: 'user' });
  }

  return { $or: orConditions };
}

/**
 * GET /api/notifications
 * Returns paginated notifications for the current user (or admin).
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const unreadOnly = req.query.unreadOnly === 'true';

    const user = await User.findById(req.user.id).select('isAdmin role').lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const query = buildNotificationQuery(user);
    if (unreadOnly) query.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ ...buildNotificationQuery(user), read: false }),
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    console.error('Notifications fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/notifications/unread/count
 * Fast endpoint — returns only unread count. Used by navbar bell.
 */
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isAdmin role').lean();
    if (!user) return res.status(401).json({ count: 0 });

    const query = { ...buildNotificationQuery(user), read: false };
    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (err) {
    res.json({ count: 0 }); // Fail silently for badge count
  }
});

/**
 * PUT /api/notifications/read-all
 * Marks ALL unread notifications as read for the current user.
 */
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isAdmin role').lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const query = { ...buildNotificationQuery(user), read: false };
    await Notification.updateMany(query, {
      $set: { read: true, readAt: new Date() },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Marks a single notification as read.
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/notifications/:id
 * Deletes a single notification.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/notifications
 * Admin-only: Create a broadcast or targeted notification.
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('isAdmin role').lean();
    if (!admin || (!admin.isAdmin && admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { recipientId, recipientRole, type, title, message, metadata, actionUrl } = req.body;
    if (!type || !title || !message) {
      return res.status(400).json({ message: 'type, title, and message are required' });
    }

    const notif = new Notification({
      recipientId: recipientId || undefined,
      recipientRole: recipientRole || null,
      type,
      title,
      message,
      metadata: metadata || {},
      actionUrl: actionUrl || undefined,
    });
    await notif.save();

    // Emit in real-time via Socket.IO
    const io = req.app.get('io');
    if (io) {
      if (recipientId) {
        io.to(recipientId.toString()).emit('notification', notif);
      } else if (recipientRole === 'all') {
        io.emit('notification', notif);
      }
    }

    res.status(201).json(notif);
  } catch (err) {
    console.error('Notification create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
