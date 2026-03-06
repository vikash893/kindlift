const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  startLocation: {
    type: String,
    required: true
  },

  startLat: {
    type: Number,
    required: true
  },

  startLng: {
    type: Number,
    required: true
  },

  endLocation: {
    type: String,
    required: true
  },

  endLat: {
    type: Number,
    required: true
  },

  endLng: {
    type: Number,
    required: true
  },

  distance: {
    type: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Ride", rideSchema);