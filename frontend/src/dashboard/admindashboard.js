import { useEffect, useState } from "react";
import axios from "axios";
import "../css/admindashboard.css"; // Import the CSS file

function Admindashboard() {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/admin/getusers")
      .then(res => {
        setCount(res.data.userCount);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const findUser = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/get-user/${email}`
      );
      setUser(res.data);
      setName(res.data.name);
    } catch (err) {
      alert(err.response?.data?.message || "User not found");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/update-user/${email}`,
        { name }
      );
      alert("User Updated Successfully!");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${email}`
      );
      alert("User Deleted Successfully!");
      setUser(null);
      setEmail("");
      setName("");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="users-count">
          <h3>Total Users: {count}</h3>
        </div>
      </div>

      <div className="search-section">
        <h2>Search User</h2>
        <div className="search-form">
          <div className="input-group">
            <label htmlFor="email-search">User Email</label>
            <input
              id="email-search"
              className="search-input"
              type="email"
              placeholder="Enter user email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && findUser()}
            />
          </div>
          <button 
            className="search-btn" 
            onClick={findUser}
            disabled={loading}
          >
            {loading ? "Searching..." : "Find User"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading">Loading...</div>
      )}

      {user && (
        <div className="user-details">
          <h2>User Details</h2>
          <div className="user-info">
            <div className="info-group">
              <label>Email Address</label>
              <input 
                className="search-input" 
                value={user.email} 
                readOnly 
              />
            </div>
            <div className="info-group">
              <label>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
          </div>
          <div className="actions">
            <button 
              className="update-btn" 
              onClick={updateUser}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
            <button 
              className="delete-btn" 
              onClick={deleteUser}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admindashboard;