const dotenv = require("dotenv").config();
const express = require("express"); 
const connectDb = require("./config/db");
const cors = require("cors");
const authRouter = require("./router/auth");
const offerRiderRouter = require("./router/offerRideRouter");
const bookRiderRouter = require("./router/bookRiderRouter");
const app = express(); 


const port = process.env.PORT || 8000 ; 

// middlewares 
app.use(cors());
app.use(express.json());



// router 
app.use("/api/auth",authRouter);
app.use("/api/rider" , offerRiderRouter);
app.use("/api/bookrider" , bookRiderRouter);


// database connection 
connectDb();


app.listen(port , ()=>{
    console.log(`server running on the port ${port}`);
})