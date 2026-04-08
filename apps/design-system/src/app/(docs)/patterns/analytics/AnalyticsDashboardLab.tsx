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
} from '@gateflow/ui';

// Lazy load ChartLab to match documentation pattern
const ChartLab = dynamic(() => import('./ChartLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-[var(--ds-surface-subtle)] animate-pulse rounded-3xl border border-[var(--ds-border-bold)]" />
  ),
});

export default function AnalyticsDashboardLab() {
  const [period, setPeriod] = React.useState('Last 7 Days');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const mockStats: StatItem[] = [
    {
      label: 'Active Residents',
      value: '2,842',
      trend: { value: '+12%', direction: 'up' },
      icon: Users,
      variant: 'primary',
    },
    {
      label: 'Verified Scans',
      value: '45.2k',
      trend: { value: '+4.5%', direction: 'up' },
      icon: ShieldCheck,
      variant: 'success',
    },
    {
      label: 'System Latency',
      value: '142ms',
      trend: { value: '-8ms', direction: 'down' },
      icon: Zap,
      variant: 'info',
    },
    {
      label: 'Security incidents',
      value: '12',
      trend: { value: '+2', direction: 'neutral' },
      icon: Activity,
      variant: 'danger',
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
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Intelligence Hub
          </h3>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
            Real-time telemetry and access patterns for the current community.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="subtle"
                size="sm"
                className="bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)] hover:bg-[var(--ds-background-selected)]"
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
            className="h-8 w-8 p-0"
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
        <StatGrid stats={mockStats} columns={4} />

        {/* Chart Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[var(--ds-primary-accent)]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-primary)]">
              Traffic Density Analysis
            </h4>
          </div>
          <ChartLab />
        </div>
      </div>
    </div>
  );
}
