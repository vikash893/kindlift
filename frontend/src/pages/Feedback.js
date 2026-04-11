import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, MessageCircle, Star } from 'lucide-react';
import api from "../lib/api";

function Feedback() {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    feedback: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    try {
      await api.post("/feedback", feedback);
      setSuccess("Thank you for your genuine feedback! Redirecting to home page...");
      setFeedback({
        name: "",
        email: "",
        feedback: ""
      });
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Dark brand panel with text content */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-brand-dark/95" />

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

        <div className="relative z-10 space-y-8">
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

        <div className="relative z-10 flex items-center gap-8 text-sm text-white/30">
          <span><strong className="text-white/60">10,000+</strong> feedback received</span>
          <span><strong className="text-white/60">95%</strong> implemented suggestions</span>
          <span><strong className="text-white/60">24h</strong> acknowledgment</span>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-brand-light">
        <div className="w-full max-w-md">
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

          <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Share Your Thoughts</h2>
          <p className="text-brand-muted mb-2">We value genuine feedback from our community</p>
          <p className="text-xs text-brand-muted/70 mb-10">Please visit our website to share authentic experiences</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="John Doe"
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
                name="feedback"
                required
                rows="5"
                className="input-underline resize-none"
                placeholder="Share your experience, suggestions, or report any issues..."
                value={feedback.feedback}
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
                  <div className="loader-spinner !w-5 !h-5 !border-2" />
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