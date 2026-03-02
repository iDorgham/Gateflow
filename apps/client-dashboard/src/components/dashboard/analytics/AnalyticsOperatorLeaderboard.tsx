'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface OperatorRow {
  userId: string;
  name: string;
  email: string;
  scanCount: number;
}

interface AnalyticsOperatorLeaderboardProps {
  filters: AnalyticsFilters;
  className?: string;
}

function buildOperatorsUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  return `/api/analytics/operators?${sp.toString()}`;
}

export function AnalyticsOperatorLeaderboard({ filters, className }: AnalyticsOperatorLeaderboardProps) {
  const { t } = useTranslation('dashboard');
  const [data, setData] = useState<OperatorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(buildOperatorsUrl(filters), { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setError(json.message ?? 'Failed to load operators');
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

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.operatorLeaderboard', 'Top Operators')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center text-sm text-muted-foreground">
            {t('analytics.loading', 'Loading…')}
          </div>
        ) : error ? (
          <div className="flex min-h-[120px] items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('analytics.noOperators', 'No operator data in this period.')}</p>
        ) : (
          <ul className="space-y-2">
            {data.map((op, i) => (
              <li key={op.userId} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 w-5">{i + 1}.</span>
                  <span className="text-sm font-medium">{op.name || op.email || 'Unknown'}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{op.scanCount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
