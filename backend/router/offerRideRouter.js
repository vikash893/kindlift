const express = require("express");
const offerRide = require("../models/offerRide");
const User = require("../models/User");
const getCoordinates = require("../utils/geoCoder"); // ✅ import
const getDistance = require("../utils/distance");
const rideRequest = require("../models/rideRequest");

const offerRiderRouter = express.Router();

offerRiderRouter.post("/create", async (req, res) => {
    try {
        const { avilable_seat, source, destination, user_id } = req.body;

        // 🔹 validation
        if (!avilable_seat || !source || !destination || !user_id) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 🔹 check user
        const checkUser = await User.findOne({ user_id });

        if (!checkUser) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        // 🔹 get coordinates (parallel - faster 🚀)
        const [sourceCoordinate, destinationCoordinate] = await Promise.all([
            getCoordinates(source),
            getCoordinates(destination)
        ]);

        const riderdistance = getDistance(
            sourceCoordinate.lat,
            sourceCoordinate.lng,
            destinationCoordinate.lat,
            destinationCoordinate.lng
        );


        // 🔹 create rider
        const newRider = new offerRide({
            offerRider_id: "OFR" + Date.now(),
            user_id,
            avilable_seat,
            source,
            destination,
            source_coordinate: sourceCoordinate,
            destination_coordinate: destinationCoordinate,
            distance: riderdistance
        });

        await newRider.save();

        res.status(201).json({
            success: true,
            user_name: checkUser.name,
            distance: riderdistance,
            data: newRider
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

offerRiderRouter.get("/distance/:offer_id", async (req, res) => {
    try {
        const { offer_id } = req.params;

        const findRider = await offerRide.findOne({ offerRider_id: offer_id });

        if (!findRider) {
            return res.status(400).json({
                error: "Rider not found"
            });
        }

        const totalDistance = findRider.distance;

        res.status(200).json({
            success: true,
            distance: totalDistance
        });

    } catch (error) {
        res.status(500).json({
            error: "Error in finding distance"
        });
    }
});



offerRiderRouter.post("/respond-request", async (req, res) => {
    try {
        const { request_id, action } = req.body;

        if (!request_id || !action) {
            return res.status(400).json({
                error: "Missing fields"
            });
        }

        const request = await rideRequest.findOne({ request_id });

        if (!request) {
            return res.status(404).json({
                error: "Request not found"
            });
        }

        request.status = action; // accepted / rejected
        await request.save();

        res.status(200).json({
            success: true,
            message: `Request ${action}`
        });

    } catch (error) {
        res.status(500).json({
            error: "Error updating request"
        });
    }
});

module.exports = offerRiderRouter;