'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@gate-access/ui';
import { Shield, TrendingUp } from 'lucide-react';
import type { AnalyticsMode } from '@/lib/analytics/analytics-filters';

interface AnalyticsModeToggleProps {
  mode: AnalyticsMode;
  onModeChange: (mode: AnalyticsMode) => void;
  className?: string;
}

const MODES: { value: AnalyticsMode; Icon: React.ElementType; labelKey: string; fallback: string }[] = [
  { value: 'security', Icon: Shield, labelKey: 'analytics.modeSecurity', fallback: 'Security' },
  { value: 'marketing', Icon: TrendingUp, labelKey: 'analytics.modeMarketing', fallback: 'Marketing' },
];

export function AnalyticsModeToggle({ mode, onModeChange, className }: AnalyticsModeToggleProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div
      role="group"
      aria-label={t('analytics.modeToggleAria', 'Dashboard view mode')}
      className={cn('inline-flex rounded-xl border border-border bg-muted/50 p-1 gap-1', className)}
    >
      {MODES.map(({ value, Icon, labelKey, fallback }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => onModeChange(value)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all duration-200',
            mode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {t(labelKey, fallback)}
        </button>
      ))}
    </div>
  );
}
