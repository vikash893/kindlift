/**
 * @fileoverview RideOffer Schema — MongoDB Model
 *
 * Represents a ride offered by a driver. Contains source/destination
 * coordinates, available seats, departure time, and ride status.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Location
 * @property {string} name - Human-readable location name
 * @property {number} lat  - Latitude coordinate
 * @property {number} lng  - Longitude coordinate
 */

/**
 * @typedef {Object} RideOffer
 * @property {ObjectId}  driverId       - Reference to User who created the ride
 * @property {Location}  source         - Pickup location with coordinates
 * @property {Location}  destination    - Drop-off location with coordinates
 * @property {number}    seatsAvailable - Number of available seats (min: 0)
 * @property {Date}      departureTime  - Scheduled departure time
 * @property {string}    status         - Ride lifecycle status
 *
 * Status flow: waiting → ongoing → completed
 *                 ↘ cancelled
 */
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

// ─── Performance Indexes ─────────────────────────────
rideOfferSchema.index({ driverId: 1, status: 1 });       // My offers + status filter
rideOfferSchema.index({ status: 1 });                     // Admin stats countDocuments
rideOfferSchema.index({ createdAt: -1 });                 // Sorting by latest
rideOfferSchema.index({ status: 1, createdAt: -1 });      // Admin rides list

const RideOffer = mongoose.model('RideOffer', rideOfferSchema);

module.exports = { RideOffer };