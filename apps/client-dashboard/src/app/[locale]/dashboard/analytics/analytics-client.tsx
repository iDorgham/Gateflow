'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsFilterBar,
  AnalyticsModeToggle,
  AnalyticsKPICards,
  AnalyticsChartPlaceholder,
  AnalyticsApplyFiltersButton,
  type KPIData,
} from '@/components/dashboard/analytics';
import { useAnalyticsFilters } from '@/lib/analytics';
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

      {/* KPI row */}
      <AnalyticsKPICards data={kpiData} />

      {/* Main charts: 60/40 split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AnalyticsChartPlaceholder mode={filters.mode} className="min-h-[320px]" />
        </div>
        <div className="lg:col-span-5">
          <AnalyticsChartPlaceholder mode={filters.mode} className="min-h-[280px]" />
        </div>
      </div>

      {/* Apply filters to Contacts/Units */}
      <AnalyticsApplyFiltersButton locale={locale} filters={filters} />
    </div>
  );
}
