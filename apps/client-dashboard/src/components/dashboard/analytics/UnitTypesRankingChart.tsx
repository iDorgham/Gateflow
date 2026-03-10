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
import type { UnitTypesRankingRow } from '@/lib/analytics/types';

function buildUnitTypesUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/unit-types?${sp.toString()}`;
}

async function fetchUnitTypes(filters: AnalyticsFilters): Promise<UnitTypesRankingRow[]> {
  const res = await fetch(buildUnitTypesUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load unit types');
  }
  return json.data;
}

interface UnitTypesRankingChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function UnitTypesRankingChart({ filters, className }: UnitTypesRankingChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'unit-types', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchUnitTypes(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noScanDataInRange', 'No scan data in this period.');

  return (
    <AnalyticsChartCard
      title={t('analytics.unitTypesRanking', 'Unit Types Visit Ranking')}
      tooltip={t('analytics.unitTypesRankingDesc', 'Visits by unit type (resident-created QRs).')}
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
              dataKey="unitType"
              width={80}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (String(v).length > 10 ? String(v).slice(0, 8) + '…' : v)}
            />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24} fill={CHART_PRIMARY} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
