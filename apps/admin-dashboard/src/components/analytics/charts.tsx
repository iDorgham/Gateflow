'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';

// Mock data
const trendData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const distributionData = [
  { name: 'Web', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'API', value: 300 },
  { name: 'Legacy', value: 200 },
];

const funnelData = [
  { value: 100, name: 'Scanned', fill: '#8884d8' },
  { value: 80, name: 'Validated', fill: '#83a6ed' },
  { value: 50, name: 'Authorized', fill: '#8dd1e1' },
  { value: 40, name: 'Entered', fill: '#82ca9d' },
];

const gatesData = [
  { name: 'Gate Alpha', value: 1200 },
  { name: 'Gate Beta', value: 900 },
  { name: 'Gate Gamma', value: 1500 },
  { name: 'Gate Delta', value: 600 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function ScanTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--ds-background-brand-bold)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="var(--ds-background-brand-bold)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(255,255,255,0.05)"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10,
            fontWeight: 900,
            fill: 'var(--ds-text-subtler)',
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10,
            fontWeight: 900,
            fill: 'var(--ds-text-subtler)',
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--ds-background-neutral)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '10px',
          }}
          itemStyle={{
            fontSize: '12px',
            fontWeight: 900,
            color: 'var(--ds-text)',
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--ds-background-brand-bold)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SourceDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={distributionData}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ConversionFunnelChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <FunnelChart>
        <Tooltip />
        <Funnel dataKey="value" data={funnelData} isAnimationActive>
          <LabelList
            position="right"
            fill="var(--ds-text-subtler)"
            stroke="none"
            dataKey="name"
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

export function TopGatesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={gatesData} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="rgba(255,255,255,0.05)"
        />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10,
            fontWeight: 900,
            fill: 'var(--ds-text-subtler)',
          }}
        />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Bar
          dataKey="value"
          fill="var(--ds-background-brand-bold)"
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
