const express = require("express");

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      {
        headers: {
          "User-Agent": "kindlift-app", // IMPORTANT
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

module.exports = router;