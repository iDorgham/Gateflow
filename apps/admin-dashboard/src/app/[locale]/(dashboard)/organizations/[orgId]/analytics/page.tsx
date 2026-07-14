'use client';

import { useState, useEffect, use } from 'react';
import {
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  Calendar,
  Download,
  Sparkles,
  Cpu,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Cell,
  Pie,
} from 'recharts';
import { Button } from '@gate-access/ui/components/ui/button';
import { Badge } from '@gate-access/ui/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AnalyticsPage(props: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const params = use(props.params);
  const { orgId } = params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [orgId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics/overview?orgId=${orgId}`);
      const data = await res.json();
      if (data.success) {
        setData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3'];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-ds-text-subtle">
          Aggregating Neural Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8 bg-ds-background-neutral-subtle/20 overflow-y-auto ga-scroll">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Predictive Intelligence
          </h1>
          <p className="text-sm font-bold text-ds-text-subtle uppercase tracking-widest flex items-center gap-2 mt-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Real-time Performance & Conversion Forecasting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-ds-border/60 font-bold uppercase tracking-widest text-[10px] gap-2"
          >
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-xl shadow-blue-100">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Operations',
            value: data?.stats.totalScans,
            icon: Activity,
            trend: '+12.5%',
            color: 'blue',
          },
          {
            label: 'Lead Velocity',
            value: data?.stats.leadCount,
            icon: Users,
            trend: '+8.2%',
            color: 'indigo',
          },
          {
            label: 'Conversion Rate',
            value: `${data?.stats.conversionRate}%`,
            icon: MousePointerClick,
            trend: '+2.4%',
            color: 'purple',
          },
          {
            label: 'Neural Activity',
            value: data?.stats.aiActionCount,
            icon: Cpu,
            trend: '+45.0%',
            color: 'violet',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-ds-border/40 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-green-100 bg-green-50 text-green-600 text-[10px] font-bold px-2"
              >
                <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.trend}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                {stat.label}
              </p>
              <p className="text-3xl font-black italic tracking-tighter leading-none mt-1">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-ds-border/40 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black italic uppercase tracking-tighter text-lg">
                Growth & Engagement
              </h3>
              <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest mt-1">
                Cross-channel operation volume
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Operations
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Neural
                </span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                  itemStyle={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
                <Area
                  type="monotone"
                  dataKey="aiUsage"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel/Conversion Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-ds-border/40 shadow-sm flex flex-col space-y-8">
          <div>
            <h3 className="font-black italic uppercase tracking-tighter text-lg">
              Sales Pipeline
            </h3>
            <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest mt-1">
              Conversion velocity funnel
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between py-4">
            {[
              {
                label: 'Total Leads',
                value: data?.stats.leadCount,
                color: 'bg-blue-600',
                w: '100%',
              },
              {
                label: 'Opportunities',
                value: data?.stats.oppCount,
                color: 'bg-indigo-500',
                w: '65%',
              },
              {
                label: 'Closed Won',
                value: Math.floor(data?.stats.oppCount * 0.4),
                color: 'bg-purple-500',
                w: '30%',
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    {item.label}
                  </span>
                  <span className="font-black italic text-sm">
                    {item.value}
                  </span>
                </div>
                <div className="h-4 bg-ds-background-neutral-subtle rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.w }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${item.color} shadow-lg`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-ds-background-neutral-subtle/40 rounded-3xl border border-ds-border/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                AI Optimization Tip
              </span>
              <Badge className="bg-blue-600 animate-pulse">LIVE</Badge>
            </div>
            <p className="text-xs font-medium text-ds-text-main leading-relaxed">
              &ldquo;Lead conversion is up 2.4% this week. Improving your{' '}
              <span className="text-blue-600 font-bold underline">
                Response Automation
              </span>{' '}
              could yield an additional 15% growth.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-ds-border/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black italic uppercase tracking-tighter text-lg">
              Neural Cost Tracker
            </h3>
            <Badge
              variant="outline"
              className="rounded-xl font-bold uppercase tracking-widest text-[9px]"
            >
              v2.5 Omega
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', radius: 8 }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="aiUsage"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-all duration-1000" />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-black italic uppercase tracking-tighter text-2xl">
                AI Weekly Summary
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                &ldquo;Your organization is operating at 94% efficiency.
                Predictive models suggest a surge in traffic next Monday between
                8 AM and 10 AM. Gate configuration has been auto-optimized for
                high-density throughput.&rdquo;
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">
                    Efficiency Score
                  </p>
                  <p className="text-xl font-black italic tracking-tighter">
                    94.2
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">
                    System Health
                  </p>
                  <p className="text-xl font-black italic tracking-tighter">
                    NOMINAL
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black uppercase tracking-widest text-xs h-12 shadow-2xl shadow-blue-900/40">
              Generate Deep Dive Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
