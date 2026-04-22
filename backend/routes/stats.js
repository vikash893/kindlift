const express = require('express');
const router = express.Router();
const { RideRequest } = require('../models/RideRequest');
const { RideOffer } = require('../models/RideOffer');

router.get('/', async (req, res) => {
  try {
    // 1. Happy Journeys (Completed Rides)
    const happyJourneys = await RideRequest.countDocuments({ status: 'completed' });

    // 2. Match Accuracy (Accepted or Completed / Total Requests)
    // If no requests, default to 98 (as in original) or 100
    const totalRequests = await RideRequest.countDocuments();
    const successfulRequests = await RideRequest.countDocuments({
      status: { $in: ['accepted', 'completed'] }
    });
    
    let matchAccuracy = 98; // Default if no data
    if (totalRequests > 0) {
      matchAccuracy = Math.round((successfulRequests / totalRequests) * 100);
    }

    // 3. Active Cities
    // We can aggregate unique cities from RideOffers' source and destination
    const offers = await RideOffer.find({}, 'source.name destination.name');
    const citiesSet = new Set();
    
    offers.forEach(offer => {
      if (offer.source && offer.source.name) {
        // Extract city (simplistic split by comma, usually the first or second part, or just the string if it's a city)
        citiesSet.add(offer.source.name.split(',')[0].trim());
      }
      if (offer.destination && offer.destination.name) {
        citiesSet.add(offer.destination.name.split(',')[0].trim());
      }
    });
    
    const activeCities = citiesSet.size || 0;

    res.status(200).json({
      happyJourneys,
      matchAccuracy,
      activeCities
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
