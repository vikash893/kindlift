import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import api from '../lib/api';
import { ArrowRight, ArrowLeft, Mail, KeyRound, Lock, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password, 4: success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/verify-reset-otp', { email, otp });
      setSuccess(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess(res.data.message);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex pt-16">
        {/* Left — Dark brand panel */}
        <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
          <div className="noise-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-dark/80" />

          <div className="relative z-10" />

          <div className="relative z-10 mt-12">
            <h1 className="font-display text-display-lg text-white mb-6">
              Reset your<br /><span className="text-gradient">password.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-sm">
              Don't worry — it happens to the best of us. We'll send you an OTP to get back in.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-8 text-sm text-white/30">
            <span><strong className="text-white/60">Secure</strong> OTP verification</span>
            <span><strong className="text-white/60">10 min</strong> expiry</span>
            <span><strong className="text-white/60">Encrypted</strong> storage</span>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-brand-light">
          <div className="w-full max-w-md">

            {/* Step Indicators */}
            <div className="flex items-center gap-3 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all duration-500 ${
                    step >= s ? 'bg-brand-dark text-white' :
                    step === 4 ? 'bg-emerald-500 text-white' :
                    'bg-brand-dark/10 text-brand-muted'
                  }`}>
                    {step > s || step === 4 ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step > s ? 'bg-brand-dark' : 'bg-brand-dark/10'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-brand-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-brand-dark">Find your account</h2>
                </div>
                <p className="text-brand-muted mb-10 ml-[52px]">Enter the email associated with your account</p>

                <form onSubmit={handleSendOtp} className="space-y-6">
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

                  <button
                    type="submit" disabled={loading}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Sending OTP...</span>
                    ) : (
                      <>Send Reset OTP <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>

                  <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-brand-muted hover:text-brand-dark font-display font-semibold transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </form>
              </>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-brand-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-brand-dark">Verify OTP</h2>
                </div>
                <p className="text-brand-muted mb-10 ml-[52px]">We sent a 6-digit code to <strong className="text-brand-dark">{email}</strong></p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">OTP Code</label>
                    <input
                      type="text" required className="input-underline text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="000000" maxLength="6"
                      value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>

                  <button
                    type="submit" disabled={otp.length !== 6 || loading}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Verifying...</span>
                    ) : (
                      <>Verify & Continue <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess(''); }}
                      className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark font-display font-semibold transition-colors">
                      <ArrowLeft className="h-4 w-4" /> Change email
                    </button>
                    <button type="button" onClick={handleResendOtp} disabled={loading}
                      className="text-sm text-brand-accent hover:text-brand-accent-hover font-display font-semibold transition-colors disabled:opacity-50">
                      {loading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-brand-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-brand-dark">New password</h2>
                </div>
                <p className="text-brand-muted mb-10 ml-[52px]">Choose a strong password you haven't used before</p>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} required className="input-underline pr-12"
                        placeholder="Min. 6 characters" minLength="6"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer p-2 rounded-lg text-brand-muted hover:text-brand-dark transition-colors"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Confirm Password</label>
                    <input
                      type="password" required className="input-underline"
                      placeholder="Re-enter your password" minLength="6"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-500 text-xs mt-2 font-medium">Passwords don't match</p>
                    )}
                  </div>

                  {/* Password strength hints */}
                  <div className="bg-brand-dark/[0.03] rounded-xl p-4 space-y-2">
                    <p className="text-xs font-display font-bold text-brand-dark mb-2">Password requirements:</p>
                    <div className={`flex items-center gap-2 text-xs ${newPassword.length >= 6 ? 'text-emerald-600' : 'text-brand-muted'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-brand-dark/20'}`} />
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${newPassword === confirmPassword && confirmPassword ? 'text-emerald-600' : 'text-brand-muted'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword === confirmPassword && confirmPassword ? 'bg-emerald-500' : 'bg-brand-dark/20'}`} />
                      Passwords match
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2"><div className="loader-spinner !w-5 !h-5 !border-2" />Resetting...</span>
                    ) : (
                      <>Reset Password <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>

                  <button type="button" onClick={() => setStep(2)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-brand-muted hover:text-brand-dark font-display font-semibold transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Go back
                  </button>
                </form>
              </>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="font-display text-3xl font-bold text-brand-dark mb-3">Password Reset!</h2>
                <p className="text-brand-muted mb-10 text-lg">Your password has been updated successfully. You can now sign in with your new password.</p>

                <Link to="/login"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                >
                  Go to Login <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};
