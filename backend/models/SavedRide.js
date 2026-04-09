/**
 * @fileoverview SavedRide Schema — MongoDB Model
 *
 * Allows users to bookmark frequently used routes for quick access.
 * Saved rides store source/destination coordinates and a preferred seat count.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} SavedRide
 * @property {ObjectId}  userId      - Reference to the user who saved this route
 * @property {Location}  source      - Saved pickup location with coordinates
 * @property {Location}  destination - Saved drop-off location with coordinates
 * @property {number}    seats       - Default number of seats for this route
 */
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