const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/find", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Only users who have GeoJSON location
    const nearbyUsers = await User.find({
      "location.coordinates": { $exists: true }
    });

    const filtered = nearbyUsers.filter(u => {
      const [userLng, userLat] = u.location.coordinates;
      const d = Math.sqrt(
        Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2)
      );
      return d <= 0.2; // ~10km rough
    });

    res.json({ nearbyUsers: filtered });

  } catch (err) {
    console.error("Ride Find Error:", err);
    res.status(500).json({ message: "Ride match failed" });
  }
});

module.exports = router;