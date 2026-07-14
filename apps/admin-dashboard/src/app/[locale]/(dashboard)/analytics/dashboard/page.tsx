'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Scan,
  DollarSign,
  Target,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gateflow/ui';
import {
  ScanTrendChart,
  ConversionFunnelChart,
  SourceDistributionChart,
  TopGatesChart,
} from '@/components/analytics/charts';

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-ds-icon-brand" />
            Intelligence Hub
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Visualizing neural data trajectories and operational capital flow
          </p>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
              >
                <Calendar className="h-4 w-4" />{' '}
                {timeRange === '7d'
                  ? 'Last 7 Days'
                  : timeRange === '30d'
                    ? 'Last 30 Days'
                    : 'Last 90 Days'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-ds-border">
              <DropdownMenuItem
                onClick={() => setTimeRange('7d')}
                className="text-[10px] font-black uppercase py-2.5"
              >
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeRange('30d')}
                className="text-[10px] font-black uppercase py-2.5"
              >
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeRange('90d')}
                className="text-[10px] font-black uppercase py-2.5"
              >
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="h-11 border-ds-border gap-2 text-[10px] font-black uppercase tracking-widest px-4"
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Scans',
            value: '1.2M',
            growth: '+12.5%',
            trend: 'up',
            icon: Scan,
          },
          {
            label: 'Active Users',
            value: '84.2K',
            growth: '+5.4%',
            trend: 'up',
            icon: Users,
          },
          {
            label: 'Total Revenue',
            value: '$284K',
            growth: '-2.1%',
            trend: 'down',
            icon: DollarSign,
          },
          {
            label: 'Conversion',
            value: '4.8%',
            growth: '+0.8%',
            trend: 'up',
            icon: Target,
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="border-ds-border bg-card/40 backdrop-blur-md overflow-hidden border-dashed group hover:border-ds-border-brand/30 transition-all"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-ds-background-brand-subtle/50 text-ds-text-brand">
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-[10px] font-black uppercase tracking-widest',
                    kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                  )}
                >
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.growth}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtler mb-1">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-black text-ds-text">
                  {kpi.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-ds-border bg-card/40 border-dashed overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-ds-text-subtler">
                Scan Intensity Trajectory
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[9px] font-black uppercase bg-ds-background-brand-subtle text-ds-text-brand px-3 h-7 rounded-full"
                >
                  Intensity
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[9px] font-black uppercase text-ds-text-subtler px-3 h-7 rounded-full"
                >
                  Volume
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] w-full p-6">
                <ScanTrendChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-ds-border bg-card/40 border-dashed overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-ds-text-subtler">
                  Source Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] p-6">
                <SourceDistributionChart />
              </CardContent>
            </Card>
            <Card className="border-ds-border bg-card/40 border-dashed overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-ds-text-subtler">
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] p-6">
                <ConversionFunnelChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <Card className="border-ds-border bg-ds-background-brand-bold text-ds-icon-inverse shadow-xl shadow-primary/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  AI Intelligence Insight
                </h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-lg font-black leading-tight">
                    Dubai-A Hub scanner efficiency increased by 14%.
                  </p>
                  <p className="text-xs font-medium opacity-70 leading-relaxed">
                    Systemic optimization of regional firmware nodes has
                    resulted in lower latency across the cluster.
                  </p>
                </div>
                <Button className="w-full h-10 bg-white text-ds-background-brand-bold font-black uppercase tracking-widest text-[10px] gap-2">
                  View Detail Analysis <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border bg-card/40 border-dashed">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] p-6">
                <TopGatesChart />
              </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border bg-card/40 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-4 w-4 text-ds-text-subtler" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                  Audit Logs
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  { event: 'ANALYTICS_EXPORTED', time: '2m ago' },
                  { event: 'AI_INSIGHT_GEN', time: '1h ago' },
                  { event: 'REVENUE_CALC_DONE', time: '4h ago' },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight"
                  >
                    <span className="opacity-70">{log.event}</span>
                    <span className="text-ds-text-subtler">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
