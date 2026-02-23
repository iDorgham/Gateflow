'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@gate-access/ui';
import { CreditCard, Zap, Activity, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillingTabProps {
  org: {
    name: string;
    plan: string;
  };
  gateCount: number;
  qrCount: number;
}

const PLANS = [
  {
    name: 'FREE',
    price: '$0',
    description: 'Perfect for small venues and personal test labs.',
    features: ['3 Secured Gates', '100 QR Codes/month', 'Basic Scan Logs', 'Community Support'],
    accent: 'slate'
  },
  {
    name: 'PRO',
    price: '$49',
    description: 'Advanced features for growing venues and festivals.',
    features: ['20 Secured Gates', 'Unlimited QR Codes', 'Extended Analytics', 'API & Webhooks', 'Priority Support'],
    accent: 'blue',
    popular: true
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    description: 'Bespoke security for global enterprise deployments.',
    features: ['Unlimited Gates', 'Dedicated Infrastructure', 'SLA Guarantees', 'Deep Integrations', '24/7 Phone Support'],
    accent: 'violet'
  },
];

const MOCK_INVOICES = [
  { id: 'INV-2026-001', date: 'Feb 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Jan 01, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 01, 2025', amount: '$49.00', status: 'Paid' },
];

export function BillingTab({ org, gateCount, qrCount }: BillingTabProps) {
  const limits = {
    FREE: { gates: 3, qr: 100 },
    PRO: { gates: 20, qr: 1000000 },
    ENTERPRISE: { gates: Infinity, qr: Infinity },
  }[org.plan as 'FREE' | 'PRO' | 'ENTERPRISE'] || { gates: 3, qr: 100 };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Subscription & Usage</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage your resource allocations and financial history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="pb-4 pt-6 px-6">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Live Usage
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-500 dark:text-slate-400">Active Gates</span>
                            <span className="text-slate-900 dark:text-white font-black">{gateCount} / {limits.gates === Infinity ? '∞' : limits.gates}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50">
                            <div 
                                className="h-full bg-blue-600 transition-all duration-1000 skeleton-glow" 
                                style={{ width: `${Math.min(100, (gateCount / (limits.gates === Infinity ? 1 : limits.gates)) * 100)}%` }} 
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-500 dark:text-slate-400">Monthly QR Issued</span>
                            <span className="text-slate-900 dark:text-white font-black">{qrCount} / {limits.qr === Infinity ? '∞' : limits.qr}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50">
                            <div 
                                className="h-full bg-blue-600 transition-all duration-1000 skeleton-glow" 
                                style={{ width: `${Math.min(100, (qrCount / (limits.qr === Infinity ? 1 : limits.qr)) * 100)}%` }} 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="pb-4 pt-6 px-6">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                        Stored Payment
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-[10px] text-slate-400 italic">
                            VISA
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">•••• 4242</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Exp 12/26</p>
                        </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
                        Update Credentials
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                    <Card key={plan.name} className={cn(
                        "relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl group",
                        plan.name === org.plan 
                            ? "border-primary bg-primary/5 dark:bg-primary/10 ring-4 ring-primary/5" 
                            : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    )}>
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg z-10">
                                Popular Choice
                            </div>
                        )}
                        <CardHeader className="pb-4 pt-6">
                             <div className="flex flex-col">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                                    plan.name === org.plan ? "text-primary" : "text-slate-400"
                                )}>
                                    {plan.name}
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">/mo</span>
                                </div>
                             </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                {plan.description}
                            </p>
                            <ul className="space-y-2.5">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                        <ShieldCheck className={cn("h-3.5 w-3.5", plan.name === org.plan ? "text-primary" : "text-slate-400")} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                disabled={plan.name === org.plan}
                                className={cn(
                                    "w-full mt-4 rounded-xl font-black uppercase tracking-widest text-[10px] h-10 transition-all",
                                    plan.name === org.plan 
                                        ? "bg-emerald-500 hover:bg-emerald-500 text-white cursor-default" 
                                        : "bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 shadow-lg shadow-black/5"
                                )}
                            >
                                {plan.name === org.plan ? (
                                    <span className="flex items-center gap-2">
                                        <Star className="h-3.5 w-3.5 fill-current" />
                                        Current Tier
                                    </span>
                                ) : (
                                    'Switch to Tier'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-100 dark:border-slate-700">
                    <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                        Financial History
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium tracking-tight">Access your past invoices and transaction receipts.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <tr>
                                    <th className="px-8 py-4">Ref Number</th>
                                    <th className="px-8 py-4">Billing Date</th>
                                    <th className="px-8 py-4">Total Amount</th>
                                    <th className="px-8 py-4">Condition</th>
                                    <th className="px-8 py-4 text-right">Certificate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {MOCK_INVOICES.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-all">
                                        <td className="px-8 py-4 font-mono text-[11px] font-black text-slate-600 dark:text-slate-400">{inv.id}</td>
                                        <td className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">{inv.date}</td>
                                        <td className="px-8 py-4 text-sm font-black text-slate-900 dark:text-white uppercase">{inv.amount}</td>
                                        <td className="px-8 py-4">
                                            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50 shadow-none font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5">
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                Fetch PDF
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
