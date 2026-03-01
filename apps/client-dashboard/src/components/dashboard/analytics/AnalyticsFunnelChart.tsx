'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface FunnelStage {
  name: string;
  count: number;
  dropoffRate?: number;
}

interface AnalyticsFunnelChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

function buildFunnelUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if ((filters as { utmCampaign?: string }).utmCampaign) {
    sp.set('utmCampaign', (filters as { utmCampaign?: string }).utmCampaign!);
  }
  return `/api/analytics/funnel?${sp.toString()}`;
}

export function AnalyticsFunnelChart({ filters, className }: AnalyticsFunnelChartProps) {
  const { t } = useTranslation('dashboard');
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(buildFunnelUrl(filters), { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data?.stages)) {
          setStages(json.data.stages);
        } else {
          setError(json.message ?? 'Failed to load funnel');
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

  const conversionRate =
    stages.length >= 2 && stages[0].count > 0
      ? Math.round((stages[1].count / stages[0].count) * 100)
      : 0;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.funnelTitle', 'Attribution funnel')}</CardTitle>
        <CardDescription>
          {t('analytics.funnelDesc', 'QR created → scanned conversion')}
          {stages.length >= 2 && (
            <span className="ml-2 font-medium text-foreground">
              {conversionRate}% {t('analytics.conversion', 'conversion')}
            </span>
          )}
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
        ) : stages.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
            {t('analytics.noFunnelData', 'No funnel data in this range')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stages} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                formatter={(value: number, name: string, props: { payload?: FunnelStage }) => [
                  value,
                  props.payload?.dropoffRate != null
                    ? `${props.payload.name} (${props.payload.dropoffRate}% dropoff)`
                    : name,
                ]}
              />
              <Bar dataKey="count" name={t('analytics.count', 'Count')} radius={[4, 4, 0, 0]}>
                {stages.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
