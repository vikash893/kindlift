const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePhoto: { type: String }, // Base64 string
  
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User };