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
 * @property {boolean} isDriverVerified  - Whether driver submitted vehicle details (default: false)
 * @property {string}  [vehicleNumber]   - Registered vehicle plate number
 * @property {string}  [licenseNumber]   - Driver's license number
 * @property {string}  [vehiclePhoto]    - Base64-encoded vehicle photo
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

const User = mongoose.model('User', userSchema);

module.exports = { User };