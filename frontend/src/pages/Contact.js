import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { RevealSection } from '../components/TextReveal';
import { Footer } from '../components/Footer';

export const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

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
                      required
                      className="input-underline"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Last Name</label>
                    <input
                      type="text"
                      required
                      className="input-underline"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-underline"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-display font-semibold text-brand-dark mb-3">Message</label>
                  <textarea
                    rows="4"
                    required
                    className="input-underline resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                >
                  {sent ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      Message Sent!
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
