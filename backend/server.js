const dotenv = require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const router = require('./routers/auth');


const app = express();

const port = process.env.PORT || 5000 


// middleware
app.use(cors());
app.use(express.json());


//routers
app.use("/api/auth" , router);
app.use("/uploads", express.static("uploads"));


app.listen( port , ()=>{
    try {
        console.log(`server is running on the port ${port}`);
        connectDb();
    } catch (error) {
        console.log("error in connecting server");
    }
})