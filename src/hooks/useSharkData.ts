import { useState, useEffect, useMemo, useCallback } from 'react';
import { SharkAttack, Filters, StatsData } from '../types';
import { fetchAllAttacks } from '../data/api';

const defaultFilters: Filters = {
  yearRange: [1900, 2026],
  countries: [],
  continents: [],
  oceans: [],
  species: [],
  activities: [],
  types: [],
  fatalOnly: false,
  nonFatalOnly: false,
  search: '',
};

export function useSharkData() {
  const [allAttacks, setAllAttacks] = useState<SharkAttack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    let cancelled = false;

    fetchAllAttacks((loaded, total) => {
      if (!cancelled) setProgress({ loaded, total });
    })
      .then(data => {
        if (!cancelled) {
          setAllAttacks(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const filteredAttacks = useMemo(() => {
    return allAttacks.filter(attack => {
      if (attack.year < filters.yearRange[0] || attack.year > filters.yearRange[1]) return false;
      if (filters.countries.length > 0 && !filters.countries.includes(attack.country)) return false;
      if (filters.continents.length > 0 && !filters.continents.includes(attack.continent)) return false;
      if (filters.oceans.length > 0 && !filters.oceans.includes(attack.ocean)) return false;
      if (filters.species.length > 0 && !filters.species.includes(attack.species)) return false;
      if (filters.activities.length > 0 && !filters.activities.includes(attack.activity)) return false;
      if (filters.types.length > 0 && !filters.types.includes(attack.type)) return false;
      if (filters.fatalOnly && !attack.fatal) return false;
      if (filters.nonFatalOnly && attack.fatal) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          attack.country.toLowerCase().includes(q) ||
          attack.species.toLowerCase().includes(q) ||
          attack.activity.toLowerCase().includes(q) ||
          attack.continent.toLowerCase().includes(q) ||
          attack.ocean.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allAttacks, filters]);

  const stats: StatsData = useMemo(() => {
    const attacks = filteredAttacks;
    const fatal = attacks.filter(a => a.fatal).length;

    // By decade
    const decadeMap = new Map<string, { count: number; fatal: number }>();
    for (const a of attacks) {
      const decade = `${Math.floor(a.year / 10) * 10}s`;
      const existing = decadeMap.get(decade) || { count: 0, fatal: 0 };
      existing.count++;
      if (a.fatal) existing.fatal++;
      decadeMap.set(decade, existing);
    }
    const byDecade = Array.from(decadeMap.entries())
      .map(([decade, data]) => ({ decade, ...data }))
      .sort((a, b) => a.decade.localeCompare(b.decade));

    // Generic top-N counter
    function topN(key: keyof SharkAttack, n: number) {
      const map = new Map<string, number>();
      for (const a of attacks) {
        const val = String(a[key] || 'Unknown');
        map.set(val, (map.get(val) || 0) + 1);
      }
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
    }

    // By month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap = new Map<number, number>();
    for (const a of attacks) {
      if (a.date) {
        const parts = a.date.split(/[-/]/);
        let month = -1;
        for (const p of parts) {
          const n = parseInt(p);
          if (n >= 1 && n <= 12 && p.length <= 2) { month = n - 1; break; }
        }
        if (month >= 0) {
          monthMap.set(month, (monthMap.get(month) || 0) + 1);
        }
      }
    }
    const byMonth = monthNames.map((name, i) => ({ name, count: monthMap.get(i) || 0 }));

    return {
      total: attacks.length,
      fatal,
      nonFatal: attacks.length - fatal,
      countriesAffected: new Set(attacks.map(a => a.country)).size,
      speciesIdentified: new Set(attacks.filter(a => a.species !== 'Unknown' && a.species !== 'Unconfirmed').map(a => a.species)).size,
      byDecade,
      byCountry: topN('country', 20),
      bySpecies: topN('species', 20),
      byActivity: topN('activity', 15),
      byContinent: topN('continent', 10),
      byOcean: topN('ocean', 10),
      byType: topN('type', 10),
      byMonth,
    };
  }, [filteredAttacks]);

  // All unique values for filter dropdowns
  const filterOptions = useMemo(() => ({
    countries: [...new Set(allAttacks.map(a => a.country))].sort(),
    continents: [...new Set(allAttacks.map(a => a.continent))].filter(c => c !== 'Unknown').sort(),
    oceans: [...new Set(allAttacks.map(a => a.ocean))].filter(o => o !== 'Unknown').sort(),
    species: [...new Set(allAttacks.map(a => a.species))].filter(s => s !== 'Unknown').sort(),
    activities: [...new Set(allAttacks.map(a => a.activity))].filter(a => a !== 'Unknown').sort(),
    types: [...new Set(allAttacks.map(a => a.type))].filter(t => t !== '' && t !== 'Invalid').sort(),
    yearRange: [
      Math.min(...allAttacks.map(a => a.year), 1900),
      Math.max(...allAttacks.map(a => a.year), 2025),
    ] as [number, number],
  }), [allAttacks]);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  return {
    allAttacks,
    filteredAttacks,
    loading,
    error,
    progress,
    filters,
    setFilters,
    resetFilters,
    stats,
    filterOptions,
  };
}
