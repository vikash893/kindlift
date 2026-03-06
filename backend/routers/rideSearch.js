const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");


/* ================= FIND RIDES ================= */

router.get("/search", async (req, res) => {

  try {

    const { source, destination } = req.query;

    if (!source || !destination) {

      return res.status(400).json({
        message: "Source and destination required"
      });

    }

    const rides = await Ride.find({
      startLocation: { $regex: source, $options: "i" },
      endLocation: { $regex: destination, $options: "i" }
    });

    res.json({
      rides
    });

  } catch (err) {

    console.error("Ride Search Error:", err);

    res.status(500).json({
      message: "Ride search failed"
    });

  }

});

module.exports = router;