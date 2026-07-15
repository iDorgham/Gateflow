'use client';

import * as React from 'react';
import { StatGrid, StatItem } from '@gateflow/components';
import {
  Users,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  ChevronDown,
  RefreshCcw,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from '@gateflow/ui';

// Lazy load ChartLab to match documentation pattern
const ChartLab = dynamic(() => import('./ChartLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-[var(--ds-surface-subtle)] animate-pulse rounded-3xl border border-[var(--ds-border-bold)]" />
  ),
});

export default function AnalyticsDashboardLab() {
  const [mode, setMode] = React.useState<'real-time' | 'historical'>(
    'real-time'
  );
  const [period, setPeriod] = React.useState('Last 7 Days');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const realTimeStats: StatItem[] = [
    {
      label: 'Live Concurrent Users',
      value: '482',
      trend: { value: '+42', direction: 'up' },
      icon: Users,
      variant: 'primary',
    },
    {
      label: 'Active Scanners',
      value: '24',
      trend: { value: 'Stable', direction: 'neutral' },
      icon: ShieldCheck,
      variant: 'success',
    },
    {
      label: 'Avg. Scan Speed',
      value: '1.2s',
      trend: { value: '-0.2s', direction: 'up' },
      icon: Zap,
      variant: 'info',
    },
    {
      label: 'Open Alerts',
      value: '3',
      trend: { value: '+1', direction: 'down' },
      icon: Activity,
      variant: 'danger',
    },
  ];

  const historicalStats: StatItem[] = [
    {
      label: 'Total Residents',
      value: '12.4k',
      trend: { value: '+8%', direction: 'up' },
      icon: Users,
      variant: 'primary',
    },
    {
      label: 'Total Scans (30d)',
      value: '142k',
      trend: { value: '+12%', direction: 'up' },
      icon: ShieldCheck,
      variant: 'success',
    },
    {
      label: 'Peak Latency',
      value: '450ms',
      trend: { value: '-20ms', direction: 'up' },
      icon: Zap,
      variant: 'info',
    },
    {
      label: 'Resolved Issues',
      value: '1,240',
      trend: { value: '98%', direction: 'neutral' },
      icon: Activity,
      variant: 'success',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col gap-6 p-1 rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-sunken)] shadow-2xl overflow-hidden group">
      {/* Dashboard Sub-Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 bg-[var(--ds-surface-subtle)] border-b border-[var(--ds-border-bold)]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Intelligence Hub
            </h3>
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest transition-all',
                mode === 'real-time'
                  ? 'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]'
                  : 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)]'
              )}
            >
              {mode}
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
            {mode === 'real-time'
              ? 'Live telemetry and access patterns for the current session.'
              : 'Historical trends and archival data analysis.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)]">
            <button
              onClick={() => setMode('real-time')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all',
                mode === 'real-time'
                  ? 'bg-[var(--ds-background-brand-bold)] text-white shadow-lg'
                  : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text-primary)]'
              )}
            >
              Real-time
            </button>
            <button
              onClick={() => setMode('historical')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all',
                mode === 'historical'
                  ? 'bg-[var(--ds-background-brand-bold)] text-white shadow-lg'
                  : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text-primary)]'
              )}
            >
              Historical
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--ds-border-bold)]" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="subtle"
                size="sm"
                className="bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)] hover:bg-[var(--ds-background-selected)] h-9"
              >
                <Calendar size={14} className="mr-2 opacity-60" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {period}
                </span>
                <ChevronDown size={14} className="ml-2 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['Today', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'].map(
                (p) => (
                  <DropdownMenuItem
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    {p}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="subtle"
            size="sm"
            onClick={handleRefresh}
            className="h-9 w-9 p-0 bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)]"
          >
            <RefreshCcw
              size={14}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-8">
        {/* Stat Grid Section */}
        <StatGrid
          stats={mode === 'real-time' ? realTimeStats : historicalStats}
          columns={4}
        />

        {/* Chart Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[var(--ds-primary-accent)]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-primary)]">
              {mode === 'real-time'
                ? 'Live Traffic Density'
                : 'Archival Traffic Analysis'}
            </h4>
          </div>
          <ChartLab mode={mode} />
        </div>
      </div>
    </div>
  );
}
