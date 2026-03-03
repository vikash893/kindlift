const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// 🔥 Create uploads folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= REGISTER ================= */
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      aadharNumber,
      password,
      lat,
      lng,
      city,
      state
    } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`   // ✅ ONLY RELATIVE PATH
      : null;

    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      image: imagePath,
      location: {
        type: "Point",
        coordinates: lat && lng
          ? [parseFloat(lng), parseFloat(lat)]
          : [0, 0],
        city: city || "",
        state: state || ""
      }
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    console.error("MESSAGE:", err.message);
  console.error("STACK:", err.stack);
  console.error("FULL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid password" });

    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Login successful",
      user: userData
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET USER IMAGE ================= */
router.get("/photo", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email }).select("image");

    if (!user || !user.image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({
      image: user.image   // ✅ returns "/uploads/filename.png"
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= TOTAL USERS ================= */
router.get("/getuser", async (req, res) => {
  const countUser = await User.countDocuments();
  res.json({ countUser });
});

module.exports = router;