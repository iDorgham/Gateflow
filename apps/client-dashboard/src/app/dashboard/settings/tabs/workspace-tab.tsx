'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gate-access/ui';
import { updateWorkspaceSettingsAction } from '../../workspace/settings/actions';
import { toast } from 'sonner';
import { AlertTriangle, Building2, ExternalLink, Globe, Save, Sparkles, Copy, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrgData {
  id: string;
  name: string;
  email: string;
  domain: string;
  plan: string;
  createdAt: string;
}

const PLAN_STYLES: Record<string, { badge: string; dot: string; label: string; description: string; card: string }> = {
  FREE: {
    badge: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
    label: 'Free',
    description: 'Up to 3 gates · 100 QR codes/month',
    card: 'border-slate-200 dark:border-slate-700',
  },
  PRO: {
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'Pro',
    description: 'Up to 20 gates · Unlimited QR codes',
    card: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10',
  },
  ENTERPRISE: {
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
    label: 'Enterprise',
    description: 'Unlimited everything · Dedicated support',
    card: 'border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-900/10',
  },
};

export function WorkspaceTab({ org }: { org: OrgData }) {
  const [name, setName] = useState(org.name);
  const [email, setEmail] = useState(org.email);
  const [domain, setDomain] = useState(org.domain);
  const [isPending, startTransition] = useTransition();

  const planStyle = PLAN_STYLES[org.plan] ?? PLAN_STYLES.FREE;

  function save() {
    if (!name.trim() || !email.trim()) {
      return toast.error('Name and email are required.');
    }
    startTransition(async () => {
      const res = await updateWorkspaceSettingsAction({
        name: name.trim(),
        email: email.trim(),
        domain: domain.trim() || null,
      });

      if (res.success) {
        toast.success('Settings saved.');
      } else {
        toast.error(`Failed to save settings: ${res.message}`);
      }
    });
  }

  const copyId = () => {
    navigator.clipboard.writeText(org.id);
    toast.success('Organization ID copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
            {/* Plan info */}
            <Card className={cn('overflow-hidden rounded-2xl shadow-sm transition-all border-2 bg-white dark:bg-slate-800', planStyle.card)}>
                <CardHeader className="pb-3 pt-6 px-6">
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Sparkles className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    Subscription Plan
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                    Your workspace is currently on the <span className="text-primary font-bold">{planStyle.label}</span> tier.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 px-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={cn('flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm', planStyle.badge)}>
                        <span className={cn('inline-block h-2 w-2 rounded-full animate-pulse', planStyle.dot)} />
                        {planStyle.label}
                        </span>
                        <span className="text-sm font-bold text-slate-500">{planStyle.description}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto shrink-0 gap-2 rounded-xl font-bold uppercase tracking-widest text-[10px] border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all active:scale-95">
                        <a href="#billing">
                        Upgrade Tier
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    </Button>
                </CardContent>
            </Card>

            {/* Org info form */}
            <Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="pb-6 pt-6 px-6">
                    <CardTitle className="flex items-center gap-2 text-xl font-black">
                        <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
                        Workspace Details
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        Settings applied globally to all members in this organization.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="orgName" className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal Name</Label>
                            <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/30 dark:bg-slate-900/30" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orgEmail" className="text-xs font-bold uppercase tracking-widest text-slate-500">Billing Email</Label>
                            <Input
                                id="orgEmail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/30 dark:bg-slate-900/30"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="domain" className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Workspace Domain</Label>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Enterprise only</span>
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="domain"
                                placeholder="e.g. workspace.gateflow.io"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/30 dark:bg-slate-900/30 pl-11"
                            />
                        </div>
                    </div>

                    <Button onClick={save} disabled={isPending} className="w-full sm:w-auto gap-2 rounded-xl bg-primary font-bold uppercase tracking-widest text-[11px] h-11 px-8 shadow-lg shadow-primary/10">
                        {isPending ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Updating…
                        </>
                        ) : (
                        <>
                            <Save className="h-4 w-4" aria-hidden="true" />
                            Save Configuration
                        </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-200 dark:border-red-900/50 rounded-2xl bg-red-50/10 dark:bg-red-950/10 shadow-sm overflow-hidden border-t-4 border-t-red-500">
                <CardHeader className="pb-4 pt-6 px-6">
                <CardTitle className="flex items-center gap-2 text-lg font-black text-red-600 uppercase tracking-tight">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                    Danger Zone
                </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-red-500/5">
                    <div className="space-y-1">
                    <p className="font-bold text-red-900 dark:text-red-400">Terminate Organization</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md font-medium">
                        All data, including gates, keys, and logs, will be purged. This action is irreversible.
                    </p>
                    </div>
                    <Button
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-red-500/10"
                    onClick={() => {
                        if (confirm('Are you certain? All organization data will be purged.')) {
                            toast.info('Contact compliance@gateflow.io for terminal deletion.');
                        }
                    }}
                    >
                    Purge Data
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Metadata</h3>
                </div>
                <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secure ID</p>
                        <div className="flex items-center gap-2">
                        <code className="flex-1 truncate rounded bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                            {org.id}
                        </code>
                        <button
                            onClick={copyId}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary transition-all active:scale-90"
                            title="Copy ID"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-900 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Established</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{new Date(org.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Connectivity</h3>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                        Connect custom SSL-secured domains to fully white-label your access experience and QR short-links.
                    </p>
                    <Button variant="outline" size="sm" className="mt-6 w-full gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                        Domain Documentation
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
