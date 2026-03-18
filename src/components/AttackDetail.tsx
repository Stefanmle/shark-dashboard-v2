import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Skull, Fish, Activity, User, Clock, Loader2 } from 'lucide-react';
import { SharkAttack, AttackDetail as AttackDetailType } from '../types';
import { fetchAttackDetail } from '../data/api';

interface AttackDetailProps {
  attack: SharkAttack;
  onClose: () => void;
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value || value === 'Unknown' || value === '') return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={14} className="text-shark-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-xs text-shark-400 uppercase tracking-wider">{label}</div>
        <div className="text-sm text-shark-100">{value}</div>
      </div>
    </div>
  );
}

export function AttackDetail({ attack, onClose }: AttackDetailProps) {
  const [detail, setDetail] = useState<AttackDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttackDetail(attack.id).then(d => {
      setDetail(d);
      setLoading(false);
    });
  }, [attack.id]);

  const locationParts = [detail?.location, detail?.area, attack.country].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-shark-900 border border-shark-700/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 ${attack.fatal ? 'bg-gradient-to-r from-danger-950/50 to-shark-900' : 'bg-gradient-to-r from-ocean-950/50 to-shark-900'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                attack.fatal
                  ? 'bg-danger-500/20 text-danger-300 border border-danger-500/30'
                  : 'bg-ocean-500/20 text-ocean-300 border border-ocean-500/30'
              }`}>
                {attack.fatal ? <Skull size={12} /> : <Fish size={12} />}
                {attack.fatal ? 'FATAL ATTACK' : 'NON-FATAL ATTACK'}
              </div>
              <h2 className="text-xl font-bold text-white">
                {loading ? attack.country : locationParts.join(', ')}
              </h2>
              <p className="text-shark-400 text-sm mt-1">
                Case #{attack.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-shark-400 hover:text-white rounded-lg hover:bg-shark-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto max-h-[50vh] divide-y divide-shark-800/50">
          <DetailRow icon={Calendar} label="Date" value={attack.date || String(attack.year)} />

          {loading ? (
            <div className="flex items-center gap-2 py-4 text-shark-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Loading details...
            </div>
          ) : detail && (
            <>
              <DetailRow icon={Clock} label="Time" value={detail.time} />
              <DetailRow icon={MapPin} label="Location" value={locationParts.join(', ')} />
            </>
          )}

          <DetailRow icon={Fish} label="Species" value={attack.species} />
          <DetailRow icon={Activity} label="Activity" value={attack.activity} />

          {detail && (
            <>
              <DetailRow icon={User} label="Victim" value={
                [detail.name, detail.sex === 'M' ? 'Male' : detail.sex === 'F' ? 'Female' : '', detail.age ? `Age ${detail.age}` : '']
                  .filter(Boolean).join(', ')
              } />

              {detail.injury && (
                <div className="py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Skull size={14} className="text-shark-400" />
                    <span className="text-xs text-shark-400 uppercase tracking-wider">Injury</span>
                  </div>
                  <p className="text-sm text-shark-200 leading-relaxed">{detail.injury}</p>
                </div>
              )}
            </>
          )}

          <div className="py-2 grid grid-cols-3 gap-3">
            <div className="bg-shark-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-shark-400 mb-1">Continent</div>
              <div className="text-sm font-medium text-shark-200">{attack.continent}</div>
            </div>
            <div className="bg-shark-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-shark-400 mb-1">Ocean</div>
              <div className="text-sm font-medium text-shark-200">{attack.ocean}</div>
            </div>
            <div className="bg-shark-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-shark-400 mb-1">Type</div>
              <div className="text-sm font-medium text-shark-200">{attack.type}</div>
            </div>
          </div>

          <div className="py-2 text-center">
            <div className="text-xs text-shark-500">
              Coordinates: {attack.lat.toFixed(3)}, {attack.lng.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
