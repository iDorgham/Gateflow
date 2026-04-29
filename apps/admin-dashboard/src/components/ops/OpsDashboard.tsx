'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Brain,
  BarChart4,
  Users,
  Activity,
  ArrowUpRight,
  Cpu,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  cn,
} from '@gateflow/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { toast } from 'sonner';

/**
 * Predictive Analytics Hub
 * Executive cockpit for CRM metrics, AI costs, and Dept Performance.
 */
export function OpsDashboard() {
  const [isSummarizing, setIsSummarizing] = React.useState(false);

  const leadData = [
    { name: 'Jan', value: 450, growth: 12 },
    { name: 'Feb', value: 520, growth: 15 },
    { name: 'Mar', value: 610, growth: 18 },
    { name: 'Apr', value: 590, growth: 8 },
    { name: 'May', value: 720, growth: 22 },
  ];

  const aiCostData = [
    { name: 'MARKETING', cost: 1240, calls: 45000 },
    { name: 'SALES', cost: 890, calls: 32000 },
    { name: 'SUPPORT', cost: 450, calls: 15000 },
    { name: 'DEV', cost: 2100, calls: 78000 },
  ];

  const handleWeeklySummary = async () => {
    setIsSummarizing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)), // Simulation
      {
        loading: 'AI is synthesizing ops data...',
        success: 'Weekly Intelligence Briefing generated!',
        error: 'AI summarization failed.',
      }
    );
    setIsSummarizing(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-1000 overflow-y-auto pb-12">
      {/* QUICK STATS DOCK */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Deal Pipeline',
            value: '$2.4M',
            change: '+14%',
            icon: TrendingUp,
            color: 'text-emerald-500',
          },
          {
            label: 'AI Operations (30d)',
            value: '184k',
            change: '+22%',
            icon: Cpu,
            color: 'text-primary',
          },
          {
            label: 'Customer Sentiment',
            value: '92%',
            change: '+2%',
            icon: Brain,
            color: 'text-amber-500',
          },
          {
            label: 'Avg AI Costs / Dept',
            $value: '$1.2k',
            change: '-4%',
            icon: DollarSign,
            color: 'text-ds-text-subtle',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden group hover:border-primary/40 transition-all cursor-crosshair"
          >
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <div className={cn('p-2 rounded-xl bg-muted/50', stat.color)}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest border-border/30 h-6"
                >
                  {stat.change} <ArrowUpRight className="h-2.5 w-2.5 ml-1" />
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler opacity-60">
                  {stat.label}
                </p>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-ds-text">
                  {stat.value || stat.$value}
                </h2>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* MAIN LEAD FUNNEL (RECHARTS) */}
        <Card className="col-span-8 border-border/40 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" /> Lead IQ Pipeline
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none">
                PREDICTIVE ENABLED
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--ds-background-brand-bold))"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--ds-background-brand-bold))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fontWeight: 900,
                    fill: 'hsl(var(--ds-text-subtler))',
                  }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--ds-background-brand-bold))"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI COST BREAKDOWN (VERTICAL BAR) */}
        <Card className="col-span-4 border-border/40 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <BarChart4 className="h-4 w-4 text-primary" /> Dept AI Burn Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiCostData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fontWeight: 900,
                    fill: 'hsl(var(--ds-text-subtler))',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar
                  dataKey="cost"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* EXECUTIVE SUMMARY GENERATOR */}
        <Card className="col-span-7 border-primary/20 bg-primary/5 shadow-none group relative overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">
                  Ops Intelligence Briefing
                </h3>
                <p className="text-[10px] font-bold text-ds-text-subtle opacity-70">
                  Synthesize last 7 days of CRM, CMS, and AI usage logs into a
                  natural language executive summary.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-primary/30 h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 bg-background/50 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10"
                onClick={handleWeeklySummary}
                disabled={isSummarizing}
              >
                <Sparkles className="h-4 w-4" />{' '}
                {isSummarizing ? 'Synthesizing...' : 'Generate 7D Summary'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 relative z-10 pt-4">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase text-primary leading-none">
                  Sales Forecast
                </p>
                <p className="text-sm font-black uppercase tracking-tight">
                  On Track for Q2 • 94.2% Success
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase text-primary leading-none">
                  Content Health
                </p>
                <p className="text-sm font-black uppercase tracking-tight">
                  8 Blogs Published • 4.2k Views
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase text-primary leading-none">
                  System Load
                </p>
                <p className="text-sm font-black uppercase tracking-tight">
                  All Sensors Global Green
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Brain className="h-40 w-40" />
            </div>
          </CardContent>
        </Card>

        {/* REAL-TIME PULSE GAUGE */}
        <Card className="col-span-5 border-border/40 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" /> Platform Resilience
              Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-ds-text-subtler">
                  Rate Limit Saturation
                </span>
                <span className="text-emerald-500">12% SAFE</span>
              </div>
              <Progress value={12} className="h-1.5 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-ds-text-subtler">API Response P99</span>
                <span className="text-primary">124ms OPTIMAL</span>
              </div>
              <Progress value={45} className="h-1.5 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-ds-text-subtler">Cache Hit Ratio</span>
                <span className="text-ds-text">98.4% HIGH</span>
              </div>
              <Progress value={98} className="h-1.5 bg-muted shadow-sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
