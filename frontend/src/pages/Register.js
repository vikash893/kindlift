import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { ArrowRight, Camera } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!profilePhoto) {
      setError('Profile photo is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        profilePhoto,
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — Branding */}
          <div className="space-y-8 sticky top-28 hidden lg:block">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-brand-accent rounded-full" />
                Kindlift
              </div>
              <h1 className="text-4xl font-bold text-brand-dark mb-4">
                Join the Community
              </h1>
              <p className="text-brand-muted text-lg">
                Create your account and start your journey with us
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <p className="text-brand-muted">
                    <strong className="text-brand-dark">10,000+</strong> happy travelers ·{' '}
                    <strong className="text-brand-dark">98%</strong> match rate ·{' '}
                    <strong className="text-brand-dark">24/7</strong> support
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {['Free to join and use', 'Find travel buddies easily', 'Save on fuel costs', 'Safe and verified community'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-brand-dark/70">
                  <span className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-brand-muted pt-4">
              <span>✓ Secure Registration</span>
              <span>✓ 256-bit SSL</span>
              <span>✓ Privacy Protected</span>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 relative">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">Create Account</h2>
                <p className="text-brand-muted text-sm mt-2">Join Kindlift and start your journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">!</span>
                    {error}
                  </div>
                )}

                {/* Profile Photo */}
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden bg-brand-cream border-3 ${!profilePhoto && error?.includes('photo') ? 'border-red-400' : 'border-gray-200'} flex items-center justify-center transition-all group-hover:border-brand-accent`}>
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-brand-muted" />
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-brand-dark p-2 rounded-full text-white cursor-pointer hover:bg-brand-charcoal transition-all shadow-sm"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-dark hover:bg-brand-charcoal text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="loader-spinner !w-5 !h-5 !border-2" />
                      Registering...
                    </span>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-brand-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-brand-accent hover:text-brand-accent-hover">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>

              <div className="mt-4 p-3 bg-brand-cream rounded-xl">
                <p className="text-xs text-brand-muted text-center">
                  <span className="font-semibold">Note:</span> Profile photo is required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};