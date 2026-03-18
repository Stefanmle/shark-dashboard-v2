import React from 'react';

interface LoadingProps {
  loaded: number;
  total: number;
}

export function Loading({ loaded, total }: LoadingProps) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-shark-950 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated shark */}
        <div className="relative mb-8">
          <div className="text-8xl animate-bounce">
            🦈
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-ocean-400/20 loading-ring" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Shark Attack Dashboard
        </h1>
        <p className="text-shark-300 mb-6">
          Loading global shark attack data...
        </p>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="bg-shark-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-ocean-500 to-ocean-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-shark-400 text-sm mt-2">
            {loaded > 0 ? `${loaded.toLocaleString()} / ${total.toLocaleString()} records` : 'Connecting...'}
          </p>
        </div>
      </div>
    </div>
  );
}
