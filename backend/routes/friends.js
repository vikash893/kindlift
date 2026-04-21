/**
 * @fileoverview Friend Routes
 *
 * Manages friend connections between KindLift users.
 * Supports sending, accepting, rejecting requests and listing friends.
 *
 * @requires express          - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../models/Friendship - Friendship model
 * @requires ../models/User - User model
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Friendship } = require('../models/Friendship');
const { User } = require('../models/User');

const router = express.Router();

/**
 * POST /request — Send a friend request
 */
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // Check recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing friendship in either direction
    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ message: 'A friend request already exists' });
      }
      if (existing.status === 'blocked') {
        return res.status(403).json({ message: 'This connection is blocked' });
      }
      // If rejected, allow re-sending by updating status
      existing.requester = req.user.id;
      existing.recipient = recipientId;
      existing.status = 'pending';
      await existing.save();

      // Notify recipient
      const io = req.app.get('io');
      if (io) {
        io.to(recipientId).emit('friend_request', {
          _id: existing._id,
          requester: { _id: req.user.id, name: req.user.name },
          status: 'pending'
        });
      }

      return res.status(201).json(existing);
    }

    const friendship = new Friendship({
      requester: req.user.id,
      recipient: recipientId,
      status: 'pending'
    });

    await friendship.save();

    // Notify recipient via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(recipientId).emit('friend_request', {
        _id: friendship._id,
        requester: { _id: req.user.id, name: req.user.name },
        status: 'pending'
      });
    }

    res.status(201).json(friendship);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    console.error('Friend request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /:id/respond — Accept or reject a friend request
 */
router.put('/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
    }

    const friendship = await Friendship.findById(req.params.id);
    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Only the recipient can respond
    if (friendship.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the recipient can respond to this request' });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been responded to' });
    }

    friendship.status = status;
    await friendship.save();

    // Notify the requester
    const io = req.app.get('io');
    if (io) {
      io.to(friendship.requester.toString()).emit('friend_response', {
        _id: friendship._id,
        responderId: req.user.id,
        responderName: req.user.name,
        status
      });
    }

    res.json({ message: `Friend request ${status}`, friendship });
  } catch (err) {
    console.error('Friend respond error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /list — Get all accepted friends
 */
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [
        { requester: req.user.id, status: 'accepted' },
        { recipient: req.user.id, status: 'accepted' }
      ]
    })
      .populate('requester', 'name email profilePhoto isDriverVerified driverVerificationStatus')
      .populate('recipient', 'name email profilePhoto isDriverVerified driverVerificationStatus')
      .sort({ updatedAt: -1 })
      .lean();

    // Map to return the "other" user as the friend
    const friends = friendships.map(f => {
      const friend = f.requester._id.toString() === req.user.id ? f.recipient : f.requester;
      return {
        friendshipId: f._id,
        ...friend,
        connectedAt: f.updatedAt
      };
    });

    res.json(friends);
  } catch (err) {
    console.error('Friend list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /pending — Get incoming pending friend requests
 */
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const requests = await Friendship.find({
      recipient: req.user.id,
      status: 'pending'
    })
      .populate('requester', 'name email profilePhoto isDriverVerified')
      .sort({ createdAt: -1 })
      .lean();

    res.json(requests);
  } catch (err) {
    console.error('Pending requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /sent — Get outgoing pending friend requests
 */
router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const requests = await Friendship.find({
      requester: req.user.id,
      status: 'pending'
    })
      .populate('recipient', 'name email profilePhoto')
      .sort({ createdAt: -1 })
      .lean();

    res.json(requests);
  } catch (err) {
    console.error('Sent requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /search — Search for users to add as friends
 */
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Find users matching the query (exclude self)
    const users = await User.find({
      _id: { $ne: req.user.id },
      isActive: { $ne: false },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ]
    })
      .select('name email profilePhoto isDriverVerified driverVerificationStatus')
      .limit(20)
      .lean();

    // Get existing friendships with these users
    const userIds = users.map(u => u._id);
    const friendships = await Friendship.find({
      $or: [
        { requester: req.user.id, recipient: { $in: userIds } },
        { recipient: req.user.id, requester: { $in: userIds } }
      ]
    }).lean();

    // Map friendship status to each user
    const friendshipMap = {};
    for (const f of friendships) {
      const otherId = f.requester.toString() === req.user.id ? f.recipient.toString() : f.requester.toString();
      friendshipMap[otherId] = {
        friendshipId: f._id,
        status: f.status,
        isRequester: f.requester.toString() === req.user.id
      };
    }

    const results = users.map(u => ({
      ...u,
      friendship: friendshipMap[u._id.toString()] || null
    }));

    res.json(results);
  } catch (err) {
    console.error('User search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /:id — Remove a friend or cancel a request
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const friendship = await Friendship.findById(req.params.id);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    // Only involved users can remove
    const isInvolved = [friendship.requester.toString(), friendship.recipient.toString()].includes(req.user.id);
    if (!isInvolved) {
      return res.status(403).json({ message: 'You are not part of this friendship' });
    }

    await Friendship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Friendship removed' });
  } catch (err) {
    console.error('Remove friend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /status/:userId — Check friendship status with a specific user
 */
router.get('/status/:userId', authMiddleware, async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      $or: [
        { requester: req.user.id, recipient: req.params.userId },
        { requester: req.params.userId, recipient: req.user.id }
      ]
    });

    if (!friendship) {
      return res.json({ status: 'none' });
    }

    res.json({
      friendshipId: friendship._id,
      status: friendship.status,
      isRequester: friendship.requester.toString() === req.user.id
    });
  } catch (err) {
    console.error('Friendship status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
