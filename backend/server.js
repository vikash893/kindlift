const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDb = require("./config/db");
const router = require("./routers/auth");
const adminRouter = require("./routers/admin");
const rideRoutes = require("./routers/ride.routes");
const myriderRouter = require("./routers/myride");

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    // "https://your-frontend-domain.com"
  ],
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/auth", router);
app.use("/uploads", express.static("uploads"));
app.use("/api/ride", rideRoutes);
app.use("/api/ride", myriderRouter);
app.use("/api/admin", adminRouter);

// start server
app.listen(port, async () => {
  console.log(`server is running on the port ${port}`);
  await connectDb();
});