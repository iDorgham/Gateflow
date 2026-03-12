'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DataPoint {
  label: string;
  count: number;
}

interface ScanTrendChartProps {
  data: DataPoint[];
}

export function ScanTrendChart({ data }: ScanTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--foreground))',
          }}
          labelStyle={{ fontWeight: 700 }}
          formatter={(value: number) => [value.toLocaleString(), 'Scans']}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          fill="url(#scanGradient)"
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(217, 91%, 60%)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
