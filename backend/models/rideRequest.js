const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideOffer',
    required: true
  },
  seatsRequested: {
    type: Number,
    required: true,
    min: 1
  },
status: {
  type: String,
  enum: ['pending', 'accepted', 'rejected', 'completed'], // ✅ ADD THIS
  default: 'pending'
},
  source: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  destination: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  completionCode: {
    type: String
  },
  isRatedByPassenger: {
    type: Boolean,
    default: false
  },
  isRatedByDriver: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = { RideRequest };