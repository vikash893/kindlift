/**
 * @fileoverview Rating Schema — MongoDB Model
 *
 * Stores post-ride ratings between drivers and passengers.
 * Each user can rate the other exactly once per ride request,
 * enforced by a unique compound index on {requestId, raterId}.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Rating
 * @property {ObjectId}  rideOfferId  - The RideOffer associated with this rating
 * @property {ObjectId}  requestId    - The RideRequest associated with this rating
 * @property {ObjectId}  raterId      - User who submitted the rating
 * @property {ObjectId}  ratedUserId  - User being rated
 * @property {number}    rating       - Star rating (1–5)
 * @property {string}    review       - Optional text review
 * @property {string}    raterRole    - Role of the rater: 'driver' or 'passenger'
 *
 * Business Rules:
 * - One rating per user per ride request (unique index)
 * - Submitting a rating updates the rated user's aggregate ratingSum/totalRatings
 * - When BOTH driver and passenger rate each other, the RideRequest is auto-deleted
 */
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

// Prevent duplicate ratings: one rating per rater per ride request
ratingSchema.index({ requestId: 1, raterId: 1 }, { unique: true });
// ─── Performance Indexes ─────────────────────────────
ratingSchema.index({ ratedUserId: 1, createdAt: -1 });     // User's received ratings
ratingSchema.index({ createdAt: -1 });                      // Admin ratings list

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = { Rating };
