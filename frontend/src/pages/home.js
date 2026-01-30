import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import '../css/home.css';
import logo from '../public/logo.png';
import { 
  Car, 
  Users, 
  MapPin, 
  Shield, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Phone,
  Mail,
  Map
} from 'lucide-react';

function Home() {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
  axios.get("http://localhost:8000/api/auth/getuser")
    .then((res) => {
      setUserCount(res.data.countUser);
    })
    .catch((err) => {
      console.log("Error fetching user count", err);
    });
}, []);
    const navigate = useNavigate();
    
    const gotoRegister = () => {
        navigate("/register");
    }
    
    const gotoLogin = () => {
        navigate("/login");
    }
    
    const gotoAbout = () => {
        navigate("/about");
    }
    
    const gotoContact = () => {
        navigate("/contact");
    }
    
    return (
        <div className="home-container">
            {/* Navbar */}
            <div className="navbar">
                <header>
                    <nav>
                        <a href="/" className="logo">
                            <img src={logo} alt="logo" id="logo">
                            </img>
                            kindlift
                        </a>
                        <div className="nav-links">
                            <button>Home</button>
                            <button onClick={gotoAbout}>About</button>
                            <button onClick={gotoContact}>Contact</button>
                            <button onClick={gotoLogin} className="login-btn">Login</button>
                            <button onClick={gotoRegister} className="register-btn">Register</button>
                        </div>
                    </nav>
                </header>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Find Your Perfect <span>Travel Companion</span> for Every Journey</h1>
                        <p>
                            Connect with fellow travelers, share rides, split costs, and make every journey 
                            more enjoyable. Whether you're commuting or embarking on an adventure, 
                            find the perfect travel partner with kindlift.
                        </p>
                        <div className="cta-buttons">
                            <button className="primary-btn" onClick={gotoRegister}>
                                Start Your Journey
                                <ChevronRight style={{ marginLeft: '8px' }} />
                            </button>
                            <button className="secondary-btn" onClick={gotoAbout}>
                                Learn More
                            </button>
                        </div>
                        <div className="stats">
                            <div className="stat-item">
                                <h3>{userCount}+</h3>
                                <p>Happy Travelers</p>
                            </div>
                            <div className="stat-item">
                                <h3>{userCount}+</h3>
                                <p>Successful Rides</p>
                            </div>
                            <div className="stat-item">
                                <h3>{userCount}0+</h3>
                                <p>Cities Covered</p>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="People traveling together" 
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="section-title">
                    <h2>Why Choose kindlift?</h2>
                    <p>Experience travel like never before with our innovative features</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <Users className="feature-icon" />
                        <h3>Find Travel Partners</h3>
                        <p>Connect with verified travelers going your way. Share rides and make new friends on every journey.</p>
                    </div>
                    <div className="feature-card">
                        <Shield className="feature-icon" />
                        <h3>Safe & Verified</h3>
                        <p>All users are verified for safety. Enjoy secure travels with our comprehensive safety features.</p>
                    </div>
                    <div className="feature-card">
                        <MapPin className="feature-icon" />
                        <h3>Smart Matching</h3>
                        <p>Our algorithm finds the perfect travel companion based on your route, preferences, and schedule.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="section-title">
                    <h2>How It Works</h2>
                    <p>Get started with kindlift in three simple steps</p>
                </div>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Account</h3>
                        <p>Sign up and complete your profile with your travel preferences and verification.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Find Partners</h3>
                        <p>Search for travelers going your way or post your own travel plans.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Connect & Travel</h3>
                        <p>Chat with potential partners, plan your journey, and enjoy the ride together.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Start Your Journey?</h2>
                <p>
                    Join thousands of travelers who have found their perfect ride companions. 
                    Save money, reduce your carbon footprint, and make travel more enjoyable.
                </p>
                <button className="cta-btn" onClick={gotoRegister}>
                    Join kindlift Today
                </button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div>
                        <a href="/" className="footer-logo">
                            <Car />
                            kindlift
                        </a>
                        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
                            Connecting travelers, creating memories. Your perfect journey companion awaits.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p><Phone size={16} /> +91 7015283332</p>
                        <p><Mail size={16} /> support@kindlift.com</p>
                        <p><Map size={16} /> Palwal Haryana </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 kindlift. All rights reserved. Making travel better, together.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;