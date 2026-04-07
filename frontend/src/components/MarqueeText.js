import React from 'react';

export const MarqueeText = ({ text, separator = ' — ', speed = 'normal', reverse = false, className = '' }) => {
  const items = Array(6).fill(text);
  const animClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  const speedDuration = speed === 'slow' ? '50s' : speed === 'fast' ? '15s' : '30s';

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`marquee-track ${animClass}`}
        style={{ animationDuration: speedDuration }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span>{item}</span>
            <span className="mx-6 opacity-30">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
