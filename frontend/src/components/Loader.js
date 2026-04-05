import React from 'react';

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-brand-cream z-50 flex flex-col items-center justify-center">
      <div className="loader-spinner mb-6"></div>
      <h2 className="text-lg font-semibold text-brand-dark tracking-tight">
        Loading your journey...
      </h2>
      <p className="text-sm text-brand-muted mt-1">Hang tight</p>
    </div>
  );
};
