import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { clearAllCache } from '../lib/api';
import { socket } from '../lib/socket';

const AuthContext = createContext();

/**
 * Serialize user data for localStorage caching
 * Avoids the expensive /auth/me API call on every page refresh
 * by serving from cache first, then revalidating in background
 */
const USER_CACHE_KEY = 'kindlift_user';

const getCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache expires after 30 minutes
    if (Date.now() - parsed._cachedAt > 30 * 60 * 1000) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const setCachedUser = (user) => {
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify({ ...user, _cachedAt: Date.now() }));
  } catch { /* localStorage full — skip */ }
};

const clearCachedUser = () => {
  localStorage.removeItem(USER_CACHE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Start with cached user data for instant render (no loading flash)
  const cachedUser = token ? getCachedUser() : null;
  const [user, setUser] = useState(cachedUser ? { ...cachedUser, _cachedAt: undefined } : null);
  const [loading, setLoading] = useState(cachedUser ? false : !!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          profilePhoto: res.data.profilePhoto,
          isDriverVerified: res.data.isDriverVerified,
          isAdmin: res.data.isAdmin,
          role: res.data.role,
          coins: res.data.coins || 0,
          ratingSum: res.data.ratingSum || 0,
          totalRatings: res.data.totalRatings || 0,
        };
        setUser(userData);
        setCachedUser(userData);

        // Connect socket when user is loaded
        socket.connect();
        socket.emit('join', res.data._id);
      } catch (err) {
        if (err.response?.status !== 404 && err.response?.status !== 401) {
          console.error('Failed to load user', err);
        }
        localStorage.removeItem('token');
        clearCachedUser();
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    // If we have cached data, connect socket immediately & revalidate in bg
    if (cachedUser) {
      socket.connect();
      socket.emit('join', cachedUser.id);
      // Background revalidation — don't block rendering
      loadUser();
    } else {
      loadUser();
    }

    return () => {
      socket.disconnect();
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    setCachedUser(newUser);
    socket.connect();
    socket.emit('join', newUser.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearCachedUser();
    clearAllCache(); // Clear API cache on logout
    setToken(null);
    setUser(null);
    socket.disconnect();
  };

  const updateUser = (updates) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      setCachedUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};