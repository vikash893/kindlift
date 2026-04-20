/**
 * @fileoverview Rating Routes
 *
 * Handles post-ride rating submissions and retrieval.
 * Includes input validation and authorization checks.
 *
 * @requires express           - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../middleware/validate - Input validation
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Rating } = require('../models/Rating');
const { User } = require('../models/User');
const { RideRequest } = require('../models/RideRequest');
const { validateCreateRating } = require('../middleware/validate');

const router = express.Router();

/**
 * POST / — Submit a rating for a completed ride (validated)
 *
 * Authorization: Only users involved in the ride can rate.
 * Users cannot rate themselves.
 */
router.post('/', authMiddleware, validateCreateRating, async (req, res) => {
  try {
    const { rideOfferId, requestId, ratedUserId, rating, review, raterRole } = req.body;

    // Authorization: prevent self-rating
    if (ratedUserId === req.user.id) {
      return res.status(403).json({ message: 'You cannot rate yourself' });
    }

    // Check for duplicate rating
    const existingRating = await Rating.findOne({ requestId, raterId: req.user.id });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user for this ride' });
    }

    // Authorization: verify the user was part of this ride
    const request = await RideRequest.findById(requestId).populate('offerId');
    if (!request) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    const isPassenger = request.passengerId.toString() === req.user.id;
    const isDriver = request.offerId?.driverId?.toString() === req.user.id;

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Forbidden: you are not part of this ride' });
    }

    const newRating = new Rating({
      rideOfferId,
      requestId,
      raterId: req.user.id,
      ratedUserId,
      rating,
      review,
      raterRole
    });

    await newRating.save();

    // Atomic update for the rated user's aggregate rating (much faster than find-then-save)
    await User.updateOne(
      { _id: ratedUserId },
      { $inc: { ratingSum: rating, totalRatings: 1 } }
    );

    // Update rating flags on the ride request
    if (request) {
      if (raterRole === 'passenger') request.isRatedByPassenger = true;
      if (raterRole === 'driver') request.isRatedByDriver = true;

      // Auto-cleanup: delete request when both parties have rated
      if (request.isRatedByPassenger && request.isRatedByDriver) {
        await request.deleteOne();
      } else {
        await request.save();
      }
    }

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Rating already exists.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /user/:userId — Get all ratings received by a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    // Validate userId format
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const ratings = await Rating.find({ ratedUserId: req.params.userId })
      .populate('raterId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .lean();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /predict-sentiment — Get ML-predicted sentiment (Admin only)
 *
 * Calls the Python ML microservice to predict whether
 * a given review text is positive, neutral, or negative.
 *
 * Body: { "review": "the driver was very friendly" }
 * Response: { "predicted_sentiment": "positive", "confidence": "high", ... }
 */
router.post('/predict-sentiment', authMiddleware, async (req, res) => {
  try {
    // Admin check
    const user = await User.findById(req.user.id);
    if (!user || (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { review } = req.body;

    if (!review || !review.trim()) {
      return res.status(400).json({ message: 'Missing "review" field' });
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';

    const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: review.trim() })
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json();
      return res.status(mlResponse.status).json({
        message: 'ML service error',
        detail: errorData.error
      });
    }

    const prediction = await mlResponse.json();
    res.json(prediction);
  } catch (err) {
    console.error('ML Service Error:', err.message);
    res.status(503).json({
      message: 'ML service unavailable. Make sure the Python server is running on port 5001.'
    });
  }
});



/**
 * GET /sentiment/:userId — Get sentiment summary for a user (Admin only)
 *
 * Returns the user's average rating along with ML-predicted
 * sentiments from their most recent reviews.
 */
router.get('/sentiment/:userId', authMiddleware, async (req, res) => {
  try {
    // Admin check
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || (!adminUser.isAdmin && adminUser.role !== 'admin' && adminUser.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const avgRating = user.totalRatings > 0
      ? (user.ratingSum / user.totalRatings).toFixed(1)
      : 0;

    // Get the user's latest reviews
    const latestRatings = await Rating.find({ ratedUserId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Predict sentiment for each review that has text
    let mlPredictions = [];
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';

    for (const r of latestRatings) {
      if (r.review && r.review.trim()) {
        try {
          const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ review: r.review.trim() })
          });
          if (mlResponse.ok) {
            const prediction = await mlResponse.json();
            mlPredictions.push({
              review: r.review,
              rating: r.rating,
              ...prediction
            });
          }
        } catch {
          // ML service not available — skip prediction
        }
      }
    }

    res.json({
      userId: user._id,
      name: user.name,
      averageRating: parseFloat(avgRating),
      totalRatings: user.totalRatings,
      mlPredictions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
