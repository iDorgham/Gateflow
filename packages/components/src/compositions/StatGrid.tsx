'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Card, CardContent } from '@gateflow/ui';

export interface StatItem {
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 1 | 2 | 3 | 4 | 5;
}

const colSpanMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 lg:grid-cols-5',
};

/**
 * StatGrid - Optimized for ADS Monorepo
 * Uses semantic tokens for status and depth.
 */
export function StatGrid({
  stats,
  columns = 4,
  className,
  ...props
}: StatGridProps) {
  return (
    <div
      className={cn('grid gap-4', colSpanMap[columns], className)}
      {...props}
    >
      {stats.map((stat, index) => (
        <Card
          key={`${stat.label}-${index}`}
          className="relative group overflow-hidden transition-all hover:scale-[1.01] hover:shadow-[var(--ds-shadow-raised)]"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--ds-text-subtle)] group-hover:text-[var(--ds-text-primary)] transition-colors">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black tracking-tight text-[var(--ds-text-primary)]">
                    {stat.value}
                  </h4>
                  {stat.trend && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full',
                        stat.trend.direction === 'up' &&
                          'text-[var(--ds-text-success)] bg-[var(--ds-background-success-subtle)]',
                        stat.trend.direction === 'down' &&
                          'text-[var(--ds-text-danger)] bg-[var(--ds-background-danger-subtle)]',
                        stat.trend.direction === 'neutral' &&
                          'text-[var(--ds-text-subtle)] bg-[var(--ds-background-neutral-subtle)]'
                      )}
                    >
                      {stat.trend.direction === 'up' && (
                        <TrendingUp size={11} />
                      )}
                      {stat.trend.direction === 'down' && (
                        <TrendingDown size={11} />
                      )}
                      <span>{stat.trend.value}</span>
                    </div>
                  )}
                </div>
                {stat.description && (
                  <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed line-clamp-1 opacity-70">
                    {stat.description}
                  </p>
                )}
              </div>
              {stat.icon && (
                <div className="shrink-0 p-2.5 rounded-xl bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] group-hover:bg-[var(--ds-background-selected)] group-hover:text-[var(--ds-primary-accent)] transition-colors">
                  <stat.icon size={22} strokeWidth={2.5} />
                </div>
              )}
            </div>
          </CardContent>
          {stat.variant && stat.variant !== 'default' && (
            <div
              className={cn(
                'absolute bottom-0 left-0 h-1 transition-all',
                stat.variant === 'primary' &&
                  'bg-[var(--ds-background-brand-bold)] w-1/3 group-hover:w-full',
                stat.variant === 'success' &&
                  'bg-[var(--ds-background-success-bold)] w-1/3 group-hover:w-full',
                stat.variant === 'warning' &&
                  'bg-[var(--ds-background-warning-bold)] w-1/3 group-hover:w-full',
                stat.variant === 'danger' &&
                  'bg-[var(--ds-background-danger-bold)] w-1/3 group-hover:w-full',
                stat.variant === 'info' &&
                  'bg-[var(--ds-background-information-bold)] w-1/3 group-hover:w-full'
              )}
            />
          )}
        </Card>
      ))}
    </div>
  );
}

StatGrid.displayName = 'StatGrid';
