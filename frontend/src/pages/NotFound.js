import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPin } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen section-dark flex items-center justify-center overflow-hidden"
    >
      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />

      {/* Animated background orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(232,168,56,0.4), transparent 70%)',
          left: `calc(30% + ${mousePos.x * 30}px)`,
          top: `calc(20% + ${mousePos.y * 30}px)`,
          transition: 'left 0.8s ease-out, top 0.8s ease-out',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)',
          right: `calc(20% + ${mousePos.x * -20}px)`,
          bottom: `calc(30% + ${mousePos.y * -20}px)`,
          transition: 'right 0.8s ease-out, bottom 0.8s ease-out',
          filter: 'blur(80px)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 mega text */}
        <div className="relative mb-8">
          <h1
            className="font-display font-bold text-[10rem] md:text-[14rem] leading-none select-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            404
          </h1>

          {/* Floating pin icon */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
              transition: 'transform 0.6s ease-out',
              opacity: mounted ? 1 : 0,
              transitionDelay: mounted ? '0.3s' : '0s',
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(232,168,56,0.15)',
                border: '1px solid rgba(232,168,56,0.3)',
                boxShadow: '0 0 60px rgba(232,168,56,0.2)',
              }}
            >
              <MapPin className="h-10 w-10 text-brand-accent" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2
          className="font-display text-display-sm text-white mb-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.2s',
          }}
        >
          Route not found
        </h2>

        {/* Description */}
        <p
          className="text-white/40 text-lg mb-12 max-w-md mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.35s',
          }}
        >
          Looks like you've taken a wrong turn. This page doesn't exist on the Kindlift map.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.5s',
          }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark font-display font-bold text-base rounded-full hover:bg-white transition-all duration-500"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-display font-bold text-base rounded-full hover:bg-white/10 transition-all duration-500"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div
          className="mt-16 pt-10 border-t border-white/5"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease',
            transitionDelay: '0.7s',
          }}
        >
          <p className="text-white/20 text-sm font-display font-bold uppercase tracking-widest mb-6">
            Popular destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { to: '/book-ride', label: 'Book a Ride' },
              { to: '/offer-ride', label: 'Offer a Ride' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '/faqs', label: 'FAQs' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-5 py-2.5 rounded-full border border-white/10 text-white/40 text-sm font-medium hover:border-brand-accent/40 hover:text-brand-accent transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
    </div>
  );
};
