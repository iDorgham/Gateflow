'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@gate-access/ui';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  UserPlus, 
  CheckCircle2,
  Save,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ROLE_PERMISSIONS: Record<string, { label: string; icon: any; color: string; permissions: string[] }> = {
  ADMIN: { 
    label: 'Platform Admin', 
    icon: ShieldAlert, 
    color: 'text-destructive border-destructive/20 bg-destructive/5',
    permissions: ['Full System Access', 'Billing Management', 'Cross-Org Operations', 'Audit Logs']
  },
  TENANT_ADMIN: { 
    label: 'Workspace Owner', 
    icon: ShieldCheck, 
    color: 'text-primary border-primary/20 bg-primary/5',
    permissions: ['Manage All Projects', 'Invite/Remove Team', 'API Key Management', 'Webhook Config']
  },
  TENANT_USER: { 
    label: 'Standard Associate', 
    icon: Users, 
    color: 'text-muted-foreground border-border bg-muted/50',
    permissions: ['View Projects', 'Scan Management', 'Personal Settings', 'View Analytics']
  },
};

export function RolesTab() {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(t('settings.roles.success.saved', 'Authorization matrix updated successfully.'));
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <ShieldAlert className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.roles.title', 'Authorization Matrix')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.roles.description', 'Define system-wide permission hierarchies for administrative nodes.')}
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

      {/* Content */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
            <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              {t('settings.roles.rolesList', 'Defined Roles')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {Object.entries(ROLE_PERMISSIONS).map(([role, data]) => {
              const Icon = data.icon;
              return (
                <div key={role} className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", data.color)}>
                              <Icon className="h-5 w-5" />
                          </div>
                          <div>
                              <h4 className="text-sm font-black uppercase tracking-tight">{role}</h4>
                              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{data.label}</p>
                          </div>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-muted/50 border-border text-muted-foreground">System Defined</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-13">
                      {data.permissions.map((perm) => (
                          <div key={perm} className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border border-border/50 group hover:border-primary/20 transition-colors">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{perm}</span>
                          </div>
                      ))}
                      <button className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border hover:bg-primary/5 hover:border-primary/20 transition-all text-muted-foreground/40 hover:text-primary group">
                          <UserPlus className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('common.addCapability', 'Add Capability')}</span>
                      </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
