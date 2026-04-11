const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/sendEmail');

const {
  validateRegister,
  validateLogin,
  validateSendOtp,
  validateVerifyOtp,
} = require('../middleware/validate');

const router = express.Router();

// Store verified emails (temporary after OTP)
const verifiedEmails = new Set();

// ================= REGISTER =================
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

// ================= SEND OTP =================
router.post("/send-otp", validateSendOtp, async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTP
    await OTP.deleteMany({ email });

    // Save new OTP in DB
    await OTP.create({
      email,
      otp,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await sendEmail(
      email,
      "OTP Verification",
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    res.json({ message: "OTP sent ✅" });

  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ message: "Email failed ❌" });
  }
});

// ================= VERIFY OTP =================
router.post("/verify-otp", validateVerifyOtp, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "No OTP found ❌" });
    }

    if (new Date() > record.expires) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired ⏰" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    await OTP.deleteOne({ email });
    verifiedEmails.add(email);

    res.json({ message: "Verified ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// ================= LOGIN =================
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

// ================= ME =================
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