import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User, Phone, Mail, IdCard, Lock, MapPin, Car, Shield, Users,
  CheckCircle, AlertCircle, Eye, EyeOff, Loader2
} from 'lucide-react';
import '../css/home.css';
import '../css/auth.css';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    let strength = 0;
    if (user.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(user.password)) strength += 25;
    if (/[0-9]/.test(user.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(user.password)) strength += 25;
    setPasswordStrength(strength);
  }, [user.password]);

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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (user.password !== confirmPassword) return setError("Passwords do not match"), false;
    if (user.password.length < 8) return setError("Password too short"), false;
    if (!agreeToTerms) return setError("Accept terms"), false;
    if (!coords.lat || !coords.lng) return setError("Please detect location"), false;
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
      await axios.post("http://localhost:8000/api/auth/register", formData);
      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  const getStrengthText = () => {
  if (passwordStrength >= 75) return "Strong";
  if (passwordStrength >= 50) return "Medium";
  if (passwordStrength >= 25) return "Weak";
  return "Very Weak";
};

const getStrengthColor = () => {
  if (passwordStrength >= 75) return "strong";
  if (passwordStrength >= 50) return "medium";
  return "";
};

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Branding & Features */}
        <div className="auth-left">
          <div className="auth-left-content">
            <Link to="/" className="logo" style={{ color: 'white', marginBottom: '2rem', display: 'inline-flex' }}>
              <Car style={{ marginRight: '0.5rem' }} />
              kindlift
            </Link>
            <h1>Join Our Travel Community</h1>
            <p>
              Create an account to start sharing rides, connecting with fellow travelers,
              and making every journey more affordable and enjoyable.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <Shield />
                <span>Secure & Verified Profiles</span>
              </div>
              <div className="auth-feature">
                <Users />
                <span>Connect with Verified Travelers</span>
              </div>
              <div className="auth-feature">
                <MapPin />
                <span>Smart Route Matching</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-right">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <User />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <Phone />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="aadharNumber">Aadhar Number</label>
              <div className="input-with-icon">
                <IdCard />
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={user.aadharNumber}
                  onChange={handleChange}
                  placeholder="Enter your Aadhar number"
                  required
                  disabled={loading}
                  maxLength="12"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                />



                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {user.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="strength-text">
                    Password strength: {getStrengthText()}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <Lock />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="location-input-group">
                <div className="input-with-icon">
                  <MapPin />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="detect-location-btn"
                  disabled={loadingLocation || loading}
                >
                  {loadingLocation ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      Detecting...
                    </>
                  ) : (
                    "Detect Location"
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Profile Image</label>
              <div className="input-with-icon">
                <User />
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={loading}
                />
              </div>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "10px"
                  }}
                />
              )}
            </div>

            <div className="terms-agreement">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="auth-switch">
              Already have an account?
              <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;