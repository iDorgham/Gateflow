'use client';

import * as React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Separator,
  ScrollArea,
  cn
} from '@gate-access/ui';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Sparkles, 
  Activity, 
  ArrowUpRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
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
  Cell,
  PieChart,
  Pie
} from 'recharts';

const AI_COST_DATA = [
  { name: 'Jan', Sales: 400, Marketing: 240, Dev: 180, Support: 120 },
  { name: 'Feb', Sales: 300, Marketing: 139, Dev: 200, Support: 190 },
  { name: 'Mar', Sales: 200, Marketing: 980, Dev: 220, Support: 150 },
  { name: 'Apr', Sales: 278, Marketing: 390, Dev: 250, Support: 180 },
];

const LEAD_FUNNEL_DATA = [
  { name: 'New Leads', value: 2400, fill: 'var(--ds-background-neutral-subtle)' },
  { name: 'Contacted', value: 1800, fill: 'var(--ds-background-brand-subtle)' },
  { name: 'Qualified', value: 1200, fill: 'var(--ds-background-brand-bold-muted, var(--ds-background-neutral-hovered))' },
  { name: 'Negot.', value: 800, fill: 'var(--ds-background-brand-bold-subtle, var(--ds-background-brand-subtle))' },
  { name: 'Closed', value: 450, fill: 'var(--ds-background-brand-bold)' },
];

/**
 * Predictive Ops Analytics Dashboard
 * 
 * A high-density visual intelligence hub for Super Admins.
 * Tracks business KPIs (CRM, Sales) alongside AI operational 
 * metrics (Cost, Latency, Token Usage) with predictive forecasts.
 */
export function OpsDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Value', value: '$1.2M', growth: '+12%', icon: DollarSign, color: 'text-ds-text-success' },
          { label: 'Active Leads', value: '450', growth: '+5%', icon: Users, color: 'text-ds-text-information' },
          { label: 'AI Efficiency', value: '84%', growth: '+2%', icon: Zap, color: 'text-ds-text-warning' },
          { label: 'Monthly AI Cost', value: '$4.2k', growth: '-8%', icon: Sparkles, color: 'text-ds-text-brand' },
        ].map((stat, i) => (
          <Card key={i} className="border-ds-border bg-ds-background-default shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">{stat.label}</p>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    <span className={cn("text-[10px] font-black", stat.growth.startsWith('+') ? "text-ds-text-success" : "text-ds-text-warning")}>
                      {stat.growth}
                    </span>
                    <span className="text-[10px] text-ds-text-subtle uppercase font-bold tracking-tighter">vs last month</span>
                  </div>
                </div>
                <div className={cn("p-2 rounded-xl bg-ds-background-neutral-subtle", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel 1: Lead Funnel Efficiency */}
        <Card className="lg:col-span-4 border-ds-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Lead Funnel</CardTitle>
              <Target className="h-4 w-4 text-ds-text-subtle" />
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEAD_FUNNEL_DATA} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', fill: 'var(--ds-text-subtle)' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--ds-background-default)', borderRadius: '12px', border: '1px solid var(--ds-border)', boxShadow: 'var(--ds-shadow-overlay)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {LEAD_FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Panel 2: AI Token & Cost Tracking */}
        <Card className="lg:col-span-8 border-ds-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-black uppercase tracking-widest">AI Cost by Department</CardTitle>
                <p className="text-[10px] text-ds-text-subtle font-bold uppercase tracking-widest">Across Gemini & GPT Models</p>
              </div>
              <Button variant="outline" size="sm" className="text-[9px] font-black uppercase tracking-widest h-8 px-4">
                View Billing Detail
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={AI_COST_DATA}>
                <defs>
                  <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--ds-background-information-bold)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--ds-background-information-bold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ds-border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--ds-text-subtle)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--ds-text-subtle)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--ds-background-default)', borderRadius: '12px', border: '1px solid var(--ds-border)', boxShadow: 'var(--ds-shadow-overlay)' }} />
                <Area type="monotone" dataKey="Marketing" stroke="var(--ds-background-information-bold)" strokeWidth={3} fillOpacity={1} fill="url(#colorMarketing)" />
                <Area type="monotone" dataKey="Sales" stroke="var(--ds-background-brand-bold)" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="Dev" stroke="var(--ds-background-brand-subtle)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategy Summary Card */}
      <Card className="border-ds-border-brand/30 bg-ds-background-brand-subtle/10 overflow-hidden relative group">
        <div className="absolute -right-12 -top-12 h-64 w-64 bg-ds-background-brand-bold/5 rounded-full blur-3xl group-hover:bg-ds-background-brand-bold/10 transition-all duration-500" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="h-5 w-5 text-ds-text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand">Executive Briefing AI</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-tight">Weekly Performance Summary</h2>
              <p className="text-sm text-ds-text-subtle max-w-2xl leading-relaxed">
                "Sales performance is up by 12% following the Phase 5 Landing Page roll-out. AI costs peaked on Wednesday during the high-volume blog generation cycle. Recommended action: Optimize prompt caching for repeated CMS translation calls to reduce cost by ~15%."
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <Badge className="bg-ds-background-brand-bold font-black text-[9px] tracking-widest uppercase px-3 py-1">Strategy Confirmed</Badge>
                <Badge variant="outline" className="border-ds-border-brand/30 text-ds-text-brand font-black text-[9px] tracking-widest uppercase px-3 py-1">Optimization Opportunity</Badge>
              </div>
            </div>
            <Button size="lg" className="bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover h-16 px-10 font-black text-[11px] tracking-widest uppercase shadow-xl shadow-ds-background-brand-bold/20">
              Download Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
