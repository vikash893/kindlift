const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { SavedRide } = require('../models/SavedRide');
const { geocode } = require('../utils/geocoder');

const router = express.Router();

// Create a saved ride
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { sourceName, destinationName, seats } = req.body;

    const sourceCoords = await geocode(sourceName);
    const destCoords = await geocode(destinationName);

    if (!sourceCoords || !destCoords) {
      return res.status(400).json({ message: 'Could not resolve coordinates' });
    }

    const newSavedRide = new SavedRide({
      userId: req.user.id,
      source: {
        name: sourceName,
        lat: sourceCoords.lat,
        lng: sourceCoords.lng
      },
      destination: {
        name: destinationName,
        lat: destCoords.lat,
        lng: destCoords.lng
      },
      seats: seats || 1
    });

    await newSavedRide.save();
    res.status(201).json(newSavedRide);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all saved rides
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rides = await SavedRide.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a saved ride
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ride = await SavedRide.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Saved ride not found' });
    }

    if (ride.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await ride.deleteOne();
    res.json({ message: 'Saved ride removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;