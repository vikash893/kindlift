import React, { useEffect, useState, useRef } from 'react';

/**
 * SmoothPageTransition — Wraps page content with a cinematic
 * entrance/exit animation using clip-path reveals
 */
export const SmoothPageTransition = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Small delay for stagger effect
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`page-transition ${isVisible ? 'page-visible' : ''} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};

/**
 * StaggeredReveal — Reveals children with staggered delays
 * Each child animates in sequentially for a premium feel
 */
export const StaggeredReveal = ({ children, className = '', staggerDelay = 0.08, threshold = 0.1 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`staggered-reveal ${className}`}>
      {React.Children.map(children, (child, i) => (
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * HorizontalScrollReveal — Element slides in from side on scroll
 */
export const HorizontalScrollReveal = ({ children, direction = 'left', className = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initialTransform = direction === 'left' ? 'translateX(-60px)' : 'translateX(60px)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : initialTransform,
        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};

/**
 * TypewriterText — Smooth typewriter effect for hero text
 */
export const TypewriterText = ({ text, className = '', speed = 40, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor" style={{
        display: 'inline-block',
        width: '3px',
        height: '1em',
        backgroundColor: '#e8a838',
        marginLeft: '2px',
        animation: 'cursorBlink 1s ease-in-out infinite',
        verticalAlign: 'text-bottom',
      }} />
    </span>
  );
};

/**
 * ScrollProgress — Shows a smooth scroll progress bar at top
 */
export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(total > 0 ? (current / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px]">
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #e8a838, #f5d78e, #e8a838)',
          boxShadow: '0 0 10px rgba(232,168,56,0.5), 0 0 30px rgba(232,168,56,0.2)',
        }}
      />
    </div>
  );
};

/**
 * CountUpOnView — A simpler inline counter that activates on viewport entry
 */
export const CountUpOnView = ({ end, suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          let startTime = null;
          const step = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(2, -10 * p);
            setCount(Math.floor(eased * end));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref} className={className}>{count.toLocaleString()}{suffix}</span>;
};
