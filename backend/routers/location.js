const express = require("express");
const Locations = require("../models/locations");

const locationRouter = express.Router();


// ADD LOCATION
locationRouter.post("/add", async (req, res) => {
  try {

    const { name, city, state, lat, lng } = req.body;

    if (!name || !city || !state || !lat || !lng) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const newLocation = new Locations({
      name,
      city,
      state,
      lat,
      lng
    });

    await newLocation.save();

    res.status(200).json({
      message: "Location added successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: "Internal server error"
    });

  }
});


// GET ALL LOCATION NAMES
locationRouter.get("/get", async (req, res) => {

  try {

    const locationNames = await Locations.find({}, "name");

    res.status(200).json({
      locations: locationNames
    });

  } catch (error) {

    res.status(500).json({
      error: "Internal server error"
    });

  }

});


// SEARCH LOCATION (for suggestion dropdown)
locationRouter.get("/search", async (req, res) => {

  try {

    const query = req.query.query;

    const results = await Locations.find({
      name: { $regex: query, $options: "i" }
    }).limit(10);

    res.status(200).json({
      locations: results
    });

  } catch (error) {

    res.status(500).json({
      error: "Internal server error"
    });

  }

});


// GET COORDINATES BY LOCATION NAME
locationRouter.get("/get-coordinates", async (req, res) => {

  try {

    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        error: "Location name is required"
      });
    }

    const location = await Locations.findOne({ name });

    if (!location) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    res.status(200).json({
      name: location.name,
      lat: location.lat,
      lng: location.lng
    });

  } catch (error) {

    res.status(500).json({
      error: "Internal server error"
    });

  }

});

module.exports = locationRouter;