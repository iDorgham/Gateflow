'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsFilterBar,
  AnalyticsModeToggle,
  AnalyticsKPICards,
  AnalyticsApplyFiltersButton,
  AnalyticsHeatmapChart,
  AnalyticsAnomalyCards,
  AnalyticsOperatorLeaderboard,
  AnalyticsFunnelChart,
  AnalyticsCampaignBarChart,
  AnalyticsPersonaPie,
  AnalyticsROIWidget,
  AnalyticsAudienceExportButton,
  type KPIData,
} from '@/components/dashboard/analytics';
import { useAnalyticsFilters, useAnalyticsSummary } from '@/lib/analytics';
import { PrintButton } from './print-button';
import { ExportChartButton } from './export-chart-button';
import { CopyLinkButton } from './copy-link-button';

interface AnalyticsClientProps {
  kpiData?: Partial<KPIData>;
  gates?: { id: string; name: string }[];
}

export function AnalyticsClient({ kpiData, gates = [] }: AnalyticsClientProps) {
  const chartsRef = useRef<HTMLDivElement>(null);
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
  const attributedScans = kpiDataToUse?.attributedScans ?? 0;

  return (
    <div className="space-y-6">
      {/* Header: title, mode toggle, export (Marketing), print */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('analytics.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('analytics.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {!isSecurity && (
            <AnalyticsAudienceExportButton filters={filters} />
          )}
          <ExportChartButton targetRef={chartsRef} />
          <CopyLinkButton />
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

      {/* Main charts: Security = heatmap + leaderboard; Marketing = funnel + campaign bar + ROI + persona */}
      <div ref={chartsRef} className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {isSecurity ? (
          <>
            <div className="lg:col-span-7" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsHeatmapChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="lg:col-span-5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsOperatorLeaderboard filters={filters} className="min-h-[280px]" />
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-7" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsFunnelChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="lg:col-span-5 space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsCampaignBarChart filters={filters} className="min-h-[200px]" />
              <AnalyticsROIWidget attributedScans={attributedScans} />
            </div>
            <div className="lg:col-span-12 lg:col-start-1" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsPersonaPie className="min-h-[200px]" />
            </div>
          </>
        )}
      </div>

      {/* Apply filters to Contacts/Units */}
      <AnalyticsApplyFiltersButton locale={locale} filters={filters} />
    </div>
  );
}
