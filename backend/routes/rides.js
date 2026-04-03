const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { RideOffer } = require('../models/RideOffer');
const { geocode, calculateDistance } = require('../utils/geocoder');
const { User } = require('../models/User');

const router = express.Router();

// Create a ride offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      sourceName,
      destinationName,
      seatsAvailable,
      departureTime,
      vehicleNumber,
      licenseNumber,
      vehiclePhoto
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Driver verification
    if (!user.isDriverVerified) {
      if (!vehicleNumber || !licenseNumber || !vehiclePhoto) {
        return res.status(400).json({
          message: 'First time drivers must provide vehicle number, license number, and vehicle photo.'
        });
      }

      user.vehicleNumber = vehicleNumber;
      user.licenseNumber = licenseNumber;
      user.vehiclePhoto = vehiclePhoto;
      user.isDriverVerified = true;

      await user.save();
    }

    const sourceCoords = await geocode(sourceName);
    const destCoords = await geocode(destinationName);

    if (!sourceCoords || !destCoords) {
      return res.status(400).json({
        message: 'Could not resolve coordinates for source or destination'
      });
    }

    const newRide = new RideOffer({
      driverId: req.user.id,
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
      seatsAvailable,
      departureTime
    });

    await newRide.save();
    res.status(201).json(newRide);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get my rides
router.get('/my-offers', authMiddleware, async (req, res) => {
  try {
    const rides = await RideOffer.find({ driverId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Search rides
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { source, destination, seats } = req.query;

    if (!source || !destination || !seats) {
      return res.status(400).json({
        message: 'Please provide source, destination, and seats'
      });
    }

    const sourceCoords = await geocode(source);
    const destCoords = await geocode(destination);

    if (!sourceCoords || !destCoords) {
      return res.status(400).json({
        message: 'Could not resolve coordinates'
      });
    }

    const availableRides = await RideOffer.find({
      status: 'waiting',
      seatsAvailable: { $gte: Number(seats) },
      driverId: { $ne: req.user.id }
    }).populate('driverId', 'name email phone');

    const MAX_DISTANCE_KM = 5;

    const matchedRides = availableRides
      .filter(ride => {
        const sourceDist = calculateDistance(
          sourceCoords.lat,
          sourceCoords.lng,
          ride.source.lat,
          ride.source.lng
        );

        const destDist = calculateDistance(
          destCoords.lat,
          destCoords.lng,
          ride.destination.lat,
          ride.destination.lng
        );

        return sourceDist <= MAX_DISTANCE_KM && destDist <= MAX_DISTANCE_KM;
      })
      .map(ride => {
        const sourceDist = calculateDistance(
          sourceCoords.lat,
          sourceCoords.lng,
          ride.source.lat,
          ride.source.lng
        );

        return {
          ...ride.toObject(),
          distanceToDriver: sourceDist.toFixed(1)
        };
      });

    // Sort nearest first
    matchedRides.sort(
      (a, b) => Number(a.distanceToDriver) - Number(b.distanceToDriver)
    );

    res.json(matchedRides);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Complete a ride
const { RideRequest } = require('../models/RideRequest');


router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;

    console.log("REQ ID:", req.params.id);
    console.log("ENTERED CODE:", code);

    // ✅ Populate offerId (IMPORTANT)
    const request = await RideRequest.findById(req.params.id)
      .populate('offerId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log("REQUEST FOUND:", request);

    // ✅ Safety check
    if (!request.offerId) {
      return res.status(400).json({ message: 'Offer not linked' });
    }

    const driverId = request.offerId.driverId;

    // ✅ Auth check
    if (driverId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // ✅ Code check
    if (!request.completionCode) {
      return res.status(400).json({ message: 'No completion code found' });
    }

    console.log("STORED CODE:", request.completionCode);

    if (request.completionCode.toString() !== code.toString().trim()) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // ✅ Prevent double completion
    if (request.status === 'completed') {
      return res.status(400).json({ message: 'Already completed' });
    }

    // ✅ Mark completed
    request.status = 'completed';
    await request.save();

    // ✅ Coins logic
    const coins = 10;

    await User.findByIdAndUpdate(driverId, {
      $inc: { coins }
    });

    await User.findByIdAndUpdate(request.passengerId, {
      $inc: { coins: Math.floor(coins / 2) }
    });

    res.json({
      message: 'Ride completed successfully',
      coinsAllocated: coins
    });

  } catch (err) {
    console.error("🔥 COMPLETE ERROR:", err);   // VERY IMPORTANT
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;