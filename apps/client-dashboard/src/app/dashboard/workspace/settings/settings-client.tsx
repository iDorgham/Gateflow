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
import { updateWorkspaceSettingsAction } from './actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AlertTriangle, Building2, ExternalLink, Globe, Save, Sparkles, Copy, Calendar, Info } from 'lucide-react';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';

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

export function WorkspaceSettingsClient({ org }: { org: OrgData }) {
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
        console.error('Save settings error:', res.message);
      }
    });
  }

  const copyId = () => {
    navigator.clipboard.writeText(org.id);
    toast.success('Organization ID copied to clipboard');
  };

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Workspace Metadata" icon={Info}>
        <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organization ID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-slate-50 dark:bg-slate-700 px-2 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                {org.id}
              </code>
              <button
                onClick={copyId}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
                title="Copy ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created On</p>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold">{new Date(org.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="Custom Domains" icon={Globe}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium lowercase first-letter:uppercase">
            White-label your workspace by connecting a custom domain. This will be used for all QR short links and your public gate pages.
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full gap-2 rounded-xl text-[11px] font-bold border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
            Learn more about DNS
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Settings</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">General settings and organizational metadata for your workspace.</p>
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">
      {/* Plan info */}
      <Card className={cn('overflow-hidden rounded-2xl shadow-sm transition-all', planStyle.card)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-blue-500" aria-hidden="true" />
            Current Plan
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Member since {new Date(org.createdAt).toLocaleDateString()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={cn('flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm', planStyle.badge)}>
              <span className={cn('inline-block h-2 w-2 rounded-full animate-pulse', planStyle.dot)} />
              {planStyle.label}
            </span>
            <span className="text-sm font-medium text-slate-500">{planStyle.description}</span>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto shrink-0 gap-2 rounded-lg font-semibold border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm">
            <a href="/dashboard/workspace/billing">
              Upgrade
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Org info form */}
      <Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Building2 className="h-5 w-5 text-slate-400" aria-hidden="true" />
            Organization Details
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Changes here affect all members of your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Organization name</Label>
            <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border-slate-200 focus:ring-blue-500/20" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact email</Label>
            <Input
              id="orgEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="domain" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Globe className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Custom domain
              </Label>
              <span className="text-xs font-medium text-slate-400">Optional</span>
            </div>
            <Input
              id="domain"
              placeholder="company.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
          </div>

          <Button onClick={save} disabled={isPending} className="w-full sm:w-auto gap-2 rounded-lg bg-blue-600 font-semibold shadow-sm hover:bg-blue-700">
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Save settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-900/50 rounded-2xl bg-red-50/20 dark:bg-red-950/20 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700/70 font-medium">
            These actions are destructive and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="space-y-1">
              <p className="font-bold text-red-900 dark:text-red-400">Delete organization</p>
              <p className="text-sm text-red-600/80 leading-relaxed max-w-md">
                All data, including gates, QR codes, and scan logs, will be permanently removed from our servers.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto rounded-lg font-bold shadow-sm"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure? This will permanently delete your organization and all its data.',
                  )
                ) {
                  toast.info('Contact support@gateflow.io to delete your organization.');
                }
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </WorkspacePageLayout>
  );
}
