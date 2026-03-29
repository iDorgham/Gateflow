'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ScanFailureDataPoint {
  time: string;
  total: number;
  failures: number;
}

interface FailureAnalyticsChartProps {
  data: ScanFailureDataPoint[];
  isLoading?: boolean;
  className?: string;
}

export function FailureAnalyticsChart({
  data,
  isLoading,
  className,
}: FailureAnalyticsChartProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-ds-border bg-ds-surface p-4 flex flex-col gap-4',
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-ds-text font-semibold text-sm">
          Hardware Reliability Trend (24h)
        </h3>
        <p className="text-ds-text-subtle text-xs">
          Autonomous failure detection & scan stability monitoring.
        </p>
      </div>

      <div className="h-[200px] w-full">
        {isLoading ? (
          <div className="w-full h-full bg-ds-background-neutral-subtle animate-pulse rounded opacity-20" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--ds-border)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'var(--ds-text-subtle)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--ds-text-subtle)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ds-background-default)',
                  borderColor: 'var(--ds-border)',
                  fontSize: '11px',
                  borderRadius: '6px',
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', top: -20 }}
              />
              <Line
                name="Total Scans"
                type="monotone"
                dataKey="total"
                stroke="var(--ds-background-selected-bold)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                name="Failures"
                type="monotone"
                dataKey="failures"
                stroke="var(--ds-background-danger-bold)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
