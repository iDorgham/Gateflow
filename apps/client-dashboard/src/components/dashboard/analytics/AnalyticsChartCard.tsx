'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  cn,
} from '@gate-access/ui';
import { Info } from 'lucide-react';

interface AnalyticsChartCardProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  contentClassName?: string;
}

export function AnalyticsChartCard({
  title,
  tooltip,
  children,
  className,
  loading = false,
  contentClassName,
}: AnalyticsChartCardProps) {
  return (
    <Card className={cn('flex flex-col rounded-2xl border-border shadow-none hover:shadow-md hover:border-primary/20 transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground leading-none">
          {title}
        </h3>
        {tooltip && (
          <span
            className="text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors"
            title={tooltip}
            aria-label={tooltip}
          >
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </CardHeader>
      <CardContent className={cn('flex-1 px-5 pb-5 pt-0', contentClassName)}>
        {loading ? (
          <Skeleton className="h-full min-h-[200px] w-full rounded-xl" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
