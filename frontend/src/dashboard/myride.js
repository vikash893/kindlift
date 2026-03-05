import React, { useState } from "react";
import API from "../api/axios";
import "../css/MyRide.css";

export default function MyRide() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [sourceLatLng, setSourceLatLng] = useState(null);
  const [destLatLng, setDestLatLng] = useState(null);

  const handleSearch = async (value, type) => {

    if (type === "source") setSource(value);
    else setDestination(value);

    if (value.length < 1) return;

    try {

      const res = await API.get(`/api/location/search?query=${value}`);

      if (type === "source") {
        setSourceSuggestions(res.data.locations);
      } else {
        setDestSuggestions(res.data.locations);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const selectLocation = async (value, type) => {

    try {

      const res = await API.get(`/api/location/get-coordinates?name=${value}`);

      if (type === "source") {

        setSource(value);
        setSourceSuggestions([]);
        setSourceLatLng(res.data);

      } else {

        setDestination(value);
        setDestSuggestions([]);
        setDestLatLng(res.data);

      }

    } catch (err) {
      console.log(err);
    }

  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;

  };

  const submitRide = async () => {

    if (!sourceLatLng || !destLatLng) {
      alert("Please select both locations");
      return;
    }

    const distance = calculateDistance(
      sourceLatLng.lat,
      sourceLatLng.lng,
      destLatLng.lat,
      destLatLng.lng
    );

    try {

      await API.post("/api/rides/create", {

        name: "Vikash",

        startLocation: source,
        startLat: sourceLatLng.lat,
        startLng: sourceLatLng.lng,

        endLocation: destination,
        endLat: destLatLng.lat,
        endLng: destLatLng.lng,

        distance

      });

      alert("Ride Created Successfully");

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="my-ride-container">

      <div className="my-ride-card">

        <h2>Offer Ride</h2>

        {/* SOURCE */}

        <input
          type="text"
          placeholder="Enter source"
          value={source}
          onChange={(e) => handleSearch(e.target.value, "source")}
        />

        {sourceSuggestions.map((loc, index) => (

          <div
            key={index}
            onClick={() => selectLocation(loc.name, "source")}
          >
            {loc.name}
          </div>

        ))}

        {/* DESTINATION */}

        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => handleSearch(e.target.value, "destination")}
        />

        {destSuggestions.map((loc, index) => (

          <div
            key={index}
            onClick={() => selectLocation(loc.name, "destination")}
          >
            {loc.name}
          </div>

        ))}

        <button onClick={submitRide}>
          Offer Ride
        </button>

      </div>

    </div>

  );

}