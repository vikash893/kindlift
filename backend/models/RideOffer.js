const mongoose = require('mongoose');

const rideOfferSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  seatsAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  departureTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'ongoing', 'completed', 'cancelled'],
    default: 'waiting'
  },
}, { timestamps: true });

const RideOffer = mongoose.model('RideOffer', rideOfferSchema);

module.exports = { RideOffer };