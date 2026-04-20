/**
 * @fileoverview Ride Routes
 *
 * Handles ride offer CRUD operations, coordinate-based search,
 * and ride completion with OTP verification.
 * All routes include input validation and authorization checks.
 *
 * @requires express          - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../middleware/validate - Input validation
 * @requires ../models/RideOffer - RideOffer model
 * @requires ../utils/geocoder  - Distance calculation
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { RideOffer } = require('../models/RideOffer');
const { calculateDistance } = require('../utils/geocoder');
const { User } = require('../models/User');
const { RideRequest } = require('../models/RideRequest');
const {
  validateCreateRide,
  validateSearchRides,
  validateCompleteRequest,
} = require('../middleware/validate');

const router = express.Router();

/**
 * POST / — Create a new ride offer
 *
 * First-time drivers must provide vehicle details for verification.
 * Coordinates are validated to be within valid latitude/longitude ranges.
 */
router.post('/', authMiddleware, validateCreateRide, async (req, res) => {
  try {
    const {
      source,
      destination,
      seatsAvailable,
      departureTime,
      vehicleNumber,
      licenseNumber,
      vehiclePhoto
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ─── One-Time Driver Verification ────────────────────
    if (!user.isDriverVerified) {
      if (!vehicleNumber || !licenseNumber || !vehiclePhoto) {
        return res.status(400).json({
          message: 'First time drivers must provide vehicle details'
        });
      }

      user.vehicleNumber = vehicleNumber;
      user.licenseNumber = licenseNumber;
      user.vehiclePhoto = vehiclePhoto;
      user.isDriverVerified = true;

      await user.save();
    }

    // ─── Create Ride Offer ───────────────────────────────
    const newRide = new RideOffer({
      driverId: req.user.id,
      source: {
        name: source.name,
        lat: Number(source.lat),
        lng: Number(source.lng)
      },
      destination: {
        name: destination.name,
        lat: Number(destination.lat),
        lng: Number(destination.lng)
      },
      seatsAvailable,
      departureTime
    });

    await newRide.save();
    res.status(201).json(newRide);

  } catch (err) {
    console.error("🔥 CREATE RIDE ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /my-offers — Get all ride offers by the current user
 */
router.get('/my-offers', authMiddleware, async (req, res) => {
  try {
    const rides = await RideOffer.find({ driverId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /search — Search for rides matching coordinates (validated)
 */
router.get('/search', authMiddleware, validateSearchRides, async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng, seats } = req.query;

    const sourceCoords = {
      lat: Number(sourceLat),
      lng: Number(sourceLng)
    };

    const destCoords = {
      lat: Number(destLat),
      lng: Number(destLng)
    };

    const availableRides = await RideOffer.find({
      status: 'waiting',
      seatsAvailable: { $gte: Number(seats) },
      driverId: { $ne: req.user.id }
    }).populate('driverId', 'name email phone').lean();

    /** @constant {number} MAX_DISTANCE_KM - Maximum matching radius */
    const MAX_DISTANCE_KM = 5;

    const matchedRides = availableRides
      .filter(ride => {
        const sourceDist = calculateDistance(
          sourceCoords.lat, sourceCoords.lng,
          ride.source.lat, ride.source.lng
        );
        const destDist = calculateDistance(
          destCoords.lat, destCoords.lng,
          ride.destination.lat, ride.destination.lng
        );
        return sourceDist <= MAX_DISTANCE_KM && destDist <= MAX_DISTANCE_KM;
      })
      .map(ride => {
        const sourceDist = calculateDistance(
          sourceCoords.lat, sourceCoords.lng,
          ride.source.lat, ride.source.lng
        );
        return {
          ...ride.toObject(),
          distanceToDriver: sourceDist.toFixed(1)
        };
      });

    matchedRides.sort(
      (a, b) => Number(a.distanceToDriver) - Number(b.distanceToDriver)
    );

    res.json(matchedRides);

  } catch (err) {
    console.error("🔥 SEARCH ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /:id/complete — Complete a ride with OTP verification (validated)
 */
router.put('/:id/complete', authMiddleware, validateCompleteRequest, async (req, res) => {
  try {
    const { code } = req.body;

    const request = await RideRequest.findById(req.params.id)
      .populate('offerId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!request.offerId) {
      return res.status(400).json({ message: 'Offer not linked' });
    }

    const driverId = request.offerId.driverId;

    // Authorization: only the driver can complete
    if (driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: only the driver can complete this ride' });
    }

    if (!request.completionCode) {
      return res.status(400).json({ message: 'No completion code found' });
    }

    if (request.completionCode.toString() !== code.toString().trim()) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (request.status === 'completed') {
      return res.status(400).json({ message: 'Already completed' });
    }

    request.status = 'completed';
    await request.save();

    const coins = 10;

    await Promise.all([
      User.updateOne({ _id: driverId }, { $inc: { coins } }),
      User.updateOne({ _id: request.passengerId }, { $inc: { coins: Math.floor(coins / 2) } }),
    ]);

    res.json({
      message: 'Ride completed successfully',
      coinsAllocated: coins
    });

  } catch (err) {
    console.error("🔥 COMPLETE ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;