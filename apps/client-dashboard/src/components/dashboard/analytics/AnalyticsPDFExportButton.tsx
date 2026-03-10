'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@gate-access/ui';
import { FileText } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';
import { downloadAnalyticsPdf } from '@/lib/analytics/pdf-export-client';

interface AnalyticsPDFExportButtonProps {
  filters: AnalyticsFilters;
  locale?: string;
  className?: string;
}

export function AnalyticsPDFExportButton({
  filters,
  locale,
  className,
}: AnalyticsPDFExportButtonProps) {
  const { t } = useTranslation('dashboard');
  const [loading, setLoading] = useState(false);

  async function handleExportPdf() {
    setLoading(true);
    try {
      await downloadAnalyticsPdf({ filters, locale });
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
