import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Car, 
  Shield, 
  Users, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import '../css/home.css'; // Include your main CSS
import '../css/auth.css'; // Include the new auth CSS

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        user
      );

      console.log(res.data);
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Show success message and navigate
      navigate("/userdashboard");

    } catch (error) {
      setError(error.response?.data?.error || "Invalid email or password. Please try again.");
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
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
            <h1>Welcome Back!</h1>
            <p>
              Sign in to connect with fellow travelers, find your perfect ride companion, 
              and make every journey more enjoyable.
            </p>
            
            <div className="auth-features">
              <div className="auth-feature">
                <Shield />
                <span>Secure & Verified Users</span>
              </div>
              <div className="auth-feature">
                <Users />
                <span>Connect with Travelers</span>
              </div>
              <div className="auth-feature">
                <MapPin />
                <span>Smart Route Matching</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-right">
          <div className="auth-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
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
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="auth-switch">
              Don't have an account?
              <Link to="/register">Sign up now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;