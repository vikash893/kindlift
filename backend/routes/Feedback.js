const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

router.post("/feedback", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        const userFeedback = new Feedback({
            name,
            email,
            message
        });

        await userFeedback.save();

        return res.status(200).json({
            message: "Feedback submitted successfully"
        });

    } catch (error) {
        console.error('Feedback error:', error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

// Get featured feedback for Home page
router.get("/feedback/featured", async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ isFeatured: true })
            .sort({ _id: -1 })
            .limit(10);
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Fetch featured feedback error:', error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;