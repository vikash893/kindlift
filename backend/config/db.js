/**
 * @fileoverview MongoDB Database Connection
 *
 * Establishes connection to MongoDB Atlas using Mongoose ODM.
 * Connection string is read from the MONGODB_URI environment variable.
 *
 * @requires mongoose - MongoDB object modeling for Node.js
 */

const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the URI from environment variables.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} Logs error message if connection fails
 *
 * @example
 * const connectDB = require('./config/db');
 * await connectDB();
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 20,              // Allow up to 20 concurrent connections
      minPoolSize: 5,               // Keep 5 connections warm for instant responses
      socketTimeoutMS: 30000,       // Close sockets after 30s of inactivity
      maxIdleTimeMS: 60000,         // Release idle connections after 60s
      autoIndex: process.env.NODE_ENV !== 'production', // Build indexes in dev only
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
