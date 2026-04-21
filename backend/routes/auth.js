console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");
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
    const verifiedRecord = await OTP.findOne({ email, verified: true })
      .sort({ createdAt: -1 });
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
        driverVerificationStatus: user.driverVerificationStatus,
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
    console.log("Generated OTP:", otp);
    console.log("SEND OTP EMAIL:", email);

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

    const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("DB OTP:", record?.otp);
    console.log("ENTERED OTP:", otp);
    console.log("TYPE DB:", typeof record?.otp);
    console.log("TYPE ENTERED:", typeof otp);
    console.log("VERIFY OTP EMAIL:", email);
    if (!record) {
      return res.status(400).json({ message: "No OTP found ❌" });
    }

    if (new Date() > record.expires) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired ⏰" });
    }

    if (record.otp !== otp.toString()) {
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
        driverVerificationStatus: user.driverVerificationStatus,
        isAdmin: user.isAdmin,
        role: user.role,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ================= GOOGLE LOGIN =================
router.post("/google", async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePhoto: photo,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Server error" });
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

    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ================= UPDATE PROFILE =================
router.put('/update-profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );

    const { name, phone, profilePhoto } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(decoded.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      isDriverVerified: user.isDriverVerified,
      driverVerificationStatus: user.driverVerificationStatus,
      isAdmin: user.isAdmin,
      role: user.role,
      coins: user.coins || 0,
      ratingSum: user.ratingSum || 0,
      totalRatings: user.totalRatings || 0,
    });

  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= FORGOT PASSWORD — Send OTP =================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists for security
      return res.json({ message: 'If that email exists, a reset OTP has been sent ✅' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Password Reset OTP:', otp);

    // Clear old OTPs for this email
    await OTP.deleteMany({ email, purpose: 'password-reset' });

    await OTP.create({
      email,
      otp,
      expires: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
      purpose: 'password-reset',
    });

    try {
      await sendEmail(
        email,
        'KindLift — Password Reset',
        `Your password reset OTP is <strong>${otp}</strong>. It will expire in 10 minutes. If you didn't request this, please ignore this email.`
      );
      res.json({ message: 'Reset OTP sent ✅' });
    } catch (emailErr) {
      console.error('❌ Password reset email failed:', emailErr.message);
      await OTP.deleteMany({ email, purpose: 'password-reset' });
      res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= VERIFY RESET OTP =================
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const record = await OTP.findOne({ email, purpose: 'password-reset' }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ message: 'No reset OTP found. Please request a new one.' });
    }

    if (new Date() > record.expires) {
      await OTP.deleteMany({ email, purpose: 'password-reset' });
      return res.status(400).json({ message: 'OTP expired ⏰. Please request a new one.' });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP ❌' });
    }

    // Mark as verified so reset-password can confirm
    record.verified = true;
    await record.save();

    res.json({ message: 'OTP verified ✅' });
  } catch (err) {
    console.error('Verify Reset OTP Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= RESET PASSWORD — Verify OTP & Update =================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find the OTP record
    const record = await OTP.findOne({ email, purpose: 'password-reset' }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ message: 'No reset OTP found. Please request a new one.' });
    }

    if (new Date() > record.expires) {
      await OTP.deleteMany({ email, purpose: 'password-reset' });
      return res.status(400).json({ message: 'OTP expired ⏰. Please request a new one.' });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP ❌' });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clean up OTP records
    await OTP.deleteMany({ email, purpose: 'password-reset' });

    res.json({ message: 'Password reset successful ✅' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;