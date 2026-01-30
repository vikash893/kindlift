import { useNavigate } from "react-router-dom";
import '../css/home.css';
import vikash from '../public/vikash.png';
// At the top of About.jsx
import { 
  Car, 
  Target, 
  Users, 
  Shield, 
  Globe, 
  Heart,
  MapPin,
  User,
  Star,
  TrendingUp,
  Phone,  // Add these imports for the footer
  Mail,
  Map,
} from 'lucide-react';

function About() {
    const navigate = useNavigate();
    
    const gotoHome = () => {
        navigate("/");
    }
    
    const gotoContact = () => {
        navigate("/contact");
    }
    
    const gotoLogin = () => {
        navigate("/login");
    }
    
    const gotoRegister = () => {
        navigate("/register");
    }

    return (
        <div className="home-container">
            {/* Navbar - Same as Home */}
            <div className="navbar">
                <header>
                    <nav>
                        <a href="/" className="logo">
                            <Car className="logo-icon" />
                            kindlift
                        </a>
                        <div className="nav-links">
                            <button onClick={gotoHome}>Home</button>
                            <button>About</button>
                            <button onClick={gotoContact}>Contact</button>
                            <button onClick={gotoLogin} className="login-btn">Login</button>
                            <button onClick={gotoRegister} className="register-btn">Register</button>
                        </div>
                    </nav>
                </header>
            </div>

            {/* About Hero Section */}
            <section className="about-hero">
                <h1>Our Journey to Connect Travelers Worldwide</h1>
                <p>
                    At kindlift, we believe every journey is better shared. We're on a mission to 
                    transform how people travel by creating meaningful connections and sustainable 
                    transportation solutions.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="about-mission">
                <div className="mission-content">
                    <div className="mission-image">
                        <img 
                            src="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="Team working together" 
                        />
                    </div>
                    <div className="mission-text">
                        <h2>Our Mission & Vision</h2>
                        <p>
                            Founded in 2026, kindlift emerged from a simple idea: travel should be 
                            social, affordable, and sustainable. We noticed that millions of empty seats 
                            were traveling the same routes every day, while others were searching for 
                            transportation.
                        </p>
                        <p>
                            Our vision is to create a global community where every seat is filled, 
                            every journey is shared, and every traveler finds not just a ride, but 
                            companionship along the way.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                            <div>
                                <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>500K+</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Connections Made</p>
                            </div>
                            <div>
                                <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>85%</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Cost Savings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="values">
                <div className="section-title">
                    <h2>Our Core Values</h2>
                    <p>The principles that guide everything we do</p>
                </div>
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">
                            <Shield size={32} />
                        </div>
                        <h3>Safety First</h3>
                        <p>Verified users, secure payments, and 24/7 support ensure every journey is safe.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">
                            <Users size={32} />
                        </div>
                        <h3>Community</h3>
                        <p>Building trust and meaningful connections between travelers worldwide.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">
                            <Globe size={32} />
                        </div>
                        <h3>Sustainability</h3>
                        <p>Reducing carbon footprint by maximizing vehicle occupancy and efficiency.</p>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="team">
                <div className="section-title">
                    <h2>Meet Our Team</h2>
                    <p>The passionate people behind kindlift</p>
                </div>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-image">
                            <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                alt="Vishnu Singh Rajput" 
                            />
                        </div>
                        <h3>Vishnu Singh Rajput</h3>
                        <p>CEO & Founder</p>
                    </div>
                    <div className="team-member">
                        <div className="member-image">
                            <img 
                                src={vikash}
                                alt="Vikash Bhardwaj" 
                            />
                        </div>
                        <h3>Vikash Bhardwaj</h3>
                        <p>Head of Product</p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="story">
                <div className="story-content">
                    <h2>Our Journey</h2>
                    <p>
                        It all started with a road trip from vrindavan to Mathura. Vishnu, our founder, 
                        was driving alone and realized how many empty seats were on the highway. He thought, 
                        "What if people could share these journeys?"
                    </p>
                    <p>
                        That simple question sparked a revolution. Today, kindlift operates in over 200 cities 
                        across 50 countries, helping travelers save money, reduce their environmental impact, 
                        and make new friends along the way.
                    </p>
                    <p>
                        We're just getting started. Our goal is to become the world's leading platform for 
                        shared travel experiences, making every journey social, sustainable, and memorable.
                    </p>
                </div>
            </section>

            {/* Footer - Same as Home */}
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
                        <p><Map size={16} /> palwal Haryana</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 kindlift. All rights reserved. Making travel better, together.</p>
                </div>
            </footer>
        </div>
    );
}

export default About;