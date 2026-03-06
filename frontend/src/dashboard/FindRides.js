import { useState } from "react";
import API from "../api/axios";

function FindRides() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [rides, setRides] = useState([]);

  /* ---------------- SEARCH LOCATION ---------------- */

  const handleSearch = async (value, type) => {

    if (type === "source") setSource(value);
    else setDestination(value);

    if (value.length < 1) return;

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


  /* ---------------- SELECT LOCATION ---------------- */

  const selectLocation = (value, type) => {

    if (type === "source") {

      setSource(value);
      setSourceSuggestions([]);

    } else {

      setDestination(value);
      setDestSuggestions([]);

    }

  };


  /* ---------------- SEARCH RIDES ---------------- */

  const searchRides = async () => {

    if (!source || !destination) {
      alert("Enter both locations");
      return;
    }

    try {

      const res = await API.get(
        `/api/ride/search?source=${source}&destination=${destination}`
      );

      setRides(res.data.rides);

    } catch (err) {

      console.log(err);

    }

  };


  /* ---------------- ACCEPT RIDE ---------------- */

  const acceptRide = (rideId) => {

    alert("Ride accepted");

  };


  /* ---------------- REJECT RIDE ---------------- */

  const rejectRide = (rideId) => {

    alert("Ride rejected");

  };


  return (

    <div style={{ width: "100%" }}>

      <h2>Find Rides</h2>


      {/* SOURCE */}

      <div className="location-input">

        <input
          type="text"
          placeholder="Enter source"
          value={source}
          onChange={(e) => handleSearch(e.target.value, "source")}
        />

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


      {/* DESTINATION */}

      <div className="location-input">

        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => handleSearch(e.target.value, "destination")}
        />

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


      <button
        onClick={searchRides}
        style={{
          marginTop: "10px",
          padding: "10px",
          borderRadius: "8px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Search Ride
      </button>


      {/* ---------------- RIDES LIST ---------------- */}

      <div style={{ marginTop: "20px" }}>

        {rides.length === 0 && <p>No rides found</p>}

        {rides.map((ride, index) => (

          <div
            key={index}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >

            <h4>{ride.name}</h4>

            <p>
              {ride.startLocation} → {ride.endLocation}
            </p>

            <p>Distance: {ride.distance} km</p>


            <div style={{ display: "flex", gap: "10px" }}>

              <button
                onClick={() => acceptRide(ride._id)}
                style={{
                  padding: "8px 12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Accept
              </button>


              <button
                onClick={() => rejectRide(ride._id)}
                style={{
                  padding: "8px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default FindRides;