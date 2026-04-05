import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Have questions or need support? Our team is always here to help you get moving.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Contact Info Panel */}
          <div className="bg-brand-dark text-white p-10 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
              <p className="text-gray-400 text-sm mb-10">We'd love to hear from you</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-brand-accent" />
                  </div>
                  <span className="text-sm">support@kindlift.in</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Phone className="h-5 w-5 text-brand-accent" />
                  </div>
                  <span className="text-sm">+91 (800) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-brand-accent" />
                  </div>
                  <span className="text-sm">India</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500">Response time: within 24 hours</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-10 lg:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">Message</label>
                <textarea
                  rows="4"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none resize-none bg-brand-cream/50"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-dark hover:bg-brand-charcoal text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {sent ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    Message Sent!
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
