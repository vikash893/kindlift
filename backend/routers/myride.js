const express = require("express");
const myrider = require("../models/myrider");

const myriderRouter = express.Router();


// =======================================================
// 🔥 HELPER FUNCTION: Calculate distance (Haversine)
// =======================================================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in KM
}


// =======================================================
// ✅ TEST ROUTE
// =======================================================
myriderRouter.get("/checkrider", async (req, res) => {
  res.send("Rider route working 🚀");
});


// =======================================================
// 🚗 REGISTER NEW RIDE
// =======================================================
myriderRouter.post("/register", async (req, res) => {
  try {
    const {
      name,
      startLocation,
      startLat,
      startLng,
      endLocation,
      endLat,
      endLng
    } = req.body;

    // 🔒 validation
    if (
      !name ||
      !startLocation ||
      !endLocation ||
      startLat === undefined ||
      startLng === undefined ||
      endLat === undefined ||
      endLng === undefined
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const rider = new myrider({
      name,
      startLocation,
      startLat,
      startLng,
      endLocation,
      endLat,
      endLng
    });

    await rider.save();

    res.status(201).json({
      success: true,
      msg: "Ride registered successfully 🚗",
      rider
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error while registering ride" });
  }
});


// =======================================================
// 🔎 MATCH RIDERS BASED ON NEARBY LOCATION
// =======================================================
myriderRouter.get("/match", async (req, res) => {
  try {
    let { startLat, startLng, endLat, endLng } = req.query;

    // convert to numbers
    startLat = parseFloat(startLat);
    startLng = parseFloat(startLng);
    endLat = parseFloat(endLat);
    endLng = parseFloat(endLng);

    if (
      isNaN(startLat) ||
      isNaN(startLng) ||
      isNaN(endLat) ||
      isNaN(endLng)
    ) {
      return res.status(400).json({ msg: "Invalid coordinates" });
    }

    // get all riders
    const allRiders = await myrider.find();

    // filter riders
    const matchedRiders = allRiders.filter((rider) => {
      const startDistance = getDistance(
        startLat,
        startLng,
        rider.startLat,
        rider.startLng
      );

      const endDistance = getDistance(
        endLat,
        endLng,
        rider.endLat,
        rider.endLng
      );

      // 🔥 matching condition (within 5 KM radius)
      return startDistance <= 5 && endDistance <= 5;
    });

    res.json({
      success: true,
      totalMatches: matchedRiders.length,
      riders: matchedRiders
    });

  } catch (err) {
    console.error("Match Error:", err);
    res.status(500).json({ msg: "Server error while matching riders" });
  }
});


// =======================================================
// 📄 GET ALL RIDERS (for testing / admin)
// =======================================================
myriderRouter.get("/all", async (req, res) => {
  try {
    const riders = await myrider.find();
    res.json(riders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching riders" });
  }
});


// =======================================================
// ❌ DELETE RIDER (optional)
// =======================================================
myriderRouter.delete("/delete/:id", async (req, res) => {
  try {
    await myrider.findByIdAndDelete(req.params.id);
    res.json({ msg: "Rider deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting rider" });
  }
});


// =======================================================
module.exports = myriderRouter;