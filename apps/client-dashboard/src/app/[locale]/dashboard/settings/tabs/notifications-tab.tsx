'use client';

import React, { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Switch,
} from '@gate-access/ui';
import { 
  Bell, 
  Mail, 
  Smartphone,
  Monitor,
  Save,
  BellRing,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function NotificationsTab() {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(t('settings.notifications.success.saved', 'Notification preferences saved.'));
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <BellRing className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.notifications.title', 'Alerts & Notifications')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.notifications.description', 'Manage external communications and system alerts.')}
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
      <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
        <CardHeader className="pb-4 pt-6 px-8 border-b border-border/50 bg-muted/5">
          <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            {t('settings.general.sections.notifications', 'Notification Infrastructure')}
          </CardTitle>
          <CardDescription className="text-xs">{t('settings.general.notificationsDesc', 'Control how and when you receive critical system alerts.')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {[
              { id: 'email-alerts', label: t('settings.general.notif.email', 'Email Alerts'), desc: t('settings.general.notif.emailDesc', 'Receive daily summaries and critical scan alerts via email.'), icon: Mail, checked: true },
              { id: 'push-notif', label: t('settings.general.notif.push', 'Push Notifications'), desc: t('settings.general.notif.pushDesc', 'Get real-time browser alerts for immediate gate activity.'), icon: Smartphone, checked: false },
              { id: 'audit-notif', label: t('settings.general.notif.audit', 'Audit Logs'), desc: t('settings.general.notif.auditDesc', 'Notify me when any administrative changes are detected.'), icon: Monitor, checked: true },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-8 hover:bg-muted/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground uppercase tracking-tight">{item.label}</p>
                      <p className="text-[11px] font-medium text-muted-foreground max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={item.checked} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
