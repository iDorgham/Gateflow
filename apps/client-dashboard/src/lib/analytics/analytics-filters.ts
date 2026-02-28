/**
 * Shared filter schema for analytics dashboard.
 * URL params: range, from, to, projectId, gateId, unitType, search, mode
 */

export type AnalyticsMode = 'security' | 'marketing';
export type DateRangePreset = '7d' | '30d' | 'custom';

export interface AnalyticsFilters {
  range: DateRangePreset;
  from: string;
  to: string;
  projectId: string;
  gateId: string;
  unitType: string;
  search: string;
  mode: AnalyticsMode;
}

const DEFAULT_MODE: AnalyticsMode = 'security';
const DEFAULT_RANGE: DateRangePreset = '7d';

/** Default filters when no URL params present */
export function getDefaultFilters(): AnalyticsFilters {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const from = new Date(now);
  from.setDate(from.getDate() - 6);
  from.setHours(0, 0, 0, 0);
  return {
    range: DEFAULT_RANGE,
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
    projectId: '',
    gateId: '',
    unitType: '',
    search: '',
    mode: DEFAULT_MODE,
  };
}

/** Parse URL search params into AnalyticsFilters */
export function parseFiltersFromSearchParams(params: URLSearchParams): Partial<AnalyticsFilters> {
  const filters: Partial<AnalyticsFilters> = {};
  const range = params.get('range');
  if (range === '7d' || range === '30d' || range === 'custom') {
    filters.range = range;
  }
  const from = params.get('from');
  if (from) filters.from = from;
  const to = params.get('to');
  if (to) filters.to = to;
  const projectId = params.get('projectId');
  if (projectId) filters.projectId = projectId;
  const gateId = params.get('gateId');
  if (gateId) filters.gateId = gateId;
  const unitType = params.get('unitType');
  if (unitType) filters.unitType = unitType;
  const search = params.get('search');
  if (search) filters.search = search;
  const mode = params.get('mode');
  if (mode === 'security' || mode === 'marketing') {
    filters.mode = mode;
  }
  return filters;
}

/** Build URL search string from filters */
export function buildSearchParams(filters: Partial<AnalyticsFilters>): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.range) sp.set('range', filters.range);
  if (filters.from) sp.set('from', filters.from);
  if (filters.to) sp.set('to', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  if (filters.search) sp.set('search', filters.search);
  if (filters.mode && filters.mode !== 'security') sp.set('mode', filters.mode);
  return sp;
}

/** Merge partial filters with defaults */
export function mergeFilters(partial: Partial<AnalyticsFilters>): AnalyticsFilters {
  const defaults = getDefaultFilters();
  return {
    ...defaults,
    ...partial,
  };
}
