'use client';

import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { RefObject } from 'react';

interface ExportChartButtonProps {
  targetRef: RefObject<HTMLElement>;
}

export function ExportChartButton({ targetRef }: ExportChartButtonProps) {
  const { t } = useTranslation('dashboard');

  async function onExport() {
    if (!targetRef.current) {
      toast.error(t('analytics.exportPngFailed', 'Unable to export chart'));
      return;
    }

    try {
      const canvas = await html2canvas(targetRef.current, {
        useCORS: true,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `analytics-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      toast.success(t('analytics.exportPngSuccess', 'Chart exported as PNG'));
    } catch {
      toast.error(t('analytics.exportPngFailed', 'Unable to export chart'));
    }
  }

  return (
    <button
      type="button"
      onClick={onExport}
      className="no-print inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      aria-label={t('analytics.exportChart', 'Export chart')}
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {t('analytics.exportChart', 'Export chart')}
    </button>
  );
}
