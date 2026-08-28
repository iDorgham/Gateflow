'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation,
  Shield,
} from 'lucide-react';
import type { LiveGateShiftTelemetry } from '@/lib/shifts/use-live-shifts';
import type { PatrolRouteDto, PatrolRunDto } from '@gate-access/types';

interface GuardShiftVisualMapProps {
  gates: LiveGateShiftTelemetry[];
  selectedGateId?: string | null;
  onSelectGate?: (gate: LiveGateShiftTelemetry) => void;
  patrolRoutes?: PatrolRouteDto[];
  activePatrols?: PatrolRunDto[];
  onManagePatrols?: () => void;
}

/**
 * Renders an interactive perimeter schematic for live gate telemetry and guard patrol routes.
 *
 * @param gates - Gate telemetry records to display.
 * @param selectedGateId - Identifier of the currently selected gate.
 * @param onSelectGate - Callback invoked when a gate node is selected.
 * @param patrolRoutes - Configured patrol routes with checkpoints.
 * @param activePatrols - Real-time active patrol runs.
 * @param onManagePatrols - Callback to open patrol route manager drawer.
 */
export function GuardShiftVisualMap({
  gates,
  selectedGateId,
  onSelectGate,
  patrolRoutes = [],
  activePatrols: _activePatrols = [],
  onManagePatrols,
}: GuardShiftVisualMapProps) {
  const { t } = useTranslation('dashboard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPatrols, setShowPatrols] = useState<boolean>(true);

  // Compute node positions: use coordinates if present, otherwise distribute circularly / on perimeter ring
  const nodes = useMemo(() => {
    const total = gates.length;
    if (total === 0) return [];

    const hasGeo = gates.some(
      (g) => g.latitude !== null && g.longitude !== null
    );

    if (hasGeo) {
      const validLats = gates
        .map((g) => g.latitude)
        .filter((l): l is number => l !== null);
      const validLngs = gates
        .map((g) => g.longitude)
        .filter((l): l is number => l !== null);

      const minLat = Math.min(...validLats);
      const maxLat = Math.max(...validLats);
      const minLng = Math.min(...validLngs);
      const maxLng = Math.max(...validLngs);

      const latDiff = maxLat - minLat || 0.001;
      const lngDiff = maxLng - minLng || 0.001;

      return gates.map((gate, index) => {
        let x: number;
        let y: number;

        if (gate.latitude !== null && gate.longitude !== null) {
          x = 15 + ((gate.longitude - minLng) / lngDiff) * 70;
          y = 85 - ((gate.latitude - minLat) / latDiff) * 70; // Invert lat for SVG Y axis
        } else {
          // Fallback placement along perimeter for gates missing coordinates
          const angle = (index / total) * 2 * Math.PI;
          x = 50 + 36 * Math.cos(angle);
          y = 50 + 36 * Math.sin(angle);
        }

        return { gate, x, y };
      });
    }

    // Default: distribute nodes along perimeter layout
    return gates.map((gate, index) => {
      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      const x = 50 + 36 * Math.cos(angle);
      const y = 50 + 36 * Math.sin(angle);
      return { gate, x, y };
    });
  }, [gates]);

  const getNodeColor = (status: LiveGateShiftTelemetry['status']) => {
    switch (status) {
      case 'ACTIVE':
        return {
          fill: '#10b981',
          bg: 'bg-emerald-500',
          ring: 'ring-emerald-400',
          border: 'border-emerald-600',
          text: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'OVERRUN':
        return {
          fill: '#f59e0b',
          bg: 'bg-amber-500',
          ring: 'ring-amber-400',
          border: 'border-amber-600',
          text: 'text-amber-700 dark:text-amber-300',
        };
      case 'SCHEDULED':
        return {
          fill: '#3b82f6',
          bg: 'bg-blue-500',
          ring: 'ring-blue-400',
          border: 'border-blue-600',
          text: 'text-blue-700 dark:text-blue-300',
        };
      case 'UNMANNED':
        return {
          fill: '#ef4444',
          bg: 'bg-rose-500',
          ring: 'ring-rose-400',
          border: 'border-rose-600',
          text: 'text-rose-700 dark:text-rose-300',
        };
      default:
        return {
          fill: '#94a3b8',
          bg: 'bg-slate-400',
          ring: 'ring-slate-300',
          border: 'border-slate-500',
          text: 'text-slate-600 dark:text-slate-400',
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('shifts.perimeterRadar', 'Perimeter Terminal & Patrol Radar')}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            {gates.length} {t('shifts.terminalsCount', 'Terminals')}
          </span>
          {patrolRoutes.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              {patrolRoutes.length}{' '}
              {t('shifts.patrolRoutesCount', 'Patrol Routes')}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {patrolRoutes.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPatrols((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                showPatrols
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              <Navigation className="h-3 w-3" />
              {showPatrols ? 'Hide Patrols' : 'Show Patrols'}
            </button>
          )}

          {onManagePatrols && (
            <button
              type="button"
              onClick={onManagePatrols}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
              <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Manage Routes
            </button>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-s border-slate-200 ps-2 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Workspace */}
      <div className="relative w-full h-[440px] sm:h-[480px] bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Futuristic Map Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div
          className="relative w-full h-full max-w-[700px] max-h-[460px] transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible pointer-events-none"
          >
            {/* Center Compound Radar Pulse */}
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#334155"
              strokeWidth="0.5"
              strokeDasharray="1.5 1.5"
            />
            <circle
              cx="50"
              cy="50"
              r="24"
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.4"
            />
            <circle
              cx="50"
              cy="50"
              r="10"
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.4"
            />

            {/* Perimeter Connective Polygon */}
            {nodes.length > 2 && (
              <polygon
                points={nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="rgba(56, 189, 248, 0.03)"
                stroke="rgba(56, 189, 248, 0.2)"
                strokeWidth="0.6"
                strokeDasharray="2 1"
              />
            )}

            {/* Radial Beams to Center */}
            {nodes.map((n) => (
              <line
                key={`beam-${n.gate.gateId}`}
                x1="50"
                y1="50"
                x2={n.x}
                y2={n.y}
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="0.3"
              />
            ))}

            {/* Patrol Route Polylines */}
            {showPatrols &&
              patrolRoutes.map((route) => {
                if (!route.checkpoints || route.checkpoints.length < 2)
                  return null;
                const points = route.checkpoints
                  .map((cp) => {
                    const x = cp.mapCoordinates?.x ?? 50;
                    const y = cp.mapCoordinates?.y ?? 50;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <g key={`patrol-path-${route.id}`}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  </g>
                );
              })}
          </svg>

          {/* Interactive Gate Nodes */}
          {nodes.map((n) => {
            const colors = getNodeColor(n.gate.status);
            const isSelected = selectedGateId === n.gate.gateId;

            return (
              <div
                key={n.gate.gateId}
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 cursor-pointer group"
                onClick={() => onSelectGate?.(n.gate)}
              >
                {/* Node Ring Pulse for Active/Overrun gates */}
                {(n.gate.status === 'ACTIVE' ||
                  n.gate.status === 'OVERRUN') && (
                  <span
                    className={`absolute -inset-1.5 rounded-full animate-ping opacity-40 ${colors.bg}`}
                  />
                )}

                {/* Node Base Badge */}
                <div
                  className={`relative flex items-center justify-center h-8 w-8 rounded-full border-2 shadow-lg transition-all duration-200 group-hover:scale-125 ${
                    isSelected ? 'ring-4 ring-white/60 scale-120' : ''
                  } ${colors.bg} ${colors.border}`}
                >
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                    {n.gate.gateName.slice(0, 2)}
                  </span>
                </div>

                {/* Node Label Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-950/90 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-800 backdrop-blur-xs flex flex-col items-center">
                    <span className="font-bold text-slate-100">
                      {n.gate.gateName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {n.gate.activeShift
                        ? `Guard: ${n.gate.activeShift.guardName}`
                        : n.gate.status === 'UNMANNED'
                          ? 'Unmanned'
                          : 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Checkpoint Station Waypoint Nodes */}
          {showPatrols &&
            patrolRoutes.map((route) =>
              route.checkpoints.map((cp, idx) => {
                const x = cp.mapCoordinates?.x ?? 50;
                const y = cp.mapCoordinates?.y ?? 50;

                return (
                  <div
                    key={`checkpoint-node-${cp.id || idx}`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-10 group cursor-default"
                  >
                    <div className="relative flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[9px] font-extrabold text-white shadow-md border border-indigo-400 transition-transform group-hover:scale-125">
                      {idx + 1}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                      <div className="bg-indigo-950 text-indigo-100 text-[10px] font-semibold py-1 px-2 rounded-md whitespace-nowrap shadow-xl border border-indigo-800">
                        <span>{route.name}</span>: #{idx + 1} {cp.name}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
        </div>
      </div>
    </div>
  );
}
