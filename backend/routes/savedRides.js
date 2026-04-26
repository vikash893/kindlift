/**
 * @fileoverview Saved Rides Routes
 *
 * Allows users to bookmark frequently used routes.
 * Includes input validation and ownership authorization.
 *
 * @requires express           - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../middleware/validate - Input validation
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { SavedRide } = require('../models/SavedRide');
const { geocode } = require('../utils/geocoder');
const {
  validateCreateSavedRide,
  validateMongoId,
} = require('../middleware/validate');

const router = express.Router();

/**
 * POST / — Save a new ride/route (validated)
 */
router.post('/', authMiddleware, validateCreateSavedRide, async (req, res) => {
  try {
    const { sourceName, destinationName, seats, sourceCoords: clientSourceCoords, destCoords: clientDestCoords } = req.body;

    let sourceCoords = clientSourceCoords;
    let destCoords = clientDestCoords;

    if (!sourceCoords) {
      sourceCoords = await geocode(sourceName);
    }
    if (!destCoords) {
      destCoords = await geocode(destinationName);
    }

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
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET / — Get all saved rides for the current user
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rides = await SavedRide.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /:id — Delete a saved ride (validated ID)
 * Authorization: only the owner can delete their saved ride.
 */
router.delete('/:id', authMiddleware, validateMongoId, async (req, res) => {
  try {
    const ride = await SavedRide.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Saved ride not found' });
    }

    // Authorization: only the owner can delete
    if (ride.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: you can only delete your own saved rides' });
    }

    await ride.deleteOne();
    res.json({ message: 'Saved ride removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;