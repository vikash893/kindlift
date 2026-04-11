const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Auto-delete documents 30 minutes after expiry (cleanup)
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model('OTP', otpSchema);