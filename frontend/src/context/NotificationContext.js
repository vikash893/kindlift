import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { socket } from '../lib/socket';
import api from '../lib/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const fetchedRef = useRef(false);

  const isAdmin = user && (user.isAdmin || user.role === 'admin' || user.role === 'superadmin');

  // ─── Fetch notifications ──────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/notifications?limit=30');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ─── Fetch unread count (lightweight) ────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications/unread/count');
      setUnreadCount(res.data.count || 0);
    } catch {}
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      fetchedRef.current = false;
      return;
    }

    // Initial fetch
    fetchNotifications();
    fetchedRef.current = true;

    // Refresh count every 60s
    const interval = setInterval(fetchUnreadCount, 60000);

    // ─── Socket: Join admin room if admin ─────────────
    if (isAdmin) {
      socket.emit('join_admin', user.id);
    }

    // ─── Socket: Listen for real-time notifications ────
    const handleNewNotification = (notif) => {
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.find(n => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
      setUnreadCount(prev => prev + 1);
    };

    socket.on('notification', handleNewNotification);

    return () => {
      clearInterval(interval);
      socket.off('notification', handleNewNotification);
    };
  }, [user, isAdmin, fetchNotifications, fetchUnreadCount]);

  // ─── Mark single as read ─────────────────────────────
  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  }, []);

  // ─── Mark all as read ────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  }, []);

  // ─── Delete notification ─────────────────────────────
  const deleteNotification = useCallback(async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => {
        const notif = prev.find(n => n._id === id);
        if (notif && !notif.read) {
          setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.filter(n => n._id !== id);
      });
    } catch {}
  }, []);

  // ─── Open panel (lazy fetch if stale) ────────────────
  const openPanel = useCallback(() => {
    setPanelOpen(true);
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      panelOpen,
      setPanelOpen,
      openPanel,
      markRead,
      markAllRead,
      deleteNotification,
      fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
