import React from 'react';

export const Loader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-dark overflow-hidden">
    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* Ambient glow */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(232,168,56,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
      }}
    />

    <div className="relative z-10 flex flex-col items-center">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 bg-brand-accent rounded-xl flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <span className="font-display font-bold text-2xl text-white tracking-tight">Kindlift</span>
      </div>

      {/* Road + Car Animation */}
      <div className="relative w-72 sm:w-80 h-16 mb-6">
        {/* Road */}
        <div className="absolute bottom-2 left-0 right-0 h-[3px] bg-white/10 rounded-full overflow-hidden">
          {/* Road dashes */}
          <div className="road-dashes absolute inset-0" />
          {/* Progress line */}
          <div className="car-trail absolute left-0 top-0 bottom-0 rounded-full" />
        </div>

        {/* Start dot */}
        <div className="absolute bottom-[5px] left-0 w-2 h-2 rounded-full bg-brand-accent/40" />

        {/* End dot */}
        <div className="absolute bottom-[5px] right-0 w-2 h-2 rounded-full bg-white/20" />

        {/* Car Icon driving across */}
        <div className="car-drive absolute bottom-1">
          <div className="relative">
            {/* Exhaust puffs */}
            <div className="exhaust-puff absolute -left-3 top-1/2 -translate-y-1/2" />
            <div className="exhaust-puff-2 absolute -left-5 top-1/2 -translate-y-1/2" />
            
            {/* Car shadow */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-brand-accent/20"
              style={{ filter: 'blur(3px)' }}
            />
            
            {/* Car body */}
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(232,168,56,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <p className="text-white/30 text-xs font-display font-bold uppercase tracking-[0.3em]">
        Getting your ride ready...
      </p>
    </div>

    {/* Inline keyframes */}
    <style>{`
      .car-drive {
        animation: carDrive 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      @keyframes carDrive {
        0%   { left: -10px; opacity: 0; }
        8%   { opacity: 1; }
        50%  { left: calc(50% - 20px); }
        92%  { opacity: 1; }
        100% { left: calc(100% - 30px); opacity: 0; }
      }

      .car-trail {
        background: linear-gradient(90deg, transparent, rgba(232,168,56,0.5));
        animation: trailGrow 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      @keyframes trailGrow {
        0%   { width: 0%; opacity: 0; }
        10%  { opacity: 1; }
        50%  { width: 52%; }
        100% { width: 100%; opacity: 0; }
      }

      .road-dashes {
        background: repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.15) 0px,
          rgba(255,255,255,0.15) 8px,
          transparent 8px,
          transparent 20px
        );
        animation: dashScroll 0.8s linear infinite;
      }
      @keyframes dashScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-20px); }
      }

      .exhaust-puff {
        width: 4px; height: 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        animation: puff 0.6s ease-out infinite;
      }
      .exhaust-puff-2 {
        width: 3px; height: 3px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        animation: puff 0.6s ease-out 0.3s infinite;
      }
      @keyframes puff {
        0%   { opacity: 0.6; transform: translateY(-50%) scale(1); }
        100% { opacity: 0; transform: translateY(-50%) scale(2.5) translateX(-8px); }
      }
    `}</style>
  </div>
);
