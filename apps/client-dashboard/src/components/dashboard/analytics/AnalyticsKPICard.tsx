'use client';

import { cn, Card, CardContent } from '@gate-access/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AnalyticsKPICardProps {
  title: string;
  value: string | number;
  trend?: { pct: number; dir: 'up' | 'down' | 'flat' };
  className?: string;
  icon?: LucideIcon;
  /** Color accent: 'default' | 'success' | 'destructive' | 'warning' | 'primary' */
  accent?: 'default' | 'success' | 'destructive' | 'warning' | 'primary';
  /** Sub-label shown below the value */
  subLabel?: string;
}

const ACCENT_CLASSES = {
  default:     { icon: 'bg-muted text-muted-foreground', value: 'text-foreground' },
  success:     { icon: 'bg-success/10 text-success', value: 'text-success' },
  destructive: { icon: 'bg-destructive/10 text-destructive', value: 'text-destructive' },
  warning:     { icon: 'bg-warning/10 text-warning', value: 'text-warning' },
  primary:     { icon: 'bg-primary/10 text-primary', value: 'text-primary' },
};

export function AnalyticsKPICard({
  title,
  value,
  trend,
  className,
  icon: Icon,
  accent = 'default',
  subLabel,
}: AnalyticsKPICardProps) {
  const classes = ACCENT_CLASSES[accent];

  return (
    <Card className={cn('h-full rounded-2xl border-border shadow-none hover:shadow-md hover:border-primary/20 transition-all duration-300', className)}>
      <CardContent className="p-4 h-full flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">
            {title}
          </p>
          {Icon && (
            <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center shrink-0', classes.icon)}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className={cn('text-3xl font-black tabular-nums leading-none', classes.value)}>
              {value}
            </span>
            {trend && trend.dir !== 'flat' && (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-xs font-bold',
                  trend.dir === 'up' ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.dir === 'up'
                  ? <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  : <TrendingDown className="h-3 w-3" aria-hidden="true" />
                }
                {trend.pct}%
              </span>
            )}
            {trend && trend.dir === 'flat' && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-muted-foreground/50">
                <Minus className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </div>
          {subLabel && (
            <p className="text-[10px] text-muted-foreground/60 font-medium">{subLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
