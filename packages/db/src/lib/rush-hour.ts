/**
 * Rush-hour / traffic simulation for advanced seeding — synthetic `ScanLog.scannedAt` timelines.
 *
 * Mixture model: **uniform baseline** + **weighted Gaussian bumps** in normalized window [0, 1].
 * Outputs **UTC ISO-8601** strings sorted ascending for Phase 6 inserts.
 *
 * Scenarios align with IDEA v3: `luxury-compound`, `nightclub`, `private-school`, `wedding-venue`.
 */

import { mulberry32 } from './red-sea-data';

export const RUSH_SCENARIOS = [
  'luxury-compound',
  'nightclub',
  'private-school',
  'wedding-venue',
] as const;

export type RushScenario = (typeof RUSH_SCENARIOS)[number];

export type RushGaussianPeak = {
  /** Relative mixture weight (normalized with baseline + other peaks). */
  weight: number;
  /** Mean as fraction of window [0, 1] from `windowStart`. */
  mu: number;
  /** Standard deviation as fraction of window width (clamped samples land in [0, 1]). */
  sigma: number;
};

export type RushScenarioDefinition = {
  /** Uniform component weight (spread across entire window). */
  baselineWeight: number;
  peaks: RushGaussianPeak[];
};

/** Registry used by {@link sampleScanTimestamps} and Phase 6+ orchestration. */
export const RUSH_SCENARIO_REGISTRY: Record<
  RushScenario,
  RushScenarioDefinition
> = {
  'luxury-compound': {
    baselineWeight: 0.28,
    peaks: [
      { weight: 0.26, mu: 0.32, sigma: 0.07 }, // morning departure cluster
      { weight: 0.28, mu: 0.72, sigma: 0.09 }, // evening return cluster
      { weight: 0.18, mu: 0.5, sigma: 0.12 }, // midday services / guests
    ],
  },
  nightclub: {
    baselineWeight: 0.18,
    peaks: [
      { weight: 0.35, mu: 0.9, sigma: 0.045 },
      { weight: 0.32, mu: 0.82, sigma: 0.06 },
      { weight: 0.15, mu: 0.65, sigma: 0.08 },
    ],
  },
  'private-school': {
    baselineWeight: 0.32,
    peaks: [
      { weight: 0.28, mu: 0.22, sigma: 0.045 }, // morning drop-off
      { weight: 0.25, mu: 0.42, sigma: 0.05 }, // lunch / mid
      { weight: 0.15, mu: 0.58, sigma: 0.045 }, // afternoon pickup
    ],
  },
  'wedding-venue': {
    baselineWeight: 0.22,
    peaks: [
      { weight: 0.3, mu: 0.48, sigma: 0.1 }, // ceremony / early reception
      { weight: 0.35, mu: 0.7, sigma: 0.085 }, // evening peak
      { weight: 0.13, mu: 0.88, sigma: 0.06 }, // late departures
    ],
  },
};

export type WeekendAccent = 'none' | 'mena';

export type SampleScanTimestampsParams = {
  count: number;
  scenario: RushScenario;
  windowStart: Date;
  windowEnd: Date;
  seed: number;
  /** Extra evening bump when the window overlaps Fri PM / Sat (UTC heuristic). */
  weekendAccent?: WeekendAccent;
  /**
   * When set, timestamps are sorted then shifted so consecutive scans are at least this many ms apart,
   * anchoring from `windowStart` (can move samples earlier than the raw mixture draw).
   * Throws {@link RushHourScheduleError} if the window cannot fit `count` scans at this gap.
   */
  minInterScanMs?: number;
};

function rushRngSeed(seed: number, i: number): number {
  return (Math.imul(seed, 0x85ebca6b) ^ i ^ 0xc2b2ae35) >>> 0;
}

/** Box–Muller standard normal. */
function gaussianStandard(rng: () => number): number {
  const u1 = Math.max(Number.EPSILON, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function windowTouchesMenaWeekendUtc(start: Date, end: Date): boolean {
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (!(startMs < endMs)) return false;
  let t = startMs;
  const step = 60 * 60 * 1000;
  while (t <= endMs) {
    const d = new Date(t);
    const day = d.getUTCDay();
    const hour = d.getUTCHours();
    if (day === 5 && hour >= 14) return true;
    if (day === 6) return true;
    if (day === 0 && hour < 4) return true;
    t += step;
  }
  return false;
}

function mergeWeekendAccent(
  def: RushScenarioDefinition,
  windowStart: Date,
  windowEnd: Date,
  accent: WeekendAccent
): RushScenarioDefinition {
  if (accent !== 'mena') return def;
  if (!windowTouchesMenaWeekendUtc(windowStart, windowEnd)) return def;
  return {
    baselineWeight: def.baselineWeight,
    peaks: [
      ...def.peaks,
      { weight: 0.12, mu: 0.86, sigma: 0.055 }, // Fri–Sat social / returns (UTC-agnostic bump)
    ],
  };
}

function normalizeMixture(def: RushScenarioDefinition): {
  baseline: number;
  peaks: RushGaussianPeak[];
} {
  const peakSum = def.peaks.reduce((s, p) => s + p.weight, 0);
  const total = def.baselineWeight + peakSum;
  if (total <= 0) {
    throw new Error('rush-hour: scenario weights must sum to a positive total');
  }
  return {
    baseline: def.baselineWeight / total,
    peaks: def.peaks.map((p) => ({ ...p, weight: p.weight / total })),
  };
}

function sampleNormalizedPosition(
  rng: () => number,
  baseline: number,
  peaks: RushGaussianPeak[]
): number {
  const r = rng();
  let acc = 0;
  acc += baseline;
  if (r < acc) {
    return rng();
  }
  for (const p of peaks) {
    acc += p.weight;
    if (r < acc) {
      const z = gaussianStandard(rng);
      return clamp01(p.mu + p.sigma * z);
    }
  }
  return rng();
}

function enforceMinInterScanGapSorted(
  sortedAscMs: number[],
  minMs: number,
  windowStartMs: number,
  windowEndMs: number
): number[] {
  if (sortedAscMs.length === 0) return sortedAscMs;
  /** Anchor from window start so late random draws can still pack without exceeding the end. */
  let prev = windowStartMs - minMs;
  const out: number[] = [];
  for (let i = 0; i < sortedAscMs.length; i++) {
    const want = Math.max(sortedAscMs[i]!, prev + minMs);
    if (want > windowEndMs) {
      throw new RushHourScheduleError(
        `cannot fit ${sortedAscMs.length} scans with minInterScanMs=${minMs} within window`
      );
    }
    out.push(want);
    prev = want;
  }
  return out;
}

export class RushHourScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RushHourScheduleError';
  }
}

/**
 * Draw `count` scan timestamps in `[windowStart, windowEnd)` using the scenario mixture,
 * sort ascending, optionally enforce minimum spacing, return ISO strings (UTC).
 */
export function sampleScanTimestamps(
  params: SampleScanTimestampsParams
): string[] {
  const {
    count,
    scenario,
    windowStart,
    windowEnd,
    seed,
    weekendAccent = 'none',
    minInterScanMs,
  } = params;

  if (!Number.isInteger(count) || count < 1) {
    throw new Error('sampleScanTimestamps: count must be a positive integer');
  }
  const startMs = windowStart.getTime();
  const endMs = windowEnd.getTime();
  if (!(startMs < endMs)) {
    throw new Error(
      'sampleScanTimestamps: windowStart must be before windowEnd'
    );
  }

  const rawDef = RUSH_SCENARIO_REGISTRY[scenario];
  if (!rawDef) {
    throw new Error(
      `sampleScanTimestamps: unknown scenario "${String(scenario)}"`
    );
  }

  const def = mergeWeekendAccent(rawDef, windowStart, windowEnd, weekendAccent);
  const { baseline, peaks } = normalizeMixture(def);

  const width = endMs - startMs;
  const times: number[] = [];

  for (let i = 0; i < count; i++) {
    const rng = mulberry32(rushRngSeed(seed, i));
    const u = sampleNormalizedPosition(rng, baseline, peaks);
    const ms = startMs + u * width;
    times.push(ms);
  }

  times.sort((a, b) => a - b);

  let finalMs = times;
  if (minInterScanMs != null && minInterScanMs > 0) {
    finalMs = enforceMinInterScanGapSorted(
      times,
      minInterScanMs,
      startMs,
      endMs
    );
  }

  return finalMs.map((ms) => new Date(ms).toISOString());
}

/** Normalized position in window for histogram tests (0 = start, 1 = end). */
export function normalizedPositionsInWindow(
  isos: string[],
  windowStart: Date,
  windowEnd: Date
): number[] {
  const a = windowStart.getTime();
  const b = windowEnd.getTime();
  const w = b - a;
  if (w <= 0) throw new Error('normalizedPositionsInWindow: invalid window');
  return isos.map((iso) => {
    const t = new Date(iso).getTime();
    return (t - a) / w;
  });
}

/** Histogram of [0,1) into `binCount` equal bins (last bin closed on right at 1). */
export function histogramBins01(
  positions: number[],
  binCount: number
): number[] {
  if (binCount < 2) throw new Error('histogramBins01: binCount >= 2');
  const bins = new Array<number>(binCount).fill(0);
  for (const p of positions) {
    const x = Math.min(1, Math.max(0, p));
    let idx = Math.floor(x * binCount);
    if (idx >= binCount) idx = binCount - 1;
    bins[idx]!++;
  }
  return bins;
}

/**
 * Pearson chi-square statistic against discrete uniform over bins (expected = n / binCount).
 */
export function chiSquareUniform(bins: number[]): number {
  const n = bins.reduce((s, c) => s + c, 0);
  const k = bins.length;
  if (k === 0 || n === 0) return 0;
  const expected = n / k;
  let chi2 = 0;
  for (const o of bins) {
    chi2 += (o - expected) ** 2 / expected;
  }
  return chi2;
}

/** Mass in inclusive-normalized range [lo, hi] (0–1 scale). */
export function massInRange(
  positions: number[],
  lo: number,
  hi: number
): number {
  let c = 0;
  for (const p of positions) {
    if (p >= lo && p <= hi) c++;
  }
  return c / Math.max(1, positions.length);
}
