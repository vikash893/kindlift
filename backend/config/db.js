const mongoose = require("mongoose");

const connectDb = async () => {
  console.log("MONGO URI IS:", process.env.MONGO_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;