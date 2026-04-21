import { signInWithGoogle, getGoogleRedirectResult } from "../auth";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar'; // Import the Navbar component
import api from '../lib/api';
import vedio from '../public/login.webm';
import { ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Google redirect result (mobile flow)
  useEffect(() => {
    const handleRedirect = async () => {
      setGoogleLoading(true);
      try {
        const firebaseUser = await getGoogleRedirectResult();
        if (firebaseUser) {
          const res = await api.post("/auth/google", {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
          });
          login(res.data.token, res.data.user);
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google redirect error:", err);
        setError(`Google sign-in failed: ${err.code || err.message || JSON.stringify(err)}`);
      } finally {
        setGoogleLoading(false);
      }
    };
    handleRedirect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="min-h-screen flex pt-16"> {/* Added pt-16 to account for navbar */}
        {/* Left — Dark brand panel */}
        <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
          <div className="noise-overlay absolute inset-0" />
          <div className="absolute inset-0 opacity-30">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src={vedio} type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-brand-dark/70" />
          </div>

          {/* Logo removed from left panel since navbar has it */}
          <div className="relative z-10">
            {/* Logo removed to avoid duplication */}
          </div>

          <div className="relative z-10 mt-12"> {/* Added mt-12 to push content down */}
            <h1 className="font-display text-display-lg text-white mb-6">
              Welcome<br /><span className="text-gradient">back.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-sm">Your journey to meaningful connections starts here.</p>
          </div>

          <div className="relative z-10 flex items-center gap-8 text-sm text-white/30">
            <span><strong className="text-white/60">10,000+</strong> travelers</span>
            <span><strong className="text-white/60">98%</strong> match rate</span>
            <span><strong className="text-white/60">24/7</strong> support</span>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-brand-light">
          <div className="w-full max-w-md">
            {/* Mobile logo removed */}
            
            <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Sign In</h2>
            <p className="text-brand-muted mb-10">Access your account and hit the road</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Email</label>
                <input
                  type="email" required className="input-underline" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} required className="input-underline pr-12"
                    placeholder="Enter your password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer p-2 rounded-lg text-brand-muted hover:text-brand-dark transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
                  <span className="text-sm text-brand-muted">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-brand-accent hover:text-brand-accent-hover font-display font-semibold link-hover">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Signing in...</span>
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-gray-light" /></div>
                <div className="relative flex justify-center"><span className="px-4 bg-brand-light text-brand-muted text-sm">or</span></div>
              </div>
              <button
                type="button"
                disabled={googleLoading}
                onClick={async () => {
                  setGoogleLoading(true);
                  setError('');
                  try {
                    const firebaseUser = await signInWithGoogle();
                    // If null, redirect flow is in progress (mobile) — page will reload
                    if (firebaseUser) {
                      const res = await api.post("/auth/google", {
                        name: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photo: firebaseUser.photoURL,
                      });
                      login(res.data.token, res.data.user);
                      navigate("/dashboard");
                    }
                  } catch (error) {
                    console.error("Google login error:", error);
                    setError(`Popup failed: ${error.code || error.message || JSON.stringify(error)}`);
                    setGoogleLoading(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Connecting...</span>
                ) : (
                  <>
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="google"
                      className="w-5 h-5"
                    />
                    <span className="font-semibold text-gray-700">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              <Link to="/register" className="block w-full">
                <button type="button" className="w-full px-6 py-4 border-2 border-brand-dark/10 text-brand-dark font-display font-bold rounded-full hover:border-brand-dark/30 transition-all">
                  Create New Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};