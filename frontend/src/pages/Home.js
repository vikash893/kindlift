import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Heart, Shield, Coins, Star, Users,
  Route, MessageCircle, Gift, ArrowRight,
  MapPin, Phone, Mail, ChevronRight
} from 'lucide-react';
import { HeroCar3D } from '../components/HeroCar3D';

/* ── Scroll reveal hook ────────────────────────────── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const RevealSection = ({ children, className = '' }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

export const Home = () => {
  const features = [
    {
      icon: <Compass className="h-6 w-6" />,
      title: 'Smart Route Matching',
      description: 'Our AI finds travelers within 5km of your route. Perfect for long highway journeys.',
      stat: '95% accuracy',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Companion Preferences',
      description: 'Choose your ideal travel buddy — conversation level, music taste, and more.',
      stat: 'Find your vibe',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safety First',
      description: 'Verified IDs, driver\'s license check, vehicle verification, and emergency SOS.',
      stat: '100% verified',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: 'Kindlift Coins',
      description: 'Earn coins on every trip! Redeem for free rides, discounts, or donate to charity.',
      stat: '10 coins = 1 free km',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Trusted Ratings',
      description: 'Two-way rating system after each journey. Build your reputation.',
      stat: '4.92 avg rating',
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Referral Rewards',
      description: 'Invite friends and get 50 bonus coins each. Build your travel network!',
      stat: 'Unlimited referrals',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  const steps = [
    {
      icon: <Route className="h-7 w-7 text-white" />,
      title: 'Plan Your Journey',
      desc: 'Enter your starting point, destination, and travel date.',
      color: 'bg-brand-dark',
    },
    {
      icon: <Users className="h-7 w-7 text-white" />,
      title: 'Get Matched',
      desc: 'Our smart algorithm finds travelers going your way.',
      color: 'bg-brand-accent',
    },
    {
      icon: <MessageCircle className="h-7 w-7 text-white" />,
      title: 'Connect & Travel',
      desc: 'Chat with your match, coordinate details, and hit the road!',
      color: 'bg-emerald-600',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      route: 'Mumbai → Pune',
      quote: 'I used to dread the 3-hour drive alone. Now I actually look forward to it! Found a regular travel buddy who loves the same podcasts.',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      route: 'Delhi → Jaipur',
      quote: 'Split fuel costs, great conversation, and even made a business connection. Kindlift is a game-changer for solo travelers.',
      rating: 5,
    },
    {
      name: 'Anjali Nair',
      route: 'Bangalore → Coorg',
      quote: 'Was nervous about sharing a ride at first. But the verification system is solid, and now I\'ve made 3 good friends through Kindlift!',
      rating: 5,
    },
  ];

  return (
    <div className="overflow-x-hidden -mt-20">

      {/* ═══════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-brand-cream flex items-center overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        {/* Warm gradient overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-50/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-card text-sm font-medium text-brand-dark animate-fade-up">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Connecting travelers across India
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark tracking-tight leading-[1.1] animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Don't Drive{' '}
                <br className="hidden sm:block" />
                Alone.{' '}
                <span className="text-gradient">Find Your Ride Buddy</span>
              </h1>

              <p className="text-lg text-brand-muted leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
                We connect you with fellow travelers heading the same way — share costs,
                share stories, and turn a lonely drive into an unforgettable road trip.
              </p>

              {/* Search-style CTA */}
              <div className="bg-white rounded-2xl shadow-card p-2 flex flex-col sm:flex-row gap-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-cream/50">
                  <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0" />
                  <span className="text-sm text-brand-muted">Where are you going?</span>
                </div>
                <Link
                  to="/book-ride"
                  className="px-6 py-3 bg-brand-dark text-white font-semibold text-sm rounded-xl hover:bg-brand-charcoal transition-all flex items-center justify-center gap-2 group"
                >
                  Find a Ride
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                {[
                  { value: '10,000+', label: 'Happy Journeys' },
                  { value: '98%', label: 'Match Accuracy' },
                  { value: '50+', label: 'Active Cities' },
                ].map((stat, i) => (
                  <div key={i} className="text-left">
                    <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                    <p className="text-sm text-brand-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 3D Car */}
            <div className="relative h-[400px] lg:h-[500px] animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-brand-cream rounded-3xl" />
              <HeroCar3D />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Simple Process</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-brand-muted max-w-2xl mx-auto">
                Whether you're driving or looking for a seat, we make it effortless to connect.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-[2px] bg-gray-100" />

            {steps.map((step, i) => (
              <RevealSection key={i}>
                <div className="text-center group" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="relative inline-block mb-6">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-dark shadow-sm">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{step.title}</h3>
                  <p className="text-brand-muted">{step.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════════════ */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Features</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
                Why Travelers Love Kindlift
              </h2>
              <p className="mt-4 text-lg text-brand-muted max-w-2xl mx-auto">
                We've thought of everything to make your shared journey safe, enjoyable, and rewarding.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <RevealSection key={i}>
                <div className="bg-white rounded-2xl p-7 shadow-card card-lift border border-gray-100/80">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">{feature.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-4">{feature.description}</p>
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-brand-cream text-brand-dark/70">
                    {feature.stat}
                  </span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
                From Lonely Drive to{' '}
                <span className="text-gradient">Memorable Journey</span>
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevealSection>
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 font-bold text-lg">✕</div>
                  <h3 className="text-xl font-bold text-brand-dark">Solo Drive Struggle</h3>
                </div>
                <ul className="space-y-3">
                  {['Boring 5-hour drive with no one to talk to', 'Full fuel cost on just one person', 'No one to share snacks, music, or stories', 'Feeling unsafe driving alone at night', 'No help if your car breaks down', 'Arriving tired and lonely'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-brand-dark/70 text-sm">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-red-400 text-xs">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-lg">✓</div>
                  <h3 className="text-xl font-bold text-brand-dark">With Kindlift</h3>
                </div>
                <ul className="space-y-3">
                  {['Interesting conversations and new friendships', 'Split fuel costs — save up to 50%', 'Curate the perfect road trip playlist together', 'Safety in numbers during night drives', 'Shared responsibility and peace of mind', 'Arrive energized with new memories'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-brand-dark/70 text-sm">
                      <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-500 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Testimonials</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
                Real Stories from the Road
              </h2>
              <p className="mt-4 text-lg text-brand-muted">See how Kindlift turned lonely drives into lifelong friendships</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <RevealSection key={i}>
                <div className="bg-white rounded-2xl p-7 shadow-card card-lift border border-gray-100/80 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark">{t.name}</h4>
                      <p className="text-sm text-brand-muted">{t.route}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-brand-dark/70 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════════════════ */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <RevealSection>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Ready for Your Next{' '}
              <span className="text-brand-accent">Adventure</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered the joy of shared journeys.
              Your next road trip friend is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-ride"
                className="px-8 py-4 bg-brand-accent text-brand-dark font-bold rounded-full hover:bg-brand-accent-hover transition-all text-lg group inline-flex items-center justify-center gap-2"
              >
                Find a Ride
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/offer-ride"
                className="px-8 py-4 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg inline-flex items-center justify-center gap-2"
              >
                Offer a Ride
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500">Free to join · No commitment · Cancel anytime</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════ FOOTER ════════════════════════ */}
      <footer className="bg-brand-dark text-gray-400 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <span className="font-bold text-lg text-white">Kindlift</span>
              </div>
              <p className="text-sm leading-relaxed">
                Connecting travelers across India. Share rides, save costs, and make lifelong friendships.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { to: '/book-ride', label: 'Find a Ride' },
                  { to: '/offer-ride', label: 'Offer a Ride' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm hover:text-white transition-colors flex items-center gap-1 group">
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                {['Safety Guidelines', 'FAQs', 'Community Standards', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <span className="text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-1 group">
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-brand-accent" />
                  support@kindlift.in
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-brand-accent" />
                  +91 (800) 123-4567
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-brand-accent" />
                  India
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Kindlift. All rights reserved.</p>
            <p className="text-sm">Built with care by the Kindlift team</p>
          </div>
        </div>
      </footer>
    </div>
  );
};