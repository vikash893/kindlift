import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const LIBRARIES = ["places"];

export default function MyRide() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handlePlaceSelect = (autocomplete, type) => {
    const place = autocomplete.getPlace();
    if (!place) return;

    const location = place.formatted_address || place.name || "";

    if (type === "source") {
      setSource(location);
    } else {
      setDestination(location);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyA9oTOgPJ5BQ4_EFtk4jBhFrfq-aTmUP6M" libraries={LIBRARIES}>
      <h2>Offer Ride</h2>

      <Autocomplete
        onLoad={(auto) => (window.sourceAuto = auto)}
        onPlaceChanged={() =>
          handlePlaceSelect(window.sourceAuto, "source")
        }
      >
        <input
          type="text"
          placeholder="Enter Source"
          value={source || ""}
        />
      </Autocomplete>

      <Autocomplete
        onLoad={(auto) => (window.destAuto = auto)}
        onPlaceChanged={() =>
          handlePlaceSelect(window.destAuto, "destination")
        }
      >
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination || ""}
        />
      </Autocomplete>
    </LoadScript>
  );
}