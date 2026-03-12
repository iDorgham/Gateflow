'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DataPoint {
  label: string;
  total: number;
}

interface OrgGrowthChartProps {
  data: DataPoint[];
}

export function OrgGrowthChart({ data }: OrgGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
          formatter={(value: number) => [value.toLocaleString(), 'Total Orgs']}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(271, 91%, 65%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(271, 91%, 65%)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
