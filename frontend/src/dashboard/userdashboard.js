import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  MapPin,
  User,
  Bell,
  Settings,
  Calendar,
  Navigation,
  Clock,
  Users as UsersIcon,
  DollarSign,
  LogOut,
  Home,
  Search,
  MessageSquare,
  Star,
  ChevronRight,
  Loader2,
  Target,
  Map as MapIcon,
  X
} from 'lucide-react';
// import '../css/home.css'; // Include your main CSS
import '../css/dashboard.css'; // Include the new dashboard CSS

function Userdashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const [profileImg, setProfileImg] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profilePopupRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Check if user has location stored
      if (userData.location) {
        const [city, state, country] = userData.location.split(', ');
        setLocation({
          city: city || 'Unknown',
          state: state || '',
          country: country || ''
        });
      }
    }
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        // Check if click is not on the profile avatar
        const profileAvatar = document.querySelector('.profile-avatar-trigger');
        if (!profileAvatar || !profileAvatar.contains(event.target)) {
          setShowProfilePopup(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load profile image
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:8000/api/auth/photo?email=${user.email}`)
      .then(res => res.json())
      .then(data => setProfileImg(data.image))
      .catch(err => console.error("Image load failed", err));
  }, [user]);

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get a color based on user's initials for avatar
  const getAvatarColor = (initials) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    
    // Clear any session data
    sessionStorage.clear();
    
    // Redirect to login page with replace to prevent going back
    navigate("/login", { replace: true });
    
    // Force reload to clear any cached state
    window.location.reload();
  };

  // Toggle profile popup
  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
        }}>
          <Loader2 className="loading-spinner" style={{ width: '50px', height: '50px', marginBottom: '1rem' }} />
          <h2 style={{ color: '#1e293b' }}>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="dashboard-nav-left">
            <a href="/" className="dashboard-logo">
              <Car />
              kindlift
            </a>
          </div>

          <div className="dashboard-nav-right">
            <div className="notification-bell">
              <Bell size={24} />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </div>
            
            {/* Profile Avatar - Click to toggle popup */}
            <div className="profile-avatar-trigger" onClick={toggleProfilePopup}>
              {profileImg ? (
                <img
                  src={`http://localhost:8000/${profileImg}`}
                  className="avatar"
                  alt="profile"
                />
              ) : (
                <div
                  className="avatar"
                  style={{ background: getAvatarColor(getInitials(user.name)) }}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup" ref={profilePopupRef}>
            <div className="profile-popup-header">
              <h3>Profile</h3>
              <button 
                className="popup-close-btn" 
                onClick={() => setShowProfilePopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="profile-popup-content">
              <div className="profile-popup-avatar">
                {profileImg ? (
                  <img
                    src={`http://localhost:8000/${profileImg}`}
                    className="avatar avatar-xl"
                    alt="profile"
                  />
                ) : (
                  <div
                    className="avatar avatar-xl"
                    style={{ background: getAvatarColor(getInitials(user.name)) }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              
              <div className="profile-popup-info">
                <h2>{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                
                {/* {location && (
                  <div className="profile-location">
                    <MapPin size={16} />
                    <span>{location.city}, {location.state}, {location.country}</span>
                  </div>
                )} */}
                
              </div>
              
              
              
              <button 
                className="profile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </button>
              
              {/* <div className="profile-popup-links">
                <a href="/profile" className="profile-link">
                  <User size={18} />
                  View Full Profile
                </a>
                <a href="/settings" className="profile-link">
                  <Settings size={18} />
                  Account Settings
                </a>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            {profileImg ? (
              <img
                src={`http://localhost:8000/${profileImg}`}
                className="avatar avatar-lg"
                alt="profile"
              />
            ) : (
              <div
                className="avatar avatar-lg"
                style={{ background: getAvatarColor(getInitials(user.name)) }}
              >
                {getInitials(user.name)}
              </div>
            )}
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>4.8 Rating</span>
            </div>
          </div>

          <div className="sidebar-menu">
            <div
              className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </div>
            <div
              className={`menu-item ${activeMenu === 'find-rides' ? 'active' : ''}`}
              onClick={() => setActiveMenu('find-rides')}
            >
              <Search size={20} />
              <span>Find Rides</span>
            </div>
            <div
              className={`menu-item ${activeMenu === 'my-rides' ? 'active' : ''}`}
              onClick={() => setActiveMenu('my-rides')}
            >
              <Car size={20} />
              <span>My Rides</span>
            </div>
            <div
              className={`menu-item ${activeMenu === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveMenu('messages')}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </div>
            <div
              className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </div>
            <div
              className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMenu('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </aside>

        {/* Main Dashboard Area */}
        <main className="dashboard-main">
          {/* Welcome Card */}
          <section className="welcome-card">
            <div className="welcome-content">
              <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p>Ready for your next adventure? Find your perfect ride companion today.</p>

              <div className="welcome-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <Car size={24} />
                  </div>
                  <div className="stat-text">
                    <h3>12</h3>
                    <p>Completed Rides</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <UsersIcon size={24} />
                  </div>
                  <div className="stat-text">
                    <h3>8</h3>
                    <p>Travel Partners</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Star size={24} />
                  </div>
                  <div className="stat-text">
                    <h3>4.8</h3>
                    <p>Your Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <a href="/find-rides" className="action-card">
                <div className="action-icon">
                  <Search size={24} />
                </div>
                <h3>Find a Ride</h3>
                <p>Search for available rides near you</p>
              </a>

              <a href="/offer-ride" className="action-card">
                <div className="action-icon">
                  <Car size={24} />
                </div>
                <h3>Offer a Ride</h3>
                <p>Share your journey with others</p>
              </a>

              <a href="/messages" className="action-card">
                <div className="action-icon">
                  <MessageSquare size={24} />
                </div>
                <h3>Messages</h3>
                <p>Chat with travel partners</p>
              </a>

              <a href="/upcoming" className="action-card">
                <div className="action-icon">
                  <Calendar size={24} />
                </div>
                <h3>Schedule</h3>
                <p>View your upcoming rides</p>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Userdashboard;