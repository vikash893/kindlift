const mongoose = require('mongoose');

const savedRideSchema = new mongoose.Schema({
  userId: {
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
  seats: {
    type: Number,
    required: true,
    default: 1
  },
}, { timestamps: true });

const SavedRide = mongoose.model('SavedRide', savedRideSchema);

module.exports = { SavedRide };