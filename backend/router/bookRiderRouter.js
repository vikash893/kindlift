const express = require("express");
const User = require("../models/User");
const bookRide = require("../models/bookRide");
const offerRide = require("../models/offerRide"); 
const getCoordinates = require("../utils/geoCoder");
const getDistance = require("../utils/distance");
const rideRequest = require("../models/rideRequest");

const bookRiderRouter = express.Router();


// ================= CREATE BOOKING =================
bookRiderRouter.post("/create", async (req, res) => {
    try {
        const { required_seat, source, destination, user_id } = req.body;

        if (!required_seat || !source || !destination || !user_id) {
            return res.status(400).json({
                error: "Please enter all the fields"
            });
        }

        const findUser = await User.findOne({ user_id });

        if (!findUser) {
            return res.status(400).json({
                error: "User not found"
            });
        }

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

        const newbookRider = new bookRide({
            bookRider_id: "BRI" + Date.now(),
            user_id,
            required_seat,
            source,
            destination,
            source_coordinate: sourceCoordinate,
            destination_coordinate: destinationCoordinate,
        });

        await newbookRider.save();

        res.status(201).json({
            success: true,
            user_name: findUser.name,
            distance: riderdistance,
            data: newbookRider
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});


// ================= FIND NEAREST RIDERS =================
bookRiderRouter.post("/nearest-rider", async (req, res) => {
    try {
        const { source, destination, required_seat } = req.body;

        if (!source || !destination) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // 🔹 user coordinates
        const [userSource, userDestination] = await Promise.all([
            getCoordinates(source),
            getCoordinates(destination)
        ]);

        // 🔹 get all drivers
        const riders = await offerRide.find();

        let matchedRides = [];

        for (let rider of riders) {

            // 🔹 seat filter
            if (required_seat && rider.avilable_seat < required_seat) continue;

            // 🔹 distance calculations
            const sourceDistance = getDistance(
                userSource.lat,
                userSource.lng,
                rider.source_coordinate.lat,
                rider.source_coordinate.lng
            );

            const destinationDistance = getDistance(
                userDestination.lat,
                userDestination.lng,
                rider.destination_coordinate.lat,
                rider.destination_coordinate.lng
            );

            // 🔹 matching condition (5km threshold)
            if (sourceDistance <= 5 && destinationDistance <= 5) {
                matchedRides.push({
                    offer_id: rider.offerRider_id,
                    source: rider.source,
                    destination: rider.destination,
                    available_seat: rider.avilable_seat,
                    sourceDistance,
                    destinationDistance,
                    score: sourceDistance + destinationDistance
                });
            }
        }

        // 🔥 sort by best match
        matchedRides.sort((a, b) => a.score - b.score);

        res.status(200).json({
            success: true,
            totalMatches: matchedRides.length,
            rides: matchedRides
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error finding nearest riders"
        });
    }
});

// ===========================================Send-request======================

bookRiderRouter.post("/send-request", async (req, res) => {
    try {
        const { user_id, matched_rides } = req.body;

        if (!user_id || !matched_rides || matched_rides.length === 0) {
            return res.status(400).json({
                error: "Missing fields"
            });
        }

        let requests = [];

        for (let rider of matched_rides) {

            // 🔥 prevent duplicate requests
            const existing = await rideRequest.findOne({
                passenger_id: user_id,
                offer_id: rider.offer_id,
                status: "pending"
            });

            if (existing) continue;

            const newRequest = new rideRequest({
                request_id: "REQ" + Date.now() + Math.random(),
                passenger_id: user_id,
                offer_id: rider.offer_id
            });

            await newRequest.save();
            requests.push(newRequest);
        }

        res.status(201).json({
            success: true,
            message: "Request sent to riders",
            totalRequests: requests.length,
            data: requests
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to send request"
        });
    }
});


// =================================check status==================
bookRiderRouter.get("/request-status/:request_id", async (req, res) => {
    try {
        const request = await rideRequest.findOne({
            request_id: req.params.request_id
        });

        if (!request) {
            return res.status(404).json({
                error: "Request not found"
            });
        }

        res.json({
            success: true,
            status: request.status
        });

    } catch (error) {
        res.status(500).json({
            error: "Error fetching status"
        });
    }
});
module.exports = bookRiderRouter;