export {};

import {
  chiSquareUniform,
  histogramBins01,
  massInRange,
  normalizedPositionsInWindow,
  RUSH_SCENARIOS,
  RushHourScheduleError,
  sampleScanTimestamps,
} from './rush-hour';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function parseSorted(isos: string[]): number[] {
  return isos.map((s) => new Date(s).getTime());
}

describe('rush-hour', () => {
  const windowStart = new Date('2026-06-01T00:00:00.000Z');
  const windowEnd = new Date(windowStart.getTime() + WEEK_MS);

  test('sampleScanTimestamps: exact count and sorted non-decreasing', () => {
    const n = 500;
    const isos = sampleScanTimestamps({
      count: n,
      scenario: 'luxury-compound',
      windowStart,
      windowEnd,
      seed: 2026,
    });
    expect(isos.length).toBe(n);
    const ms = parseSorted(isos);
    for (let i = 1; i < ms.length; i++) {
      expect(ms[i]! >= ms[i - 1]!).toBe(true);
    }
  });

  test('sampleScanTimestamps: all timestamps inside [windowStart, windowEnd]', () => {
    const isos = sampleScanTimestamps({
      count: 200,
      scenario: 'private-school',
      windowStart,
      windowEnd,
      seed: 3,
    });
    const a = windowStart.getTime();
    const b = windowEnd.getTime();
    for (const iso of isos) {
      const t = new Date(iso).getTime();
      expect(t).toBeGreaterThanOrEqual(a);
      expect(t).toBeLessThanOrEqual(b);
    }
  });

  test('sampleScanTimestamps: deterministic for same seed', () => {
    const params = {
      count: 100,
      scenario: 'wedding-venue' as const,
      windowStart,
      windowEnd,
      seed: 99,
    };
    const a = sampleScanTimestamps(params);
    const b = sampleScanTimestamps(params);
    expect(a).toEqual(b);
  });

  test('nightclub concentrates more mass in late window than private-school', () => {
    const n = 8000;
    const nc = sampleScanTimestamps({
      count: n,
      scenario: 'nightclub',
      windowStart,
      windowEnd,
      seed: 42,
    });
    const sc = sampleScanTimestamps({
      count: n,
      scenario: 'private-school',
      windowStart,
      windowEnd,
      seed: 42,
    });
    const lateLo = 0.78;
    const lateHi = 1;
    const mNight = massInRange(
      normalizedPositionsInWindow(nc, windowStart, windowEnd),
      lateLo,
      lateHi
    );
    const mSchool = massInRange(
      normalizedPositionsInWindow(sc, windowStart, windowEnd),
      lateLo,
      lateHi
    );
    expect(mNight).toBeGreaterThan(mSchool + 0.08);
  });

  test('private-school concentrates more mass in morning corridor than nightclub', () => {
    const n = 8000;
    const sc = sampleScanTimestamps({
      count: n,
      scenario: 'private-school',
      windowStart,
      windowEnd,
      seed: 7,
    });
    const nc = sampleScanTimestamps({
      count: n,
      scenario: 'nightclub',
      windowStart,
      windowEnd,
      seed: 7,
    });
    const lo = 0.12;
    const hi = 0.38;
    const mSchool = massInRange(
      normalizedPositionsInWindow(sc, windowStart, windowEnd),
      lo,
      hi
    );
    const mNight = massInRange(
      normalizedPositionsInWindow(nc, windowStart, windowEnd),
      lo,
      hi
    );
    expect(mSchool).toBeGreaterThan(mNight + 0.06);
  });

  test('mixture is far from uniform (high chi-square vs uniform bins)', () => {
    const isos = sampleScanTimestamps({
      count: 6000,
      scenario: 'luxury-compound',
      windowStart,
      windowEnd,
      seed: 1,
    });
    const pos = normalizedPositionsInWindow(isos, windowStart, windowEnd);
    const bins = histogramBins01(pos, 12);
    const chi2 = chiSquareUniform(bins);
    // Uniform null: chi2 ~ chi-squared(11); median ~10.3; reject uniformity when large
    expect(chi2).toBeGreaterThan(80);
  });

  test('histogram snapshot: nightclub late bins dominate (fixed seed)', () => {
    const isos = sampleScanTimestamps({
      count: 1200,
      scenario: 'nightclub',
      windowStart,
      windowEnd,
      seed: 12345,
    });
    const bins = histogramBins01(
      normalizedPositionsInWindow(isos, windowStart, windowEnd),
      10
    );
    const lastTwo = bins[8]! + bins[9]!;
    const firstTwo = bins[0]! + bins[1]!;
    expect(lastTwo).toBeGreaterThan(firstTwo * 1.5);
  });

  test('minInterScanMs: enforces gap when feasible', () => {
    const start = new Date('2026-01-01T00:00:00.000Z');
    /** 4h — enough headroom even when the first random draws sit late in the window. */
    const end = new Date(start.getTime() + 4 * 3600_000);
    const isos = sampleScanTimestamps({
      count: 10,
      scenario: 'luxury-compound',
      windowStart: start,
      windowEnd: end,
      seed: 1,
      minInterScanMs: 300_000,
    });
    const ms = parseSorted(isos);
    for (let i = 1; i < ms.length; i++) {
      expect(ms[i]! - ms[i - 1]!).toBeGreaterThanOrEqual(300_000 - 1);
    }
  });

  test('minInterScanMs: throws when schedule impossible', () => {
    const start = new Date('2026-01-01T00:00:00.000Z');
    const end = new Date(start.getTime() + 100_000);
    expect(() =>
      sampleScanTimestamps({
        count: 5,
        scenario: 'luxury-compound',
        windowStart: start,
        windowEnd: end,
        seed: 1,
        minInterScanMs: 40_000,
      })
    ).toThrow(RushHourScheduleError);
  });

  test('weekendAccent mena: can increase late mass when window spans weekend (UTC)', () => {
    const friStart = new Date('2026-06-05T12:00:00.000Z'); // Friday
    const sunEnd = new Date('2026-06-07T18:00:00.000Z');
    const n = 5000;
    const base = sampleScanTimestamps({
      count: n,
      scenario: 'luxury-compound',
      windowStart: friStart,
      windowEnd: sunEnd,
      seed: 50,
      weekendAccent: 'none',
    });
    const accented = sampleScanTimestamps({
      count: n,
      scenario: 'luxury-compound',
      windowStart: friStart,
      windowEnd: sunEnd,
      seed: 50,
      weekendAccent: 'mena',
    });
    const mBase = massInRange(
      normalizedPositionsInWindow(base, friStart, sunEnd),
      0.75,
      1
    );
    const mAcc = massInRange(
      normalizedPositionsInWindow(accented, friStart, sunEnd),
      0.75,
      1
    );
    expect(mAcc).toBeGreaterThanOrEqual(mBase);
    expect(mAcc).toBeGreaterThan(mBase + 0.01);
  });

  test('RUSH_SCENARIOS lists all registry keys', () => {
    expect(RUSH_SCENARIOS).toEqual([
      'luxury-compound',
      'nightclub',
      'private-school',
      'wedding-venue',
    ]);
  });
});
