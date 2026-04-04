import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import vedio from '../public/login.webm';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Video */}
          <div className="space-y-8">
            {/* Logo & Tagline */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>🚗</span>
                <span>Kindlift</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Welcome Back to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Kindlift
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                Your journey to meaningful connections starts here
              </p>
            </div>

            {/* How it Works Video Section with Actual Video */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative">
                {/* Video Player */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600">
                  <video
                    className="w-full h-64 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={vedio} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Overlay gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Text overlay on video */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-sm">
                      <span>🚗</span>
                      <span>Find a ride</span>
                      <span>→</span>
                      <span>👥</span>
                      <span>Match with buddies</span>
                      <span>→</span>
                      <span>💬</span>
                      <span>Chat & Travel</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video steps */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <p className="text-gray-600 font-medium">Plan journey</p>
                    <p className="text-xs text-gray-400">Set your route</p>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <p className="text-gray-600 font-medium">Find buddy</p>
                    <p className="text-xs text-gray-400">Match with travelers</p>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <p className="text-gray-600 font-medium">Travel together</p>
                    <p className="text-xs text-gray-400">Share the journey</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Kindlift Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✨</div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">10,000+</span> happy travelers • 
                    <span className="font-semibold"> 98%</span> match rate • 
                    <span className="font-semibold"> 24/7</span> support
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Join the community that makes every journey memorable
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form with Blue Car */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 opacity-10">
              <span className="text-8xl">🚗</span>
            </div>
            <div className="absolute -bottom-10 -left-10 opacity-10">
              <span className="text-8xl">🛣️</span>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 relative z-10 border border-gray-100">
              {/* Blue Car Illustration */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4 shadow-xl">
                  <div className="relative">
                    <span className="text-5xl block animate-bounce">🚗</span>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black/20 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Access your account and hit the road
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                      <span>⚠️</span>
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        📧
                      </span>
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔒
                      </span>
                      <input
                        type="password"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>🚗</span>
                      Sign In
                      <span>→</span>
                    </span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Link to="/register">
                    <button
                      type="button"
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Create New Account
                    </button>
                  </Link>
                </form>

                {/* Demo credentials */}
                <div className="mt-6 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 text-center">
                    <span className="font-semibold">Demo:</span> demo@kindlift.com / demo123
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">✓ Secure Login</span>
                <span className="flex items-center gap-1">✓ 256-bit SSL</span>
                <span className="flex items-center gap-1">✓ Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};