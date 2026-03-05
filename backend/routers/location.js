const express = require("express");
const locations = require("../models/locations");

const locationRouter = express.Router();

locationRouter.post("/add", async (req, res) => {
  try {
    const { name, city, state, lat, lng } = req.body;

    if (!name || !city || !state || !lat || !lng) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const citylocation = new locations({
      name,
      city,
      state,
      lat,
      lng
    });

    await citylocation.save();

    res.status(200).json({
      message: "Location added successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});


locationRouter.get("/get", async (req, res) => {
  try {

    const locationNames = await locations.find({}, "name");

    res.status(200).json({
      locations: locationNames
    });

  } catch (error) {
    res.status(500).json({
      error: "internal server error"
    });
  }
});


locationRouter.get("/search", async (req, res) => {

  const query = req.query.query;

  const locations = await Location.find({
    name: { $regex: query, $options: "i" }
  }).limit(10);

  res.json({ locations });

});

module.exports = locationRouter;