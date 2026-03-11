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
        <Card className="flex-1 min-w-[220px] rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5 text-warning" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-warning">
                {t('analytics.anomalyDeniedHigh', 'High denial rate')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('analytics.anomalyDeniedDesc', '{{pct}}% of scans denied (threshold 5%).', { pct: deniedPct })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {rule2 && (
        <Card className="flex-1 min-w-[220px] rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-destructive">
                {t('analytics.anomalySpikeDetected', 'Scan spike detected')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
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
