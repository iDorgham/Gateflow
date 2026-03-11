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
  AnalyticsPDFExportButton,
  TotalVisitsChart,
  TopGatesChart,
  ScanOutcomeChart,
  NewVsReturningChart,
  UnitTypesRankingChart,
  VisitorTypeChart,
  TopUnitsChart,
  IncidentsChart,
  ResidentQuotaChart,
  PeakDaysChart,
  UTMAttributionChart,
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

// ─── Section Divider ──────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center gap-3 pt-2">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
  const dir = locale === 'ar' || locale === 'ar-EG' ? 'rtl' : 'ltr';

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-foreground">
            {t('analytics.title', 'Analytics')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t('analytics.subtitle', 'Track access patterns, security events, and visitor trends.')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
          <AnalyticsModeToggle mode={filters.mode} onModeChange={setMode} />
          {!isSecurity && <AnalyticsAudienceExportButton filters={filters} />}
          <AnalyticsPDFExportButton filters={filters} locale={locale} />
          <ExportChartButton targetRef={chartsRef} />
          <CopyLinkButton />
          <PrintButton />
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <AnalyticsFilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        gates={gates}
      />

      {/* ── KPI row ──────────────────────────────────────────────────────────── */}
      <AnalyticsKPICards data={kpiDataToUse} />

      {/* ── Anomaly cards (Security mode) ────────────────────────────────────── */}
      {isSecurity && <AnalyticsAnomalyCards summary={summary ?? undefined} />}

      {/* ── Charts grid ──────────────────────────────────────────────────────── */}
      <div
        ref={chartsRef}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* — Traffic overview — */}
        <SectionHeader label={t('analytics.sectionOverview', 'Traffic Overview')} />

        <div className="md:col-span-2 lg:col-span-3 min-h-[260px]" dir={dir}>
          <TotalVisitsChart filters={filters} />
        </div>

        {/* — Mode-specific charts — */}
        {isSecurity ? (
          <>
            <SectionHeader label={t('analytics.sectionSecurity', 'Security & Operations')} />

            <div className="md:col-span-2 lg:col-span-3 min-h-[320px]" dir={dir}>
              <AnalyticsHeatmapChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="min-h-[280px]" dir={dir}>
              <TopGatesChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={dir}>
              <ScanOutcomeChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={dir}>
              <AnalyticsOperatorLeaderboard filters={filters} className="min-h-[280px]" />
            </div>
          </>
        ) : (
          <>
            <SectionHeader label={t('analytics.sectionMarketing', 'Marketing Performance')} />

            <div className="md:col-span-2 lg:col-span-3 min-h-[320px]" dir={dir}>
              <AnalyticsFunnelChart filters={filters} locale={locale} className="min-h-[320px]" />
            </div>
            <div className="min-h-[280px]" dir={dir}>
              <TopGatesChart filters={filters} />
            </div>
            <div className="min-h-[280px]" dir={dir}>
              <ScanOutcomeChart filters={filters} />
            </div>
            <div className="space-y-4 min-h-[200px]" dir={dir}>
              <AnalyticsCampaignBarChart filters={filters} className="min-h-[200px]" />
              <AnalyticsROIWidget attributedScans={attributedScans} />
            </div>
            <div className="col-span-full min-h-[200px]" dir={dir}>
              <AnalyticsPersonaPie className="min-h-[200px]" />
            </div>
          </>
        )}

        {/* — Visitor insights — */}
        <SectionHeader label={t('analytics.sectionVisitors', 'Visitor Insights')} />

        <div className="md:col-span-2 lg:col-span-3 min-h-[280px]" dir={dir}>
          <NewVsReturningChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <UnitTypesRankingChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <VisitorTypeChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <TopUnitsChart filters={filters} />
        </div>

        {/* — Operations & compliance — */}
        <SectionHeader label={t('analytics.sectionOperations', 'Operations & Compliance')} />

        <div className="min-h-[280px]" dir={dir}>
          <IncidentsChart filters={filters} groupBy="gate" />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <ResidentQuotaChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <PeakDaysChart filters={filters} />
        </div>
        <div className="min-h-[280px]" dir={dir}>
          <UTMAttributionChart filters={filters} />
        </div>
      </div>

      {/* ── Footer export row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-5">
        <AnalyticsAudienceExportButton filters={filters} labelKey="analytics.exportCsv" />
        <AnalyticsPDFExportButton filters={filters} locale={locale} />
      </div>

      {/* ── Apply filters shortcut ────────────────────────────────────────────── */}
      <AnalyticsApplyFiltersButton locale={locale} filters={filters} />
    </div>
  );
}
