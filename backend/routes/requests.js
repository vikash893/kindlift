/**
 * @fileoverview Ride Request Routes
 *
 * Manages the lifecycle of ride booking requests between passengers and drivers.
 * Includes input validation, authorization checks, and proper error responses.
 *
 * @requires express           - Router
 * @requires ../middleware/auth - JWT authentication
 * @requires ../middleware/validate - Input validation
 */

const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { RideRequest } = require('../models/RideRequest');
const { RideOffer } = require('../models/RideOffer');
const { User } = require('../models/User');
const { calculateDistance } = require('../utils/geocoder');
const {
  validateCreateRequest,
  validateUpdateStatus,
  validateCompleteRequest,
  validateMongoId,
} = require('../middleware/validate');

const router = express.Router();

/**
 * POST / — Create a ride request (passenger books a ride)
 * Validates input, prevents duplicates, and notifies driver via Socket.IO.
 */
router.post('/', authMiddleware, validateCreateRequest, async (req, res) => {
  try {
    const { offerId, seatsRequested, source, destination } = req.body;

    // Prevent duplicate bookings
    const existingReq = await RideRequest.findOne({
      passengerId: req.user.id,
      offerId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingReq) {
      return res.status(400).json({ message: 'You have already requested or booked this ride' });
    }

    const offer = await RideOffer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Ride offer not found' });

    // Authorization: prevent driver from booking their own ride
    if (offer.driverId.toString() === req.user.id) {
      return res.status(403).json({ message: 'You cannot book your own ride' });
    }

    if (offer.seatsAvailable < seatsRequested) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const newRequest = new RideRequest({
      passengerId: req.user.id,
      offerId,
      seatsRequested,
      source,
      destination
    });

    await newRequest.save();

    // Notify driver in real-time
    const io = req.app.get('io');
    if (io) {
      io.to(offer.driverId.toString()).emit('new_request', newRequest);
    }

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /incoming — Get incoming ride requests for the driver
 */
router.get('/incoming', authMiddleware, async (req, res) => {
  try {
    const offers = await RideOffer.find({ driverId: req.user.id });
    const offerIds = offers.map(o => o._id);

    const requests = await RideRequest.find({ offerId: { $in: offerIds } })
      .populate('passengerId', 'name phone')
      .populate('offerId', 'source destination departureTime seatsAvailable')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /my-requests — Get the passenger's own ride requests
 */
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await RideRequest.find({ passengerId: req.user.id })
      .populate({
        path: 'offerId',
        populate: { path: 'driverId', select: 'name phone email' }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /:id/status — Accept or reject a ride request (validated)
 * Authorization: only the ride's driver can update status.
 */
router.put('/:id/status', authMiddleware, validateUpdateStatus, async (req, res) => {
  try {
    const { status } = req.body;

    const request = await RideRequest.findById(req.params.id).populate('offerId');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const offer = request.offerId;

    // Authorization: only the driver of this ride can accept/reject
    if (offer.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: only the driver can update request status' });
    }

    if (status === 'accepted') {
      if (offer.seatsAvailable < request.seatsRequested) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      offer.seatsAvailable -= request.seatsRequested;

      if (offer.seatsAvailable === 0) {
        offer.status = 'ongoing';
      }

      await offer.save();

      // Reject other pending requests from same passenger
      await RideRequest.updateMany(
        { passengerId: request.passengerId, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // Generate unique 4-digit completion code
      request.completionCode = Math.floor(1000 + Math.random() * 9000).toString();
    }

    request.status = status;
    await request.save();

    // Notify passenger in real-time
    const io = req.app.get('io');
    if (io) {
      io.to(request.passengerId.toString()).emit('request_updated', request);
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /:id — Get specific request details (validated ID)
 * Authorization: only the passenger or driver involved can view.
 */
router.get('/:id', authMiddleware, validateMongoId, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id)
      .populate('passengerId', 'name email phone')
      .populate({
        path: 'offerId',
        populate: { path: 'driverId', select: 'name email phone' }
      });

    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Authorization: only involved parties can view request details
    const isPassenger = request.passengerId._id.toString() === req.user.id;
    const isDriver = request.offerId?.driverId?._id?.toString() === req.user.id;

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Forbidden: you are not part of this ride' });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /:id/messages — Get chat messages for a request (validated ID)
 * Authorization: only the passenger or driver involved can view messages.
 */
router.get('/:id/messages', authMiddleware, validateMongoId, async (req, res) => {
  try {
    // Verify the user is part of this ride request
    const request = await RideRequest.findById(req.params.id).populate('offerId');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isPassenger = request.passengerId.toString() === req.user.id;
    const isDriver = request.offerId?.driverId?.toString() === req.user.id;

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Forbidden: you cannot view these messages' });
    }

    const { Message } = require('../models/Message');
    const messages = await Message.find({ requestId: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /:id/complete — Complete a specific ride request with OTP (validated)
 * Authorization: only the ride's driver can complete.
 */
router.put('/:id/complete', authMiddleware, validateCompleteRequest, async (req, res) => {
  try {
    const { code } = req.body;
    const request = await RideRequest.findById(req.params.id).populate('offerId');

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'accepted') return res.status(400).json({ message: 'Request is not currently active' });

    // Authorization: only the driver can complete
    if (request.offerId.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: only the driver can complete this ride' });
    }

    if (request.completionCode !== code) {
      return res.status(400).json({ message: 'Invalid completion code! Please ask passenger for the 4-digit code.' });
    }

    request.status = 'completed';
    await request.save();

    // Check if all requests for this offer are now complete
    const pendingReqs = await RideRequest.countDocuments({
      offerId: request.offerId._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (pendingReqs === 0) {
      const offer = await RideOffer.findById(request.offerId._id);
      offer.status = 'completed';
      await offer.save();
    }

    // Calculate coins based on distance (1 coin per km)
    const distance = calculateDistance(
      request.source.lat, request.source.lng,
      request.destination.lat, request.destination.lng
    );
    const coinsAllocated = Math.max(1, Math.floor(distance));

    // Driver gets full coins
    const driver = await User.findById(request.offerId.driverId);
    if (driver) {
      driver.coins = (driver.coins || 0) + coinsAllocated;
      await driver.save();
    }

    // Passenger gets half
    const passenger = await User.findById(request.passengerId);
    if (passenger) {
      passenger.coins = (passenger.coins || 0) + Math.floor(coinsAllocated / 2);
      await passenger.save();
    }

    // Notify passenger in real-time
    const io = req.app.get('io');
    if (io) {
      io.to(request.passengerId.toString()).emit('request_updated', request);
    }

    res.json({ message: 'Ride completed successfully', coinsAllocated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;