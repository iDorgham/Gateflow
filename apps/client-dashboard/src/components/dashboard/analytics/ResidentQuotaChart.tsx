'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { CHART_SUCCESS, CHART_DESTRUCTIVE } from '@/lib/analytics/chart-colors';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import type { QuotaUsageRow } from '@/lib/analytics/types';

function buildQuotaUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/quota?${sp.toString()}`;
}

async function fetchQuota(filters: AnalyticsFilters): Promise<QuotaUsageRow[]> {
  const res = await fetch(buildQuotaUrl(filters), { credentials: 'include' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to load quota');
  }
  return Array.isArray(json.data) ? json.data : [];
}

interface ResidentQuotaChartProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function ResidentQuotaChart({ filters, className }: ResidentQuotaChartProps) {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'quota', filters.from, filters.to, filters.projectId, filters.gateId],
    queryFn: () => fetchQuota(filters),
  });

  const isEmpty = !data || data.length === 0;
  const stubMessage = t('analytics.quotaComingSoon', 'No quota data yet. Coming soon.');

  return (
    <AnalyticsChartCard
      title={t('analytics.residentQuotaUsage', 'Resident Quota Usage')}
      tooltip={t('analytics.quotaDesc', 'Quota used vs limit by unit type (when available).')}
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
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <span>{stubMessage}</span>
        </div>
      )}
      {!error && !isEmpty && data && (
        <div className="space-y-4">
          {data.map((row, index) => {
            const pct = row.limit > 0 ? Math.min(100, Math.round((row.used / row.limit) * 100)) : 0;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{row.unitType}</span>
                  <span className="text-muted-foreground">
                    {row.used} / {row.limit}
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: 'hsl(var(--muted))' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 100 ? CHART_DESTRUCTIVE : CHART_SUCCESS,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AnalyticsChartCard>
  );
}
