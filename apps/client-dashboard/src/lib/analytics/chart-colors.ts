/**
 * Chart color palette — CSS variables only (no hard-coded hex).
 * Use for Recharts fill, stroke, and series colors.
 * Refs: packages/ui/src/tokens.ts, apps/client-dashboard/src/app/globals.css
 */

/** Primary (data lines, bars, main series) */
export const CHART_PRIMARY = 'hsl(var(--primary))';

/** Positive / success (e.g. successful scans, growth) */
export const CHART_SUCCESS = 'hsl(var(--success))';

/** Negative / failures (e.g. denied scans, errors) */
export const CHART_DESTRUCTIVE = 'hsl(var(--destructive))';

/** Warning / override (e.g. manual overrides) */
export const CHART_WARNING = 'hsl(var(--warning))';

/** Neutral / muted (secondary series, backgrounds) */
export const CHART_MUTED = 'hsl(var(--muted-foreground))';

/** Chart series palette (--chart-1 … --chart-5) for multi-series charts */
export const CHART_PALETTE = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
] as const;

/** Get series color by index (cycles through palette) */
export function getChartColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}

/** Semantic map for status-based charts (e.g. scan outcome) */
export const CHART_SEMANTIC = {
  success: CHART_SUCCESS,
  destructive: CHART_DESTRUCTIVE,
  warning: CHART_WARNING,
  muted: CHART_MUTED,
  primary: CHART_PRIMARY,
} as const;
