import * as React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@gate-access/ui';

export interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: { label: string; value: number }[];
  className?: string;
}

export function AnalyticsChart({
  title,
  description,
  data,
  className,
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-success bg-success/10 px-2 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] mt-4 flex items-end gap-2 justify-between">
          {data.map((item, i) => {
            const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 flex-1 group"
              >
                <div className="w-full relative flex items-end justify-center rounded-t-md overflow-hidden bg-muted/20 h-full">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all duration-500 ease-out group-hover:bg-primary/80"
                    style={{ height: `${heightPct}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                    {item.value}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
