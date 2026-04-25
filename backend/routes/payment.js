const Transaction = require("../models/Transaction");
const { authMiddleware } = require("../middleware/auth"); // adjust path
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User"); // adjust path
//const User = require("./models/User"); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// 🔐 VERIFY + ADD COINS (SECURE)
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user.id;

    // 1. VERIFY SIGNATURE
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
    console.log("🔍 Razorpay Signature:", razorpay_signature);
    console.log("🔍 Expected Signature:", expectedSign);
    // ✅ Add this to catch missing values
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Secret Key:", process.env.RAZORPAY_KEY_SECRET ? "Loaded ✅" : "MISSING ❌");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // 2. FETCH ORDER
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const amount = order.amount / 100;

    // 3. DECIDE COINS
    const coins = (amount / 10) * 1000; // ✅ dynamic
    //else return res.status(400).json({ success: false });

    // 🔁 DUPLICATE CHECK
    const existing = await Transaction.findOne({
      paymentId: razorpay_payment_id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }

    // 4. UPDATE USER
    await User.findByIdAndUpdate(userId, {
      $inc: { coins },
    });

    // 🧾 SAVE TRANSACTION
    await Transaction.create({
      userId,
      amount,
      coins,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "success",
    });

    return res.json({ success: true, coinsAdded: coins });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});
// ✅ CREATE ORDER (REQUIRED)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("BACKEND RECEIVED AMOUNT:", amount);
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating order" });
  }
});
module.exports = router;