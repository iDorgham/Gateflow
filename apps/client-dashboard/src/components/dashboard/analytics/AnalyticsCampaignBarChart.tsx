'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface CampaignRow {
  name: string;
  scans: number;
  passRate: number;
}

interface AnalyticsCampaignBarChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

function buildCampaignsUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  return `/api/analytics/campaigns?${sp.toString()}`;
}

export function AnalyticsCampaignBarChart({ filters, className }: AnalyticsCampaignBarChartProps) {
  const { t } = useTranslation('dashboard');
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(buildCampaignsUrl(filters), { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data?.campaigns)) {
          setCampaigns(json.data.campaigns);
        } else {
          setError(json.message ?? 'Failed to load campaigns');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Network error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when filter params change
  }, [filters.from, filters.to, filters.projectId]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.campaignsTitle', 'Campaign performance')}</CardTitle>
        <CardDescription>
          {t('analytics.campaignsDesc', 'Scans by UTM campaign')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
            {t('analytics.loading', 'Loading…')}
          </div>
        ) : error ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
            {t('analytics.noCampaignData', 'No UTM campaign data in this range')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={campaigns}
              margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.[0] && payload[0].payload ? (
                    <div className="rounded border bg-background px-3 py-2 text-sm shadow">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p>{t('analytics.scans', 'Scans')}: {payload[0].payload.scans}</p>
                      <p>{t('analytics.passRate', 'Pass rate')}: {payload[0].payload.passRate}%</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="scans" name={t('analytics.scans', 'Scans')} fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
