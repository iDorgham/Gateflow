'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const chartData = [
  { name: 'Mon', value: 400, color: 'var(--ds-primary-accent)' },
  { name: 'Tue', value: 300, color: 'var(--gf-color-info)' },
  { name: 'Wed', value: 500, color: 'var(--gf-color-success)' },
  { name: 'Thu', value: 280, color: 'var(--gf-color-warning)' },
  { name: 'Fri', value: 590, color: 'var(--gf-color-danger)' },
];

export default function ChartLab() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-2xl relative overflow-hidden">
        {/* Abstract Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(var(--ds-text-primary) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--ds-border-subtle)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={
                  {
                    fill: 'var(--ds-text-subtlest)',
                    fontSize: 10,
                    fontWeight: 800,
                  } as React.ComponentProps<typeof XAxis>['tick']
                }
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={
                  {
                    fill: 'var(--ds-text-subtlest)',
                    fontSize: 10,
                    fontWeight: 800,
                  } as React.ComponentProps<typeof YAxis>['tick']
                }
              />
              <Tooltip
                cursor={{ fill: 'var(--ds-surface-raised)', opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: 'var(--ds-surface-overlay)',
                  border: '1px solid var(--ds-border-bold)',
                  borderRadius: '12px',
                  boxShadow: 'var(--ds-shadow-lg)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--ds-text-primary)',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-6 rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-subtle)] flex flex-col gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
            Institutional Palette
          </h4>
          <div className="flex flex-col gap-3">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-bold text-[var(--ds-text-primary)]">
                    {item.name} Series
                  </span>
                </div>
                <code className="text-[9px] font-mono text-[var(--ds-text-subtlest)]">
                  {item.color}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--ds-accent-bold)]/20 bg-[var(--ds-accent-subtle)]/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--ds-accent-bold)]">
            <PieChartIcon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Profile Sync
            </span>
          </div>
          <p className="text-[10px] font-medium text-[var(--ds-text-subtle)] leading-relaxed">
            The first series of any chart is bound to{' '}
            <strong>--ds-primary-accent</strong>. Try changing your accent
            profile in the Lab to see this dashboard update instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
