import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Bell,
  Settings,
  Calendar,
  Users as UsersIcon,
  LogOut,
  Home,
  Search,
  MessageSquare,
  Star,
  Loader2,
  X
} from "lucide-react";

import FindRides from "./FindRides";
import "../css/dashboard.css";

function Userdashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [profileImg, setProfileImg] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const profilePopupRef = useRef(null);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------------- LOAD PROFILE IMAGE ---------------- */
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/api/auth/photo?email=${user.email}`)
      .then(res => res.json())
      .then(data => setProfileImg(data.image))
      .catch(() => {});
  }, [user]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  if (!user) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Loader2 size={40} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}
      <header className="dashboard-header" style={{ height: "70px" }}>
        <div className="dashboard-nav">
          <div className="dashboard-logo">
            <Car />
            kindlift
          </div>

          <div className="dashboard-nav-right">
            <Bell />

            <div
              className="profile-avatar-trigger"
              onClick={() => setShowProfilePopup(!showProfilePopup)}
            >
              {profileImg ? (
                <img
                  src={`http://localhost:5000/${profileImg}`}
                  className="avatar"
                  alt="profile"
                />
              ) : (
                <div className="avatar">
                  {user.name[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= PROFILE POPUP ================= */}
      {showProfilePopup && (
        <div className="profile-popup-overlay">
          <div className="profile-popup" ref={profilePopupRef}>
            <div className="profile-popup-header">
              <h3>Profile</h3>
              <button onClick={() => setShowProfilePopup(false)}>
                <X />
              </button>
            </div>

            <p>{user.name}</p>
            <p>{user.email}</p>

            <button onClick={handleLogout}>
              <LogOut /> Logout
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN LAYOUT ================= */}
      <div
        className="dashboard-content"
        style={{
          height: "calc(100vh - 70px)",
          display: "flex",
          overflow: "hidden"
        }}
      >

        {/* ========== SIDEBAR ========== */}
        <aside className="dashboard-sidebar">
          <div
            className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <Home /> Dashboard
          </div>

          <div
            className={`menu-item ${activeMenu === "find-rides" ? "active" : ""}`}
            onClick={() => setActiveMenu("find-rides")}
          >
            <Search /> Find Rides
          </div>

          <div className="menu-item">
            <Car /> My Rides
          </div>

          <div className="menu-item">
            <MessageSquare /> Messages
          </div>

          <div className="menu-item">
            <Settings /> Settings
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main
          className="dashboard-main"
          style={{
            height: "100%",
            overflowY: "auto"
          }}
        >

          {/* ---------- DASHBOARD ---------- */}
          {activeMenu === "dashboard" && (
            <>
              <h1>Welcome back, {user.name} 👋</h1>

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
                    <Calendar size={24} />
                  </div>
                  <div className="stat-text">
                    <h3>3</h3>
                    <p>Upcoming Rides</p>
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
            </>
          )}

          {/* ---------- FIND RIDES ---------- */}
          {activeMenu === "find-rides" && (
            <div style={{ height: "100%" }}>
              <FindRides />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Userdashboard;
