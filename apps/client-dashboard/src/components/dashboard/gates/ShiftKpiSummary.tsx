'use client';

import { useTranslation } from 'react-i18next';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Users,
  RefreshCw,
} from 'lucide-react';
import type { LiveShiftSummary } from '@/lib/shifts/use-live-shifts';

interface ShiftKpiSummaryProps {
  summary: LiveShiftSummary | null;
  isLoading?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

/**
 * Displays live perimeter-shift telemetry KPIs and status information.
 *
 * @param summary - Optional shift summary used to populate the KPI values
 * @param isLoading - Whether telemetry data is currently being refreshed
 * @param lastUpdated - Optional time when the telemetry was last updated
 * @param onRefresh - Optional callback invoked to refresh the telemetry data
 */
export function ShiftKpiSummary({
  summary,
  isLoading,
  lastUpdated,
  onRefresh,
}: ShiftKpiSummaryProps) {
  const { t } = useTranslation('dashboard');

  const totalGates = summary?.totalGates ?? 0;
  const activeShifts = summary?.activeShiftsCount ?? 0;
  const unmannedGates = summary?.unmannedGatesCount ?? 0;
  const overrunShifts = summary?.overrunShiftsCount ?? 0;
  const activeGuards = summary?.activeGuardsCount ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-medium text-[var(--ds-text-subtle,#6b778c)]">
            {t('shifts.liveTelemetry', 'Live Perimeter Shift Telemetry')}
          </span>
          {lastUpdated && (
            <span className="text-[11px] text-[var(--ds-text-subtlest,#8993a4)]">
              • {t('shifts.updated', 'Updated')}{' '}
              {lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          )}
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ds-text-subtle,#6b778c)] hover:text-[var(--ds-text,#172b4d)] transition-colors disabled:opacity-50"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span>{t('common.refresh', 'Refresh')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Gates */}
        <div className="p-3.5 rounded-lg border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.totalGates', 'Total Gates')}
            </span>
            <Shield className="h-4 w-4 text-[var(--ds-text-subtle,#6b778c)]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--ds-text,#172b4d)]">
            {totalGates}
          </p>
        </div>

        {/* Active Shifts */}
        <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
              {t('shifts.activeShifts', 'Active Manned')}
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            {activeShifts}
          </p>
        </div>

        {/* Unmanned Gates */}
        <div
          className={`p-3.5 rounded-lg border shadow-xs transition-colors ${
            unmannedGates > 0
              ? 'border-rose-500/30 bg-rose-50/60 dark:bg-rose-950/30'
              : 'border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                unmannedGates > 0
                  ? 'text-rose-800 dark:text-rose-300 font-semibold'
                  : 'text-[var(--ds-text-subtle,#6b778c)]'
              }`}
            >
              {t('shifts.unmannedGates', 'Unmanned Gates')}
            </span>
            <ShieldAlert
              className={`h-4 w-4 ${
                unmannedGates > 0
                  ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'text-[var(--ds-text-subtle,#6b778c)]'
              }`}
            />
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              unmannedGates > 0
                ? 'text-rose-950 dark:text-rose-100'
                : 'text-[var(--ds-text,#172b4d)]'
            }`}
          >
            {unmannedGates}
          </p>
        </div>

        {/* Overrun Shifts (>8h) */}
        <div
          className={`p-3.5 rounded-lg border shadow-xs transition-colors ${
            overrunShifts > 0
              ? 'border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30'
              : 'border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                overrunShifts > 0
                  ? 'text-amber-800 dark:text-amber-300 font-semibold'
                  : 'text-[var(--ds-text-subtle,#6b778c)]'
              }`}
            >
              {t('shifts.overrunShifts', 'Overrun (>8h)')}
            </span>
            <Clock
              className={`h-4 w-4 ${
                overrunShifts > 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-[var(--ds-text-subtle,#6b778c)]'
              }`}
            />
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              overrunShifts > 0
                ? 'text-amber-950 dark:text-amber-100'
                : 'text-[var(--ds-text,#172b4d)]'
            }`}
          >
            {overrunShifts}
          </p>
        </div>

        {/* Guards on Duty */}
        <div className="p-3.5 rounded-lg border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--ds-text-subtle,#6b778c)]">
              {t('shifts.activeGuards', 'Guards on Duty')}
            </span>
            <Users className="h-4 w-4 text-[var(--ds-text-subtle,#6b778c)]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--ds-text,#172b4d)]">
            {activeGuards}
          </p>
        </div>
      </div>
    </div>
  );
}
