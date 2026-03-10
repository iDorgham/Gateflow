'use client';

import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

export function buildAnalyticsPdfExportUrl(
  filters: AnalyticsFilters,
  locale?: string
): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  if (locale) sp.set('locale', locale);
  return `/api/analytics/export-pdf?${sp.toString()}`;
}

export async function downloadAnalyticsPdf(params: {
  filters: AnalyticsFilters;
  locale?: string;
  filename?: string;
}): Promise<void> {
  const url = buildAnalyticsPdfExportUrl(params.filters, params.locale);
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());

  const blob = await res.blob();
  const downloadUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download =
      params.filename ??
      `analytics-${params.filters.from}-to-${params.filters.to}.pdf`;
    a.click();
  } finally {
    URL.revokeObjectURL(downloadUrl);
  }
}

