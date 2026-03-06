import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../css/MyRide.css";

export default function MyRide() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [sourceLatLng, setSourceLatLng] = useState(null);
  const [destLatLng, setDestLatLng] = useState(null);

  const [rideHistory, setRideHistory] = useState([]);


  /* ================= LOAD HISTORY ================= */

  useEffect(() => {

    const savedHistory = localStorage.getItem("rideHistory");

    if (savedHistory) {
      setRideHistory(JSON.parse(savedHistory));
    }

  }, []);


  /* ================= SEARCH LOCATION ================= */

  const handleSearch = async (value, type) => {

    if (type === "source") {
      setSource(value);
      setSourceLatLng(null);
    } else {
      setDestination(value);
      setDestLatLng(null);
    }

    if (value.trim().length === 0) {
      setSourceSuggestions([]);
      setDestSuggestions([]);
      return;
    }

    try {

      const res = await API.get(
        `/api/location/search?query=${encodeURIComponent(value)}`
      );

      if (type === "source") {
        setSourceSuggestions(res.data.locations);
      } else {
        setDestSuggestions(res.data.locations);
      }

    } catch (err) {
      console.log(err);
    }

  };


  /* ================= SELECT LOCATION ================= */

  const selectLocation = async (value, type) => {

    try {

      const res = await API.get(
        `/api/location/get-coordinates?name=${encodeURIComponent(value)}`
      );

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


  /* ================= DISTANCE CALCULATION ================= */

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


  /* ================= SUBMIT RIDE ================= */

  const submitRide = async () => {

    if (!sourceLatLng || !destLatLng) {
      alert("Please select valid locations from suggestions");
      return;
    }

    const distance = calculateDistance(
      sourceLatLng.lat,
      sourceLatLng.lng,
      destLatLng.lat,
      destLatLng.lng
    );

    try {

      await API.post("/api/ride/create", {

        name: "Vikash",

        startLocation: source,
        startLat: sourceLatLng.lat,
        startLng: sourceLatLng.lng,

        endLocation: destination,
        endLat: destLatLng.lat,
        endLng: destLatLng.lng,

        distance

      });

      const newRide = {
        source,
        destination,
        distance: distance.toFixed(2),
        time: new Date().toLocaleString()
      };

      const updatedHistory = [newRide, ...rideHistory];

      setRideHistory(updatedHistory);

      localStorage.setItem(
        "rideHistory",
        JSON.stringify(updatedHistory)
      );

      alert("Ride Created Successfully");

      setSource("");
      setDestination("");
      setSourceLatLng(null);
      setDestLatLng(null);

    } catch (error) {

      console.log(error);

    }

  };


  /* ================= UI ================= */

  return (

    <div className="my-ride-container">

      <div className="my-ride-card">

        <h2>Offer Ride</h2>


        {/* SOURCE */}

        <div className="location-input">

          <input
            type="text"
            placeholder="Enter source"
            value={source}
            onChange={(e) => handleSearch(e.target.value, "source")}
          />

          {sourceSuggestions.length > 0 && (

            <div className="suggestions">

              {sourceSuggestions.map((loc, index) => (

                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectLocation(loc.name, "source")}
                >
                  {loc.name}
                </div>

              ))}

            </div>

          )}

        </div>


        {/* DESTINATION */}

        <div className="location-input">

          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => handleSearch(e.target.value, "destination")}
          />

          {destSuggestions.length > 0 && (

            <div className="suggestions">

              {destSuggestions.map((loc, index) => (

                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectLocation(loc.name, "destination")}
                >
                  {loc.name}
                </div>

              ))}

            </div>

          )}

        </div>


        <button onClick={submitRide}>
          Offer Ride
        </button>


        {/* ================= HISTORY ================= */}

        {rideHistory.length > 0 && (

          <div className="ride-history">

            <h3>Your Ride History</h3>

            {rideHistory.map((ride, index) => (

              <div key={index} className="history-item">

                <p>
                  <b>{ride.source}</b> ➜ <b>{ride.destination}</b>
                </p>

                <p>Distance: {ride.distance} km</p>

                <p className="history-time">{ride.time}</p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}