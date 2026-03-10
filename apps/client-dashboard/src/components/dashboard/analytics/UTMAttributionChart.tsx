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

interface CampaignRow {
  name: string;
  scans: number;
  passRate: number;
}

function buildCampaignsUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  return `/api/analytics/campaigns?${sp.toString()}`;
}

async function fetchCampaigns(filters: AnalyticsFilters): Promise<CampaignRow[]> {
  const res = await fetch(buildCampaignsUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to load campaigns');
  }
  const campaigns = json.data?.campaigns;
  return Array.isArray(campaigns) ? campaigns : [];
}

interface UTMAttributionChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function UTMAttributionChart({ filters, className }: UTMAttributionChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'campaigns', filters.from, filters.to, filters.projectId],
    queryFn: () => fetchCampaigns(filters),
  });

  const isEmpty = !data || data.length === 0;
  const noDataMessage = t('analytics.noCampaignData', 'No UTM campaign data in this range');

  return (
    <AnalyticsChartCard
      title={t('analytics.utmAttribution', 'UTM Attribution')}
      tooltip={t('analytics.utmAttributionDesc', 'Scans by UTM campaign.')}
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
              dataKey="name"
              width={100}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (String(v).length > 12 ? String(v).slice(0, 10) + '…' : v)}
            />
            <Tooltip
              formatter={(value: number) => [value, t('analytics.scans', 'Scans')]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="scans" radius={[0, 4, 4, 0]} maxBarSize={24}>
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
