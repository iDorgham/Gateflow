'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { getChartColor } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { VisitorTypeRow } from '@/lib/analytics/types';

function buildVisitorTypeUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/visitor-type?${sp.toString()}`;
}

async function fetchVisitorType(filters: AnalyticsFilters): Promise<VisitorTypeRow[]> {
  const res = await fetch(buildVisitorTypeUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load visitor type');
  }
  return json.data;
}

interface VisitorTypeChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function VisitorTypeChart({ filters, className }: VisitorTypeChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'visitor-type', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchVisitorType(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noScanDataInRange', 'No scan data in this period.');

  return (
    <AnalyticsChartCard
      title={t('analytics.scansByQrType', 'Visitor Type Distribution')}
      tooltip={t('analytics.qrTypeDesc', 'Single-use, recurring, and permanent access codes.')}
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
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              label={({ type }) => type}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={getChartColor(index)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Legend formatter={(value) => value} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
