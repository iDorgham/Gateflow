'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsFilterBar,
  AnalyticsModeToggle,
  AnalyticsKPICards,
  AnalyticsChartPlaceholder,
  AnalyticsApplyFiltersButton,
  AnalyticsHeatmapChart,
  AnalyticsAnomalyCards,
  AnalyticsOperatorLeaderboard,
  type KPIData,
} from '@/components/dashboard/analytics';
import { useAnalyticsFilters, useAnalyticsSummary } from '@/lib/analytics';
import { PrintButton } from './print-button';

interface AnalyticsClientProps {
  kpiData?: Partial<KPIData>;
  gates?: { id: string; name: string }[];
}

export function AnalyticsClient({ kpiData, gates = [] }: AnalyticsClientProps) {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const locale = (params?.locale as string) || 'en';
  const { filters, updateFilters, setMode } = useAnalyticsFilters();
  const { data: summary } = useAnalyticsSummary(filters, true);

  const kpiDataToUse = summary
    ? {
        totalVisits: summary.totalVisits,
        passRate: summary.passRate,
        peakHour: summary.peakHour,
        uniqueVisitors: summary.uniqueVisitors,
        deniedScans: summary.deniedCount,
        attributedScans: summary.attributedScans,
      }
    : kpiData;

  const isSecurity = filters.mode === 'security';

  return (
    <div className="space-y-6">
      {/* Header: title, mode toggle, print */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('analytics.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('analytics.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsModeToggle mode={filters.mode} onModeChange={setMode} />
          <PrintButton />
        </div>
      </div>

      {/* Filter bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        gates={gates}
      />

      {/* KPI row (short-polled via summary) */}
      <AnalyticsKPICards data={kpiDataToUse} />

      {/* Anomaly cards (Security mode only) */}
      {isSecurity && <AnalyticsAnomalyCards summary={summary ?? undefined} />}

      {/* Main charts: 60/40 split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {isSecurity ? (
          <>
            <div className="lg:col-span-7">
              <AnalyticsHeatmapChart filters={filters} className="min-h-[320px]" />
            </div>
            <div className="lg:col-span-5">
              <AnalyticsOperatorLeaderboard filters={filters} className="min-h-[280px]" />
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-7">
              <AnalyticsChartPlaceholder mode={filters.mode} className="min-h-[320px]" />
            </div>
            <div className="lg:col-span-5">
              <AnalyticsChartPlaceholder mode={filters.mode} className="min-h-[280px]" />
            </div>
          </>
        )}
      </div>

      {/* Apply filters to Contacts/Units */}
      <AnalyticsApplyFiltersButton locale={locale} filters={filters} />
    </div>
  );
}
