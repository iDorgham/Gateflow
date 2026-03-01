'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import { ShieldAlert, TrendingUp } from 'lucide-react';

interface SummaryData {
  totalVisits: number;
  passRate: number;
  deniedCount: number;
  lastHourCount?: number;
  hourlyAvg?: number;
}

interface AnalyticsAnomalyCardsProps {
  summary?: SummaryData | null;
  className?: string;
}

/** Rule 1: denied % > 5%; Rule 2: last hour > 2× hourly average */
export function AnalyticsAnomalyCards({ summary, className }: AnalyticsAnomalyCardsProps) {
  const { t } = useTranslation('dashboard');

  if (!summary) return null;

  const deniedPct = summary.totalVisits > 0
    ? Math.round((summary.deniedCount / summary.totalVisits) * 100)
    : 0;
  const rule1 = deniedPct > 5;
  const hourlyAvg = summary.hourlyAvg ?? 0;
  const lastHour = summary.lastHourCount ?? 0;
  const rule2 = hourlyAvg > 0 && lastHour > 2 * hourlyAvg;

  if (!rule1 && !rule2) return null;

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {rule1 && (
        <Card className="flex-1 min-w-[200px] border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldAlert className="h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t('analytics.anomalyDeniedHigh', 'High denial rate')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {t('analytics.anomalyDeniedDesc', '{{pct}}% of scans were denied (threshold 5%).', {
                  pct: deniedPct,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {rule2 && (
        <Card className="flex-1 min-w-[200px] border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-8 w-8 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                {t('analytics.anomalySpikeDetected', 'Scan spike detected')}
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {t('analytics.anomalySpikeDesc', 'Last hour ({{count}}) > 2× hourly avg ({{avg}}).', {
                  count: lastHour,
                  avg: hourlyAvg.toFixed(1),
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
