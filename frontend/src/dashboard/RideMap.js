import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function ResizeFix() {
  const map = useMap();

 useEffect(() => {
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
}, [map]);


  return null;
}

function RideMap({ userLocation, rides }) {
  if (!userLocation) return null;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <ResizeFix />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* USER LOCATION */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* NEARBY RIDES */}
      {rides.map((ride, i) => (
        <Marker key={i} position={[ride.lat, ride.lng]}>
          <Popup>
            <strong>{ride.name}</strong>
            <br />
            {ride.distance} km away
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default RideMap;
