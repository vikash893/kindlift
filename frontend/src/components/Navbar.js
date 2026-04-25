import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X, Users, MessageCircle } from 'lucide-react';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { NotificationBell } from './NotificationBell';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadDMs, setUnreadDMs] = useState(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 100) {
        setHidden(currentScroll > lastScroll.current && currentScroll > 200);
      } else {
        setHidden(false);
      }

      setScrolled(currentScroll > 50);
      lastScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch unread DM count
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/dm/unread/count');
        setUnreadDMs(res.data.count);
      } catch {}  // silent fail
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // refresh every 30s

    const handleNewDM = () => {
      setUnreadDMs(prev => prev + 1);
    };
    socket.on('dm_message', handleNewDM);
    return () => {
      clearInterval(interval);
      socket.off('dm_message', handleNewDM);
    };
  }, [user]);

  const isHome = location.pathname === '/';
  // Always use dark text on feedback page since it has light background on the right
  const shouldUseDarkText = isHome ? !scrolled : true;
  const isDark = isHome && !scrolled;

  const navLinks = !user
    ? [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
        { to: '/feedback', label: 'Feedback' },
      ]
    : [];

  const authLinks = user
    ? [
        { to: '/offer-ride', label: 'Offer Ride' },
        { to: '/book-ride', label: 'Book Ride' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/friends', label: 'Friends' },
        { to: '/messages', label: 'Messages', badge: unreadDMs },
        { to: '/profile', label: 'Profile' },
        { to: '/feedback', label: 'Feedback' },
        ...(user.isAdmin || user.role === 'admin' || user.role === 'superadmin'
          ? [{ to: '/admin', label: 'Admin' }]
          : []),
      ]
    : [];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'py-2' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-500 rounded-full px-6 py-2.5 ${
              scrolled
                ? 'bg-white/60 backdrop-blur-2xl shadow-nav border border-white/30'
                : 'bg-white/40 backdrop-blur-xl border border-white/20'
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <span className={`font-display font-bold text-lg tracking-tight transition-colors duration-300 text-brand-dark`}>
                Kindlift
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 link-hover ${
                    location.pathname === link.to
                      ? 'text-brand-accent'
                      : 'text-brand-dark/60 hover:text-brand-dark'
                  }`}
                >
                  {link.label}
                  {link.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-brand-dark/10 flex items-center justify-center bg-brand-accent/10">
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-brand-accent" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-brand-dark">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="block text-xs text-brand-accent font-semibold">{user.coins || 0} coins</span>
                    </div>
                  </div>
                  {/* Notification Bell */}
                  <NotificationBell />
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full transition-all text-brand-muted hover:text-red-500 hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium transition-all link-hover text-brand-dark/60 hover:text-brand-dark"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-brand-accent text-brand-dark text-sm font-display font-bold rounded-full hover:bg-brand-accent/80 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg transition-colors text-brand-dark hover:bg-brand-dark/5"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[99] bg-brand-dark transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-8 overflow-y-auto">
          <div className="space-y-3 flex-1">
            {[...navLinks, ...authLinks].map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block font-display text-2xl sm:text-3xl font-bold text-white/80 hover:text-white transition-all duration-300 ${
                  mobileOpen ? 'animate-fade-up' : ''
                } ${location.pathname === link.to ? 'text-brand-accent' : ''}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <span className="flex items-center gap-3">
                  {link.label}
                  {link.badge > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-3 flex-shrink-0">
            {user ? (
              <div className="text-center">
                <p className="text-white/50 text-sm mb-2">{user.name} · {user.coins || 0} coins</p>
                <button onClick={handleLogout} className="text-red-400 text-sm font-medium hover:text-red-300 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <Link to="/login" className="text-white/50 text-sm hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-8 py-3 bg-brand-accent text-brand-dark font-display font-bold rounded-full hover:bg-white transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};