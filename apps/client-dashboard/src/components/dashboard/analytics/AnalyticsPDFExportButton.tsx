'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@gate-access/ui';
import { FileText } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface AnalyticsPDFExportButtonProps {
  filters: AnalyticsFilters;
  className?: string;
}

function buildPdfExportUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  return `/api/analytics/export-pdf?${sp.toString()}`;
}

export function AnalyticsPDFExportButton({
  filters,
  className,
}: AnalyticsPDFExportButtonProps) {
  const { t } = useTranslation('dashboard');
  const [loading, setLoading] = useState(false);

  async function handleExportPdf() {
    setLoading(true);
    try {
      const url = buildPdfExportUrl(filters);
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `analytics-${filters.from}-to-${filters.to}.pdf`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportPdf}
      disabled={loading}
      className={className}
    >
      <FileText className="mr-1 h-4 w-4" />
      {loading
        ? t('analytics.exporting', 'Exporting…')
        : t('analytics.exportPdf', 'Export PDF')}
    </Button>
  );
}
