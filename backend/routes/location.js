/**
 * @fileoverview Location Search Routes
 *
 * Provides geocoding search using the Nominatim (OpenStreetMap) API.
 * Includes input validation, caching, rate limiting, request queuing,
 * and automatic retry on 429 responses.
 *
 * @requires express      - Router
 * @requires node-fetch   - HTTP client for Nominatim API
 * @requires node-cache   - In-memory caching
 * @requires express-rate-limit - Request rate limiting
 * @requires p-queue      - Request queue
 */

const express = require("express");
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const PQueue = require("p-queue").default;
const { validateLocationSearch } = require('../middleware/validate');

const router = express.Router();

/** @type {NodeCache} In-memory cache with 1-hour TTL */
const cache = new NodeCache({ stdTTL: 60 * 60 });

/** Rate limiter: 200 requests per IP per minute */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later" },
});

/** Request queue: 1 req/sec to Nominatim to prevent bans */
const queue = new PQueue({
  interval: 1000,
  intervalCap: 1,
});

router.use(limiter);

/**
 * GET /search — Search for locations by name (validated)
 */
router.get("/search", validateLocationSearch, async (req, res) => {
  const query = req.query.q;

  const key = query.toLowerCase();

  // Return cached results if available
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=10`;

    const data = await queue.add(() => fetchWithRetry(url));

    if (!Array.isArray(data)) {
      console.error("Invalid API response:", data);
      return res.json([]);
    }

    cache.set(key, data);
    res.json(data);

  } catch (error) {
    console.error("Server Error:", error.message);
    res.json([]);
  }
});

/**
 * Fetches a URL with automatic retry on 429 responses.
 *
 * @async
 * @param {string} url - URL to fetch
 * @param {number} [retries=3] - Retry attempts remaining
 * @returns {Promise<Array>} Parsed JSON or empty array
 */
async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "KindLift/1.0 (vikashbhardwaj430@gmail.com)",
        "Accept": "application/json",
      },
    });

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