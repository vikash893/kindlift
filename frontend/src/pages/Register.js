import React, { useState, useEffect } from 'react';
import { ButtonLoader } from '../components/ButtonLoader';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import api from '../lib/api';
import { ArrowRight, Camera, ArrowLeft } from 'lucide-react';
import { signInWithGoogle, getGoogleRedirectResult } from '../auth';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
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
          const res = await api.post('/auth/google', {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
          });
          login(res.data.token, res.data.user);
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Google redirect error:', err);
        setError('Google sign-up failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    };
    handleRedirect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Photo must be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setProfilePhoto(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!profilePhoto) { setError('Profile photo is required'); return; }

    setLoading(true); setError('');
    try {
      await api.post("/auth/send-otp", { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!otp) { setError('Please enter your OTP'); return; }

    setLoading(true); setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      const res = await api.post('/auth/register', { name, email, password, phone, profilePhoto });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Verification or Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar /> {/* Navbar added here */}
      <div className="min-h-screen flex pt-16"> {/* Added pt-16 for navbar spacing */}
        {/* Left — Dark brand panel */}
        <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
          <div className="noise-overlay absolute inset-0" />

          {/* Logo removed - navbar has it */}
          <div className="relative z-10">
            {/* Logo section removed to avoid duplication */}
          </div>

          <div className="relative z-10 mt-12"> {/* Added mt-12 to push content down */}
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
            
            {step === 1 ? (
              <>
                <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Create Account</h2>
                <p className="text-brand-muted mb-10">Join Kindlift and start your journey</p>

                <form onSubmit={handleInitialSubmit} className="space-y-6">
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
                    <input type="email" required className="input-underline w-full" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                      <ButtonLoader text="Sending OTP..." />
                    ) : (
                      <>Sign Up <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
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
                        if (firebaseUser) {
                          const res = await api.post('/auth/google', {
                            name: firebaseUser.displayName,
                            email: firebaseUser.email,
                            photo: firebaseUser.photoURL,
                          });
                          login(res.data.token, res.data.user);
                          navigate('/dashboard');
                        }
                      } catch (error) {
                        console.error('Google sign-up error:', error);
                        setError('Google sign-up failed. Please try again.');
                        setGoogleLoading(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    {googleLoading ? (
                      <ButtonLoader text="Verifying..." />
                    ) : (
                      <>
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" className="w-5 h-5" />
                        <span className="font-semibold text-gray-700">Sign up with Google</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-brand-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="font-display font-semibold text-brand-accent hover:text-brand-accent-hover link-hover">Sign in here</Link>
                  </p>
                </form>

                <div className="mt-6 p-4 bg-brand-dark/5 rounded-xl text-center">
                  <p className="text-xs text-brand-muted"><span className="font-semibold text-brand-dark">Note:</span> Profile photo is required for manual sign-up. Google sign-up uses your Google profile photo.</p>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setStep(1)} 
                  className="mb-8 flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to details
                </button>
                <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Verify Email</h2>
                <p className="text-brand-muted mb-10">We've sent a 6-digit OTP to <span className="font-semibold text-brand-dark">{email}</span></p>

                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3 text-center">Enter OTP <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      required 
                      className="input-underline text-center text-3xl tracking-widest font-display py-4" 
                      placeholder="------" 
                      maxLength="6" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                    {loading ? (
                      <ButtonLoader text="Verifying..." />
                    ) : (
                      <>Verify & Register <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
