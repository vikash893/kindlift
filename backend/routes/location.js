const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "KindLift/1.0 (vikashbhardwaj430@gmail.com)", // 🔥 IMPORTANT (use real email)
        "Accept": "application/json",
      },
      timeout: 5000, // ⏱️ prevent hanging
    });

    // 🔥 LOG REAL ERROR (IMPORTANT)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nominatim ERROR:", response.status, errorText);
      return res.json([]);
    }

    const data = await response.json();

    // 🔥 SAFETY CHECK
    if (!Array.isArray(data)) {
      console.error("Invalid response:", data);
      return res.json([]);
    }

    res.json(data);

  } catch (error) {
    console.error("Location API Error:", error.message);
    res.json([]);
  }
});

module.exports = router;