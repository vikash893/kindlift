const mongoose = require("mongoose"); 


const connectDb = async(req,res)=>{
    try {
        mongoose.connect(process.env.MONGO_URI); 
        console.log("Database is connected .");
    } catch (error) {
        console.error("database connection error");
    }
}


module.exports = connectDb;