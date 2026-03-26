const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema({
    request_id: String,

    passenger_id: String,
    offer_id: String, // driver ride

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("rideRequest", rideRequestSchema);