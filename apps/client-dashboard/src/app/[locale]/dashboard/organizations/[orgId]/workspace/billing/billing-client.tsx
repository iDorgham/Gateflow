'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@gate-access/ui';
import { PlanCards } from './plan-cards';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';
import { CreditCard, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BillingClientProps {
  org: {
    name: string;
    plan: string;
    stripeCustomerId?: string | null;
  };
  gateCount: number;
  qrCount: number;
}

const PLANS = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    features: ['3 gates', '100 QR codes/month', '1,000 scans/month', 'Email support'],
  },
  {
    name: 'PRO',
    price: '$49',
    period: 'per month',
    features: [
      '20 gates',
      'Unlimited QR codes',
      '100,000 scans/month',
      'Priority support',
      'Analytics',
      'API access',
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
      'Custom integrations',
    ],
  },
];

const MOCK_INVOICES = [
  { id: 'INV-001', date: '2026-01-01', amount: '$49.00', status: 'Paid' },
  { id: 'INV-002', date: '2025-12-01', amount: '$49.00', status: 'Paid' },
  { id: 'INV-003', date: '2025-11-01', amount: '$49.00', status: 'Paid' },
];

export function BillingClient({ org, gateCount, qrCount }: BillingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const limits = {
    FREE: { gates: 3, qr: 100 },
    PRO: { gates: 20, qr: 1000000 },
    ENTERPRISE: { gates: Infinity, qr: Infinity },
  }[org.plan as 'FREE' | 'PRO' | 'ENTERPRISE'] || { gates: 3, qr: 100 };

  const handleUpgrade = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const res = await fetch('/api/workspace/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
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

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Usage Overview" icon={Activity}>
        <div className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 dark:text-slate-400 uppercase">Gates Created</span>
              <span className="text-slate-900 dark:text-white">{gateCount} / {limits.gates === Infinity ? '∞' : limits.gates}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${Math.min(100, (gateCount / (limits.gates === Infinity ? 1 : limits.gates)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 dark:text-slate-400 uppercase">QR Code Usage</span>
              <span className="text-slate-900 dark:text-white">{qrCount} / {limits.qr === Infinity ? '∞' : limits.qr}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${Math.min(100, (qrCount / (limits.qr === Infinity ? 1 : limits.qr)) * 100)}%` }} 
              />
            </div>
          </div>

          <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed italic">
            Usage resets on the 1st of every month.
          </p>
        </div>
      </SidebarSection>

      <SidebarSection title="Payment Method" icon={CreditCard}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          {org.stripeCustomerId ? (
            <>
              <div className="flex items-center gap-3">
                 <div className="h-8 w-12 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-[10px] text-slate-400">
                    STRIPE
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-900 dark:text-white">Active Account</p>
                   <p className="text-[10px] text-slate-500 font-medium">Managed via portal</p>
                 </div>
              </div>
              <button 
                onClick={handleManageBilling}
                disabled={isPortalLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 py-2 transition-colors dark:text-slate-300 disabled:opacity-50"
              >
                {isPortalLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                Manage in Stripe
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-500 font-medium text-center py-2">
              No active subscription yet.
            </p>
          )}
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage your subscription plan, invoices, and billing details.</p>
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">
        {/* Current plan */}
        <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Current Plan</CardTitle>
                <CardDescription className="text-slate-500 font-medium">{org.name}</CardDescription>
              </div>
              <Badge
                className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                  org.plan === 'PRO'
                    ? 'bg-blue-100 text-blue-700'
                    : org.plan === 'ENTERPRISE'
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {org.plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="bg-slate-50/50 dark:bg-slate-800/50 py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {org.plan === 'FREE'
                ? 'You are on the free plan. Upgrade to unlock more features.'
                : `Your ${org.plan} subscription is active.`}
            </p>
          </CardContent>
        </Card>

        {/* Plan cards */}
        <PlanCards 
          plans={PLANS} 
          currentPlan={org.plan} 
          onUpgrade={handleUpgrade}
          loadingPlan={loadingPlan}
        />

        {/* Invoice history - Hide if FREE, or redirect to portal if PRO */}
        {org.plan !== 'FREE' && org.stripeCustomerId && (
          <div className="flex justify-center py-4">
            <button 
              onClick={handleManageBilling}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
            >
              View Invoice History in Stripe Portal
            </button>
          </div>
        )}
      </div>
    </WorkspacePageLayout>
  );
}
