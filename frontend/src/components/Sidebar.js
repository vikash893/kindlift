/**
 * Sidebar — Left navigation for logged-in users.
 *
 * Desktop (lg+): Fixed left sidebar, always visible
 * Mobile: Hidden by default, slides in via hamburger toggle from a mini top bar
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Car, Search, Users, MessageCircle,
  User as UserIcon, MessageSquare, Shield, LogOut, Menu, X,
  Coins, Home, Info, Phone, ChevronLeft, Sun, Moon, Gift,
} from 'lucide-react';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { NotificationBell } from './NotificationBell';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadDMs, setUnreadDMs] = useState(0);

  // Close sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Fetch unread DM count
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/dm/unread/count');
        setUnreadDMs(res.data.count);
      } catch {} // silent fail
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);

    const handleNewDM = () => {
      setUnreadDMs(prev => prev + 1);
    };
    socket.on('dm_message', handleNewDM);
    return () => {
      clearInterval(interval);
      socket.off('dm_message', handleNewDM);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/offer-ride', label: 'Offer Ride', icon: Car },
    { to: '/book-ride', label: 'Book Ride', icon: Search },
    { to: '/friends', label: 'Friends', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadDMs },
    { to: '/profile', label: 'Profile', icon: UserIcon },
    { to: '/gifts', label: 'Gifts', icon: Gift },
    { to: '/feedback', label: 'Feedback', icon: MessageSquare },
    ...(user?.isAdmin || user?.role === 'admin' || user?.role === 'superadmin'
      ? [{ to: '/admin', label: 'Admin', icon: Shield }]
      : []),
  ];



  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-accent flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Kindlift
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <NotificationBell />
            </div>
            {/* Close button — mobile only */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div
          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors"
          onClick={() => { navigate('/profile'); setMobileOpen(false); }}
        >
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center bg-brand-accent/20 flex-shrink-0">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5 text-brand-accent" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-display font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 flex items-center gap-1">
              <Coins className="h-3 w-3 text-amber-400" />
              {user?.coins || 0} coins
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
        <p className="px-3 mb-2 text-[10px] font-display font-bold text-white/20 uppercase tracking-widest">
          Main
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-brand-accent text-brand-dark font-bold shadow-lg shadow-brand-accent/30 sidebar-glow-active'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.08] hover:translate-x-1'
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-brand-dark' : 'text-white/30 group-hover:text-white/60'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge > 0 && (
                <span className={`h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-brand-dark/20 text-brand-dark' : 'bg-red-500 text-white'
                }`}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}

      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
        >
          {isDark
            ? <Sun className="h-[18px] w-[18px] text-brand-accent" />
            : <Moon className="h-[18px] w-[18px] text-white/40" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ Mobile Top Bar ═══════════════════════════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-brand-dark/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-white">Kindlift</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/messages" className="relative p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <MessageCircle className="h-[18px] w-[18px]" />
              {unreadDMs > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {unreadDMs > 99 ? '99+' : unreadDMs}
                </span>
              )}
            </Link>
            <NotificationBell />
            {/* Theme toggle — mobile top bar */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              {isDark ? <Sun className="h-[18px] w-[18px] text-brand-accent" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <div
              className="h-8 w-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-brand-accent/20 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-brand-accent" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile Overlay ═══════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[198] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ═══ Sidebar Panel ════════════════════════════════ */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[199] w-64 bg-brand-dark
          flex flex-col transition-transform duration-300 ease-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
