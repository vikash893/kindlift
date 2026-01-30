const dotenv = require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const router = require('./routers/auth');
const adminRouter = require('./routers/admin');
const rideRoutes = require("./routers/ride.routes");



const app = express();

const port = process.env.PORT || 5000 


// middleware
app.use(cors());
app.use(express.json());


//routers
app.use("/api/auth" , router);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin",adminRouter);
app.use("/api/ride", rideRoutes);
// app.use("/api/ride/find" , findRouter);


app.listen( port , ()=>{
    try {
        console.log(`server is running on the port ${port}`);
        connectDb();
    } catch (error) {
        console.log("error in connecting server");
    }
})