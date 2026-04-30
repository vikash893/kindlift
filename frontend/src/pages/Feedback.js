import React, { useState } from 'react';
import { ButtonLoader } from '../components/ButtonLoader';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, MessageCircle, Star, Lock } from 'lucide-react';
import api from '../lib/api';

function Feedback() {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotRegistered(false);   // reset on any change
    setError('');
    setFeedback((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setNotRegistered(false);

    try {
      const response = await api.post('/feedback', feedback);
      setSuccess("Thank you for your genuine feedback! Redirecting to home page...");
      setFeedback({ name: "", email: "", message: "" });
      setTimeout(() => { navigate('/'); }, 2000);
    } catch (err) {
      console.error('Full error:', err);

      // ── Registered-user gate ──────────────────────────────────
      if (err.response?.status === 403 && err.response?.data?.message === 'NOT_REGISTERED') {
        setNotRegistered(true);
        return;
      }

      if (err.code === 'ERR_NETWORK') {
        setError("Cannot connect to backend. Please check if the server is running.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Please check the backend URL.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to submit feedback: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left — Dark brand panel with text content (Logo removed) */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-brand-dark/95" />

        {/* Logo section removed */}

        <div className="relative z-10 space-y-8 mt-12">
          <div>
            <h1 className="font-display text-display-lg text-white mb-6">
              Your <span className="text-gradient">feedback</span><br />
              matters.
            </h1>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              We're committed to continuous improvement and value genuine insights from our community.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-brand-accent mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Genuine Feedback Only</h3>
                <p className="text-white/50 text-sm">Share your real experiences to help us grow better</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-brand-accent mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">We Listen Actively</h3>
                <p className="text-white/50 text-sm">Every piece of feedback is reviewed by our team</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-brand-accent mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Drive Real Change</h3>
                <p className="text-white/50 text-sm">Your suggestions directly influence our roadmap</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm italic">
              "The feedback we receive shapes the future of Kindlift. Every voice matters in our journey."
            </p>
            <p className="text-white/30 text-xs mt-2">— Team Kindlift</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-white/30">
          <span><strong className="text-white/60">10,000+</strong> feedback received</span>
          <span><strong className="text-white/60">95%</strong> implemented suggestions</span>
          <span><strong className="text-white/60">24h</strong> acknowledgment</span>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-brand-light">
        <div className="w-full max-w-md">
          {/* Mobile logo removed */}
          
          <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Share Your Thoughts</h2>
          <p className="text-brand-muted mb-2">We value genuine feedback from our community</p>
          <p className="text-xs text-brand-muted/70 mb-10">Please visit our website to share authentic experiences</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ── Not-Registered Gate Banner ─────────────────── */}
            {notRegistered && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-amber-900 text-sm">Account Not Found</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      This email is not registered on KindLift. Please log in or create an account first to submit genuine feedback.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2.5 bg-brand-dark text-white text-sm font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-2.5 border-2 border-amber-300 text-amber-800 text-sm font-display font-bold rounded-full hover:bg-amber-100 transition-all duration-300"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl flex items-center gap-2">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                {success}
              </div>
            )}


            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="input-underline"
                placeholder="Vikash Bhardwaj"
                value={feedback.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="input-underline"
                placeholder="you@example.com"
                value={feedback.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Your Feedback</label>
              <textarea
                name="message"
                required
                rows="5"
                className="input-underline resize-none"
                placeholder="Share your experience, suggestions, or report any issues..."
                value={feedback.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <ButtonLoader text="" />
                  Submitting...
                </span>
              ) : (
                <>
                  Submit Feedback 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-gray-light" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-brand-light text-brand-muted text-sm">We're listening</span>
              </div>
            </div>

            <Link to="/" className="block w-full">
              <button type="button" className="w-full px-6 py-4 border-2 border-brand-dark/10 text-brand-dark font-display font-bold rounded-full hover:border-brand-dark/30 transition-all">
                Back to Home
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedback;