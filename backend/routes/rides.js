const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { RideOffer } = require('../models/RideOffer');
const { calculateDistance } = require('../utils/geocoder');
const { User } = require('../models/User');
const { RideRequest } = require('../models/RideRequest');

const router = express.Router();


// ================== CREATE RIDE ==================
router.post('/', authMiddleware, async (req, res) => {
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

    // ✅ Validate coordinates
    if (!source?.lat || !destination?.lat) {
      return res.status(400).json({
        message: 'Please select locations from suggestions'
      });
    }

    // ================= DRIVER VERIFICATION =================
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

    // ================= CREATE RIDE =================
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


// ================= MY RIDES ==================
router.get('/my-offers', authMiddleware, async (req, res) => {
  try {
    const rides = await RideOffer.find({ driverId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// ================= SEARCH RIDES ==================
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng, seats } = req.query;

    if (!sourceLat || !sourceLng || !destLat || !destLng || !seats) {
      return res.status(400).json({
        message: 'Please provide coordinates and seats'
      });
    }

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

    matchedRides.sort(
      (a, b) => Number(a.distanceToDriver) - Number(b.distanceToDriver)
    );

    res.json(matchedRides);

  } catch (err) {
    console.error("🔥 SEARCH ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= COMPLETE RIDE ==================
router.put('/:id/complete', authMiddleware, async (req, res) => {
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

    if (driverId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
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
    console.error("🔥 COMPLETE ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;