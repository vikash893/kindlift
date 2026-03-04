import { useState } from "react";
import API from "../api/axios";
import "../css/addlocation.css"; // Add this import

function AddLocation() {
  const [location, setLocation] = useState({
    name: "",
    city: "",
    state: "",
    lat: "",
    lng: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation({
      ...location,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await API.post("/api/location/add", location);
      alert("Location added successfully");
      console.log(res.data);

      setLocation({
        name: "",
        city: "",
        state: "",
        lat: "",
        lng: ""
      });
    } catch (error) {
      console.error(error);
      alert("Error adding location");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-location-container">
      <div>
        <h2>Add Location</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <span className="input-icon">📍</span>
            <input
              type="text"
              name="name"
              placeholder="Enter location name"
              value={location.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-container">
              <span className="input-icon">🏙️</span>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={location.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-container">
              <span className="input-icon">🗺️</span>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={location.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <span className="input-icon">🌐</span>
              <input
                type="number"
                name="lat"
                placeholder="Latitude"
                value={location.lat}
                onChange={handleChange}
                required
                step="any"
              />
            </div>

            <div className="input-container">
              <span className="input-icon">🌍</span>
              <input
                type="number"
                name="lng"
                placeholder="Longitude"
                value={location.lng}
                onChange={handleChange}
                required
                step="any"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={isSubmitting ? 'loading' : ''}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Location...' : 'Add Location'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLocation;