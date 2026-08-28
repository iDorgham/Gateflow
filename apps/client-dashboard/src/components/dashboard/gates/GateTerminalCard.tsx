'use client';

import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  UserX,
  Calendar,
  QrCode,
} from 'lucide-react';
import type { LiveGateShiftTelemetry } from '@/lib/shifts/use-live-shifts';

interface GateTerminalCardProps {
  gate: LiveGateShiftTelemetry;
  onSelect?: (gate: LiveGateShiftTelemetry) => void;
  isSelected?: boolean;
}

export function GateTerminalCard({
  gate,
  onSelect,
  isSelected,
}: GateTerminalCardProps) {
  const { t } = useTranslation('dashboard');

  const formatElapsed = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const getStatusBadge = () => {
    switch (gate.status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('shifts.statusActive', 'Active')}
          </span>
        );
      case 'OVERRUN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            {t('shifts.statusOverrun', 'Overrun (>8h)')}
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-500/20">
            <Calendar className="h-3 w-3" />
            {t('shifts.statusScheduled', 'Scheduled')}
          </span>
        );
      case 'UNMANNED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-500/30">
            <UserX className="h-3 w-3" />
            {t('shifts.statusUnmanned', 'Unmanned')}
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            {t('shifts.statusOffline', 'Disabled')}
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect?.(gate)}
      className={`group relative rounded-xl border p-4 transition-all cursor-pointer bg-[var(--ds-surface,#ffffff)] ${
        isSelected
          ? 'border-[var(--ds-border-focused,#0c66e4)] ring-2 ring-[var(--ds-border-focused,#0c66e4)]/20 shadow-md'
          : 'border-[var(--ds-border,#dfe1e6)] hover:border-[var(--ds-border-bold,#091e42)] hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-[var(--ds-text,#172b4d)] truncate group-hover:text-[var(--ds-link,#0052cc)] transition-colors">
              {gate.gateName}
            </h3>
            {getStatusBadge()}
          </div>
          {gate.projectName && (
            <p className="text-xs text-[var(--ds-text-subtle,#6b778c)] truncate mt-0.5">
              {gate.projectName}
            </p>
          )}
        </div>

        {/* Terminal Connection Heartbeat */}
        <div
          title={
            gate.isTerminalConnected
              ? t('shifts.terminalOnline', 'Terminal Online & Connected')
              : t('shifts.terminalOffline', 'Terminal Disconnected (>10m idle)')
          }
          className="shrink-0"
        >
          {gate.isTerminalConnected ? (
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <Wifi className="h-3 w-3" />
              <span className="hidden sm:inline">
                {t('shifts.online', 'Online')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--ds-text-subtlest,#8993a4)] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">
                {t('shifts.offline', 'Offline')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body: Guard State */}
      <div className="mt-3.5 pt-3 border-t border-[var(--ds-border-subtle,#ebecf0)] space-y-2.5">
        {gate.activeShift ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                {gate.activeShift.guardName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--ds-text,#172b4d)] truncate">
                  {gate.activeShift.guardName}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {t('shifts.onDuty', 'On Duty')} •{' '}
                  {formatElapsed(gate.activeShift.elapsedMinutes)}
                </p>
              </div>
            </div>
            <div className="text-end shrink-0">
              <span className="text-[11px] font-mono text-[var(--ds-text-subtlest,#8993a4)]">
                {new Date(gate.activeShift.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ) : gate.scheduledGuards.length > 0 ? (
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[var(--ds-text-subtle,#6b778c)] min-w-0">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
              <span className="truncate">
                {gate.scheduledGuards[0].userName}{' '}
                {gate.scheduledGuards[0].shiftStart &&
                  `(${gate.scheduledGuards[0].shiftStart})`}
              </span>
            </div>
            <span className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
              {t('shifts.scheduledNext', 'Scheduled')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-medium py-1">
            <UserX className="h-3.5 w-3.5 shrink-0 text-rose-600" />
            <span>{t('shifts.noGuardAssigned', 'No guard on duty')}</span>
          </div>
        )}

        {/* Footer info: Location & Scans */}
        <div className="flex items-center justify-between text-[11px] text-[var(--ds-text-subtle,#6b778c)] pt-1">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {gate.location || t('common.unknownLocation', 'Perimeter')}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <QrCode className="h-3 w-3" />
            <span>
              {t('shifts.scansCount', '{{count}} scans', {
                count: gate.scansTodayCount,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
