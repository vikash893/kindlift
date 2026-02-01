import { useEffect, useState } from "react";
import RideMap from "./RideMap";
import { getDistance } from "../utils/distance";

function FindRides() {
  const [userLocation, setUserLocation] = useState(null);
  const [rides, setRides] = useState([]);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied")
    );
  }, []);

  // Mock nearby rides
  useEffect(() => {
    if (!userLocation) return;

    const availableRides = [
      { name: "Aman", lat: 27.50, lng: 77.67 },
      { name: "Rohit", lat: 27.48, lng: 77.70 },
    ];

    const withDistance = availableRides.map((ride) => ({
      ...ride,
      distance: getDistance(
        userLocation.lat,
        userLocation.lng,
        ride.lat,
        ride.lng
      ).toFixed(2),
    }));

    setRides(withDistance);
  }, [userLocation]);

  if (!userLocation) {
    return <p style={{ padding: "20px" }}>Fetching your location…</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        Find Free Rides Near You
      </h2>

      {/* MAP AREA */}
     <div
  style={{
    height: "500px",
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden"
  }}
>

        <RideMap userLocation={userLocation} rides={rides} />
      </div>
    </div>
  );
}

export default FindRides;
