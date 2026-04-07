import React from 'react';

export const Loader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-dark">
    <div className="text-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl text-white">Kindlift</span>
      </div>
      <div className="loader-spinner mx-auto" />
    </div>
  </div>
);
