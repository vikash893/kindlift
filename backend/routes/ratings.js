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

    // Update the rated user's aggregate rating
    const ratedUser = await User.findById(ratedUserId);
    if (ratedUser) {
      ratedUser.ratingSum += rating;
      ratedUser.totalRatings += 1;
      await ratedUser.save();
    }

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
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
