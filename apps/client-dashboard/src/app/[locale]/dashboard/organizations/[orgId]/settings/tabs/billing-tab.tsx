'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@gate-access/ui';
import { CreditCard, Zap, Activity, Star, Calendar, Download, Save, Info, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PlanCards } from '../../workspace/billing/plan-cards';

interface BillingTabProps {
  org: {
    name: string;
    plan: string;
    stripeCustomerId?: string | null;
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
    description: 'Bespoke infrastructure for large-scale operations.',
    features: ['Unlimited Secured Gates', 'Unlimited QR Codes', 'White-label Options', 'Dedicated Support', 'Custom Integrations'],
    accent: 'violet',
  }
};

const PLANS_FOR_CARDS = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    features: ['3 gates', '100 QR codes/month', 'Basic support'],
  },
  {
    name: 'PRO',
    price: '$49',
    period: 'per month',
    features: [
      '20 gates',
      'Unlimited QR codes',
      'Extended analytics',
      'API & Webhooks',
      'Priority support',
    ],
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited gates',
      'Unlimited everything',
      'SSO / SAML',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
];

const MOCK_INVOICES = [
  { id: 'INV-2026-001', date: 'Feb 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Jan 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 01, 2025', amount: '$49.00', status: 'Paid' },
];

export function BillingTab({ org, gateCount, qrCount }: BillingTabProps) {
  const { t } = useTranslation('dashboard');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const planName = org.plan as keyof typeof PLAN_INFO;
  const plan = PLAN_INFO[planName] || PLAN_INFO.FREE;

  const limits = {
    FREE: { gates: 3, qr: 100 },
    PRO: { gates: 20, qr: 1000000 },
    ENTERPRISE: { gates: Infinity, qr: Infinity },
  }[planName] || { gates: 3, qr: 100 };

  const handleUpgrade = async (pName: string) => {
    setLoadingPlan(pName);
    try {
      const res = await fetch('/api/workspace/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: pName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout');

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Upgrade error:', err);
      toast.error(err.message || 'Something went wrong');
      setLoadingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    if (!org.stripeCustomerId) {
      toast.error('No billing record found. Please subscribe to a plan first.');
      return;
    }

    setIsPortalLoading(true);
    try {
      const res = await fetch('/api/workspace/billing/portal', {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal');

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Portal error:', err);
      toast.error(err.message || 'Something went wrong');
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
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
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
              {t(`settings.workspace.plans.${planName}.label`, org.plan)}
            </h1>
            <p className="text-muted-foreground max-w-md">
              {t(`settings.workspace.plans.${planName}.description`, plan.description)}
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
          {org.stripeCustomerId && (
            <Button 
              onClick={handleManageBilling}
              disabled={isPortalLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs h-11 rounded-xl shadow-lg shadow-primary/20"
            >
              {isPortalLoading && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              {t('settings.billing.manageSubscription', 'Manage Subscription')}
            </Button>
          )}
        </div>
      </Card>

      {/* Plan Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Available Plans</h2>
        <PlanCards 
          plans={PLANS_FOR_CARDS} 
          currentPlan={org.plan} 
          onUpgrade={handleUpgrade}
          loadingPlan={loadingPlan}
        />
      </div>

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
                  <span className="text-muted-foreground">{t('sidebar.gates', 'Gates')}</span>
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
                  <span className="text-muted-foreground">{t('sidebar.qrCodes', 'QR Codes')}</span>
                  <span className="text-foreground">{qrCount} / {limits.qr === Infinity ? '∞' : limits.qr}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (qrCount / (limits.qr === Infinity ? 1 : limits.qr)) * 100)}%` }} 
                  />
                </div>
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
                  {org.stripeCustomerId ? 'STRIPE' : 'NONE'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">
                    {org.stripeCustomerId ? 'Active Account' : 'No Account'}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                    {org.stripeCustomerId ? 'Managed via portal' : 'Subscribe to start'}
                  </p>
                </div>
              </div>
              {org.stripeCustomerId && (
                <Button 
                  variant="outline" 
                  onClick={handleManageBilling}
                  disabled={isPortalLoading}
                  className="mt-4 w-full rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 border-border transition-all hover:bg-secondary"
                >
                  {isPortalLoading && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                  {t('settings.billing.managePayment', 'Update Billing Node')}
                </Button>
              )}
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
              {org.stripeCustomerId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageBilling}
                  className="hidden sm:flex rounded-lg font-bold uppercase tracking-widest text-[10px] gap-2 h-9"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t('settings.billing.viewInStripe', 'View in Stripe')}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm font-medium italic">
                {org.stripeCustomerId 
                  ? 'Invoice history is managed in the Stripe Customer Portal.'
                  : 'No invoice history found.'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
