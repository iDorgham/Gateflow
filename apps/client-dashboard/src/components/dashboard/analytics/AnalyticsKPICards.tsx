'use client';

import { useTranslation } from 'react-i18next';
import { AnalyticsKPICard } from './AnalyticsKPICard';

export interface KPIData {
  totalVisits: number;
  passRate: number;
  peakHour: number;
  uniqueVisitors: number;
  deniedScans: number;
  attributedScans: number;
}

interface AnalyticsKPICardsProps {
  data?: Partial<KPIData>;
}

export function AnalyticsKPICards({ data }: AnalyticsKPICardsProps) {
  const { t } = useTranslation('dashboard');

  const totalVisits = data?.totalVisits ?? 0;
  const denied = data?.deniedScans ?? 0;
  const successful = totalVisits - denied;
  const passRate = totalVisits > 0 ? Math.round((successful / totalVisits) * 100) : 0;
  const peakHour = data?.peakHour ?? 0;
  const uniqueVisitors = data?.uniqueVisitors ?? 0;
  const attributedScans = data?.attributedScans ?? 0;

  return (
    <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
      <AnalyticsKPICard
        title={t('analytics.kpiTotalVisits', 'Total Visits')}
        value={totalVisits.toLocaleString()}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiPassRate', 'Pass Rate')}
        value={`${passRate}%`}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiPeakHour', 'Peak Hour')}
        value={peakHour >= 0 ? `${peakHour}h` : '—'}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiUniqueVisitors', 'Unique Visitors')}
        value={uniqueVisitors >= 0 ? uniqueVisitors.toLocaleString() : '—'}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiDeniedScans', 'Denied Scans')}
        value={denied.toLocaleString()}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiAttributedScans', 'Attributed Scans')}
        value={attributedScans >= 0 ? attributedScans.toLocaleString() : '—'}
      />
    </div>
  );
}
