'use client';

import { useTranslation } from 'react-i18next';
import { cn, Button } from '@gate-access/ui';
import type { AnalyticsMode } from '@/lib/analytics/analytics-filters';

interface AnalyticsModeToggleProps {
  mode: AnalyticsMode;
  onModeChange: (mode: AnalyticsMode) => void;
  className?: string;
}

export function AnalyticsModeToggle({ mode, onModeChange, className }: AnalyticsModeToggleProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div
      role="group"
      aria-label={t('analytics.modeToggleAria', 'Dashboard view mode')}
      className={cn('inline-flex rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50 p-0.5', className)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('security')}
        role="radio"
        aria-checked={mode === 'security'}
        className={cn(
          'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          mode === 'security'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        )}
      >
        {t('analytics.modeSecurity', 'Security')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('marketing')}
        role="radio"
        aria-checked={mode === 'marketing'}
        className={cn(
          'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          mode === 'marketing'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        )}
      >
        {t('analytics.modeMarketing', 'Marketing')}
      </Button>
    </div>
  );
}
