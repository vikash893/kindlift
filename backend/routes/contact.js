const express = require('express');
const rateLimit = require('express-rate-limit');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

/**
 * Rate limiter for contact form — prevents spam.
 * 5 submissions per 15 minutes per IP.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many messages sent. Please try again after 15 minutes.' },
});

/**
 * POST /api/contact
 * Accepts a contact form submission and stores it in the database.
 *
 * Body: { firstName, lastName, email, message }
 */
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        message: 'All fields are required (firstName, lastName, email, message).',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Message length check
    if (message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long.' });
    }

    const contactMsg = new ContactMessage({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    await contactMsg.save();

    return res.status(201).json({
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
