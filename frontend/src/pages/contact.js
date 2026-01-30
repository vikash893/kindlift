import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/home.css';
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
  Clock,
  CheckCircle , 
  Send
} from 'lucide-react';

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
    });
    const [submitted, setSubmitted] = useState(false);

    const gotoHome = () => {
        navigate("/");
    }
    
    const gotoAbout = () => {
        navigate("/about");
    }
    
    const gotoLogin = () => {
        navigate("/login");
    }
    
    const gotoRegister = () => {
        navigate("/register");
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                category: 'general'
            });
        }, 3000);
    };

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
                            <button onClick={gotoAbout}>About</button>
                            <button>Contact</button>
                            <button onClick={gotoLogin} className="login-btn">Login</button>
                            <button onClick={gotoRegister} className="register-btn">Register</button>
                        </div>
                    </nav>
                </header>
            </div>

            {/* Contact Hero Section */}
            <section className="contact-hero">
                <h1>Get In Touch</h1>
                <p>
                    Have questions, feedback, or need assistance? We're here to help you 
                    with your travel companion journey.
                </p>
            </section>

            {/* Contact Content */}
            <div className="contact-container">
                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Phone size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Phone Number</h4>
                                    <p>+1 (555) 123-4567</p>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                        Available Monday-Friday, 9AM-6PM EST
                                    </p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Mail size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Email Address</h4>
                                    <p>support@kindlift.com</p>
                                    <p>partners@kindlift.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <MapPin size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Office Location</h4>
                                    <p>123 Travel Street</p>
                                    <p>Adventure City, AC 10001</p>
                                    <p>United States</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Business Hours</h4>
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-container">
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>
                                    Message Sent Successfully!
                                </h3>
                                <p style={{ color: '#64748b' }}>
                                    Thank you for contacting us. We'll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <h2>Send us a Message</h2>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category">Inquiry Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="safety">Safety Concern</option>
                                        <option value="business">Business Partnership</option>
                                        <option value="feedback">Feedback/Suggestion</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Please describe your inquiry in detail..."
                                    />
                                </div>
                                <button type="submit" className="submit-btn">
                                    <Send size={20} style={{ marginRight: '8px' }} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div className="contact-map">
                    <h2 style={{ color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>
                        Find Our Office
                    </h2>
                    <div className="map-container">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <MapPin size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                                kindlift Headquarters
                            </h3>
                            <p style={{ color: '#94a3b8' }}>
                                123 Travel Street, Adventure City, AC 10001
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem' }}>
                                [Interactive Map Would Appear Here]
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="faq-section">
                    <div className="section-title">
                        <h2>Frequently Asked Questions</h2>
                        <p>Quick answers to common questions</p>
                    </div>
                    <div className="faq-container">
                        <div className="faq-item">
                            <div className="faq-question">
                                How do I verify my account?
                                <span style={{ color: '#3b82f6' }}>+</span>
                            </div>
                            <div className="faq-answer">
                                To verify your account, go to Settings → Verification and upload a government-issued ID. 
                                Verification typically takes 24-48 hours.
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-question">
                                Is kindlift available in my city?
                                <span style={{ color: '#3b82f6' }}>+</span>
                            </div>
                            <div className="faq-answer">
                                kindlift is available in over 200 cities worldwide. Check our locations page 
                                or enter your city in the search bar to see availability.
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-question">
                                How does the safety verification work?
                                <span style={{ color: '#3b82f6' }}>+</span>
                            </div>
                            <div className="faq-answer">
                                We use a multi-step verification process including ID verification, phone verification, 
                                and social verification. All users are rated after each trip.
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-question">
                                What payment methods are accepted?
                                <span style={{ color: '#3b82f6' }}>+</span>
                            </div>
                            <div className="faq-answer">
                                We accept all major credit/debit cards, PayPal, and Apple Pay. All payments are 
                                processed securely through our encrypted payment gateway.
                            </div>
                        </div>
                    </div>
                </section>
            </div>

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
                        <p><Phone size={16} /> +1 (555) 123-4567</p>
                        <p><Mail size={16} /> support@kindlift.com</p>
                        <p><Map size={16} /> 123 Travel Street, Adventure City</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 kindlift. All rights reserved. Making travel better, together.</p>
                </div>
            </footer>
        </div>
    );
}

export default Contact;