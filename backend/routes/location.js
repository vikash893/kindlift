/**
 * @fileoverview Location Search Routes
 *
 * Dual-API geocoding: Photon (primary, fast, great India coverage) +
 * Nominatim (fallback). Photon is powered by OpenStreetMap data and
 * covers villages, small towns, and tier-2/3 Indian cities excellently.
 * Results are normalized to a common shape regardless of which API was used.
 *
 * @requires express      - Router
 * @requires node-fetch   - HTTP client
 * @requires node-cache   - In-memory caching (1-hour TTL)
 */

const express = require("express");
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const { validateLocationSearch } = require('../middleware/validate');

const router = express.Router();

/** @type {NodeCache} In-memory cache with 2-hour TTL */
const cache = new NodeCache({ stdTTL: 2 * 60 * 60 });

/** Rate limiter: 300 requests per IP per minute */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: { message: "Too many requests, please try again later" },
});

router.use(limiter);

// ─── Shared fetch helper ─────────────────────────────────
const HEADERS = {
  "User-Agent": "KindLift/1.0 (vikashbhardwaj430@gmail.com)",
  "Accept": "application/json",
};

async function safeFetch(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Photon API (primary) ─────────────────────────────────
// Komoot Photon: fast, no auth, excellent India coverage, no strict rate limit
async function searchPhoton(query) {
  // bbox for India: lon_min,lat_min,lon_max,lat_max
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=en&bbox=68.1,6.5,97.4,35.5`;
  const data = await safeFetch(url);
  if (!data || !Array.isArray(data.features) || data.features.length === 0) return [];

  return data.features
    .filter(f => {
      // Only include results within India
      const [lon, lat] = f.geometry.coordinates;
      return lon >= 68.1 && lon <= 97.4 && lat >= 6.5 && lat <= 35.5;
    })
    .map(f => {
      const p = f.properties;
      // Build a human-readable display name
      const parts = [p.name, p.street, p.city || p.town || p.village || p.county, p.state, 'India']
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i); // deduplicate
      return {
        place_id: f.properties.osm_id || Math.random(),
        display_name: parts.join(', '),
        lat: String(f.geometry.coordinates[1]),
        lon: String(f.geometry.coordinates[0]),
        type: p.type || 'place',
        source: 'photon',
      };
    });
}

// ─── Nominatim API (fallback) ─────────────────────────────
async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=8&addressdetails=1`;
  const data = await safeFetch(url, 8000);
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(item => ({ ...item, source: 'nominatim' }));
}

/**
 * GET /search — Location autocomplete with Photon primary + Nominatim fallback
 */
router.get("/search", validateLocationSearch, async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) return res.json([]);

  const cacheKey = query.toLowerCase();
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    // Try Photon first — fast and has great India coverage
    let results = await searchPhoton(query);

    // If Photon returns nothing, fall back to Nominatim
    if (results.length === 0) {
      console.log(`Photon returned 0 results for "${query}", trying Nominatim...`);
      results = await searchNominatim(query);
    }

    cache.set(cacheKey, results);
    return res.json(results);
  } catch (error) {
    console.error("Location search error:", error.message);
    return res.json([]);
  }
});

/**
 * GET /reverse — Reverse geocoding (lat/lon to address) using Photon
 */
router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: "lat and lon required" });

  try {
    const url = `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}&lang=en`;
    const data = await safeFetch(url);
    if (!data || !Array.isArray(data.features) || data.features.length === 0) {
      return res.json({ display_name: "Unknown Location", lat, lon });
    }

    const f = data.features[0];
    const p = f.properties;
    const parts = [p.name, p.street, p.city || p.town || p.village || p.county, p.state, 'India']
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);

    return res.json({
      display_name: parts.join(', '),
      lat,
      lon,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;