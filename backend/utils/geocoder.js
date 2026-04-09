/**
 * @fileoverview Geocoding and Distance Utilities
 *
 * Provides two key utilities:
 * 1. `geocode()` — Converts address strings to lat/lng coordinates via Nominatim (OpenStreetMap)
 * 2. `calculateDistance()` — Computes distance between two GPS coordinates using the Haversine formula
 *
 * @requires axios - HTTP client for Nominatim API requests
 */

const axios = require('axios');

/**
 * Geocodes an address string into latitude/longitude coordinates.
 *
 * Uses the Nominatim (OpenStreetMap) geocoding API.
 * Returns the first matching result or null if no match is found.
 *
 * @async
 * @function geocode
 * @param {string} address - The address or place name to geocode
 * @returns {Promise<{lat: number, lng: number}|null>} Coordinates object or null if not found
 *
 * @example
 * const coords = await geocode("Connaught Place, Delhi");
 * // Returns: { lat: 28.6315, lng: 77.2167 }
 */
const geocode = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'KindLift/1.0 (ride-sharing-app)',
      },
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

/**
 * Calculates the great-circle distance between two points on Earth
 * using the Haversine formula.
 *
 * The Haversine formula determines the shortest distance over the Earth's
 * surface between two points specified by their latitude and longitude.
 *
 * @function calculateDistance
 * @param {number} lat1 - Latitude of point 1 (in degrees)
 * @param {number} lon1 - Longitude of point 1 (in degrees)
 * @param {number} lat2 - Latitude of point 2 (in degrees)
 * @param {number} lon2 - Longitude of point 2 (in degrees)
 * @returns {number} Distance in kilometers
 *
 * @example
 * const distance = calculateDistance(28.6315, 77.2167, 28.5706, 77.3218);
 * // Returns: ~12.4 (km)
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Converts degrees to radians.
 *
 * @function deg2rad
 * @param {number} deg - Angle in degrees
 * @returns {number} Angle in radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

module.exports = { geocode, calculateDistance };
