// const axios = require("axios");

// const getCoordinates = async (address) => {
//     const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search`,
//         {
//             params: {
//                 q: address,
//                 format: "json",
//                 limit: 1
//             }
//         }
//     );

//     if (!response.data.length) {
//         throw new Error("Location not found");
//     }

//     return {
//         lat: parseFloat(response.data[0].lat),
//         lng: parseFloat(response.data[0].lon)
//     };
// };

// module.exports = getCoordinates;