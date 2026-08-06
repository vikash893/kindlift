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
const { Notification } = require('../models/Notification');

// ─── Notification Helper ─────────────────────────────
async function sendNotification(io, { recipientId, recipientRole, type, title, message, metadata, actionUrl }) {
  try {
    const notif = new Notification({ recipientId, recipientRole, type, title, message, metadata: metadata || {}, actionUrl });
    await notif.save();
    if (io && recipientId) io.to(recipientId.toString()).emit('notification', notif);
    return notif;
  } catch (e) { console.error('Notification error:', e); }
}

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

    // ─── Coin Payment: 2 coins per km ─────────────────────
    const tripDistance = calculateDistance(
      source.lat, source.lng,
      destination.lat, destination.lng
    );
    const coinsRequired = Math.max(1, Math.ceil(tripDistance * 2)); // 2 coins/km, min 1

    // Fetch passenger and verify coin balance
    const passenger = await User.findById(req.user.id).select('name coins');
    if (!passenger) return res.status(404).json({ message: 'User not found' });

    if (passenger.coins < coinsRequired) {
      return res.status(402).json({
        message: `You need at least ${coinsRequired} coins to book this ride (${tripDistance.toFixed(1)} km × 2 coins/km). Please add more coins.`,
        insufficientCoins: true,
        coinsRequired,
        coinsAvailable: passenger.coins,
        distanceKm: parseFloat(tripDistance.toFixed(1)),
      });
    }

    // Atomically deduct coins from passenger, but only if they still have
    // enough — guards against a race where two bookings are submitted
    // back-to-back and both pass the balance check above before either
    // debit lands.
    const debited = await User.updateOne(
      { _id: req.user.id, coins: { $gte: coinsRequired } },
      { $inc: { coins: -coinsRequired } }
    );

    if (debited.matchedCount === 0) {
      return res.status(402).json({
        message: 'Insufficient coins to book this ride. Please add more coins.',
        insufficientCoins: true,
        coinsRequired,
      });
    }

    let newRequest;
    try {
      newRequest = new RideRequest({
        passengerId: req.user.id,
        offerId,
        seatsRequested,
        source,
        destination,
        coinsCharged: coinsRequired,
      });

      await newRequest.save();
    } catch (saveErr) {
      // Refund the debit if request creation failed for any reason,
      // so coins are never silently lost.
      await User.updateOne({ _id: req.user.id }, { $inc: { coins: coinsRequired } });
      throw saveErr;
    }

    // Notify driver in real-time
    const io = req.app.get('io');
    if (io) {
      io.to(offer.driverId.toString()).emit('new_request', newRequest);
    }

    // Persistent notification for driver
    await sendNotification(io, {
      recipientId: offer.driverId,
      type: 'ride_request',
      title: '🚗 New Ride Request',
      message: `${passenger?.name || 'Someone'} wants to join your ride from ${source?.name || 'unknown'} to ${destination?.name || 'unknown'}. (${coinsRequired} coins charged)`,
      metadata: { requestId: newRequest._id, offerId },
      actionUrl: `/ride/${offerId}`,
    });

    res.status(201).json({ ...newRequest.toObject(), coinsCharged: coinsRequired });
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
      .sort({ createdAt: -1 })
      .lean();

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
      .sort({ createdAt: -1 })
      .lean();

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
    if (!offer) return res.status(400).json({ message: 'Associated ride offer no longer exists' });

    // Authorization: only the driver of this ride can accept/reject
    if (offer.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: only the driver can update request status' });
    }

    // Only allow transitioning out of 'pending' — guards against
    // double-accept / accept-after-reject races and against re-running
    // this handler on an already-decided request.
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    if (status === 'accepted') {
      // Atomically reserve the seats: only succeeds if enough seats are
      // still available at the moment of the update. Prevents two
      // concurrent accepts from both decrementing seatsAvailable past 0.
      const seatUpdate = await RideOffer.findOneAndUpdate(
        { _id: offer._id, seatsAvailable: { $gte: request.seatsRequested } },
        [
          {
            $set: {
              seatsAvailable: { $subtract: ['$seatsAvailable', request.seatsRequested] },
            },
          },
          {
            $set: {
              status: { $cond: [{ $eq: ['$seatsAvailable', 0] }, 'ongoing', '$status'] },
            },
          },
        ],
        { new: true }
      );

      if (!seatUpdate) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

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

    // Persistent notification for passenger
    const driver = await User.findById(req.user.id).select('name').lean();
    if (status === 'accepted') {
      await sendNotification(io, {
        recipientId: request.passengerId,
        type: 'ride_accepted',
        title: '✅ Ride Request Accepted!',
        message: `${driver?.name || 'Your driver'} has accepted your ride request! Your completion code is: ${request.completionCode}`,
        metadata: { requestId: request._id, offerId: offer._id },
        actionUrl: `/ride/${offer._id}`,
      });
    } else if (status === 'rejected') {
      await sendNotification(io, {
        recipientId: request.passengerId,
        type: 'ride_rejected',
        title: '❌ Ride Request Rejected',
        message: `${driver?.name || 'The driver'} has rejected your ride request. Try booking another ride.`,
        metadata: { requestId: request._id },
        actionUrl: '/book-ride',
      });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /history — Get completed ride history for the current user
 * Returns rides where the user was either the passenger or driver,
 * sorted by most recent first.
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // Get all completed requests where user is the passenger
    const passengerRides = await RideRequest.find({
      passengerId: req.user.id,
      status: 'completed',
    })
      .populate({
        path: 'offerId',
        populate: { path: 'driverId', select: 'name email phone profilePhoto' },
      })
      .sort({ updatedAt: -1 })
      .lean();

    // Get all offers by this user (as driver) that have completed requests
    const driverOffers = await RideOffer.find({ driverId: req.user.id }).select('_id').lean();
    const driverOfferIds = driverOffers.map(o => o._id);

    const driverRides = await RideRequest.find({
      offerId: { $in: driverOfferIds },
      status: 'completed',
    })
      .populate('passengerId', 'name email phone profilePhoto')
      .populate('offerId', 'source destination departureTime seatsAvailable')
      .sort({ updatedAt: -1 })
      .lean();

    // Merge and tag with role
    const history = [
      ...passengerRides.map(r => ({ ...r, role: 'passenger' })),
      ...driverRides.map(r => ({ ...r, role: 'driver' })),
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(history);
  } catch (err) {
    console.error('History fetch error:', err);
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
    const messages = await Message.find({ requestId: req.params.id }).sort({ createdAt: 1 }).lean();
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
    if (!request.offerId) return res.status(400).json({ message: 'Associated ride offer no longer exists' });

    // Authorization: only the driver can complete
    if (request.offerId.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: only the driver can complete this ride' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ message: 'Request is not currently active' });
    }

    if (!request.completionCode) {
      return res.status(400).json({ message: 'No completion code found for this request' });
    }

    // Normalize both sides before comparing: `code` may arrive as a
    // number, or with surrounding whitespace, and would otherwise fail
    // a strict `!==` comparison against the stored string.
    const suppliedCode = code === undefined || code === null ? '' : String(code).trim();
    if (request.completionCode !== suppliedCode) {
      return res.status(400).json({ message: 'Invalid completion code! Please ask passenger for the 4-digit code.' });
    }

    // Atomically transition accepted -> completed. If two completion
    // requests race (e.g. a double-tap or retry), only one will match
    // status: 'accepted' and the coin payout below only runs once.
    const updatedRequest = await RideRequest.findOneAndUpdate(
      { _id: request._id, status: 'accepted' },
      { $set: { status: 'completed' } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(400).json({ message: 'Ride was already completed' });
    }

    // Check if all requests for this offer are now complete
    const pendingReqs = await RideRequest.countDocuments({
      offerId: request.offerId._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (pendingReqs === 0) {
      await RideOffer.updateOne(
        { _id: request.offerId._id, status: { $ne: 'completed' } },
        { $set: { status: 'completed' } }
      );
    }

    // ─── Coin Reward: driver earns coins charged from passenger ───
    // The passenger already paid coinsCharged at booking time.
    // On completion, transfer those coins to the driver as reward.
    const coinsAllocated = request.coinsCharged && request.coinsCharged > 0
      ? request.coinsCharged
      : Math.max(1, Math.ceil(calculateDistance(
          request.source.lat, request.source.lng,
          request.destination.lat, request.destination.lng
        ) * 2));

    // Award coins to driver
    await User.updateOne({ _id: request.offerId.driverId }, { $inc: { coins: coinsAllocated } });

    // Notify passenger in real-time
    const io = req.app.get('io');
    if (io) {
      io.to(request.passengerId.toString()).emit('request_updated', updatedRequest);
    }

    // Persistent completion notification for both parties
    await Promise.all([
      sendNotification(io, {
        recipientId: request.passengerId,
        type: 'ride_completed',
        title: '🎉 Ride Completed!',
        message: `Your ride has been marked complete. You paid ${coinsAllocated} coins for this trip. Please rate your driver.`,
        metadata: { requestId: request._id },
        actionUrl: '/dashboard',
      }),
      sendNotification(io, {
        recipientId: request.offerId.driverId,
        type: 'ride_completed',
        title: '🎉 Ride Completed!',
        message: `Ride completed successfully! You earned ${coinsAllocated} coins from this passenger.`,
        metadata: { requestId: request._id },
        actionUrl: '/dashboard',
      }),
    ]);

    res.json({ message: 'Ride completed successfully', coinsAllocated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
