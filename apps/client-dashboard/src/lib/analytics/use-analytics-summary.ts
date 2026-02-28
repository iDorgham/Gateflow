'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function useAnalyticsSummary(filters: AnalyticsFilters, enabled: boolean) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(buildSummaryUrl(filters), { credentials: 'include' });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setError(null);
      } else {
        setError(json.message ?? 'Failed to load summary');
      }
    } catch (err) {
      setError((err as Error)?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when API params change
  }, [filters.from, filters.to, filters.projectId, filters.gateId]);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetchSummary();
    const id = setInterval(fetchSummary, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, fetchSummary]);

  return { data, loading, error, refetch: fetchSummary };
}
