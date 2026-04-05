'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Mail,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Plus,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { useOrganization } from '@/providers/organization-provider';
import { toast } from 'sonner';

/**
 * CRM Dashboard Component
 * High-fidelity Kanban board + AI Insights + Deal Forecasting
 */
export function CrmDashboard() {
  const { t } = useTranslation();
  const { orgId } = useOrganization();
  const [leads, setLeads] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('pipeline');

  // Mock data for forecasting chart
  const forecastData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
  ];

  React.useEffect(() => {
    async function fetchLeads() {
      if (!orgId) return;
      try {
        const response = await fetch(`/api/crm/leads?orgId=${orgId}`);
        if (response.ok) {
          const data = await response.json();
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, [orgId]);

  const scoreLead = async (leadId: string) => {
    toast.promise(
      fetch('/api/crm/score-lead', {
        method: 'POST',
        body: JSON.stringify({ leadId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to score lead');
        return res.json();
      }),
      {
        loading: 'AI is analyzing lead potential...',
        success: (data) =>
          `Lead scored: ${data.score}/100. ${data.nextBestAction}`,
        error: 'Failed to score lead',
      }
    );
  };

  const generateDraft = async (leadId: string) => {
    toast.promise(
      fetch('/api/crm/generate-draft', {
        method: 'POST',
        body: JSON.stringify({ leadId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to generate draft');
        return res.json();
      }),
      {
        loading: 'AI is drafting follow-up email...',
        success: 'Draft generated and pending review.',
        error: 'Failed to generate draft',
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 p-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ds-text uppercase">
            {t('crm:title', 'Lead Intelligence')}
          </h1>
          <p className="text-ds-text-subtle text-sm">
            {t('crm:subtitle', 'AI-powered CRM & Deal Forecasting Dashboard')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('crm:export', 'Export Data')}
          </Button>
          <Button className="gap-2 bg-ds-background-brand-bold text-ds-icon-inverse font-bold">
            <Plus className="h-4 w-4" />
            {t('crm:new_lead', 'Add New Lead')}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Leads',
            value: '1,284',
            growth: '+12.5%',
            icon: Users,
            color: 'text-blue-500',
          },
          {
            label: 'Pipeline Value',
            value: '$842K',
            growth: '+18.2%',
            icon: TrendingUp,
            color: 'text-emerald-500',
          },
          {
            label: 'AI Score Avg',
            value: '74',
            growth: 'Optimal',
            icon: Sparkles,
            color: 'text-amber-500',
          },
          {
            label: 'Closed Deals',
            value: '142',
            growth: '+5.4%',
            icon: CheckCircle2,
            color: 'text-purple-500',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-default"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn('p-2 rounded-lg bg-current/10', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-wider text-ds-text-subtler"
                >
                  {stat.growth}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-ds-text-subtler opacity-70">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-ds-text group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 border border-border/50 p-1">
          <TabsTrigger
            value="pipeline"
            className="gap-2 font-bold uppercase tracking-wide text-xs px-4"
          >
            <Target className="h-4 w-4" />
            {t('crm:tab_pipeline', 'Sales Pipeline')}
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="gap-2 font-bold uppercase tracking-wide text-xs px-4"
          >
            <TrendingUp className="h-4 w-4" />
            {t('crm:tab_forecast', 'Deal Forecast')}
          </TabsTrigger>
          <TabsTrigger
            value="ai_audit"
            className="gap-2 font-bold uppercase tracking-wide text-xs px-4"
          >
            <Sparkles className="h-4 w-4" />
            {t('crm:tab_ai_audit', 'AI Audit Logs')}
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent
            value="pipeline"
            className="mt-6 border-none focus-visible:ring-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Kanban Column: New Leads */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ds-text-subtler flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    New Leads (4)
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-ds-text-subtler"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {isLoading
                  ? Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                      ))
                  : leads
                      .filter((l) => l.status === 'NEW')
                      .map((lead) => (
                        <Card
                          key={lead.id}
                          className="border-border/50 bg-card/50 hover:border-primary/50 transition-all cursor-pointer group shadow-sm"
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-ds-text group-hover:text-primary transition-colors">
                                  {lead.source || 'Direct Lead'}
                                </span>
                                <span className="text-[10px] text-ds-text-subtler uppercase tracking-tight font-medium">
                                  Added Today
                                </span>
                              </div>
                              {lead.score ? (
                                <Badge className="bg-ds-background-brand-bold text-ds-icon-inverse font-black text-[10px]">
                                  {lead.score}
                                </Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-ds-text-brand hover:bg-ds-background-brand-subtle"
                                  onClick={() => scoreLead(lead.id)}
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[9px] uppercase tracking-widest bg-muted/50 border-border/50"
                              >
                                {lead.organization?.type || 'Standard'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs font-bold gap-1 text-ds-text-subtler hover:text-ds-text"
                                onClick={() => generateDraft(lead.id)}
                              >
                                <Mail className="h-3 w-3" />
                                {t('crm:draft', 'Draft AI')}
                              </Button>
                              <ChevronRight className="h-4 w-4 text-ds-text-subtler group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
              </div>

              {/* Kanban Column: Contacted */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ds-text-subtler flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Contacted (12)
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-ds-text-subtler"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {/* Empty State / Mock */}
                <div className="h-40 rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-ds-text-subtler bg-muted/10">
                  <Users className="h-8 w-8 opacity-20 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    Drop items here
                  </p>
                </div>
              </div>

              {/* Kanban Column: High Value / Qualified */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ds-text-subtler flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Qualified (3)
                  </h3>
                </div>
                <Card className="border-primary/20 bg-primary/5 shadow-md ring-1 ring-primary/10 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="h-16 w-16" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-ds-text uppercase tracking-tight">
                          Luxury Resort Alpha
                        </span>
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">
                          Enterprise Priority
                        </span>
                      </div>
                      <Badge className="bg-ds-background-brand-bold text-ds-icon-inverse font-black text-[10px]">
                        98
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-ds-background-brand-subtle/50 text-[11px] leading-relaxed font-bold border border-primary/10">
                      <span className="text-primary font-black">
                        AI Insight:
                      </span>{' '}
                      Highly likely to convert for Enterprise Gate Security.
                      Decision maker located in Dubai Hub.
                    </div>
                    <Button className="w-full gap-2 font-bold uppercase tracking-wider text-[10px] h-9">
                      Review Deal <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent
            value="forecast"
            className="mt-6 border-none focus-visible:ring-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              <Card className="lg:col-span-3 border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-80">
                    Value Forecast (Active Deals)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] w-full pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
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
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--ds-background-neutral)',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '10px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
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
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Card className="border-border/50 bg-ds-background-brand-bold text-ds-icon-inverse shadow-xl shadow-primary/20">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                        Projected Goal
                      </h3>
                      <p className="text-3xl font-black">$1.2M</p>
                      <p className="text-[10px] font-bold opacity-60">
                        BY Q3 END 2026
                      </p>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <p className="text-[10px] font-black text-center uppercase tracking-widest">
                      72% of target reached
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Risk Analysis
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-ds-text-subtle font-bold">
                        3 major industrial deals are delayed beyond expected
                        close date.
                        <span className="text-primary cursor-pointer hover:underline block mt-1">
                          Review blockers →
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent
            value="ai_audit"
            className="mt-6 border-none focus-visible:ring-0"
          >
            <Card className="border-border/50 bg-card/30">
              <CardContent className="p-0">
                <div className="p-6 border-b border-border/50">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                    Autonomous CRM Intelligence Log
                  </h3>
                </div>
                <div className="divide-y divide-border/30">
                  {[1, 2, 3].map((log) => (
                    <div
                      key={log}
                      className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-ds-background-brand-subtle flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-ds-text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-ds-text uppercase tracking-tight">
                            CRM_LEAD_SCORED
                          </h4>
                          <span className="text-[10px] text-ds-text-subtler font-bold">
                            2 HOURS AGO
                          </span>
                        </div>
                        <p className="text-xs text-ds-text-subtle leading-normal font-bold">
                          Successfully analyzed Lead #482 (MENA Region).
                          Assinged score of 84 based on organization vertical
                          alignment.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase font-bold border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
                          >
                            CONFIRMED
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
