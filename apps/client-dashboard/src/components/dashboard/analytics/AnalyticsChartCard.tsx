'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@gate-access/ui';
import { Info } from 'lucide-react';

interface AnalyticsChartCardProps {
  /** Chart card title */
  title: string;
  /** Optional tooltip text (rendered as native title on info icon) */
  tooltip?: string;
  /** Chart content or placeholder */
  children: React.ReactNode;
  /** Additional class for the card root */
  className?: string;
  /** When true, show Skeleton inside CardContent instead of children */
  loading?: boolean;
  /** Optional content class (e.g. min-h for consistent card height) */
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
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {tooltip && (
          <span
            className="text-muted-foreground hover:text-foreground cursor-help"
            title={tooltip}
            aria-label={tooltip}
          >
            <Info className="h-4 w-4" />
          </span>
        )}
      </CardHeader>
      <CardContent className={cn('flex-1 pt-0', contentClassName)}>
        {loading ? (
          <Skeleton className="h-full min-h-[200px] w-full rounded-md" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
