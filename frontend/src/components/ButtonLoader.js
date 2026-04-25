import React from 'react';

export const ButtonLoader = ({ text = 'Loading...' }) => {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      {text && <span>{text}</span>}
    </span>
  );
};
