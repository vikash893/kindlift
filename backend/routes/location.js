const express = require("express");
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const PQueue = require("p-queue").default;

const router = express.Router();

// ✅ CACHE (1 hour)
const cache = new NodeCache({ stdTTL: 60 * 60 });

// ✅ RATE LIMIT (protect your backend)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 200, // max 200 requests per IP per minute
  message: "Too many requests, please try again later",
});

// ✅ QUEUE (VERY IMPORTANT - prevents API ban)
const queue = new PQueue({
  interval: 1000,     // 1 second window
  intervalCap: 1,     // 🔥 only 1 request/sec to Nominatim
});

// ✅ APPLY RATE LIMIT
router.use(limiter);

// ✅ MAIN ROUTE
router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 3) {
    return res.json([]);
  }

  const key = query.toLowerCase();

  // ✅ CACHE HIT
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=10`;

    // ✅ QUEUE WRAPPER (critical fix)
    const data = await queue.add(() => fetchWithRetry(url));

    // ✅ VALIDATION
    if (!Array.isArray(data)) {
      console.error("Invalid API response:", data);
      return res.json([]);
    }

    // ✅ SAVE CACHE
    cache.set(key, data);

    res.json(data);

  } catch (error) {
    console.error("Server Error:", error.message);
    res.json([]);
  }
});


// ✅ RETRY FUNCTION (handles 429 safely)
async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "KindLift/1.0 (vikashbhardwaj430@gmail.com)",
        "Accept": "application/json",
      },
    });

    // 🔥 HANDLE RATE LIMIT FROM NOMINATIM
    if (response.status === 429) {
      if (retries > 0) {
        console.log("Retrying due to 429...");
        await new Promise((r) => setTimeout(r, 1000));
        return fetchWithRetry(url, retries - 1);
      }
      return [];
    }

    if (!response.ok) {
      console.error("API ERROR:", response.status);
      return [];
    }

    return await response.json();

  } catch (err) {
    console.error("Fetch error:", err.message);
    return [];
  }
}

module.exports = router;