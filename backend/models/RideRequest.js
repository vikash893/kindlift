/**
 * @fileoverview RideRequest Schema — MongoDB Model
 *
 * Represents a passenger's booking request for a ride offer.
 * Tracks the request lifecycle from pending → accepted/rejected → completed,
 * including OTP-based ride completion and mutual rating flags.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} RideRequest
 * @property {ObjectId}  passengerId       - Reference to the requesting passenger
 * @property {ObjectId}  offerId           - Reference to the RideOffer being requested
 * @property {number}    seatsRequested    - Number of seats requested (min: 1)
 * @property {string}    status            - Request lifecycle status
 * @property {Location}  source            - Passenger's pickup location
 * @property {Location}  destination       - Passenger's drop-off location
 * @property {string}    completionCode    - 4-digit OTP code (generated on acceptance)
 * @property {boolean}   isRatedByPassenger - Whether passenger has submitted a rating
 * @property {boolean}   isRatedByDriver    - Whether driver has submitted a rating
 *
 * Status flow: pending → accepted → completed
 *                ↘ rejected
 *
 * Completion flow:
 * 1. Driver accepts request → system generates 4-digit completionCode
 * 2. completionCode is shown to the passenger
 * 3. Passenger shares code with driver at ride end
 * 4. Driver enters code → ride marked completed → coins allocated
 */
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
    enum: ['pending', 'accepted', 'rejected', 'completed'],
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

// ─── Performance Indexes ─────────────────────────────
rideRequestSchema.index({ passengerId: 1, status: 1 });    // My requests + status
rideRequestSchema.index({ offerId: 1, status: 1 });        // Incoming requests for a ride
rideRequestSchema.index({ status: 1 });                     // Admin stats
rideRequestSchema.index({ createdAt: -1 });                 // Sort by latest

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = { RideRequest };