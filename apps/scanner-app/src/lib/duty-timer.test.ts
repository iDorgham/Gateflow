import { formatElapsedDuration } from './duty-timer';

describe('formatElapsedDuration', () => {
  it('formats a fresh shift as 00:00:00', () => {
    const start = '2026-08-01T09:00:00.000Z';
    const now = new Date('2026-08-01T09:00:00.000Z').getTime();
    expect(formatElapsedDuration(start, now)).toBe('00:00:00');
  });

  it('formats seconds and minutes correctly', () => {
    const start = '2026-08-01T09:00:00.000Z';
    const now = new Date('2026-08-01T09:07:42.000Z').getTime();
    expect(formatElapsedDuration(start, now)).toBe('00:07:42');
  });

  it('formats durations over an hour with hours rolling past 24', () => {
    const start = '2026-08-01T09:00:00.000Z';
    const now = new Date('2026-08-02T12:15:09.000Z').getTime();
    // 27h 15m 9s elapsed
    expect(formatElapsedDuration(start, now)).toBe('27:15:09');
  });

  it('clamps a future or invalid start time to zero instead of going negative', () => {
    const start = '2026-08-01T09:00:00.000Z';
    const now = new Date('2026-08-01T08:00:00.000Z').getTime();
    expect(formatElapsedDuration(start, now)).toBe('00:00:00');
  });

  it('clamps an unparseable start time to zero', () => {
    const now = Date.now();
    expect(formatElapsedDuration('not-a-date', now)).toBe('00:00:00');
  });
});
