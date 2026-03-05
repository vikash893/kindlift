import React, { useState } from "react";
import axios from "axios";

export default function MyRide() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const handleSearch = async (value, type) => {

    if (type === "source") setSource(value);
    else setDestination(value);

    if (value.length < 1) return;

    try {

      const res = await axios.get(`/api/location/search?query=${value}`);

      if (type === "source") {
        setSourceSuggestions(res.data.locations);
      } else {
        setDestSuggestions(res.data.locations);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const selectLocation = (value, type) => {

    if (type === "source") {
      setSource(value);
      setSourceSuggestions([]);
    } else {
      setDestination(value);
      setDestSuggestions([]);
    }

  };

  return (
    <div>

      <h2>Offer Ride</h2>

      {/* SOURCE */}
      <div>
        <input
          type="text"
          placeholder="Enter Source"
          value={source}
          onChange={(e) => handleSearch(e.target.value, "source")}
        />

        {sourceSuggestions.map((loc, index) => (
          <div
            key={index}
            onClick={() => selectLocation(loc.name, "source")}
            style={{ cursor: "pointer", background: "#eee", padding: "5px" }}
          >
            {loc.name}
          </div>
        ))}
      </div>


      {/* DESTINATION */}
      <div>
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => handleSearch(e.target.value, "destination")}
        />

        {destSuggestions.map((loc, index) => (
          <div
            key={index}
            onClick={() => selectLocation(loc.name, "destination")}
            style={{ cursor: "pointer", background: "#eee", padding: "5px" }}
          >
            {loc.name}
          </div>
        ))}
      </div>

    </div>
  );
}