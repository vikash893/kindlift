/**
 * @fileoverview User Schema — MongoDB Model
 *
 * Defines the User document structure for authentication, driver verification,
 * coin rewards, and aggregate rating tracking.
 *
 * @requires mongoose - MongoDB ODM
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @property {string}  name              - User's full display name
 * @property {string}  email             - Unique email address (used for login)
 * @property {string}  password          - bcrypt-hashed password (never returned in API responses)
 * @property {string}  [phone]           - Optional phone number
 * @property {string}  [profilePhoto]    - Base64-encoded profile image
 * @property {boolean} isDriverVerified        - Whether driver is admin-approved (default: false)
 * @property {string}  driverVerificationStatus - Verification pipeline: none|pending|approved|rejected
 * @property {string}  [driverVerificationNote] - Admin feedback on verification
 * @property {string}  [vehicleNumber]          - Registered vehicle plate number
 * @property {string}  [licenseNumber]          - Driver's license number
 * @property {string}  [vehiclePhoto]           - Base64-encoded vehicle photo
 * @property {number}  coins             - Earned reward coins (default: 0)
 * @property {number}  ratingSum         - Sum of all received ratings
 * @property {number}  totalRatings      - Count of total ratings received
 * @property {Date}    createdAt         - Auto-generated timestamp
 * @property {Date}    updatedAt         - Auto-generated timestamp
 *
 * @note Average rating = ratingSum / totalRatings
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePhoto: { type: String }, // Base64 string
  
  // Admin Fields
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },

  // Driver Verification Fields
  isDriverVerified: { type: Boolean, default: false },
  driverVerificationStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  driverVerificationNote: { type: String },  // Admin feedback
  vehicleNumber: { type: String },
  licenseNumber: { type: String },
  vehiclePhoto: { type: String }, // Base64 string

  // Coin System
  coins: { type: Number, default: 0 },

  // Rating System
  ratingSum: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },

  // Account Status
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Performance Indexes ─────────────────────────────
// email is already unique (built-in index)
userSchema.index({ isActive: 1 });                         // Admin active user filter
userSchema.index({ isDriverVerified: 1 });                 // Admin driver filter
userSchema.index({ driverVerificationStatus: 1 });         // Admin verification queue
userSchema.index({ isAdmin: 1, role: 1 });                 // Admin role filter
userSchema.index({ totalRatings: -1 });                    // Top rated users sort
userSchema.index({ createdAt: -1 });                       // Recent users sort

const User = mongoose.model('User', userSchema);

module.exports = { User };