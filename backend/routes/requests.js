const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { RideRequest } = require('../models/RideRequest');
const { RideOffer } = require('../models/RideOffer');

const router = express.Router();

// Create a ride request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { offerId, seatsRequested, source, destination } = req.body;

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

    const io = req.app.get('io');
    if (io) {
      io.to(offer.driverId.toString()).emit('new_request', newRequest);
    }

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get incoming requests for driver
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
    res.status(500).send('Server error');
  }
});

// Get my requests (Passenger)
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
    res.status(500).send('Server error');
  }
});

// Accept or Reject request
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const request = await RideRequest.findById(req.params.id).populate('offerId');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const offer = request.offerId;

    if (offer.driverId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
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

      await RideRequest.updateMany(
        { passengerId: request.passengerId, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    request.status = status;
    await request.save();

    const io = req.app.get('io');
    if (io) {
      io.to(request.passengerId.toString()).emit('request_updated', request);
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get specific request details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id)
      .populate('passengerId', 'name email phone')
      .populate({
        path: 'offerId',
        populate: { path: 'driverId', select: 'name email phone' }
      });

    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.json(request);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get messages for a request
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { Message } = require('../models/Message');
    const messages = await Message.find({ requestId: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;