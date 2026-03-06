const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDb = require("./config/db");

const authRouter = require("./routers/auth");
const rideRoutes = require("./routers/ride.routes");
const myriderRouter = require("./routers/myride");
const locationRouter = require("./routers/locations");

const app = express();
const port = process.env.PORT || 8000;


/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* ================= ROUTES ================= */

app.use("/api/auth", authRouter);
app.use("/api/ride", rideRoutes);
app.use("/api/ride", myriderRouter);
app.use("/api/location", locationRouter);


/* ================= START SERVER ================= */

const startServer = async () => {

  try {

    await connectDb();

    console.log("MongoDB Connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {

    console.error("Database connection failed:", err);
    process.exit(1);

  }

};

startServer();