import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'profile':
        return (
          <div className="animate-pulse flex items-center gap-4 w-full">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded-full w-1/3" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
            <div className="h-4 bg-gray-100 rounded-full w-full" />
            <div className="h-4 bg-gray-100 rounded-full w-5/6" />
          </div>
        );
      case 'card':
      default:
        return (
          <div className="animate-pulse p-5 rounded-2xl border border-gray-100 bg-white/50 w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                <div className="h-3 bg-gray-100 rounded-full w-1/3" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
              <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
              <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};
