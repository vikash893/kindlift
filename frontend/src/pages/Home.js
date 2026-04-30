import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Heart, Shield, Coins, Star, Users,
  Route, MessageCircle, Gift, ArrowRight, ArrowUpRight,
  MapPin, ChevronRight, Zap, Globe, Lock, Sparkles, Play
} from 'lucide-react';
import { HeroCar3D } from '../components/HeroCar3D';
import { RevealSection } from '../components/TextReveal';
import api from '../lib/api';
import { MarqueeText } from '../components/MarqueeText';
import { Footer } from '../components/Footer';
import { ParticleField } from '../components/ParticleField';
import { TiltCard } from '../components/InteractiveCards';
import { ScrollProgress, StaggeredReveal, CountUpOnView } from '../components/PageTransitions';
import { AuroraBackground } from '../components/GradientMesh';

/* ── Parallax hook ──────────────────────────── */
const useParallax = (speed = 0.3) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const y = window.scrollY;
      ref.current.style.transform = `translateY(${y * speed}px)`;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [speed]);
  return ref;
};

/* ── Magnetic button ──────────────────────────── */
const MagneticBtn = ({ children, className = '', ...props }) => {
  const ref = useRef(null);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} className="inline-block transition-transform duration-300 ease-out" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {React.isValidElement(children) ? React.cloneElement(children, { className: `${children.props.className || ''} ${className}` , ...props }) : children}
    </div>
  );
};

export const Home = () => {
  const features = [
    { icon: <Compass className="h-6 w-6" />, title: 'Smart Route Matching', description: 'AI finds travelers within 5km of your route for perfect highway matches.', num: '01' },
    { icon: <Shield className="h-6 w-6" />, title: 'Safety First', description: 'Verified IDs, license checks, vehicle verification, and emergency SOS.', num: '02' },
    { icon: <Heart className="h-6 w-6" />, title: 'Companion Match', description: 'Choose your ideal buddy — conversation level, music taste, and more.', num: '03' },
    { icon: <Coins className="h-6 w-6" />, title: 'Kindlift Coins', description: 'Earn coins every trip. Redeem for free rides, discounts, or donate.', num: '04' },
    { icon: <Star className="h-6 w-6" />, title: 'Trusted Ratings', description: 'Two-way rating system after each journey. Build your reputation.', num: '05' },
    { icon: <Gift className="h-6 w-6" />, title: 'Referral Rewards', description: 'Invite friends and get 50 bonus coins each. Grow your network.', num: '06' },
  ];

  const steps = [
    { num: '01', title: 'Plan Your Journey', desc: 'Enter your starting point, destination, and travel date. Our platform handles the rest.', icon: <Route className="h-8 w-8" /> },
    { num: '02', title: 'Get Matched', desc: 'Our smart algorithm finds travelers heading your way within minutes.', icon: <Users className="h-8 w-8" /> },
    { num: '03', title: 'Connect & Travel', desc: 'Chat with your match, coordinate details, and enjoy the shared journey.', icon: <MessageCircle className="h-8 w-8" /> },
  ];

  const [testimonials, setTestimonials] = useState([
    { name: 'Rahul Rathore', route: 'Mathura → Palwal', message: 'KindLift presents a highly relevant and impactful solution. The platform directly addresses traffic congestion, rising fuel costs, and environmental sustainability.' },
    { name: 'Shivendra Pratap Singh', route: 'Delhi → Jaipur', message: 'This is an amazing step towards making our journey affordable and comfortable. Let\'s begin with full enthusiasm.' },
    { name: 'Anjali Nair', route: 'Bangalore → Coorg', message: 'Was nervous about sharing a ride at first. But the verification system is solid, and I\'ve made 3 good friends through Kindlift!' },
  ]);

  const [stats, setStats] = useState({ happyJourneys: 10000, matchAccuracy: 98, activeCities: 50 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/stats');
        setStats({ happyJourneys: statsRes.data.happyJourneys || 0, matchAccuracy: statsRes.data.matchAccuracy || 0, activeCities: statsRes.data.activeCities || 0 });
        const feedbackRes = await api.get('/feedback/featured');
        if (feedbackRes.data && feedbackRes.data.length > 0) setTestimonials(feedbackRes.data);
      } catch (error) { console.error('Failed to fetch home page data:', error); }
    };
    fetchData();
  }, []);

  const parallaxRef = useParallax(0.15);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />

      {/* ═══════════════ HERO ═══════════ */}
      <section className="relative min-h-screen section-dark flex items-center overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div ref={parallaxRef} className="absolute inset-0 opacity-50"><HeroCar3D /></div>
        <AuroraBackground intensity="low" />
        <div className="absolute inset-0 hero-gradient z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[2]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-up glass">
              <span className="w-2 h-2 bg-brand-accent rounded-full hero-pulse-dot" />
              <span className="text-white/60 text-sm font-medium">Connecting travelers across India</span>
              <Sparkles className="h-3.5 w-3.5 text-brand-accent/60" />
            </div>

            <h1 className="font-display text-display-xl text-white mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              Don't drive{' '}<span className="text-gradient-gold">alone.</span><br />
              Find your ride buddy.
            </h1>

            <p className="text-white/45 text-lg md:text-xl leading-relaxed max-w-xl mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              We connect you with fellow travelers heading the same way — share costs, share stories, turn lonely drives into unforgettable road trips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.45s' }}>
              <MagneticBtn>
                <Link to="/book-ride" className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold text-base rounded-full hover:bg-white hover:shadow-glow transition-all duration-500">
                  Find a Ride <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticBtn>
              <MagneticBtn>
                <Link to="/offer-ride" className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-display font-bold text-base rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-500 glass">
                  Offer a Ride <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </MagneticBtn>
            </div>

            {/* Live Stats */}
            <div className="flex flex-wrap gap-10 sm:gap-14 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              {[
                { value: stats.happyJourneys, suffix: stats.happyJourneys >= 1000 ? 'k+' : '+', divider: stats.happyJourneys >= 1000 ? 1000 : 1, label: 'Happy Journeys' },
                { value: stats.matchAccuracy, suffix: '%', divider: 1, label: 'Match Accuracy' },
                { value: stats.activeCities, suffix: '+', divider: 1, label: 'Active Cities' },
              ].map((s, i) => (
                <div key={i} className="group cursor-default">
                  <p className="font-display text-3xl font-bold text-white group-hover:text-brand-accent transition-colors duration-300">
                    <CountUpOnView end={Math.floor(s.value / s.divider)} suffix={s.suffix} />
                  </p>
                  <p className="text-white/35 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/25 text-xs uppercase tracking-[0.3em] font-display">Scroll</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* ═══════════════ MARQUEE STRIP ═══════════════════ */}
      <section className="section-dark py-6 border-y border-white/5">
        <MarqueeText text="Share the journey" separator="✦" className="font-display text-xl md:text-2xl font-bold text-white/10" />
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════ */}
      <section className="section-light py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"><ParticleField color="#d4962e" particleCount={40} connectionDistance={100} /></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
              <div>
                <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="h-4 w-4" /> Process</p>
                <h2 className="font-display text-display-md text-brand-dark">How it works</h2>
              </div>
              <p className="text-brand-muted text-lg max-w-md">Whether you're driving or looking for a seat, we make connecting effortless.</p>
            </div>
          </RevealSection>

          <StaggeredReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <TiltCard key={i} className="group relative" tiltAmount={6}>
                <span className="font-display text-[8rem] font-bold text-brand-dark/[0.03] absolute -top-10 -left-2 select-none">{step.num}</span>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-white mb-8 group-hover:bg-brand-accent group-hover:shadow-glow transition-all duration-500">{step.icon}</div>
                  <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">{step.title}</h3>
                  <p className="text-brand-muted leading-relaxed">{step.desc}</p>
                </div>
              </TiltCard>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════════════ */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <AuroraBackground intensity="low" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-4">Features</p>
              <h2 className="font-display text-display-md text-white">Why travelers love <span className="text-gradient-gold">Kindlift</span></h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {features.map((feature, i) => (
              <RevealSection key={i}>
                <div className="group bg-brand-dark hover:bg-brand-charcoal p-10 transition-all duration-500 cursor-default h-full feature-card-glow">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-dark group-hover:shadow-glow transition-all duration-500">{feature.icon}</div>
                    <span className="font-display text-sm text-white/15 font-bold">{feature.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors duration-300">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">{feature.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS COUNTER ════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1508 50%, #0a0a0a 100%)' }}>
        <div className="absolute inset-0"><ParticleField color="#e8a838" particleCount={50} connectionDistance={150} /></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { end: stats.happyJourneys >= 1000 ? Math.floor(stats.happyJourneys / 1000) : stats.happyJourneys, suffix: stats.happyJourneys >= 1000 ? 'k+' : '', label: 'Happy Journeys', icon: '🚗' },
                { end: stats.matchAccuracy, suffix: '%', label: 'Match Accuracy', icon: '🎯' },
                { end: stats.activeCities, suffix: '+', label: 'Active Cities', icon: '🌆' },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <p className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-white stat-glow">
                    <CountUpOnView end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/40 mt-4 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ════════════════════════ */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-20">
              <h2 className="font-display text-display-md text-brand-dark">From lonely drive to <span className="text-gradient-gold">memorable journey</span></h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-brand-gray-light shadow-xl">
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
              <div className="bg-brand-dark p-10 md:p-14 h-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"><AuroraBackground intensity="high" /></div>
                <div className="relative z-10">
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
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS — Interactive Carousel ══════════ */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <AuroraBackground intensity="low" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-brand-accent text-sm font-display font-bold uppercase tracking-widest mb-4">Testimonials</p>
                <h2 className="font-display text-display-md text-white">Real stories from <span className="text-gradient-gold">the road</span></h2>
              </div>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)}
                    className={`w-10 h-1.5 rounded-full transition-all duration-500 ${i === activeTestimonial ? 'bg-brand-accent w-16' : 'bg-white/15 hover:bg-white/30'}`} />
                ))}
              </div>
            </div>
          </RevealSection>

          <div className="relative min-h-[280px]">
            {testimonials.map((t, i) => (
              <div key={i} className={`transition-all duration-700 ${i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'}`}>
                <div className="glass rounded-3xl p-10 md:p-14 border border-white/10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (<Star key={j} className="h-5 w-5 fill-brand-accent text-brand-accent" />))}
                  </div>
                  <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">"{t.message || t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-accent to-amber-600 rounded-full flex items-center justify-center text-white font-display font-bold text-xl uppercase">{t.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-display font-bold text-white text-lg">{t.name}</h4>
                      <p className="text-sm text-white/40 flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.route || 'Kindlift User'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════════ */}
      <section className="section-dark py-24 md:py-32 relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-white/40 text-sm font-display font-bold uppercase tracking-widest mb-4">Our Services</p>
              <h2 className="font-display text-display-md text-white max-w-3xl mx-auto">Everything you need for a <span className="text-gradient-gold">shared journey</span></h2>
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
                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 md:py-10 border-b border-white/10 hover:px-6 hover:bg-white/[0.02] transition-all duration-500 rounded-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-dark group-hover:shadow-glow transition-all duration-500">{service.icon}</div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-brand-accent transition-colors duration-300">{service.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-white/40 text-sm max-w-sm md:text-right">{service.desc}</p>
                    <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300 hidden md:block" />
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE CTA ═════════════════════ */}
      <section className="section-light py-6 border-y border-brand-gray-light">
        <MarqueeText text="Find your ride buddy" separator="→" reverse className="font-display text-xl md:text-2xl font-bold text-brand-dark/5" />
      </section>

      {/* ═══════════════ FOOTER ═══════════════════════════ */}
      <Footer />
    </div>
  );
};