const mongoose = require("mongoose");

const offerRiderSchema = new mongoose.Schema({
    offerRider_id : {
        type : String , 
        required : true , 
        unique : true 
    }, 
    user_id : {
         type : String , 
        required : true , 
    }, 
    avilable_seat : {
         type : String , 
        required : true , 
    },
    source : {
         type : String , 
        required : true , 
    }, 
    destination : {
         type : String , 
        required : true , 
    }, 
    source_coordinate: {
    lat: { type: Number },
    lng: { type: Number }
},
destination_coordinate: {
    lat: { type: Number },
    lng: { type: Number }
},
distance : {
    type : String 
}
})

module.exports = mongoose.model("offerRide" , offerRiderSchema);
