import { countScansToday, getSystemStatus } from './duty-stats';
import type { HistoryEntry } from './scan-history';

// Built with the local Date constructor (not UTC ISO strings) so the
// "same calendar day" boundary is exercised in whatever timezone the
// test runner happens to be in.
function localIso(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): string {
  return new Date(year, month, day, hour, minute, second).toISOString();
}

function entry(
  scannedAt: string,
  outcome: HistoryEntry['outcome'] = 'pass'
): HistoryEntry {
  return { id: scannedAt, scannedAt, outcome, qrPrefix: 'abc' };
}

describe('countScansToday', () => {
  it('counts entries scanned on the same local calendar day as now', () => {
    const now = new Date(2026, 7, 1, 15, 0, 0).getTime();
    const entries = [
      entry(localIso(2026, 7, 1, 9, 0, 0)),
      entry(localIso(2026, 7, 1, 23, 59, 59), 'deny'),
      entry(localIso(2026, 7, 1, 0, 0, 1), 'offline'),
    ];
    expect(countScansToday(entries, now)).toBe(3);
  });

  it('excludes entries scanned on a different calendar day', () => {
    const now = new Date(2026, 7, 1, 15, 0, 0).getTime();
    const entries = [
      entry(localIso(2026, 6, 31, 23, 59, 59)),
      entry(localIso(2026, 7, 2, 0, 0, 1)),
    ];
    expect(countScansToday(entries, now)).toBe(0);
  });

  it('returns zero for an empty history', () => {
    expect(countScansToday([], Date.now())).toBe(0);
  });
});

describe('getSystemStatus', () => {
  it('reports danger when offline, regardless of queue state', () => {
    expect(getSystemStatus({ online: false, failedCount: 0 })).toEqual({
      label: 'Offline',
      tone: 'danger',
    });
  });

  it('reports warning when online but sync failures are queued', () => {
    expect(getSystemStatus({ online: true, failedCount: 3 })).toEqual({
      label: '3 sync issues',
      tone: 'warning',
    });
  });

  it('singularizes the label for exactly one failure', () => {
    expect(getSystemStatus({ online: true, failedCount: 1 })).toEqual({
      label: '1 sync issue',
      tone: 'warning',
    });
  });

  it('reports success when online with no failures', () => {
    expect(getSystemStatus({ online: true, failedCount: 0 })).toEqual({
      label: 'All systems normal',
      tone: 'success',
    });
  });
});
