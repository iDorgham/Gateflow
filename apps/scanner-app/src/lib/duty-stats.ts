/**
 * duty-stats.ts
 *
 * Pure aggregation helpers for the Master Scan Home Screen's stats grid.
 * Operate on already-loaded data (local history, queue counts, network
 * state) so they stay easy to unit test without mocking AsyncStorage.
 */

import type { HistoryEntry } from './scan-history';

function isSameLocalDay(isoA: string, epochB: number): boolean {
  const a = new Date(isoA);
  const b = new Date(epochB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Count history entries scanned on the same local calendar day as `nowMs`. */
export function countScansToday(
  entries: HistoryEntry[],
  nowMs: number
): number {
  return entries.filter((entry) => isSameLocalDay(entry.scannedAt, nowMs))
    .length;
}

export interface SystemStatus {
  label: string;
  tone: 'success' | 'warning' | 'danger';
}

/**
 * Derive the duty home screen's system health summary from connectivity
 * and the count of scans that failed to sync. Offline always wins — a
 * device with a full failed queue but a live connection reads as a sync
 * problem, not an outage.
 */
export function getSystemStatus(params: {
  online: boolean;
  failedCount: number;
}): SystemStatus {
  if (!params.online) {
    return { label: 'Offline', tone: 'danger' };
  }
  if (params.failedCount > 0) {
    const noun = params.failedCount === 1 ? 'issue' : 'issues';
    return { label: `${params.failedCount} sync ${noun}`, tone: 'warning' };
  }
  return { label: 'All systems normal', tone: 'success' };
}
