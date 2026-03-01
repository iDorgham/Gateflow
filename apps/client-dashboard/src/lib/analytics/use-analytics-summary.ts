'use client';

import { useQuery } from '@tanstack/react-query';
import type { AnalyticsFilters } from './analytics-filters';

export interface SummaryData {
  totalVisits: number;
  passRate: number;
  peakHour: number;
  uniqueVisitors: number;
  deniedCount: number;
  attributedScans: number;
  lastHourCount?: number;
  hourlyAvg?: number;
}

function buildSummaryUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/summary?${sp.toString()}`;
}

const POLL_INTERVAL_MS = 45_000;
const STALE_TIME_MS = 60_000;

async function fetchSummary(filters: AnalyticsFilters): Promise<SummaryData> {
  const res = await fetch(buildSummaryUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message ?? 'Failed to load summary');
  }
  return json.data;
}

export function useAnalyticsSummary(filters: AnalyticsFilters, enabled: boolean) {
  const query = useQuery({
    queryKey: ['analytics', 'summary', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchSummary(filters),
    enabled,
    staleTime: STALE_TIME_MS,
    refetchInterval: enabled ? POLL_INTERVAL_MS : false,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: () => query.refetch(),
  };
}
