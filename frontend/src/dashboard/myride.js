import React, { useState } from "react";

export default function Myride() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  // 🔎 fetch suggestions from OpenStreetMap
  const fetchLocations = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  // handle typing
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    fetchLocations(value, setSourceSuggestions);
  };

  const handleDestChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    fetchLocations(value, setDestSuggestions);
  };

  // when user selects location
  const selectSource = (place) => {
    setSource(place.display_name);
    setSourceSuggestions([]);

    console.log("SOURCE SELECTED:", {
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
    });
  };

  const selectDestination = (place) => {
    setDestination(place.display_name);
    setDestSuggestions([]);

    console.log("DEST SELECTED:", {
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
    });
  };

  return (
    <div style={{ width: "350px", margin: "50px auto" }}>
      <h3>🚗 Book a Ride</h3>

      {/* SOURCE INPUT */}
      <div>
        <input
          type="text"
          value={source}
          onChange={handleSourceChange}
          placeholder="Enter pickup location"
          style={styles.input}
        />

        <ul style={styles.dropdown}>
          {sourceSuggestions.map((place, index) => (
            <li
              key={index}
              style={styles.item}
              onClick={() => selectSource(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      </div>

      {/* DESTINATION INPUT */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={destination}
          onChange={handleDestChange}
          placeholder="Enter drop location"
          style={styles.input}
        />

        <ul style={styles.dropdown}>
          {destSuggestions.map((place, index) => (
            <li
              key={index}
              style={styles.item}
              onClick={() => selectDestination(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  dropdown: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    border: "1px solid #ddd",
    maxHeight: "150px",
    overflowY: "auto",
    borderRadius: "8px",
  },
  item: {
    padding: "8px",
    cursor: "pointer",
  },
};