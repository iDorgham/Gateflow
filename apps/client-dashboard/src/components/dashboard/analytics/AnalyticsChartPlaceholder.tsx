'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@gate-access/ui';
import type { AnalyticsMode } from '@/lib/analytics/analytics-filters';

interface AnalyticsChartPlaceholderProps {
  mode: AnalyticsMode;
  className?: string;
}

export function AnalyticsChartPlaceholder({ mode, className }: AnalyticsChartPlaceholderProps) {
  const { t } = useTranslation('dashboard');

  const label =
    mode === 'security'
      ? t('analytics.placeholderHeatmap', 'Heatmap: Scan intensity by day and hour')
      : t('analytics.placeholderFunnel', 'Attribution funnel: QR → Opened → Scanned');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted min-h-[280px]',
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t('analytics.placeholderComingSoon', 'Coming in Phase 2')}
      </p>
    </div>
  );
}
