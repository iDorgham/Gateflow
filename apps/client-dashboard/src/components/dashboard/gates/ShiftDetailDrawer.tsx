'use client';

import { useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  MapPin,
  Wifi,
  WifiOff,
  UserX,
  Calendar,
  AlertTriangle,
  QrCode,
  ArrowRightLeft,
} from 'lucide-react';
import { Button, Input, Label } from '@gateflow/ui';
import { toast } from 'sonner';
import type { LiveGateShiftTelemetry } from '@/lib/shifts/use-live-shifts';

interface ShiftDetailDrawerProps {
  gate: LiveGateShiftTelemetry | null;
  isOpen: boolean;
  onClose: () => void;
  onHandoverSuccess?: () => void;
}

/**
 * Displays live shift telemetry and handover controls for a selected gate.
 *
 * @param gate - The selected gate's telemetry, or `null` when no gate is selected
 * @param isOpen - Whether the drawer is visible
 * @param onClose - Called when the drawer is closed
 * @param onHandoverSuccess - Called after a handover completes successfully
 */
export function ShiftDetailDrawer({
  gate,
  isOpen,
  onClose,
  onHandoverSuccess,
}: ShiftDetailDrawerProps) {
  const { t } = useTranslation('dashboard');
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [incomingGuardId, setIncomingGuardId] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !gate) return null;

  const formatElapsed = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const handleHandoverSubmit = async () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/shifts/handover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gateId: gate.gateId,
            incomingGuardId: incomingGuardId || undefined,
            notes: handoverNotes.trim() || undefined,
          }),
        });

        const json = await res.json();
        if (json.success) {
          toast.success(
            t('shifts.handoverSuccess', {
              gate: gate.gateName,
              defaultValue: `Shift ended for ${gate.gateName}`,
            })
          );
          setShowHandoverForm(false);
          setHandoverNotes('');
          setIncomingGuardId('');
          onHandoverSuccess?.();
          onClose();
        } else {
          toast.error(
            json.message || t('shifts.handoverFailed', 'Handover failed')
          );
        }
      } catch {
        toast.error(t('shifts.handoverError', 'Network error during handover'));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 end-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--ds-surface,#ffffff)] border-s border-[var(--ds-border,#dfe1e6)] shadow-2xl flex flex-col justify-between animate-in slide-in-from-end duration-200">
          {/* Header */}
          <div className="p-5 border-b border-[var(--ds-border-subtle,#ebecf0)] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {gate.gateName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--ds-text,#172b4d)] truncate">
                  {gate.gateName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[var(--ds-text-subtle,#6b778c)]">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {gate.location || 'Compound Perimeter'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--ds-text-subtle,#6b778c)] hover:bg-[var(--ds-surface-hovered,#f4f5f7)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1">
            {/* Status & Connectivity Pill Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[var(--ds-surface-subtle,#f4f5f7)] border border-[var(--ds-border,#dfe1e6)] text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[var(--ds-text,#172b4d)]">
                  {t('shifts.statusLabel', 'Status:')}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {gate.status}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {gate.isTerminalConnected ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <Wifi className="h-3.5 w-3.5" />
                    {t('shifts.terminalConnected', 'Scanner Connected')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[var(--ds-text-subtlest,#8993a4)] font-medium">
                    <WifiOff className="h-3.5 w-3.5" />
                    {t('shifts.terminalDisconnected', 'Terminal Offline')}
                  </span>
                )}
              </div>
            </div>

            {/* Active Guard Session */}
            <div>
              <h3 className="text-xs font-bold text-[var(--ds-text-subtle,#6b778c)] uppercase tracking-wider mb-2">
                {t('shifts.activeGuardSession', 'Active Guard on Shift')}
              </h3>

              {gate.activeShift ? (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                        {gate.activeShift.guardName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--ds-text,#172b4d)]">
                          {gate.activeShift.guardName}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          {t('shifts.clockedInAt', 'Clocked in at')}{' '}
                          {new Date(
                            gate.activeShift.startTime
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="text-xs text-[var(--ds-text-subtle,#6b778c)] block">
                        {t('shifts.duration', 'Duration')}
                      </span>
                      <span className="text-sm font-bold text-[var(--ds-text,#172b4d)] font-mono">
                        {formatElapsed(gate.activeShift.elapsedMinutes)}
                      </span>
                    </div>
                  </div>

                  {gate.status === 'OVERRUN' && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>
                        {t(
                          'shifts.overrunWarning',
                          'Shift exceeded 8h. Handover recommended.'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
                  <UserX className="h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-bold">
                      {t('shifts.unmannedTitle', 'Unmanned Access Point')}
                    </p>
                    <p className="text-[11px] opacity-80">
                      {t(
                        'shifts.unmannedDesc',
                        'No security officer is currently clocked in at this gate.'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Scheduled Guard Roster */}
            <div>
              <h3 className="text-xs font-bold text-[var(--ds-text-subtle,#6b778c)] uppercase tracking-wider mb-2">
                {t('shifts.scheduledRoster', 'Assigned Schedule')}
              </h3>

              {gate.scheduledGuards.length > 0 ? (
                <div className="divide-y divide-[var(--ds-border-subtle,#ebecf0)] rounded-xl border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)]">
                  {gate.scheduledGuards.map((g) => (
                    <div
                      key={g.userId}
                      className="p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-sky-600" />
                        <span className="font-semibold text-[var(--ds-text,#172b4d)]">
                          {g.userName}
                        </span>
                      </div>
                      <span className="text-[var(--ds-text-subtle,#6b778c)] font-mono">
                        {g.shiftStart || '08:00'} - {g.shiftEnd || '16:00'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--ds-text-subtlest,#8993a4)] italic">
                  {t(
                    'shifts.noScheduledGuards',
                    'No upcoming shifts scheduled'
                  )}
                </p>
              )}
            </div>

            {/* Scan Metrics */}
            <div className="p-3.5 rounded-xl border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface,#ffffff)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[var(--ds-text-subtle,#6b778c)]" />
                <span className="text-xs font-medium text-[var(--ds-text,#172b4d)]">
                  {t('shifts.todayScans', "Today's Verified Scans")}
                </span>
              </div>
              <span className="text-sm font-bold text-[var(--ds-text,#172b4d)] font-mono">
                {gate.scansTodayCount}
              </span>
            </div>

            {/* Emergency Handover Action Form */}
            {gate.activeShift && (
              <div className="pt-2">
                {!showHandoverForm ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowHandoverForm(true)}
                    className="w-full gap-2 border-[var(--ds-border,#dfe1e6)]"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>
                      {t(
                        'shifts.triggerHandover',
                        'Trigger Shift Handover / End Shift'
                      )}
                    </span>
                  </Button>
                ) : (
                  <div className="p-4 rounded-xl border border-[var(--ds-border,#dfe1e6)] bg-[var(--ds-surface-subtle,#f4f5f7)] space-y-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-[var(--ds-text,#172b4d)] flex items-center gap-1.5">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {t(
                          'shifts.handoverConfirmTitle',
                          'Confirm Shift Handover'
                        )}
                      </span>
                    </h4>
                    <div className="space-y-1">
                      <Label htmlFor="incoming-guard" className="text-xs">
                        {t('shifts.incomingGuard', 'Incoming Guard (Optional)')}
                      </Label>
                      <select
                        id="incoming-guard"
                        value={incomingGuardId}
                        onChange={(event) =>
                          setIncomingGuardId(event.target.value)
                        }
                        className="h-10 w-full rounded-md border border-[var(--ds-border-input,#dfe1e6)] bg-[var(--ds-background-input,#ffffff)] px-3 text-sm text-[var(--ds-text,#172b4d)]"
                      >
                        <option value="">
                          {t(
                            'shifts.noReplacementGuard',
                            'End shift without replacement'
                          )}
                        </option>
                        {gate.scheduledGuards
                          .filter(
                            (guard) =>
                              guard.userId !== gate.activeShift?.guardId
                          )
                          .map((guard) => (
                            <option key={guard.userId} value={guard.userId}>
                              {guard.userName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="handover-notes" className="text-xs">
                        {t('shifts.handoverNotes', 'Handover Notes (Optional)')}
                      </Label>
                      <Input
                        id="handover-notes"
                        placeholder={t(
                          'shifts.notesPlaceholder',
                          'e.g. Relieved by Shift Lead'
                        )}
                        value={handoverNotes}
                        onChange={(e) => setHandoverNotes(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="subtle"
                        onClick={() => setShowHandoverForm(false)}
                        className="flex-1 text-xs"
                      >
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleHandoverSubmit}
                        disabled={isPending}
                        className="flex-1 text-xs gap-1.5"
                      >
                        {isPending
                          ? t('common.saving', 'Saving…')
                          : t('shifts.confirmEnd', 'End Shift')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--ds-border-subtle,#ebecf0)] bg-[var(--ds-surface-subtle,#f4f5f7)]/50 flex justify-end">
            <Button variant="subtle" onClick={onClose}>
              {t('common.close', 'Close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
