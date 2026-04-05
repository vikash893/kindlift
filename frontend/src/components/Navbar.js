import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const authLinks = user
    ? [
        { to: '/offer-ride', label: 'Offer Ride' },
        { to: '/book-ride', label: 'Book Ride' },
        { to: '/dashboard', label: 'Dashboard' },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2'
          : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ${
            scrolled
              ? 'glass shadow-nav'
              : 'bg-white/60 backdrop-blur-sm'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brand-dark tracking-tight">Kindlift</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-warm'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-warm'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                <div className="flex flex-col items-end text-xs">
                  <span className="text-brand-accent font-bold">{user.coins || 0} coins</span>
                  <span className="text-brand-muted">
                    ★ {user.totalRatings > 0 ? (user.ratingSum / user.totalRatings).toFixed(1) : 'New'}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full overflow-hidden bg-brand-warm border-2 border-brand-accent/30 flex items-center justify-center">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-brand-dark" />
                  )}
                </div>
                <span className="font-semibold text-sm text-brand-dark hidden lg:block">{user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-brand-muted hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-brand-dark/70 hover:text-brand-dark hover:bg-brand-warm transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-brand-dark text-white hover:bg-brand-charcoal transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-brand-warm transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl shadow-glass p-4 space-y-1 animate-fade-in">
            {navLinks.concat(authLinks).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-dark/70 hover:bg-brand-warm'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-brand-warm border-2 border-brand-accent/30 flex items-center justify-center">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-brand-dark" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark">{user.name}</p>
                    <p className="text-xs text-brand-accent font-medium">{user.coins || 0} coins</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-3 mt-2 border-t border-gray-200">
                <Link to="/login" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-brand-dark border border-gray-200 hover:bg-brand-warm transition-all">
                  Login
                </Link>
                <Link to="/register" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-dark text-white hover:bg-brand-charcoal transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};