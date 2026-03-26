const mongoose = require('mongoose');

const bookRideSchema = new mongoose.Schema({
    bookRider_id : {
        type: String,
        required: true
     },
    user_id: {
        type: String,
        required: true
    },
    required_seat: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    source_coordinate: {
        lat: { type: Number },
        lng: { type: Number }
    },
    destination_coordinate: {
        lat: { type: Number },
        lng: { type: Number }
    },
})


module.exports = mongoose.model("bookRider" , bookRideSchema);