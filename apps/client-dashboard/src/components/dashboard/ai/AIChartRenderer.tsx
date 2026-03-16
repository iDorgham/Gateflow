'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import { getChartColor } from '@/lib/analytics/chart-colors';

export interface ChartDataBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie';
  title: string;
  data: any[];
  xAxisKey?: string;
  yAxisKey?: string;
}

interface AIChartRendererProps {
  config: ChartDataBlock;
}

export function AIChartRenderer({ config }: AIChartRendererProps) {
  const { chartType, title, data, xAxisKey = 'label', yAxisKey = 'value' } = config;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground italic">
        No data available for this chart.
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey={yAxisKey} 
              stroke="var(--ds-background-discovery-bold, #5243AA)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--ds-background-discovery-bold, #5243AA)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yAxisKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            />
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            />
            <Bar dataKey={yAxisKey} radius={[4, 4, 0, 0]} maxBarSize={30}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <Card className="my-4 border-[var(--ds-border-discovery,#998DD9)]/30 bg-white/50 shadow-sm overflow-hidden">
      <CardHeader className="py-3 px-4 bg-[var(--ds-background-discovery-subtle,#EAE6FF)]/20 border-b border-[var(--ds-border-discovery,#998DD9)]/10">
        <CardTitle className="text-sm font-medium text-[var(--ds-text-discovery,#403294)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
