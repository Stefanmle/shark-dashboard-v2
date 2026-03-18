import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, RotateCcw, Filter } from 'lucide-react';
import { Filters as FiltersType } from '../types';

interface FiltersProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  resetFilters: () => void;
  options: {
    countries: string[];
    continents: string[];
    oceans: string[];
    species: string[];
    activities: string[];
    types: string[];
    yearRange: [number, number];
  };
  totalCount: number;
  filteredCount: number;
}

interface MultiSelectProps {
  label: string;
  icon: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelect({ label, icon, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-shark-800/50 hover:bg-shark-800 rounded-lg transition-colors text-sm"
      >
        <span className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-shark-200">{label}</span>
          {selected.length > 0 && (
            <span className="bg-ocean-500/20 text-ocean-300 px-2 py-0.5 rounded-full text-xs font-medium">
              {selected.length}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={14} className="text-shark-400" /> : <ChevronDown size={14} className="text-shark-400" />}
      </button>

      {open && (
        <div className="mt-1 bg-shark-900/90 border border-shark-700/50 rounded-lg overflow-hidden animate-fade-in">
          {options.length > 8 && (
            <div className="p-2 border-b border-shark-700/50">
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-shark-800 text-white text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-ocean-500/50 placeholder-shark-500"
              />
            </div>
          )}
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.slice(0, 50).map(option => (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1 hover:bg-shark-800/50 rounded cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={e => {
                    if (e.target.checked) {
                      onChange([...selected, option]);
                    } else {
                      onChange(selected.filter(s => s !== option));
                    }
                  }}
                  className="rounded border-shark-600 bg-shark-800 text-ocean-500 focus:ring-ocean-500/50 w-3 h-3"
                />
                <span className="text-shark-200 truncate">{option}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="text-shark-500 text-xs px-2 py-1">No matches</p>
            )}
          </div>
          {selected.length > 0 && (
            <div className="p-1 border-t border-shark-700/50">
              <button
                onClick={() => onChange([])}
                className="w-full text-xs text-danger-400 hover:text-danger-300 py-1"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FiltersPanel({ filters, setFilters, resetFilters, options, totalCount, filteredCount }: FiltersProps) {
  const [collapsed, setCollapsed] = useState(false);
  const hasActiveFilters = filters.countries.length > 0 || filters.continents.length > 0 ||
    filters.oceans.length > 0 || filters.species.length > 0 || filters.activities.length > 0 ||
    filters.types.length > 0 || filters.fatalOnly || filters.nonFatalOnly || filters.search ||
    filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2025;

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-4 left-4 z-[1000] bg-shark-900/90 backdrop-blur border border-shark-700/50 rounded-xl px-4 py-3 shadow-xl hover:bg-shark-800/90 transition-colors"
      >
        <div className="flex items-center gap-2 text-white">
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-ocean-400 rounded-full" />
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-[1000] w-72 max-h-[calc(100vh-120px)] bg-shark-900/95 backdrop-blur-xl border border-shark-700/30 rounded-xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-shark-700/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Filter size={14} />
            Filters
          </h2>
          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-1.5 text-shark-400 hover:text-danger-400 rounded-lg hover:bg-shark-800 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 text-shark-400 hover:text-white rounded-lg hover:bg-shark-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-shark-400" />
          <input
            type="text"
            placeholder="Search locations, species..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full bg-shark-800/50 text-white text-sm rounded-lg pl-8 pr-3 py-2 outline-none focus:ring-1 focus:ring-ocean-500/50 placeholder-shark-500 border border-shark-700/30"
          />
        </div>

        {/* Result count */}
        <div className="mt-2 text-xs text-shark-400">
          Showing <span className="text-ocean-400 font-medium">{filteredCount.toLocaleString()}</span> of {totalCount.toLocaleString()} attacks
        </div>
      </div>

      {/* Filter sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Year range */}
        <div className="mb-4">
          <label className="text-xs font-medium text-shark-300 block mb-2">
            📅 Year Range: {filters.yearRange[0]} — {filters.yearRange[1]}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1580}
              max={2026}
              value={filters.yearRange[0]}
              onChange={e => setFilters(f => ({ ...f, yearRange: [parseInt(e.target.value), f.yearRange[1]] }))}
              className="flex-1 accent-ocean-500 h-1.5"
            />
            <input
              type="range"
              min={1580}
              max={2026}
              value={filters.yearRange[1]}
              onChange={e => setFilters(f => ({ ...f, yearRange: [f.yearRange[0], parseInt(e.target.value)] }))}
              className="flex-1 accent-ocean-500 h-1.5"
            />
          </div>
        </div>

        {/* Fatal / Non-fatal toggles */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilters(f => ({ ...f, fatalOnly: !f.fatalOnly, nonFatalOnly: false }))}
            className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
              filters.fatalOnly
                ? 'bg-danger-500/20 border-danger-500/40 text-danger-300'
                : 'bg-shark-800/50 border-shark-700/30 text-shark-400 hover:text-shark-200'
            }`}
          >
            💀 Fatal Only
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, nonFatalOnly: !f.nonFatalOnly, fatalOnly: false }))}
            className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
              filters.nonFatalOnly
                ? 'bg-ocean-500/20 border-ocean-500/40 text-ocean-300'
                : 'bg-shark-800/50 border-shark-700/30 text-shark-400 hover:text-shark-200'
            }`}
          >
            🦈 Non-fatal
          </button>
        </div>

        <MultiSelect
          label="Continent"
          icon="🌍"
          options={options.continents}
          selected={filters.continents}
          onChange={v => setFilters(f => ({ ...f, continents: v }))}
        />

        <MultiSelect
          label="Ocean"
          icon="🌊"
          options={options.oceans}
          selected={filters.oceans}
          onChange={v => setFilters(f => ({ ...f, oceans: v }))}
        />

        <MultiSelect
          label="Country"
          icon="🏴"
          options={options.countries}
          selected={filters.countries}
          onChange={v => setFilters(f => ({ ...f, countries: v }))}
        />

        <MultiSelect
          label="Species"
          icon="🦷"
          options={options.species}
          selected={filters.species}
          onChange={v => setFilters(f => ({ ...f, species: v }))}
        />

        <MultiSelect
          label="Activity"
          icon="🏄"
          options={options.activities}
          selected={filters.activities}
          onChange={v => setFilters(f => ({ ...f, activities: v }))}
        />

        <MultiSelect
          label="Attack Type"
          icon="⚡"
          options={options.types}
          selected={filters.types}
          onChange={v => setFilters(f => ({ ...f, types: v }))}
        />
      </div>
    </div>
  );
}
