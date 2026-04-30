import React from 'react';

/**
 * Shimmer overlay — gives each skeleton block an animated light sweep
 * instead of the basic Tailwind pulse.
 */
const Shimmer = () => (
  <div className="skeleton-shimmer" />
);

/**
 * SkeletonBlock — a single rounded placeholder with shimmer effect.
 * @param {string} className — Tailwind sizing / rounding
 */
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-bone ${className}`}>
    <Shimmer />
  </div>
);

/**
 * SkeletonLoader — Renders realistic content placeholders
 * with a premium shimmer sweep animation.
 *
 * Types:
 *  - card       → Default dashboard-style content card
 *  - profile    → Avatar + name/subtitle row
 *  - text       → Multi-line paragraph placeholder
 *  - dashboard  → Full desktop dashboard skeleton (stats + cards + tabs)
 *  - table      → Data table skeleton (header + rows)
 *  - history    → Ride history card skeleton
 */
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {

      /* ─── Profile Row ─────────────────────────────────── */
      case 'profile':
        return (
          <div className="flex items-center gap-4 w-full p-4">
            <SkeletonBlock className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-4 rounded-full w-1/3" />
              <SkeletonBlock className="h-3 rounded-full w-1/2" />
            </div>
          </div>
        );

      /* ─── Text Lines ──────────────────────────────────── */
      case 'text':
        return (
          <div className="space-y-3 w-full p-4">
            <SkeletonBlock className="h-4 rounded-full w-3/4" />
            <SkeletonBlock className="h-4 rounded-full w-full" />
            <SkeletonBlock className="h-4 rounded-full w-5/6" />
            <SkeletonBlock className="h-4 rounded-full w-2/3" />
          </div>
        );

      /* ─── Full Dashboard Skeleton (Desktop-ready) ────── */
      case 'dashboard':
        return (
          <div className="w-full space-y-8 animate-fade-in">
            {/* Header row — avatar + greeting */}
            <div className="flex items-center gap-4">
              <SkeletonBlock className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-6 rounded-lg w-64 max-w-full" />
                <SkeletonBlock className="h-3 rounded-full w-48 max-w-full" />
              </div>
              <div className="hidden md:flex gap-2">
                <SkeletonBlock className="h-10 w-28 rounded-full" />
                <SkeletonBlock className="h-10 w-28 rounded-full" />
              </div>
            </div>

            {/* Stats grid — 4 cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                  <SkeletonBlock className="h-10 w-10 rounded-xl" />
                  <SkeletonBlock className="h-7 rounded-lg w-16" />
                  <SkeletonBlock className="h-3 rounded-full w-24" />
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-100">
              {[96, 112, 96, 112].map((w, i) => (
                <div key={i} className="px-6 py-3">
                  <SkeletonBlock className={`h-4 rounded-full`} style={{ width: w }} />
                </div>
              ))}
            </div>

            {/* Quick action cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 p-6 space-y-4" style={{
                  background: i === 0 ? 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)'
                    : i === 1 ? 'linear-gradient(135deg, #fff8eb 0%, #fff3d6 100%)'
                    : '#fff',
                }}>
                  <SkeletonBlock className="h-8 w-8 rounded-lg" />
                  <SkeletonBlock className="h-5 rounded-lg w-32" />
                  <SkeletonBlock className="h-3 rounded-full w-48" />
                  <SkeletonBlock className="h-4 w-4 rounded-md mt-2" />
                </div>
              ))}
            </div>

            {/* Two-column activity summary */}
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, col) => (
                <div key={col} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <SkeletonBlock className="h-5 rounded-lg w-40" />
                  {[...Array(3)].map((_, row) => (
                    <div key={row} className="flex items-center justify-between p-3 rounded-xl">
                      <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-3.5 rounded-full w-3/4" />
                        <SkeletonBlock className="h-2.5 rounded-full w-1/2" />
                      </div>
                      <SkeletonBlock className="h-6 w-16 rounded-full flex-shrink-0 ml-4" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      /* ─── Data Table Skeleton ─────────────────────────── */
      case 'table':
        return (
          <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              {[80, 120, 100, 80, 60].map((w, i) => (
                <SkeletonBlock key={i} className="h-3.5 rounded-full" style={{ width: w }} />
              ))}
            </div>
            {/* Table rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
                <SkeletonBlock className="h-8 w-8 rounded-lg flex-shrink-0" />
                <SkeletonBlock className="h-3.5 rounded-full flex-1 max-w-[120px]" />
                <SkeletonBlock className="h-3 rounded-full flex-1 max-w-[100px]" />
                <SkeletonBlock className="h-3 rounded-full w-16" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        );

      /* ─── Ride History Card Skeleton ───────────────────── */
      case 'history':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Status + date header */}
              <div className="flex justify-between items-center">
                <SkeletonBlock className="h-6 w-24 rounded-full" />
                <SkeletonBlock className="h-4 w-32 rounded-full" />
              </div>
              {/* Route dots */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
                  <SkeletonBlock className="h-3.5 rounded-full w-3/4" />
                </div>
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
                  <SkeletonBlock className="h-3.5 rounded-full w-2/3" />
                </div>
              </div>
              {/* Driver info */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <SkeletonBlock className="w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <SkeletonBlock className="h-3.5 rounded-full w-28" />
                  <SkeletonBlock className="h-2.5 rounded-full w-20" />
                </div>
                <SkeletonBlock className="h-5 w-16 rounded-full flex-shrink-0" />
              </div>
            </div>
          </div>
        );

      /* ─── Default Card ────────────────────────────────── */
      case 'card':
      default:
        return (
          <div className="p-5 rounded-2xl border border-gray-100 bg-white/50 w-full">
            <div className="flex items-center gap-4 mb-4">
              <SkeletonBlock className="w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 rounded-full w-1/2" />
                <SkeletonBlock className="h-3 rounded-full w-1/3" />
              </div>
            </div>
            <div className="space-y-3">
              <SkeletonBlock className="h-3 rounded-full w-full" />
              <SkeletonBlock className="h-3 rounded-full w-4/5" />
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
              <SkeletonBlock className="h-8 w-1/4 rounded-lg" />
              <SkeletonBlock className="h-8 w-1/4 rounded-lg" />
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
