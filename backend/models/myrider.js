const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },

  startLocation: String,
  startLat: Number,
  startLng: Number,

  endLocation: String,
  endLat: Number,
  endLng: Number
});

module.exports = mongoose.model("myrider", riderSchema);