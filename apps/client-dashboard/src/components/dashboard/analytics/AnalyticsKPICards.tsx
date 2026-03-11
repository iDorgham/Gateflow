'use client';

import { useTranslation } from 'react-i18next';
import { AnalyticsKPICard } from './AnalyticsKPICard';
import { ScanLine, ShieldCheck, Clock, Users, ShieldOff, BarChart2 } from 'lucide-react';

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

function formatPeakHour(h: number): string {
  if (h < 0) return '—';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}${ampm}`;
}

export function AnalyticsKPICards({ data }: AnalyticsKPICardsProps) {
  const { t } = useTranslation('dashboard');

  const totalVisits = data?.totalVisits ?? 0;
  const denied = data?.deniedScans ?? 0;
  const passRate =
    typeof data?.passRate === 'number' && data.passRate >= 0 && data.passRate <= 100
      ? Math.round(data.passRate)
      : totalVisits > 0
        ? Math.round(((totalVisits - denied) / totalVisits) * 100)
        : 0;
  const peakHour = data?.peakHour ?? -1;
  const uniqueVisitors = data?.uniqueVisitors ?? 0;
  const attributedScans = data?.attributedScans ?? 0;

  const passRateAccent =
    passRate >= 90 ? 'success' : passRate >= 70 ? 'warning' : 'destructive';

  const deniedAccent = denied === 0 ? 'success' : denied < 5 ? 'warning' : 'destructive';

  return (
    <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 lg:grid-cols-6">
      <AnalyticsKPICard
        title={t('analytics.kpiTotalVisits', 'Total Visits')}
        value={totalVisits.toLocaleString()}
        icon={ScanLine}
        accent="primary"
      />
      <AnalyticsKPICard
        title={t('analytics.kpiPassRate', 'Pass Rate')}
        value={`${passRate}%`}
        icon={ShieldCheck}
        accent={passRateAccent as 'success' | 'warning' | 'destructive'}
        subLabel={passRate >= 90 ? 'Excellent' : passRate >= 70 ? 'Good' : 'Needs attention'}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiPeakHour', 'Peak Hour')}
        value={formatPeakHour(peakHour)}
        icon={Clock}
        accent="default"
      />
      <AnalyticsKPICard
        title={t('analytics.kpiUniqueVisitors', 'Unique Visitors')}
        value={uniqueVisitors >= 0 ? uniqueVisitors.toLocaleString() : '—'}
        icon={Users}
        accent="default"
      />
      <AnalyticsKPICard
        title={t('analytics.kpiDeniedScans', 'Denied')}
        value={denied.toLocaleString()}
        icon={ShieldOff}
        accent={deniedAccent as 'success' | 'warning' | 'destructive'}
      />
      <AnalyticsKPICard
        title={t('analytics.kpiAttributedScans', 'Attributed')}
        value={attributedScans >= 0 ? attributedScans.toLocaleString() : '—'}
        icon={BarChart2}
        accent="default"
      />
    </div>
  );
}
