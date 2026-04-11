/**
 * @fileoverview Authentication Routes
 *
 * Handles user registration, login, OTP email verification, and
 * retrieving the current authenticated user's profile.
 * All routes include express-validator input validation.
 *
 * Routes:
 * - POST /register    — Create a new user account (requires verified email)
 * - POST /login       — Authenticate and receive a JWT token
 * - POST /send-otp    — Send a 6-digit OTP to the user's email
 * - POST /verify-otp  — Verify the OTP code
 * - GET  /me          — Get the current user's profile (requires auth)
 *
 * @requires express    - Router
 * @requires bcryptjs   - Password hashing
 * @requires jsonwebtoken - JWT token generation
 * @requires nodemailer - Email delivery for OTP
 */

/** @type {Set<string>} Set of emails that have been verified via OTP */
const verifiedEmails = new Set();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const nodemailer = require("nodemailer");
const {
  validateRegister,
  validateLogin,
  validateSendOtp,
  validateVerifyOtp,
} = require('../middleware/validate');

const router = express.Router();

/**
 * POST /register — Register a new user
 *
 * Requires email to be pre-verified via OTP flow.
 * Passwords are hashed with bcrypt (10 salt rounds).
 * Returns a JWT token valid for 7 days.
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone, profilePhoto } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!verifiedEmails.has(email)) {
      return res.status(400).json({ message: "Email not verified ❌" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
    });

    await user.save();

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isDriverVerified: user.isDriverVerified,
        isAdmin: user.isAdmin,
        role: user.role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ═══════════════════ OTP EMAIL VERIFICATION ═══════════════════

/** @type {Object.<string, {otp: string, expires: number}>} In-memory OTP storage */
const otpStore = {};

const { sendEmail } = require('../utils/sendEmail');

/**
 * POST /send-otp — Send OTP verification email
 *
 * Generates a random 6-digit OTP, stores it in memory (5-minute expiry),
 * and sends it via centralized sendEmail utility.
 */
router.post("/send-otp", validateSendOtp, async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await sendEmail(
      email,
      "OTP Verification",
      `Use ${otp} as your One-Time Password (OTP) to continue. This code will expire shortly.`
    );

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ message: "Email failed" });
  }
});

/**
 * POST /verify-otp — Verify the OTP code
 */
router.post("/verify-otp", validateVerifyOtp, (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email]; // Clean up expired OTP
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[email];
  verifiedEmails.add(email);
  res.json({ message: "Verified ✅" });
});

/**
 * POST /login — Authenticate user and return JWT token
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isDriverVerified: user.isDriverVerified,
        isAdmin: user.isAdmin,
        role: user.role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /me — Get current authenticated user's profile
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;