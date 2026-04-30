import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';
import api from '../lib/api';

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await api.post('/contact', formData);
      setStatus('success');
      setFeedback(res.data.message || 'Message sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      // Reset back to idle after 6 seconds
      setTimeout(() => { setStatus('idle'); setFeedback(''); }, 6000);
    } catch (err) {
      setStatus('error');
      const msg =
        err.response?.data?.message ||
        'Failed to send message. Please try again later.';
      setFeedback(msg);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="section-dark relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <RevealSection>
            <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-6">Contact</p>
            <h1 className="font-display text-display-xl text-white max-w-3xl">
              Let's start a <span className="text-gradient">conversation</span>
            </h1>
          </RevealSection>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Left — Info */}
            <RevealSection>
              <div>
                <h2 className="font-display text-display-sm text-brand-dark mb-6">
                  Get in touch
                </h2>
                <p className="text-brand-muted leading-relaxed mb-12 max-w-md">
                  Have questions or need support? Our team is always here to help you get moving. We typically respond within 24 hours.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-accent flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-muted mb-1">Email us at</p>
                      <p className="font-display font-bold text-brand-dark">rajputvishnu2513@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-accent flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-muted mb-1">Call us at</p>
                      <p className="font-display font-bold text-brand-dark">+91 (790) 699-0603</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-accent flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-muted mb-1">Location</p>
                      <p className="font-display font-bold text-brand-dark">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Right — Form */}
            <RevealSection>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="input-underline"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="input-underline"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="input-underline"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Message</label>
                  <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    disabled={isLoading}
                    className="input-underline resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Feedback banner */}
                {feedback && (
                  <div
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      status === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {status === 'success' ? (
                      <span className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    {feedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <>
                      Send Message
                      <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </RevealSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
