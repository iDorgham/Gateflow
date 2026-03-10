'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { CHART_PRIMARY } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { PeakDaysRow } from '@/lib/analytics/types';

function buildPeakDaysUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/peak-days?${sp.toString()}`;
}

async function fetchPeakDays(filters: AnalyticsFilters): Promise<PeakDaysRow[]> {
  const res = await fetch(buildPeakDaysUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load peak days');
  }
  return json.data;
}

interface PeakDaysChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function PeakDaysChart({ filters, className }: PeakDaysChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'peak-days', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchPeakDays(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noScanDataInRange', 'No scan data in this period.');

  return (
    <AnalyticsChartCard
      title={t('analytics.peakDays', 'Peak Days')}
      tooltip={t('analytics.peakDaysDesc', 'Scan activity by day of week.')}
      loading={isLoading}
      className={className}
      contentClassName="min-h-[260px]"
    >
      {error && (
        <div className="flex min-h-[260px] items-center justify-center text-sm text-destructive">
          {(error as Error).message}
        </div>
      )}
      {!error && isEmpty && !isLoading && (
        <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
          {noDataMessage}
        </div>
      )}
      {!error && !isEmpty && data && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32} fill={CHART_PRIMARY} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
