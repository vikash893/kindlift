const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    user_id : {
        type : String , 
        required : true ,
        unique : true 
    },
    name : {
         type : String , 
        required : true 
    },
    phone : {
         type : String , 
        required : true ,
    },
    email : {
         type : String , 
        required : true ,
    }, 
    password : {
         type : String , 
        required : true ,
    }, 
    coin : {
        type : Number , 
        required : true ,
    }, 
    rating : {
        type : Number , 
        required : true ,
    }
})


module.exports = mongoose.model("user" , userSchema);