'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { CHART_DESTRUCTIVE } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { IncidentsByGateRow, IncidentsByOperatorRow } from '@/lib/analytics/types';

type IncidentsRow = IncidentsByGateRow | IncidentsByOperatorRow;
function getLabel(row: IncidentsRow): string {
  return 'gateName' in row ? row.gateName : row.userName;
}

function buildIncidentsUrl(filters: AnalyticsFilters, groupBy: 'gate' | 'operator'): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  sp.set('groupBy', groupBy);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/incidents?${sp.toString()}`;
}

async function fetchIncidents(
  filters: AnalyticsFilters,
  groupBy: 'gate' | 'operator'
): Promise<{ label: string; count: number }[]> {
  const res = await fetch(buildIncidentsUrl(filters, groupBy), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success || !Array.isArray(json.data)) {
    throw new Error(json.message ?? 'Failed to load incidents');
  }
  return json.data.map((r: IncidentsRow) => ({ label: getLabel(r), count: r.count }));
}

interface IncidentsChartProps {
  filters: AnalyticsFilters;
  groupBy?: 'gate' | 'operator';
  className?: string;
}

export function IncidentsChart({ filters, groupBy = 'gate', className }: IncidentsChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'incidents', groupBy, filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchIncidents(filters, groupBy),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage =
    groupBy === 'gate'
      ? t('analytics.noGateActivityInRange', 'No denied scans by gate in this period.')
      : t('analytics.noOperators', 'No operator data in this period.');

  return (
    <AnalyticsChartCard
      title={
        groupBy === 'gate'
          ? t('analytics.incidentsByGate', 'Incidents by Gate')
          : t('analytics.incidentsByOperator', 'Incidents by Operator')
      }
      tooltip={t('analytics.incidentsDesc', 'Denied scans by gate or operator.')}
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
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (String(v).length > 10 ? String(v).slice(0, 8) + '…' : v)}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32} fill={CHART_DESTRUCTIVE}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_DESTRUCTIVE} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsChartCard>
  );
}
