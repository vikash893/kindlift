import React from 'react';

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-blue-50 z-50 flex flex-col items-center justify-center">
      <div className="relative w-64 h-32 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-gray-300 rounded"></div>
        <div className="absolute bottom-1 w-12 h-1 bg-blue-500 rounded fast-wind"></div>
        <div className="absolute bottom-4 w-8 h-1 bg-blue-400 rounded fast-wind-delayed"></div>
        <div className="absolute bottom-8 w-16 h-1 bg-blue-300 rounded fast-wind"></div>
        <div className="bike-loader text-6xl absolute z-10 bottom-0 filter drop-shadow-md">
          🛵
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
        Loading your journey...
      </h2>
    </div>
  );
};
