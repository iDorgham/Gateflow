'use client';

import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@gate-access/ui';
import { CreditCard, Zap, Activity, ShieldCheck, Star, Calendar, Download, Save, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface BillingTabProps {
  org: {
    name: string;
    plan: string;
  };
  gateCount: number;
  qrCount: number;
}

const PLAN_INFO = {
  FREE: {
    description: 'Perfect for small venues and personal test labs.',
    features: ['3 Secured Gates', '100 QR Codes/month', 'Basic Scan Logs', 'Community Support'],
    accent: 'slate'
  },
  PRO: {
    description: 'Advanced features for growing venues and festivals.',
    features: ['20 Secured Gates', 'Unlimited QR Codes', 'Extended Analytics', 'API & Webhooks', 'Priority Support'],
    accent: 'blue',
  },
  ENTERPRISE: {
    description: 'Bespoke security for global enterprise deployments.',
    features: ['Unlimited Gates', 'Dedicated Infrastructure', 'SLA Guarantees', 'Deep Integrations', '24/7 Phone Support'],
    accent: 'violet'
  },
};

const MOCK_INVOICES = [
  { id: 'INV-2026-001', date: 'Feb 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Jan 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 01, 2025', amount: '$49.00', status: 'Paid' },
];

export function BillingTab({ org, gateCount, qrCount }: BillingTabProps) {
  const { t } = useTranslation('dashboard');
  const planName = org.plan as keyof typeof PLAN_INFO;
  const plan = PLAN_INFO[planName] || PLAN_INFO.FREE;

  const limits = {
    FREE: { gates: 3, qr: 100 },
    PRO: { gates: 20, qr: 1000000 },
    ENTERPRISE: { gates: Infinity, qr: Infinity },
  }[planName] || { gates: 3, qr: 100 };

  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(t('settings.billing.success.saved', 'Billing preferences saved.'));
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <CreditCard className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.billing.title', 'Finance & Quotas')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.billing.description', 'Manage active subscriptions, invoices, and system resource limits.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleSave} disabled={isPending} className="px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
            {t('common.saveChanges', 'Save Settings')}
          </Button>
        </div>
      </div>

      {/* Subscription Banner */}
      <Card className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 bg-card border border-border rounded-2xl p-8 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <Zap className="h-32 w-32 text-primary" />
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
            <Star className="h-3 w-3 fill-current" />
            {t('settings.billing.activePlan', 'Active Subscription')}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">{org.plan}</h1>
            <p className="text-muted-foreground max-w-md">
              {t(`settings.billing.plans.${planName}.description`, plan.description)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="p-4 rounded-xl bg-background border border-border/50 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('settings.billing.nextBilling', 'Next Billing Date')}</span>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              March 01, 2026
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs h-11 rounded-xl shadow-lg shadow-primary/20">
            {t('settings.billing.upgradePlan', 'Upgrade Subscription')}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions & Usage */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                {t('settings.billing.resourceUsage', 'Resource Allocation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">{t('settings.billing.activeGates', 'Gates')}</span>
                  <span className="text-foreground">{gateCount} / {limits.gates === Infinity ? '∞' : limits.gates}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (gateCount / (limits.gates === Infinity ? 1 : limits.gates)) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">{t('settings.billing.messages', 'Monthly QRs')}</span>
                  <span className="text-foreground">{qrCount} / {limits.qr === Infinity ? '∞' : limits.qr}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (qrCount / (limits.qr === Infinity ? 1 : limits.qr)) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-between text-xs font-bold uppercase tracking-widest h-10 hover:bg-primary/5 hover:text-primary transition-colors">
                  {t('settings.billing.detailedAnalytics', 'Detailed Usage Logs')}
                  <Activity className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                {t('settings.billing.paymentMethod', 'Payment Node')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 relative group cursor-pointer hover:border-primary/20 transition-all">
                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-card border border-border font-black text-[10px] text-muted-foreground italic shadow-sm">
                  VISA
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">•••• 4242</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Exp 12/26</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 border-border transition-all hover:bg-secondary">
                {t('settings.billing.managePayment', 'Update Billing Node')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Invoices */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-4 pt-6 px-8 flex flex-row items-center justify-between border-b border-border/50 bg-muted/5">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold uppercase tracking-tight">
                  {t('settings.billing.invoices', 'Billing & Finance History')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('settings.billing.invoicesDesc', 'Download and review your transactional records.')}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg font-bold uppercase tracking-widest text-[10px] gap-2 h-9">
                <Download className="h-3.5 w-3.5" />
                {t('settings.billing.exportAll', 'Export CSV')}
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="overflow-x-auto h-full">
                <table className="w-full text-left rtl:text-right border-collapse">
                  <thead className="bg-muted/30 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="px-8 py-4">{t('settings.billing.ref', 'Invoice ID')}</th>
                      <th className="px-8 py-4">{t('settings.billing.date', 'Date')}</th>
                      <th className="px-8 py-4">{t('settings.billing.amount', 'Amount')}</th>
                      <th className="px-8 py-4">{t('settings.billing.status', 'Status')}</th>
                      <th className="px-8 py-4 text-right rtl:text-left">{t('settings.billing.action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {MOCK_INVOICES.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-muted/20 transition-all">
                        <td className="px-8 py-5 font-mono text-[11px] font-semibold text-muted-foreground">{inv.id}</td>
                        <td className="px-8 py-5 text-xs font-bold text-muted-foreground/80 uppercase">{inv.date}</td>
                        <td className="px-8 py-5 text-sm font-black text-foreground">{inv.amount}</td>
                        <td className="px-8 py-5">
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none shadow-none font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right rtl:text-left">
                          <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px] text-primary hover:bg-primary/10 rounded-lg h-8">
                            {t('settings.billing.download', 'PDF')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
