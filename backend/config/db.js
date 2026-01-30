const mongoose = require('mongoose');


const connectDb = async(req ,res) =>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Database connect sucessfully");
    } catch (error) {
        console.error("error in connecting database" , error);
    }
}

module.exports = connectDb ;