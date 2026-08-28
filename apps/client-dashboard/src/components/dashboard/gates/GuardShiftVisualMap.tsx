'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import type { LiveGateShiftTelemetry } from '@/lib/shifts/use-live-shifts';

interface GuardShiftVisualMapProps {
  gates: LiveGateShiftTelemetry[];
  selectedGateId?: string | null;
  onSelectGate?: (gate: LiveGateShiftTelemetry) => void;
}

export function GuardShiftVisualMap({
  gates,
  selectedGateId,
  onSelectGate,
}: GuardShiftVisualMapProps) {
  const { t } = useTranslation('dashboard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

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
          fill: '#0ea5e9',
          bg: 'bg-sky-500',
          ring: 'ring-sky-400',
          border: 'border-sky-600',
          text: 'text-sky-700 dark:text-sky-300',
        };
      case 'UNMANNED':
        return {
          fill: '#ef4444',
          bg: 'bg-rose-500',
          ring: 'ring-rose-400',
          border: 'border-rose-600',
          text: 'text-rose-700 dark:text-rose-300',
        };
      case 'OFFLINE':
      default:
        return {
          fill: '#9ca3af',
          bg: 'bg-gray-400',
          ring: 'ring-gray-300',
          border: 'border-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="relative rounded-2xl border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)] overflow-hidden shadow-xs">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-[var(--ds-border-subtle,#ebecf0)] bg-[var(--ds-surface-subtle,#f4f5f7)]/50">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--ds-text-subtle,#6b778c)]" />
          <span className="text-xs font-semibold text-[var(--ds-text,#172b4d)]">
            {t('shifts.perimeterSchematic', 'Perimeter Compound Schematic Map')}
          </span>
          <span className="text-xs text-[var(--ds-text-subtle,#6b778c)] font-mono">
            ({gates.length} {t('shifts.nodes', 'access nodes')})
          </span>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="p-1 rounded-md border border-[var(--ds-border,#dfe1e6)] hover:bg-[var(--ds-surface-hovered,#f4f5f7)] text-[var(--ds-text-subtle,#6b778c)] transition-colors"
            title={t('shifts.zoomIn', 'Zoom In')}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1 rounded-md border border-[var(--ds-border,#dfe1e6)] hover:bg-[var(--ds-surface-hovered,#f4f5f7)] text-[var(--ds-text-subtle,#6b778c)] transition-colors"
            title={t('shifts.zoomOut', 'Zoom Out')}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1 rounded-md border border-[var(--ds-border,#dfe1e6)] hover:bg-[var(--ds-surface-hovered,#f4f5f7)] text-[var(--ds-text-subtle,#6b778c)] transition-colors"
            title={t('shifts.resetZoom', 'Reset View')}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
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
                onClick={() => onSelectGate?.(n.gate)}
                className="absolute cursor-pointer group pointer-events-auto"
              >
                {/* Status Ping for active / alert nodes */}
                {(n.gate.status === 'ACTIVE' ||
                  n.gate.status === 'UNMANNED' ||
                  n.gate.status === 'OVERRUN') && (
                  <span
                    className={`absolute -inset-1.5 rounded-full opacity-60 animate-ping ${
                      n.gate.status === 'UNMANNED'
                        ? 'bg-rose-500'
                        : n.gate.status === 'OVERRUN'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  />
                )}

                {/* Node Target Core */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${colors.border} ${
                    isSelected
                      ? 'ring-4 ring-sky-400 scale-125'
                      : 'group-hover:scale-115'
                  } bg-slate-900 shadow-lg`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${colors.bg}`} />
                </div>

                {/* Floating Node Label & Status Pill */}
                <div className="absolute top-9 start-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10 transition-transform group-hover:scale-105">
                  <div className="flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-[11px] font-semibold text-slate-100 shadow-md">
                      {n.gate.gateName}
                    </span>
                    {n.gate.activeShift ? (
                      <span className="mt-0.5 px-1.5 py-0.2 rounded-sm bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-300 font-mono">
                        {n.gate.activeShift.guardName.split(' ')[0]}
                      </span>
                    ) : n.gate.status === 'UNMANNED' ? (
                      <span className="mt-0.5 px-1.5 py-0.2 rounded-sm bg-rose-950/80 border border-rose-500/40 text-[9px] text-rose-300 font-bold">
                        UNMANNED
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Legend */}
      <div className="p-3 border-t border-[var(--ds-border-subtle,#ebecf0)] bg-[var(--ds-surface,#ffffff)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.activeManned', 'Active Shift')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            <span className="text-[var(--ds-text-subtle,#6b778c)] font-medium">
              {t('shifts.unmannedAlert', 'Unmanned')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.overrunAlert', 'Overrun (>8h)')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
            <span className="text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.scheduled', 'Scheduled')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
            <span className="text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.disabled', 'Disabled')}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-[var(--ds-text-subtlest,#8993a4)] italic">
          {t(
            'shifts.clickNodeHint',
            'Click any gate node to view telemetry & guard handover'
          )}
        </span>
      </div>
    </div>
  );
}
