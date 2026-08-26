'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { HourlyTrafficBucket } from '../../../lib/analytics/operational-intelligence';

interface GateThroughputTrendsChartProps {
  data: HourlyTrafficBucket[];
  className?: string;
  isArabic?: boolean;
  peakHourLabel?: string;
}

export function GateThroughputTrendsChart({
  data,
  className = '',
  isArabic = false,
  peakHourLabel,
}: GateThroughputTrendsChartProps) {
  const totalScans = data.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${className}`}
      style={{
        borderColor: 'var(--ds-border, #dcdfe4)',
        backgroundColor: 'var(--ds-surface-raised, #ffffff)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3
            className="text-xs font-black uppercase tracking-wider"
            style={{ color: 'var(--ds-text-subtle, #626f86)' }}
          >
            {isArabic
              ? 'كثافة حركة البوابات (٢٤ ساعة)'
              : '24h Gate Throughput Velocity'}
          </h3>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: 'var(--ds-text, #172b4d)' }}
          >
            {isArabic
              ? `إجمالي المسحات: ${totalScans.toLocaleString('ar-EG')}`
              : `Total Scans: ${totalScans.toLocaleString('en-US')}`}
            {peakHourLabel && (
              <span
                className="ml-2 font-bold"
                style={{ color: 'var(--ds-text-brand, #0c66e4)' }}
              >
                •{' '}
                {isArabic
                  ? `ذروة الحركة: ${peakHourLabel}`
                  : `Peak: ${peakHourLabel}`}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="h-60 w-full">
        {totalScans === 0 ? (
          <div
            className="flex h-full w-full items-center justify-center rounded-xl border border-dashed text-xs font-semibold"
            style={{
              borderColor: 'var(--ds-border-subtle, #ebecf0)',
              color: 'var(--ds-text-subtlest, #8590a2)',
            }}
          >
            {isArabic
              ? 'لا توجد بيانات مسح مسجلة'
              : 'No gate scan activity recorded for this period'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="grantedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--ds-background-success-bold, #1f845a)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--ds-background-success-bold, #1f845a)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
                <linearGradient id="deniedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--ds-background-danger-bold, #ca3521)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--ds-background-danger-bold, #ca3521)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--ds-border-subtle, #ebecf0)"
              />
              <XAxis
                dataKey="hourLabel"
                stroke="var(--ds-text-subtlest, #8590a2)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--ds-text-subtlest, #8590a2)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--ds-surface-overlay, #ffffff)',
                  borderColor: 'var(--ds-border, #dcdfe4)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(9, 30, 66, 0.15)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="granted"
                name={isArabic ? 'دخول مصرح' : 'Granted'}
                stroke="var(--ds-border-success, #1f845a)"
                fillOpacity={1}
                fill="url(#grantedGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="denied"
                name={isArabic ? 'مرفوض' : 'Denied'}
                stroke="var(--ds-border-danger, #ca3521)"
                fillOpacity={1}
                fill="url(#deniedGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
