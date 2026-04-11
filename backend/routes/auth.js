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

// ================= REGISTER =================
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone, profilePhoto } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check MongoDB for verified email (replaces in-memory Set)
    const verifiedRecord = await OTP.findOne({ email, verified: true });
    if (!verifiedRecord) {
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

    // Clean up verified OTP record after successful registration
    await OTP.deleteMany({ email });

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

    // Check if email service is configured (Resend API, custom SMTP, or Gmail)
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    const hasGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (!hasResend && !hasSmtp && !hasGmail) {
      console.error('❌ No email service configured! Set RESEND_API_KEY, SMTP_HOST/SMTP_USER/SMTP_PASS, or EMAIL_USER/EMAIL_PASS');
      return res.status(500).json({ message: "Email service not configured on server ❌" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expires: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    // Send email and wait for it before responding
    try {
      await sendEmail(
        email,
        "OTP Verification",
        `Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.`
      );
      res.json({ message: "OTP sent ✅" });
    } catch (emailErr) {
      console.error("❌ Email send failed:", emailErr.message);
      // Clean up the OTP since email failed
      await OTP.deleteMany({ email });
      res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ message: "Email failed ❌" });
  }
});

// ================= VERIFY OTP =================
router.post("/verify-otp", validateVerifyOtp, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, verified: false });

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

    // Mark as verified in MongoDB (persists across server restarts)
    record.verified = true;
    record.expires = new Date(Date.now() + 30 * 60 * 1000); // Extend 30 min for registration
    await record.save();

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