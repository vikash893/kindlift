const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/* ================= MULTER CONFIG ================= */


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid password" });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successfully",
      user: userData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", upload.single("image"), async (req, res) => {
  console.log("🔥 REGISTER ROUTE HIT");

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

    const image = req.file ? req.file.path : null;

    if (!name || !phone || !email || !aadharNumber || !password || !lat || !lng || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAadhar = await bcrypt.hash(aadharNumber, 10);

    const user = new User({
      name,
      phone,
      email,
      aadharNumber: hashedAadhar,
      password: hashedPassword,
      image,

      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
        city,
        state
      }
    });

    await user.save();
    res.status(201).json({ message: "Registered", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ================= TOTAL USERS ================= */
router.get("/getuser", async (req, res) => {
  try {
    const countUser = await User.countDocuments();
    res.json({ success: true, countUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ================= GET USER IMAGE ================= */
router.get("/photo", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email }).select("image");

    if (!user || !user.image)
      return res.status(404).json({ message: "Image not found" });

    res.json({ image: user.image });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
