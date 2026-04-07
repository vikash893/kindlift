import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import vedio from '../public/login.webm';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Dark brand panel */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 opacity-30">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={vedio} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-brand-dark/70" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">Kindlift</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-display-lg text-white mb-6">
            Welcome<br />
            <span className="text-gradient">back.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-sm">
            Your journey to meaningful connections starts here.
          </p>
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
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-brand-dark">Kindlift</span>
          </div>

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
                type="email"
                required
                className="input-underline"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Password</label>
              <input
                type="password"
                required
                className="input-underline"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm text-brand-muted">Remember me</span>
              </label>
              <a href="#" className="text-sm text-brand-accent hover:text-brand-accent-hover font-display font-semibold link-hover">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
            >
              Sign In
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-gray-light" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-brand-light text-brand-muted text-sm">or</span></div>
            </div>

            <Link to="/register" className="block w-full">
              <button
                type="button"
                className="w-full px-6 py-4 border-2 border-brand-dark/10 text-brand-dark font-display font-bold rounded-full hover:border-brand-dark/30 transition-all"
              >
                Create New Account
              </button>
            </Link>
          </form>

          <div className="mt-8 p-4 bg-brand-dark/5 rounded-xl text-center">
            <p className="text-xs text-brand-muted">
              <span className="font-semibold text-brand-dark">Demo:</span> demo@kindlift.com / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};