const express = require("express");
const Rider = require("../models/rider");

const myriderRouter = express.Router();

myriderRouter.post("/create", async (req, res) => {

  try {

    const {
      name,
      startLocation,
      startLat,
      startLng,
      endLocation,
      endLat,
      endLng,
      distance
    } = req.body;

    const ride = new Rider({
      name,
      startLocation,
      startLat,
      startLng,
      endLocation,
      endLat,
      endLng,
      distance
    });

    await ride.save();

    res.status(200).json({
      message: "Ride created successfully",
      ride
    });

  } catch (error) {

    res.status(500).json({
      error: "Internal server error"
    });

  }

});

module.exports = router;