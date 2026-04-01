const mongoose = require('mongoose'); 

const connectDB = async(req , res)=>{
    try {
        mongoose.connect(process.env.MONGODB_URI); 
        console.log("Database connect sucessfully");
    } catch (error) {
        console.error("Database connection error");
    }
}

module.exports = connectDB ; 