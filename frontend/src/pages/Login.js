import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import vedio from '../public/login.webm';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-brand-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Branding */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-brand-accent rounded-full" />
                Kindlift
              </div>
              <h1 className="text-4xl font-bold text-brand-dark mb-4">
                Welcome Back
              </h1>
              <p className="text-brand-muted text-lg">
                Your journey to meaningful connections starts here
              </p>
            </div>

            {/* Video section */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="relative">
                <video
                  className="w-full h-56 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={vedio} type="video/webm" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-medium opacity-90">Find a ride → Match with buddies → Travel together</p>
                </div>
              </div>
              <div className="p-5 bg-brand-cream/50">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  {[
                    { step: '1', title: 'Plan journey', sub: 'Set your route' },
                    { step: '2', title: 'Find buddy', sub: 'Match with travelers' },
                    { step: '3', title: 'Travel together', sub: 'Share the journey' },
                  ].map((s) => (
                    <div key={s.step}>
                      <div className="w-7 h-7 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                        {s.step}
                      </div>
                      <p className="font-medium text-brand-dark">{s.title}</p>
                      <p className="text-brand-muted mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-brand-muted">
              <span><strong className="text-brand-dark">10,000+</strong> travelers</span>
              <span><strong className="text-brand-dark">98%</strong> match rate</span>
              <span><strong className="text-brand-dark">24/7</strong> support</span>
            </div>
          </div>

          {/* Right — Login Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 lg:p-10">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">Sign In</h2>
                <p className="text-brand-muted text-sm mt-2">Access your account and hit the road</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">!</span>
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
                    <span className="text-sm text-brand-muted">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-brand-accent hover:text-brand-accent-hover font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark hover:bg-brand-charcoal text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-brand-muted">or</span></div>
                </div>

                <Link to="/register">
                  <button
                    type="button"
                    className="w-full border border-gray-200 text-brand-dark py-3 rounded-xl font-semibold hover:bg-brand-cream transition-all"
                  >
                    Create New Account
                  </button>
                </Link>
              </form>

              <div className="mt-6 p-3 bg-brand-cream rounded-xl">
                <p className="text-xs text-brand-muted text-center">
                  <span className="font-semibold">Demo:</span> demo@kindlift.com / demo123
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-4 text-xs text-brand-muted">
                <span>✓ Secure Login</span>
                <span>✓ 256-bit SSL</span>
                <span>✓ Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};