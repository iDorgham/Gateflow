'use client';

import { cn, Card, CardContent } from '@gate-access/ui';

interface AnalyticsKPICardProps {
  title: string;
  value: string | number;
  trend?: { pct: number; dir: 'up' | 'down' | 'flat' };
  className?: string;
}

export function AnalyticsKPICard({ title, value, trend, className }: AnalyticsKPICardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && trend.dir !== 'flat' && (
            <span
              className={cn(
                'text-sm font-medium',
                trend.dir === 'up' && 'text-success',
                trend.dir === 'down' && 'text-destructive'
              )}
            >
              {trend.dir === 'up' ? '+' : '-'}{trend.pct}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
