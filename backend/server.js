import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDb from "./config/db.js";
import router from "./routers/auth.js";
import adminRouter from "./routers/admin.js";
import rideRoutes from "./routers/ride.routes.js";

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", router);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRouter);
app.use("/api/ride", rideRoutes);
app.use("/api/admin" , adminRouter);

// start server
app.listen(port, async () => {
  console.log(`server is running on the port ${port}`);
  await connectDb();
});