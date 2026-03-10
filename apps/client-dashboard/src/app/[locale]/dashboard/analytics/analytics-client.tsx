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
  TotalVisitsChart,
  TopGatesChart,
  ScanOutcomeChart,
  NewVsReturningChart,
  UnitTypesRankingChart,
  VisitorTypeChart,
  TopUnitsChart,
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

      {/* Main charts: responsive grid (1/2/3/4 cols); wide charts use col-span-2 or col-span-full */}
      <div
        ref={chartsRef}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {/* Total Visits Over Time — shown in both modes */}
        <div className="md:col-span-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <TotalVisitsChart filters={filters} />
        </div>
        {isSecurity ? (
          <>
            <div className="md:col-span-2 min-h-[320px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsHeatmapChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <TopGatesChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <ScanOutcomeChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsOperatorLeaderboard filters={filters} className="min-h-[280px]" />
            </div>
          </>
        ) : (
          <>
            <div className="md:col-span-2 min-h-[320px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsFunnelChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <TopGatesChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <ScanOutcomeChart filters={filters} />
            </div>
            <div className="space-y-4 min-h-[200px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsCampaignBarChart filters={filters} className="min-h-[200px]" />
              <AnalyticsROIWidget attributedScans={attributedScans} />
            </div>
            <div className="col-span-full min-h-[200px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <AnalyticsPersonaPie className="min-h-[200px]" />
            </div>
          </>
        )}
        {/* Phase 4 — New vs Returning, Unit Types, Visitor Type, Top Units (both modes) */}
        <div className="md:col-span-2 min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <NewVsReturningChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <UnitTypesRankingChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <VisitorTypeChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <TopUnitsChart filters={filters} />
        </div>
      </div>

      {/* Apply filters to Contacts/Units */}
      <AnalyticsApplyFiltersButton locale={locale} filters={filters} />
    </div>
  );
}
