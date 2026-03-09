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
  Cell,
} from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { getChartColor } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { TopGatesRow } from '@/lib/analytics/types';

function buildTopGatesUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/top-gates?${sp.toString()}`;
}

async function fetchTopGates(filters: AnalyticsFilters): Promise<TopGatesRow[]> {
  const res = await fetch(buildTopGatesUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load top gates');
  }
  return json.data;
}

interface TopGatesChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function TopGatesChart({ filters, className }: TopGatesChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'top-gates', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchTopGates(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noGateActivity', 'No gate activity yet.');

  return (
    <AnalyticsChartCard
      title={t('analytics.topGates', 'Top Gates by Traffic')}
      tooltip={t('analytics.topGates', 'Top Gates by Traffic')}
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
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="gateName"
              width={80}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (v.length > 12 ? v.slice(0, 10) + '…' : v)}
            />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((_, index) => (
                <Cell key={index} fill={getChartColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
