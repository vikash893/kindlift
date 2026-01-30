const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String , 
        required : true 
    },
    phone :  {
        type : String , 
        required : true 
    },
    email : {
        type : String , 
        required : true 
    }, 
    aadharNumber : {
        type : String , 
        required : true 
    }, 
    location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  },
  city: String,
  state: String
},
    image : {
        type : String , 
        required : true
    },
    password : {
        type : String , 
        required : true 
    }
})

module.exports = mongoose.model("User" , userSchema);