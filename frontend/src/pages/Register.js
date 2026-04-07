import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { ArrowRight, Camera } from 'lucide-react';

export const Register = () => {
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
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
      if (file.size > 5 * 1024 * 1024) { setError('Photo must be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setProfilePhoto(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    if (!email) { setError('Please enter your email first'); return; }
    try {
      await api.post("/auth/send-otp", { email });
      alert("OTP sent 📩");
      setShowOtpField(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post('/auth/verify-otp', { email, otp });
      alert("Email verified ✅");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!profilePhoto) { setError('Profile photo is required'); return; }

    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, profilePhoto });
      login(res.data.token, res.data.user);
      setShowOtpField(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Dark brand panel */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="noise-overlay absolute inset-0" />

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
            Join the<br /><span className="text-gradient">community.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-sm">Create your account and start your journey with fellow travelers.</p>
          <div className="mt-12 space-y-4">
            {['Free to join and use', 'Find travel buddies easily', 'Save on fuel costs', 'Safe & verified community'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/40 text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-xs">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-white/20">
          <span>✓ Secure</span><span>✓ 256-bit SSL</span><span>✓ Privacy Protected</span>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 lg:px-16 bg-brand-light overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-brand-dark">Kindlift</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Create Account</h2>
          <p className="text-brand-muted mb-10">Join Kindlift and start your journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                {error}
              </div>
            )}

            {/* Profile Photo */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${!profilePhoto && error?.includes('photo') ? 'border-red-400' : 'border-brand-gray-light'} flex items-center justify-center bg-brand-dark/5 transition-all group-hover:border-brand-accent`}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-brand-muted" />
                  )}
                </div>
                <label htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-brand-dark p-2.5 rounded-full text-white cursor-pointer hover:bg-brand-accent transition-all shadow-lg">
                  <Camera className="h-3.5 w-3.5" />
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Full Name <span className="text-red-400">*</span></label>
              <input type="text" required className="input-underline" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Email <span className="text-red-400">*</span></label>
              <div className="flex gap-2 items-end">
                <input type="email" required className="input-underline flex-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="button" onClick={handleSendOtp}
                  className="px-5 py-2.5 bg-brand-dark text-white text-sm font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 whitespace-nowrap">
                  Verify
                </button>
              </div>
              {showOtpField && (
                <div className="flex gap-2 mt-4 items-end">
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="input-underline flex-1" />
                  <button type="button" onClick={handleVerifyOtp}
                    className="px-5 py-2.5 bg-green-600 text-white text-sm font-display font-bold rounded-full hover:bg-green-700 transition-all whitespace-nowrap">
                    Verify OTP
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Password <span className="text-red-400">*</span></label>
              <input type="password" required className="input-underline" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Confirm Password <span className="text-red-400">*</span></label>
              <input type="password" required className="input-underline" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Phone (optional)</label>
              <input type="tel" className="input-underline" placeholder="1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
              {loading ? (
                <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Registering...</span>
              ) : (
                <>Sign Up <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <p className="text-center text-sm text-brand-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-display font-semibold text-brand-accent hover:text-brand-accent-hover link-hover">Sign in here</Link>
            </p>
          </form>

          <div className="mt-6 p-4 bg-brand-dark/5 rounded-xl text-center">
            <p className="text-xs text-brand-muted"><span className="font-semibold text-brand-dark">Note:</span> Profile photo is required</p>
          </div>
        </div>
      </div>
    </div>
  );
};