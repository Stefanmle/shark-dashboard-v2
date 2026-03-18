import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { ChevronDown, ChevronUp, BarChart3, X } from 'lucide-react';
import { StatsData } from '../types';

interface StatsPanelProps {
  stats: StatsData;
  onClose: () => void;
}

const COLORS = [
  '#14b8a6', '#0c8ce9', '#f43f5e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#10b981', '#ef4444', '#3b82f6', '#a855f7', '#22d3ee',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-shark-800 border border-shark-600/50 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-shark-200 text-xs font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className={`bg-shark-800/40 border border-shark-700/30 rounded-xl p-3 ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-shark-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </div>
  );
}

type ChartTab = 'timeline' | 'species' | 'countries' | 'activities' | 'oceans' | 'months';

export function StatsPanel({ stats, onClose }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('timeline');

  const tabs: { id: ChartTab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'species', label: 'Species' },
    { id: 'countries', label: 'Countries' },
    { id: 'activities', label: 'Activities' },
    { id: 'oceans', label: 'Oceans' },
    { id: 'months', label: 'Months' },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[1000] w-[480px] bg-shark-900/95 backdrop-blur-xl border border-shark-700/30 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-shark-700/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 size={14} />
            Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-shark-400 hover:text-white rounded-lg hover:bg-shark-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Total" value={stats.total} icon="🦈" color="text-ocean-400" />
          <StatCard label="Fatal" value={stats.fatal} icon="💀" color="text-danger-400" />
          <StatCard label="Countries" value={stats.countriesAffected} icon="🌍" color="text-shark-200" />
        </div>
      </div>

      {/* Chart tabs */}
      <div className="border-b border-shark-700/30 px-4 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-ocean-400 border-ocean-400'
                : 'text-shark-400 border-transparent hover:text-shark-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart content */}
      <div className="p-4 h-56">
        {activeTab === 'timeline' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.byDecade}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFatal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="decade" tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Total" stroke="#14b8a6" fill="url(#colorCount)" strokeWidth={2} />
              <Area type="monotone" dataKey="fatal" name="Fatal" stroke="#f43f5e" fill="url(#colorFatal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'species' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.bySpecies.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#b9dffd' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Attacks" radius={[0, 4, 4, 0]}>
                {stats.bySpecies.slice(0, 10).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'countries' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byCountry.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#b9dffd' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Attacks" radius={[0, 4, 4, 0]}>
                {stats.byCountry.slice(0, 10).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'activities' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byActivity.slice(0, 10)} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#b9dffd' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Attacks" radius={[0, 4, 4, 0]}>
                {stats.byActivity.slice(0, 10).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'oceans' && (
          <div className="flex items-center h-full gap-4">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byOcean}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="count"
                  nameKey="name"
                  strokeWidth={2}
                  stroke="#071f3b"
                >
                  {stats.byOcean.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {stats.byOcean.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-shark-300 truncate">{item.name}</span>
                  <span className="text-shark-400 ml-auto">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'months' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byMonth}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7cc5fc' }} tickLine={false} axisLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Attacks" radius={[4, 4, 0, 0]}>
                {stats.byMonth.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
