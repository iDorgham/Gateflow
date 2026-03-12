'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DataPoint {
  plan: string;
  count: number;
}

interface PlanDistributionChartProps {
  data: DataPoint[];
}

const PLAN_COLORS: Record<string, string> = {
  FREE: 'hsl(215, 16%, 50%)',
  PRO: 'hsl(217, 91%, 60%)',
  ENTERPRISE: 'hsl(271, 91%, 65%)',
};

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={32}>
        <XAxis
          dataKey="plan"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
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
          formatter={(value: number) => [value.toLocaleString(), 'Orgs']}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.plan}
              fill={PLAN_COLORS[entry.plan] ?? 'hsl(var(--primary))'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
