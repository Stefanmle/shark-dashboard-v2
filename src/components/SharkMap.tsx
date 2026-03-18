import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { SharkAttack } from '../types';

interface SharkMapProps {
  attacks: SharkAttack[];
  onSelectAttack: (attack: SharkAttack) => void;
}

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createMarkerIcon(fatal: boolean): L.DivIcon {
  const color = fatal ? '#f43f5e' : '#14b8a6';
  const shadow = fatal ? 'rgba(244,63,94,0.4)' : 'rgba(20,184,166,0.3)';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px; height: 12px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px ${shadow}, 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

export function SharkMap({ attacks, onSelectAttack }: SharkMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
      scrollWheelZoom: false,
    });

    // Dark ocean tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when attacks change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing cluster layer
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    // Create new cluster group
    const cluster = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      disableClusteringAtZoom: 12,
      iconCreateFunction: (clusterObj: any) => {
        const count = clusterObj.getChildCount();
        let size = 'small';
        let dim = 36;
        if (count > 100) { size = 'large'; dim = 48; }
        else if (count > 20) { size = 'medium'; dim = 42; }

        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(dim, dim),
        });
      },
    });

    // Add markers
    const markers: L.Marker[] = [];
    for (const attack of attacks) {
      if (!attack.lat || !attack.lng) continue;

      const marker = L.marker([attack.lat, attack.lng], {
        icon: createMarkerIcon(attack.fatal),
      });

      marker.bindPopup(() => {
        const div = document.createElement('div');
        div.className = 'shark-popup';
        div.innerHTML = `
          <div style="min-width: 200px">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px; color: ${attack.fatal ? '#fb7185' : '#5eead4'}">
              ${attack.fatal ? '💀 Fatal' : '🦈 Non-fatal'} Attack
            </div>
            <div style="font-size: 12px; opacity: 0.8; margin-bottom: 8px">${attack.date || attack.year}</div>
            <div style="font-size: 13px; line-height: 1.6">
              <div><strong>Location:</strong> ${attack.country}</div>
              ${attack.species && attack.species !== 'Unknown' ? `<div><strong>Species:</strong> ${attack.species}</div>` : ''}
              ${attack.activity && attack.activity !== 'Unknown' ? `<div><strong>Activity:</strong> ${attack.activity}</div>` : ''}
            </div>
            <button onclick="window.__selectAttack && window.__selectAttack('${attack.id}')"
              style="margin-top: 8px; background: rgba(12,140,233,0.2); border: 1px solid rgba(12,140,233,0.3); color: #7cc5fc; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%">
              View Full Details
            </button>
          </div>
        `;
        return div;
      }, { maxWidth: 300 });

      markers.push(marker);
    }

    cluster.addLayers(markers);
    map.addLayer(cluster);
    clusterRef.current = cluster;

    // Setup global callback for popup buttons
    (window as any).__selectAttack = (id: string) => {
      const attack = attacks.find(a => a.id === id);
      if (attack) onSelectAttack(attack);
    };

    return () => {
      delete (window as any).__selectAttack;
    };
  }, [attacks, onSelectAttack]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
