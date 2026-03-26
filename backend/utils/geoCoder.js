const axios = require("axios");

const getCoordinates = async (address) => {
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: address,
                    format: "json",
                    limit: 1
                },
                headers: {
                    "User-Agent": "kindlift-app/1.0 (vikashbhardwaj430@gmail.com)",
                    "Accept": "application/json",
                },
                timeout: 5000
            }
        );

        if (!response.data || response.data.length === 0) {
            throw new Error("Location not found");
        }

        return {
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon)
        };

    } catch (error) {
        console.error("Geocoding error:", error.response?.status, error.response?.data);
        throw new Error("Failed to get coordinates");
    }
};

module.exports = getCoordinates;