import { buildSearchParams, type AnalyticsFilters } from './analytics-filters';

/** Build analytics dashboard URL with given filters */
export function buildAnalyticsUrl(locale: string, filters: Partial<AnalyticsFilters>): string {
  const sp = buildSearchParams(filters);
  const query = sp.toString();
  return `/${locale}/dashboard/analytics${query ? `?${query}` : ''}`;
}

export interface ResidentsUrlFilters extends Partial<AnalyticsFilters> {
  unitId?: string;
  contactId?: string;
}

/** Build contacts page URL with analytics-compatible filter params and optional unitId */
export function buildContactsUrl(locale: string, filters: ResidentsUrlFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.unitType) params.set('unitType', filters.unitType);
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.unitId) params.set('unitId', filters.unitId);
  const query = params.toString();
  return `/${locale}/dashboard/residents/contacts${query ? `?${query}` : ''}`;
}

/** Build units page URL with analytics-compatible filter params and optional contactId */
export function buildUnitsUrl(locale: string, filters: ResidentsUrlFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.unitType) params.set('unitType', filters.unitType);
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.contactId) params.set('contactId', filters.contactId);
  const query = params.toString();
  return `/${locale}/dashboard/residents/units${query ? `?${query}` : ''}`;
}
