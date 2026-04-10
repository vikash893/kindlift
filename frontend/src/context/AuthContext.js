import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { socket } from '../lib/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser({ 
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
            totalRatings: res.data.totalRatings || 0
          });
          
          // Connect socket when user is loaded
          socket.connect();
          socket.emit('join', res.data._id);
        } catch (err) {
          if (err.response?.status !== 404 && err.response?.status !== 401) {
            console.error('Failed to load user', err);
          }
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    socket.connect();
    socket.emit('join', newUser.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    socket.disconnect();
  };

  const updateUser = (updates) => {
    if (user) {
      setUser({ ...user, ...updates });
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