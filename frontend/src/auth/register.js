import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Car,
  Shield,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import "../css/home.css";
import "../css/auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [cityState, setCityState] = useState({ city: "", state: "" });

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    aadharNumber: "",
    password: "",
    location: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  /* ---------- IMAGE ---------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------- LOCATION ---------- */
  async function getAddress(lat, lon) {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await res.json();
    return {
      address: `${data.city || data.locality}, ${data.principalSubdivision}, ${data.countryName}`,
      city: data.city || data.locality,
      state: data.principalSubdivision
    };
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const addressData = await getAddress(lat, lon);

        setUser((prev) => ({ ...prev, location: addressData.address }));
        setCoords({ lat, lng: lon });
        setCityState({ city: addressData.city, state: addressData.state });

        setSuccess("Location detected!");
        setLoadingLocation(false);
      },
      () => {
        setError("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  /* ---------- FORM ---------- */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (user.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (user.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!agreeToTerms) {
      setError("Please accept the terms");
      return false;
    }
    if (!coords.lat || !coords.lng) {
      setError("Please detect your location");
      return false;
    }
    if (!image) {
      setError("Profile image is required");
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

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-content">
            <Link to="/" className="logo" style={{ color: "white" }}>
              <Car /> kindlift
            </Link>

            <h1>Join Our Travel Community</h1>
            <p>Share rides with trusted college students.</p>

            <div className="auth-features">
              <div className="auth-feature"><Shield /> Secure Profiles</div>
              <div className="auth-feature"><Users /> Trusted Community</div>
              <div className="auth-feature"><MapPin /> Smart Matching</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <h2>Create Account</h2>

          {error && (
            <div className="error-message">
              <AlertCircle /> {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="phone" placeholder="Phone" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="aadharNumber" placeholder="Aadhar" maxLength="12" onChange={handleChange} required />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="button" onClick={detectLocation}>
              {loadingLocation ? "Detecting..." : "Detect Location"}
            </button>

            <input type="file" accept="image/*" onChange={handleImage} />

            {preview && <img src={preview} alt="preview" width="80" />}

            <label>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              Accept terms
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
