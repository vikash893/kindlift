import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard — 3D tilt effect on hover using CSS transforms
 * Responds to mouse position with smooth perspective rotation
 * Includes inner glow that follows cursor position
 */
export const TiltCard = ({
  children,
  className = '',
  tiltAmount = 8,
  glowColor = 'rgba(232,168,56,0.15)',
  scale = 1.02,
  borderRadius = '1.5rem',
  ...props
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotateX = (0.5 - y) * tiltAmount;
    const rotateY = (x - 0.5) * tiltAmount;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, [tiltAmount, scale]);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        transform,
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        transformStyle: 'preserve-3d',
        borderRadius,
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
      {/* Inner glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 50%)`,
          borderRadius: 'inherit',
        }}
      />
    </div>
  );
};

/**
 * MorphingCard — Card with morphing border gradient on hover
 */
export const MorphingCard = ({
  children,
  className = '',
  borderWidth = 1,
  ...props
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Gradient border */}
      <div
        className="absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232,168,56,0.4), transparent 70%)`,
          borderRadius: 'inherit',
          padding: borderWidth,
        }}
      />
      <div className="relative rounded-[inherit]" style={{ borderRadius: 'inherit' }}>
        {children}
      </div>
    </div>
  );
};

/**
 * FloatingElement — Smooth floating animation
 */
export const FloatingElement = ({ children, className = '', delay = 0, duration = 6, range = 15 }) => (
  <div
    className={className}
    style={{
      animation: `floatUpDown ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {children}
    <style>{`
      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-${range}px); }
      }
    `}</style>
  </div>
);

/**
 * NumberTicker — Animated number counter with spring physics
 */
export const NumberTicker = ({ value, duration = 2000, suffix = '', prefix = '', className = '' }) => {
  const [display, setDisplay] = React.useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = null;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease-out-expo for premium feel
            const eased = 1 - Math.pow(2, -10 * progress);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};
