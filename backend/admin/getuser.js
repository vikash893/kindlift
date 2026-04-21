/**
 * @fileoverview Admin Routes — Full Admin Panel API
 *
 * Complete admin API for managing users, rides, requests, ratings,
 * contact messages, and platform analytics.
 * All routes require admin authentication.
 *
 * @requires express - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../models/* - All data models
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { RideOffer } = require('../models/RideOffer');
const { RideRequest } = require('../models/RideRequest');
const { Rating } = require('../models/Rating');
const { Message } = require('../models/Message');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ─── Server-side Response Cache ──────────────────────
// Cache heavy endpoints (stats) to avoid hitting DB on every request
const responseCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

function getCachedResponse(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedResponse(key, data) {
  responseCache.set(key, { data, timestamp: Date.now() });
}

// Invalidate stats cache when data changes
function invalidateStatsCache() {
  responseCache.delete('admin_stats');
}

// ─── Admin Auth Middleware ───────────────────────────────
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ═══════════════════ DASHBOARD STATS ═══════════════════

/**
 * GET /stats — Platform-wide analytics dashboard
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Check server-side cache first
    const cached = getCachedResponse('admin_stats');
    if (cached) return res.json(cached);

    const [
      totalUsers, activeUsers, verifiedDrivers, pendingVerifications,
      totalRides, activeRides, completedRides,
      totalRequests, pendingRequests, acceptedRequests, completedRequests,
      totalRatings, totalMessages,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: { $ne: false } }),
      User.countDocuments({ isDriverVerified: true }),
      User.countDocuments({ driverVerificationStatus: 'pending' }),
      RideOffer.countDocuments(),
      RideOffer.countDocuments({ status: 'waiting' }),
      RideOffer.countDocuments({ status: 'completed' }),
      RideRequest.countDocuments(),
      RideRequest.countDocuments({ status: 'pending' }),
      RideRequest.countDocuments({ status: 'accepted' }),
      RideRequest.countDocuments({ status: 'completed' }),
      Rating.countDocuments(),
      Message.countDocuments(),
    ]);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [newUsersThisWeek, newRidesThisWeek, userGrowth, rideGrowth, ratingAgg, topUsers, recentUsers, recentRides] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      RideOffer.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      RideOffer.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Rating.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' }, total: { $sum: 1 } } },
      ]),
      User.find({ totalRatings: { $gt: 0 } })
        .select('name email profilePhoto ratingSum totalRatings coins isDriverVerified')
        .sort({ totalRatings: -1 }).limit(5).lean(),
      User.find()
        .select('name email createdAt profilePhoto isDriverVerified')
        .sort({ createdAt: -1 }).limit(5).lean(),
      RideOffer.find()
        .populate('driverId', 'name email')
        .sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const response = {
      overview: {
        totalUsers, activeUsers, verifiedDrivers, pendingVerifications,
        totalRides, activeRides, completedRides,
        totalRequests, pendingRequests, acceptedRequests, completedRequests,
        totalRatings, totalMessages,
        newUsersThisWeek, newRidesThisWeek,
        averageRating: ratingAgg[0]?.avg?.toFixed(1) || '0.0',
      },
      userGrowth, rideGrowth, topUsers, recentUsers, recentRides,
    };

    // Cache the response
    setCachedResponse('admin_stats', response);
    res.json(response);
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ USER MANAGEMENT ═══════════════════

/**
 * GET /users — List all users with pagination, search, and filters
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all'; // all, drivers, admins, inactive
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = {};
    const conditions = [];

    // Search by name or email
    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      });
    }

    // Apply filters
    if (filter === 'drivers') conditions.push({ isDriverVerified: true });
    if (filter === 'admins') conditions.push({ $or: [{ isAdmin: true }, { role: { $in: ['admin', 'superadmin'] } }] });
    if (filter === 'inactive') conditions.push({ isActive: false });

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password')
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /users/:id — Get single user full details
 */
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get user's ride stats
    const ridesOffered = await RideOffer.countDocuments({ driverId: user._id });
    const ridesCompleted = await RideOffer.countDocuments({ driverId: user._id, status: 'completed' });
    const requestsMade = await RideRequest.countDocuments({ passengerId: user._id });
    const requestsCompleted = await RideRequest.countDocuments({ passengerId: user._id, status: 'completed' });
    const ratingsReceived = await Rating.find({ ratedUserId: user._id })
      .populate('raterId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(10);
    const ratingsGiven = await Rating.countDocuments({ raterId: user._id });

    res.json({
      user,
      stats: {
        ridesOffered,
        ridesCompleted,
        requestsMade,
        requestsCompleted,
        ratingsGiven,
        ratingsReceived,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /users/:id — Update user (admin actions)
 */
router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isActive, isAdmin, role, coins, isDriverVerified, driverVerificationStatus } = req.body;
    const updates = {};

    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (typeof isAdmin === 'boolean') updates.isAdmin = isAdmin;
    if (role && ['user', 'admin', 'superadmin'].includes(role)) updates.role = role;
    if (typeof coins === 'number') updates.coins = coins;
    if (typeof isDriverVerified === 'boolean') updates.isDriverVerified = isDriverVerified;
    if (driverVerificationStatus && ['none', 'pending', 'approved', 'rejected'].includes(driverVerificationStatus)) {
      updates.driverVerificationStatus = driverVerificationStatus;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user });
    invalidateStatsCache();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /users/:id — Delete a user
 */
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Don't allow deleting superadmins
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin accounts' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Clean up related data
    await RideOffer.deleteMany({ driverId: req.params.id });
    await RideRequest.deleteMany({ passengerId: req.params.id });
    await Rating.deleteMany({ $or: [{ raterId: req.params.id }, { ratedUserId: req.params.id }] });

    res.json({ message: 'User and related data deleted successfully' });
    invalidateStatsCache();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ RIDE MANAGEMENT ═══════════════════

/**
 * GET /rides — List all rides with pagination and filters
 */
router.get('/rides', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = {};
    if (status && ['waiting', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const total = await RideOffer.countDocuments(query);
    const rides = await RideOffer.find(query)
      .populate('driverId', 'name email phone profilePhoto')
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      rides,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /rides/:id — Update ride status
 */
router.put('/rides/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['waiting', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ride = await RideOffer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('driverId', 'name email');

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    res.json({ message: 'Ride updated successfully', ride });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /rides/:id — Delete a ride
 */
router.delete('/rides/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const ride = await RideOffer.findByIdAndDelete(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Clean up related requests
    await RideRequest.deleteMany({ offerId: req.params.id });

    res.json({ message: 'Ride and related requests deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ REQUEST MANAGEMENT ═══════════════════

/**
 * GET /requests — List all ride requests
 */
router.get('/requests', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';

    let query = {};
    if (status && ['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      query.status = status;
    }

    const total = await RideRequest.countDocuments(query);
    const requests = await RideRequest.find(query)
      .populate('passengerId', 'name email phone profilePhoto')
      .populate({
        path: 'offerId',
        populate: { path: 'driverId', select: 'name email phone' },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      requests,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ RATINGS MANAGEMENT ═══════════════════

/**
 * GET /ratings — List all ratings with details
 */
router.get('/ratings', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const total = await Rating.countDocuments();
    const ratings = await Rating.find()
      .populate('raterId', 'name email profilePhoto')
      .populate('ratedUserId', 'name email profilePhoto')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      ratings,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /ratings/:id — Delete a rating
 */
router.delete('/ratings/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });

    // Reverse the rating from the user's aggregate
    const ratedUser = await User.findById(rating.ratedUserId);
    if (ratedUser) {
      ratedUser.ratingSum = Math.max(0, (ratedUser.ratingSum || 0) - rating.rating);
      ratedUser.totalRatings = Math.max(0, (ratedUser.totalRatings || 0) - 1);
      await ratedUser.save();
    }

    await Rating.findByIdAndDelete(req.params.id);

    res.json({ message: 'Rating deleted and user aggregate updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ DRIVER VERIFICATION ═══════════════════

/**
 * GET /verifications — List drivers pending verification
 */
router.get('/verifications', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const statusFilter = req.query.status || 'pending';

    let query = {};
    if (['pending', 'approved', 'rejected'].includes(statusFilter)) {
      query.driverVerificationStatus = statusFilter;
    } else if (statusFilter === 'all') {
      query.driverVerificationStatus = { $ne: 'none' };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('name email phone profilePhoto vehicleNumber licenseNumber vehiclePhoto driverVerificationStatus driverVerificationNote createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        limit,
      },
    });
  } catch (err) {
    console.error('Admin verifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /verifications/:id — Approve or reject a driver verification
 */
router.put('/verifications/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "approved" or "rejected"' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.driverVerificationStatus === 'none') {
      return res.status(400).json({ message: 'User has not submitted verification documents' });
    }

    user.driverVerificationStatus = status;
    user.isDriverVerified = status === 'approved';
    if (note) user.driverVerificationNote = note;

    await user.save();

    res.json({
      message: `Driver verification ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        driverVerificationStatus: user.driverVerificationStatus,
        isDriverVerified: user.isDriverVerified,
      },
    });
    invalidateStatsCache();
  } catch (err) {
    console.error('Verification update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ ADMIN AUTH ═══════════════════

/**
 * POST /login — Admin-specific login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Not an admin account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /profile — Get admin's own profile
 */
router.get('/profile', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /profile — Update admin's own profile
 */
router.put('/profile', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, phone, profilePhoto } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /make-admin — Promote a user to admin (superadmin only)
 */
router.post('/make-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (req.adminUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can promote users' });
    }

    const { userId, role } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isAdmin: true, role: role || 'admin' } },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `${user.name} is now an admin`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;