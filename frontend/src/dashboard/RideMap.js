import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


function ResizeFix() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);

  return null;
}

function RideMap({ userLocation, rides }) {
  if (!userLocation) return null;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <ResizeFix />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* USER MARKER */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* RIDERS + DISTANCE LINE */}
      {rides.map((ride, i) => (
        <div key={i}>
          <Marker position={[ride.lat, ride.lng]}>
            <Popup>
              <strong>{ride.name}</strong>
              <br />
              {ride.distance.toFixed(2)} km away
            </Popup>
          </Marker>

          {/* LINE BETWEEN USER & RIDER */}
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [ride.lat, ride.lng],
            ]}
            pathOptions={{ color: "blue", weight: 4 }}
          />
        </div>
      ))}
    </MapContainer>
  );
}

export default RideMap;
