const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  city: {
    type: String,
    required: true,
    trim: true
  },

  state: {
    type: String,
    required: true,
    trim: true
  },

  lat: {
    type: Number,
    required: true
  },

  lng: {
    type: Number,
    required: true
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("locations", locationSchema);