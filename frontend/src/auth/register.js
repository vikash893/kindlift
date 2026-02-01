import "../css/register.css";

import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    aadharNumber: "",
    password: "",
    location: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [cityState, setCityState] = useState({ city: "", state: "" });

  const [agreeToTerms, setAgreeToTerms] = useState(false); // ✅ FIX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({ lat, lng });
        setCityState({ city: "Detected", state: "Detected" });
        setUser((prev) => ({ ...prev, location: "Location detected" }));
        setSuccess("Location detected!");
      },
      () => setError("Location permission denied")
    );
  };

  const validateForm = () => {
    if (user.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!coords.lat || !coords.lng) {
      setError("Please detect location");
      return false;
    }
    if (!image) {
      setError("Profile image required");
      return false;
    }
    if (!agreeToTerms) {
      setError("Please accept terms");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(user).forEach((key) => formData.append(key, user[key]));
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);
    formData.append("city", cityState.city);
    formData.append("state", cityState.state);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/register`, formData);
      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-left">
          <h1>Join KindLift</h1>
          <p>Share rides with trusted college students.</p>
          <div className="feature">✔ Secure profiles</div>
          <div className="feature">✔ Trusted community</div>
          <div className="feature">✔ Smart matching</div>
        </div>

        <div className="register-right">
          <h2>Create Account</h2>

          {error && <div className="message-error">{error}</div>}
          {success && <div className="message-success">{success}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="phone" placeholder="Phone" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="aadharNumber" placeholder="Aadhar Number" maxLength="12" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />

            <button type="button" className="secondary" onClick={detectLocation}>
              Detect Location
            </button>

            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

            <label>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              /> Accept terms
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="register-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Register; // ✅ FIX
