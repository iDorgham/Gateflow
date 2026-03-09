'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

const DOW_LABELS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

interface HeatmapCell {
  dow: number;
  hour: number;
  count: number;
}

interface AnalyticsHeatmapChartProps {
  filters: AnalyticsFilters;
  locale?: string;
  className?: string;
}

function buildHeatmapUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/heatmap?${sp.toString()}`;
}

export function AnalyticsHeatmapChart({ filters, locale: _locale, className }: AnalyticsHeatmapChartProps) {
  const { t } = useTranslation('dashboard');
  const [data, setData] = useState<HeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(buildHeatmapUrl(filters), { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setError(json.message ?? 'Failed to load heatmap');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when API params change
  }, [filters.from, filters.to, filters.projectId, filters.gateId]);

  const maxCount = Math.max(...data.map((c) => c.count), 1);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.peakHoursHeatmap')}</CardTitle>
        <CardDescription>{t('analytics.peakHoursDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <Skeleton className="min-h-[220px] w-full rounded-md" />
        ) : error ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <div className="min-w-[560px]">
            <div className="mb-1 flex">
              <div className="w-10 shrink-0" />
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={h}
                  className="flex-1 text-center text-[9px] text-muted-foreground"
                  style={{ minWidth: 18 }}
                >
                  {h % 4 === 0 ? t('analytics.hourLabel', { h }) : ''}
                </div>
              ))}
            </div>
            {DOW_LABELS.map((dayKey, dow) => (
              <div key={dow} className="flex items-center">
                <div className="w-10 shrink-0 pr-2 text-right text-[10px] text-muted-foreground">
                  {t(`analytics.daysOfWeek.${dayKey}`)}
                </div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = data.find((c) => c.dow === dow && c.hour === hour);
                  const intensity = cell ? cell.count / maxCount : 0;
                  const dayLabel = t(`analytics.daysOfWeek.${dayKey}`);
                  return (
                    <div
                      key={hour}
                      title={
                        cell
                          ? `${dayLabel} ${hour}:00 — ${cell.count} ${t('analytics.scans')}`
                          : undefined
                      }
                      className="m-[1px] flex-1 rounded-sm"
                      style={{
                        minWidth: 16,
                        height: 16,
                        backgroundColor:
                          intensity > 0
                            ? `rgba(var(--primary-rgb),${Math.max(0.08, intensity)})`
                            : 'hsl(var(--muted))',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
