import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Heart, Shield, Coins, Star, Users,
  Route, MessageCircle, Gift, ArrowRight, ArrowUpRight,
  MapPin, ChevronRight, Zap, Globe, Lock
} from 'lucide-react';
import { HeroCar3D } from '../components/HeroCar3D';
import { RevealSection, TextReveal } from '../components/TextReveal';

import { MarqueeText } from '../components/MarqueeText';
import { Footer } from '../components/Footer';

/* ── Counter animation hook ──────────────────────────── */
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    started.current = false;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return [ref, count];
};

export const Home = () => {
  const features = [
    {
      icon: <Compass className="h-6 w-6" />,
      title: 'Smart Route Matching',
      description: 'AI finds travelers within 5km of your route for perfect highway matches.',
      num: '01',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safety First',
      description: 'Verified IDs, license checks, vehicle verification, and emergency SOS.',
      num: '02',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Companion Match',
      description: 'Choose your ideal buddy — conversation level, music taste, and more.',
      num: '03',
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: 'Kindlift Coins',
      description: 'Earn coins every trip. Redeem for free rides, discounts, or donate.',
      num: '04',
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Trusted Ratings',
      description: 'Two-way rating system after each journey. Build your reputation.',
      num: '05',
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Referral Rewards',
      description: 'Invite friends and get 50 bonus coins each. Grow your network.',
      num: '06',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Plan Your Journey',
      desc: 'Enter your starting point, destination, and travel date. Our platform handles the rest.',
      icon: <Route className="h-8 w-8" />,
    },
    {
      num: '02',
      title: 'Get Matched',
      desc: 'Our smart algorithm finds travelers heading your way within minutes.',
      icon: <Users className="h-8 w-8" />,
    },
    {
      num: '03',
      title: 'Connect & Travel',
      desc: 'Chat with your match, coordinate details, and enjoy the shared journey.',
      icon: <MessageCircle className="h-8 w-8" />,
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Rathore',
      route: 'Mathura → palwal',
      quote: 'KindLift presents a highly relevant and impactful solution to modern urban transportation challenges. By focusing on ride sharing, the platform directly addresses key issues such as traffic congestion, rising fuel costs, and environmental sustainability, making it both practical and socially responsible.Overall, KindLift is a well-thought-out and practical platform with strong real-world applicability. With further refinement and feature enhancement, it has the potential to evolve into a powerful, user-friendly, and impactful mobility solution.' , 
      rating: 5,
    },
    {
      name: 'Shivendra Pratap Singh',
      route: 'Delhi → Jaipur',
      quote: 'This is amazing step towards making our journey affordable and comfortable Lets begin with full enthusiasm.',
      rating: 3,
    },
    {
      name: 'Anjali Nair',
      route: 'Bangalore → Coorg',
      quote: 'Was nervous about sharing a ride at first. But the verification system is solid, and I\'ve made 3 good friends through Kindlift!',
      rating: 5,
    },
  ];

  const [stats, setStats] = useState({
    happyJourneys: 10000,
    matchAccuracy: 98,
    activeCities: 50
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/stats`);
        const data = await response.json();
        setStats({
          happyJourneys: data.happyJourneys || 0,
          matchAccuracy: data.matchAccuracy || 0,
          activeCities: data.activeCities || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const [journeysRef, journeys] = useCounter(stats.happyJourneys, 2500);
  const [matchRef, matchRate] = useCounter(stats.matchAccuracy, 2000);
  const [citiesRef, cities] = useCounter(stats.activeCities, 1800);

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════ HERO — Dark fullscreen ═══════════ */}
      <section className="relative min-h-screen section-dark flex items-center overflow-hidden">
        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        {/* 3D Background */}
        <div className="absolute inset-0 opacity-60">
          <HeroCar3D />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-[2]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-up">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              <span className="text-white/60 text-sm font-medium">Connecting travelers across India</span>
            </div>

            <h1
              className="font-display text-display-xl text-white mb-8 animate-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              Don't drive{' '}
              <span className="text-gradient">alone.</span>
              <br />
              Find your ride buddy.
            </h1>

            <p
              className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mb-12 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              We connect you with fellow travelers heading the same way — share costs,
              share stories, turn lonely drives into unforgettable road trips.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up"
              style={{ animationDelay: '0.45s' }}
            >
              <Link to="/book-ride"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold text-base rounded-full hover:bg-white transition-all duration-500"
              >
                Find a Ride
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/offer-ride"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-display font-bold text-base rounded-full hover:bg-white/10 transition-all duration-500"
              >
                Offer a Ride
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-12 animate-fade-up"
              style={{ animationDelay: '0.6s' }}
            >
              {[
                { value: `${stats.happyJourneys >= 1000 ? Math.floor(stats.happyJourneys / 1000) + 'k+' : stats.happyJourneys}`, label: 'Happy Journeys' },
                { value: `${stats.matchAccuracy}%`, label: 'Match Accuracy' },
                { value: `${stats.activeCities}+`, label: 'Active Cities' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ═══════════════ MARQUEE STRIP ═══════════════════ */}
      <section className="section-dark py-6 border-y border-white/5">
        <MarqueeText
          text="Share the journey"
          separator="✦"
          className="font-display text-xl md:text-2xl font-bold text-white/10"
        />
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════ */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
              <div>
                <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Process</p>
                <h2 className="font-display text-display-md text-brand-dark">
                  How it works
                </h2>
              </div>
              <p className="text-brand-muted text-lg max-w-md">
                Whether you're driving or looking for a seat, we make connecting effortless.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <RevealSection key={i}>
                <div className="group relative">
                  {/* Number Background */}
                  <span className="font-display text-[8rem] font-bold text-brand-dark/[0.03] absolute -top-10 -left-2 select-none">
                    {step.num}
                  </span>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-white mb-8 group-hover:bg-brand-accent transition-colors duration-500">
                      {step.icon}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">{step.title}</h3>
                    <p className="text-brand-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════════════ */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-4">Features</p>
              <h2 className="font-display text-display-md text-white">
                Why travelers love Kindlift
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {features.map((feature, i) => (
              <RevealSection key={i}>
                <div className="group bg-brand-dark hover:bg-brand-charcoal p-10 transition-colors duration-500 cursor-default h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-500">
                      {feature.icon}
                    </div>
                    <span className="font-display text-sm text-white/20 font-bold">{feature.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS COUNTER ════════════════════ */}
      <section className="section-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div ref={journeysRef}>
                <p className="font-display text-7xl md:text-8xl font-bold text-brand-dark">
                  {stats.happyJourneys >= 1000 ? Math.floor(journeys / 1000) + 'k+' : journeys}
                </p>
                <p className="text-brand-muted mt-4 text-lg">Happy Journeys</p>
              </div>
              <div ref={matchRef}>
                <p className="font-display text-7xl md:text-8xl font-bold text-brand-dark">{matchRate}%</p>
                <p className="text-brand-muted mt-4 text-lg">Match Accuracy</p>
              </div>
              <div ref={citiesRef}>
                <p className="font-display text-7xl md:text-8xl font-bold text-brand-dark">{cities}+</p>
                <p className="text-brand-muted mt-4 text-lg">Active Cities</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ════════════════════════ */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-20">
              <h2 className="font-display text-display-md text-brand-dark">
                From lonely drive to <span className="text-gradient">memorable journey</span>
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-brand-gray-light">
            <RevealSection>
              <div className="bg-white p-10 md:p-14 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 font-display font-bold text-lg">✕</div>
                  <h3 className="font-display text-2xl font-bold text-brand-dark">Solo Drive</h3>
                </div>
                <ul className="space-y-5">
                  {['Boring 5-hour drive alone', 'Full fuel cost on one person', 'No one to share stories', 'Unsafe driving at night', 'No help if car breaks down', 'Arrive tired and lonely'].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-brand-dark/60">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-50 text-red-400 text-xs font-bold">✕</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="bg-brand-dark p-10 md:p-14 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center text-brand-accent font-display font-bold text-lg">✓</div>
                  <h3 className="font-display text-2xl font-bold text-white">With Kindlift</h3>
                </div>
                <ul className="space-y-5">
                  {['Interesting conversations & new friends', 'Split fuel costs — save up to 50%', 'Perfect road trip playlist together', 'Safety in numbers during night drives', 'Shared responsibility & peace of mind', 'Arrive energized with new memories'].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-white/60">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-brand-accent/20 text-brand-accent text-xs font-bold">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ══════════════════════ */}
      <section className="section-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
              <div>
                <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Testimonials</p>
                <h2 className="font-display text-display-md text-brand-dark">
                  Real stories from the road
                </h2>
              </div>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <RevealSection key={i}>
                <div className="bg-white rounded-2xl p-8 md:p-10 h-full flex flex-col border border-brand-gray-light group hover:border-brand-accent/30 transition-colors duration-500">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                  <p className="text-brand-dark/70 leading-relaxed flex-1 mb-8">"{t.quote}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-brand-gray-light">
                    <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center text-white font-display font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-brand-dark">{t.name}</h4>
                      <p className="text-sm text-brand-muted">{t.route}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES STRIP ═══════════════════ */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-4">Our Services</p>
              <h2 className="font-display text-display-md text-white max-w-3xl mx-auto">
                Everything you need for a shared journey
              </h2>
            </div>
          </RevealSection>

          <div className="space-y-0 border-t border-white/10">
            {[
              { icon: <Globe className="h-6 w-6" />, title: 'Smart Route Matching', desc: 'AI-powered route analysis connects you with the perfect co-traveler.' },
              { icon: <Lock className="h-6 w-6" />, title: 'Verified Community', desc: 'Every user verified with ID, license, and vehicle checks.' },
              { icon: <Zap className="h-6 w-6" />, title: 'Instant Booking', desc: 'Real-time matching and booking — find rides in under 2 minutes.' },
              { icon: <Gift className="h-6 w-6" />, title: 'Rewards System', desc: 'Earn Kindlift Coins on every trip. Redeem for rides and perks.' },
            ].map((service, i) => (
              <RevealSection key={i}>
                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 md:py-10 border-b border-white/10 hover:px-6 transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-500">
                      {service.icon}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-brand-accent transition-colors duration-300">{service.title}</h3>
                  </div>
                  <p className="text-white/40 text-sm max-w-sm md:text-right">{service.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE CTA ═════════════════════ */}
      <section className="section-light py-6 border-y border-brand-gray-light">
        <MarqueeText
          text="Find your ride buddy"
          separator="→"
          reverse
          className="font-display text-xl md:text-2xl font-bold text-brand-dark/5"
        />
      </section>

      {/* ═══════════════ FOOTER ═══════════════════════════ */}
      <Footer />
    </div>
  );
};