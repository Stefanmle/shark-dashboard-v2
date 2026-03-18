import React, { useState, useCallback, Suspense, lazy } from 'react';
import { SharkMap } from './components/SharkMap';
import { FiltersPanel } from './components/Filters';
import { BarChart3 } from 'lucide-react';
const StatsPanel = lazy(() => import('./components/StatsPanel').then(m => ({ default: m.StatsPanel })));
import { AttackDetail } from './components/AttackDetail';
import { Loading } from './components/Loading';
import { LandingContent } from './components/LandingContent';
import { useSharkData } from './hooks/useSharkData';
import { SharkAttack } from './types';

function Header({ total, fatal, species }: { total: number; fatal: number; species: number }) {
  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
      <div className="bg-shark-900/80 backdrop-blur-xl border border-shark-700/30 rounded-2xl px-6 py-3 shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦈</span>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                Global Shark Attack Dashboard
              </h1>
              <p className="text-xs text-shark-400">
                Every recorded shark attack worldwide — GSAF Database
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-shark-700/50">
            <div className="text-center">
              <div className="text-lg font-bold text-ocean-400">{total.toLocaleString()}</div>
              <div className="text-[10px] text-shark-400 uppercase tracking-wider">Attacks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-danger-400">{fatal.toLocaleString()}</div>
              <div className="text-[10px] text-shark-400 uppercase tracking-wider">Fatal</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-shark-200">{species}</div>
              <div className="text-[10px] text-shark-400 uppercase tracking-wider">Species</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-shark-900/80 backdrop-blur border border-shark-700/30 rounded-xl px-4 py-3 shadow-xl">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-danger-500 border-2 border-white shadow" />
          <span className="text-shark-300">Fatal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-ocean-500 border-2 border-white shadow" />
          <span className="text-shark-300">Non-fatal</span>
        </div>
        <div className="text-shark-500">|</div>
        <div className="text-shark-400">
          Source: Global Shark Attack File (GSAF)
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    filteredAttacks,
    loading,
    error,
    progress,
    filters,
    setFilters,
    resetFilters,
    stats,
    filterOptions,
    allAttacks,
  } = useSharkData();

  const [selectedAttack, setSelectedAttack] = useState<SharkAttack | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleSelectAttack = useCallback((attack: SharkAttack) => {
    setSelectedAttack(attack);
  }, []);

  if (loading) {
    return <Loading loaded={progress.loaded} total={progress.total} />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-shark-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-white mb-2">Failed to load data</h1>
          <p className="text-shark-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-ocean-600 hover:bg-ocean-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen overflow-x-hidden">
      {/* Map viewport — first screen */}
      <div className="h-screen w-full relative overflow-hidden">
        {/* Full-screen map */}
        <SharkMap
          attacks={filteredAttacks}
          onSelectAttack={handleSelectAttack}
        />

        {/* Header */}
        <Header
          total={stats.total}
          fatal={stats.fatal}
          species={stats.speciesIdentified}
        />

        {/* Filters panel */}
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          options={filterOptions}
          totalCount={allAttacks.length}
          filteredCount={filteredAttacks.length}
        />

        {/* Stats panel (lazy loaded on demand) */}
        {showStats ? (
          <Suspense fallback={null}>
            <StatsPanel stats={stats} onClose={() => setShowStats(false)} />
          </Suspense>
        ) : (
          <button
            onClick={() => setShowStats(true)}
            className="absolute bottom-4 right-4 z-[1000] bg-shark-900/90 backdrop-blur border border-shark-700/50 rounded-xl px-4 py-3 shadow-xl hover:bg-shark-800/90 transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <BarChart3 size={16} />
              <span className="text-sm font-medium">Statistics</span>
            </div>
          </button>
        )}

        {/* Legend */}
        <Legend />

        {/* Attack detail modal */}
        {selectedAttack && (
          <AttackDetail
            attack={selectedAttack}
            onClose={() => setSelectedAttack(null)}
          />
        )}
      </div>

      {/* SEO landing content — below the fold */}
      <LandingContent />
    </div>
  );
}
