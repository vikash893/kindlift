const express = require("express");
const fetch = require("node-fetch"); // ✅ FIXED

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&limit=5`,
      {
        headers: {
          "User-Agent": "kindlift-app",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Nominatim failed:", response.status);
      return res.json([]); // ✅ NEVER send 500
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Location API Error:", error);
    res.json([]); // ✅ NEVER send 500
  }
});

module.exports = router;