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
  Legend,
  Cell,
} from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { CHART_SUCCESS, CHART_DESTRUCTIVE, CHART_WARNING, CHART_MUTED } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { ScanOutcomeRow } from '@/lib/analytics/types';

function buildScanOutcomeUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/scan-outcome?${sp.toString()}`;
}

async function fetchScanOutcome(filters: AnalyticsFilters): Promise<ScanOutcomeRow[]> {
  const res = await fetch(buildScanOutcomeUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load scan outcome');
  }
  return json.data;
}

function statusColor(status: string): string {
  switch (status) {
    case 'SUCCESS':
      return CHART_SUCCESS;
    case 'DENIED':
    case 'FAILED':
      return CHART_DESTRUCTIVE;
    case 'EXPIRED':
    case 'MAX_USES_REACHED':
    case 'INACTIVE':
      return CHART_WARNING;
    default:
      return CHART_MUTED;
  }
}

interface ScanOutcomeChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function ScanOutcomeChart({ filters, className }: ScanOutcomeChartProps) {
  const { t } = useTranslation('dashboard');
  const statusLabel = (status: string) =>
    t(`analytics.status.${status}`, status.replace(/_/g, ' '));
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'scan-outcome', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchScanOutcome(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noScanDataInRange', 'No scan data in this period.');

  const total = data?.reduce((s, r) => s + r.count, 0) ?? 0;
  const successCount = data?.find((r) => r.status === 'SUCCESS')?.count ?? 0;
  const passRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  return (
    <AnalyticsChartCard
      title={t('analytics.statusBreakdown30d', 'Scan Outcome')}
      tooltip={t('analytics.statusBreakdown30d', 'Scan Outcome')}
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
        <>
          <div className="mb-2 text-sm text-muted-foreground">
            {t('analytics.successRateLabel', 'Pass rate')}: <span className="font-medium text-foreground">{passRate}%</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="status"
                width={100}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => statusLabel(v)}
              />
              <Tooltip
                formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
                labelFormatter={(label) => statusLabel(label)}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <Legend formatter={(value) => statusLabel(value)} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {data.map((row, index) => (
                  <Cell key={index} fill={statusColor(row.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </AnalyticsChartCard>
  );
}
