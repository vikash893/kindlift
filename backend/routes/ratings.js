const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Rating } = require('../models/Rating');
const { User } = require('../models/User');
const { RideRequest } = require('../models/RideRequest');

const router = express.Router();

// Submit a rating
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rideOfferId, requestId, ratedUserId, rating, review, raterRole } = req.body;

    // Check if already rated
    const existingRating = await Rating.findOne({ requestId, raterId: req.user.id });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user for this ride' });
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

    // Update user's aggregate rating
    const ratedUser = await User.findById(ratedUserId);
    if (ratedUser) {
      ratedUser.ratingSum += rating;
      ratedUser.totalRatings += 1;
      await ratedUser.save();
    }

    // Update request rating status
    const request = await RideRequest.findById(requestId);
    if (request) {
      if (raterRole === 'passenger') request.isRatedByPassenger = true;
      if (raterRole === 'driver') request.isRatedByDriver = true;
      
      // If both rated, delete from history
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
    res.status(500).send('Server error');
  }
});

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUserId: req.params.userId })
      .populate('raterId', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
