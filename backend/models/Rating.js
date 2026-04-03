const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rideOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideOffer',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideRequest',
    required: true
  },
  raterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    default: ''
  },
  raterRole: {
    type: String,
    enum: ['driver', 'passenger'],
    required: true
  }
}, { timestamps: true });

// Prevent duplicate ratings
ratingSchema.index({ requestId: 1, raterId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = { Rating };
