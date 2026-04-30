import React, { useEffect, useRef } from 'react';

/**
 * AuroraBackground — Animated aurora-gradient mesh background
 * Uses CSS animations for a flowing, premium aurora effect
 */
export const AuroraBackground = ({ className = '', intensity = 'medium' }) => {
  const opacityMap = { low: 0.15, medium: 0.25, high: 0.4 };
  const opacity = opacityMap[intensity] || 0.25;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Blob 1 — Gold */}
      <div
        className="aurora-blob-1 absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          background: `radial-gradient(circle, rgba(232,168,56,${opacity}) 0%, transparent 70%)`,
          filter: 'blur(80px)',
          top: '-10%',
          right: '-10%',
        }}
      />
      {/* Blob 2 — Amber warm */}
      <div
        className="aurora-blob-2 absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background: `radial-gradient(circle, rgba(212,150,46,${opacity * 0.8}) 0%, transparent 70%)`,
          filter: 'blur(100px)',
          bottom: '-15%',
          left: '-5%',
        }}
      />
      {/* Blob 3 — White/Silver accent */}
      <div
        className="aurora-blob-3 absolute rounded-full"
        style={{
          width: '35vw',
          height: '35vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: `radial-gradient(circle, rgba(255,255,255,${opacity * 0.4}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          top: '40%',
          left: '30%',
        }}
      />
    </div>
  );
};

/**
 * GradientOrb — A single animated floating gradient orb
 */
export const GradientOrb = ({ 
  size = '300px', 
  color = 'rgba(232,168,56,0.15)', 
  position = { top: '50%', left: '50%' },
  blur = '80px',
  animationDelay = '0s',
  className = ''
}) => (
  <div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur})`,
      ...position,
      animation: `orbFloat 8s ease-in-out infinite`,
      animationDelay,
    }}
  />
);

/**
 * AnimatedGridPattern — Subtle moving grid background
 */
export const AnimatedGridPattern = ({ className = '' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(rgba(232,168,56,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(232,168,56,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      animation: 'gridSlide 20s linear infinite',
    }}
  />
);
