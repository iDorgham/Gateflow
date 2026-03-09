'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { CHART_PRIMARY } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { VisitsOverTimePoint } from '@/lib/analytics/types';

function buildVisitsOverTimeUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/visits-over-time?${sp.toString()}`;
}

async function fetchVisitsOverTime(filters: AnalyticsFilters): Promise<VisitsOverTimePoint[]> {
  const res = await fetch(buildVisitsOverTimeUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load visits');
  }
  return json.data;
}

interface TotalVisitsChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function TotalVisitsChart({ filters, className }: TotalVisitsChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'visits-over-time', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchVisitsOverTime(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noScanDataInRange', 'No scan data in this period.');

  return (
    <AnalyticsChartCard
      title={t('analytics.scansOverTime', 'Total Visits Over Time')}
      tooltip={t('analytics.scansOverTimeDesc', 'All scan attempts including failures.')}
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
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => {
                try {
                  const d = new Date(v);
                  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                } catch {
                  return v;
                }
              }}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              labelFormatter={(label) => {
                try {
                  return new Date(label).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                } catch {
                  return label;
                }
              }}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={CHART_PRIMARY}
              fill={CHART_PRIMARY}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
