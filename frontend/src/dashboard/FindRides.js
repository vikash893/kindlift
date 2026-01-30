import { useState } from "react";
import axios from "axios";

export default function FindRides() {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findRide = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.location?.coordinates) {
        setError("Location not found. Please login again.");
        return;
      }

      const [lng, lat] = user.location.coordinates;

      const res = await axios.post("http://localhost:8000/api/ride/find", {
        lat,
        lng,
        from,
        to
      });

      setMatches(res.data.nearbyUsers || []);
    } catch (err) {
      console.error(err);
      setError("Failed to find riders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Find Riders</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="From"
        value={from}
        onChange={e => setFrom(e.target.value)}
      />
      <input
        placeholder="To"
        value={to}
        onChange={e => setTo(e.target.value)}
      />

      <button onClick={findRide} disabled={loading}>
        {loading ? "Searching..." : "Find"}
      </button>

      <div>
        {matches.length === 0 && !loading && <p>No riders found</p>}

        {matches.map(u => (
          <div key={u._id || u.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <h4>{u.name}</h4>
            <p>{u.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}