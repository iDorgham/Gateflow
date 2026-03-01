'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@gate-access/ui';
import { Download } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface AnalyticsAudienceExportButtonProps {
  filters: AnalyticsFilters;
  className?: string;
}

function buildExportUrl(filters: AnalyticsFilters): string {
  const sp = new URLSearchParams();
  sp.set('dateFrom', filters.from);
  sp.set('dateTo', filters.to);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  if (filters.search) sp.set('search', filters.search);
  return `/api/analytics/export?${sp.toString()}`;
}

export function AnalyticsAudienceExportButton({ filters, className }: AnalyticsAudienceExportButtonProps) {
  const { t } = useTranslation('dashboard');
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const url = buildExportUrl(filters);
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'analytics-audience-export.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className={className}
    >
      <Download className="h-4 w-4 mr-1" />
      {loading ? t('analytics.exporting', 'Exporting…') : t('analytics.exportAudience', 'Export audience')}
    </Button>
  );
}
