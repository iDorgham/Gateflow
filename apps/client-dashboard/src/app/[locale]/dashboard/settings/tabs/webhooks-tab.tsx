'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Switch,
} from '@gate-access/ui';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  ExternalLink,
  Signal,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';
import { cn } from '@/lib/utils';

export interface WebhookRow {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  deliveries: {
    id: string;
    event: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'RETRYING';
    statusCode: number | null;
    attemptCount: number;
    lastAttemptAt: string | null;
    createdAt: string;
  }[];
}

export function WebhooksTab({ initialWebhooks }: { initialWebhooks: WebhookRow[] }) {
  const { t } = useTranslation('dashboard');
  const [webhooks, setWebhooks] = useState<WebhookRow[]>(initialWebhooks);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    const url = prompt(t('settings.webhooks.promptUrl', 'Enter the Webhook URL (must start with https://):'));
    if (!url) return;
    if (!url.startsWith('https://')) {
        return toast.error(t('settings.webhooks.errors.httpsRequired', 'Secure HTTPS required for endpoint registration.'));
    }

    setIsCreating(true);
    try {
      const res = await csrfFetch('/api/webhooks', {
        method: 'POST',
        body: JSON.stringify({ url, events: ['scan.created'] }),
      });
      const data = await res.json();
      if (res.ok) {
        setWebhooks([
          {
            ...data.webhook,
            createdAt: data.webhook.createdAt,
            deliveries: [],
          },
          ...webhooks,
        ]);
        toast.success(t('settings.webhooks.success.registered', 'Webhook endpoint handshake successful.'));
      } else {
        toast.error(data.message || t('settings.webhooks.errors.registrationFailed', 'Registration aborted.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network connectivity issue.'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('settings.webhooks.confirmRevoke', 'DANGER: Revoke this webhook? Event streams will be terminated immediately. Data loss may occur for undelivered events.'))) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== id));
        toast.success(t('settings.webhooks.success.revoked', 'Stream endpoint revoked.'));
      } else {
        toast.error(t('settings.webhooks.errors.revokeFailed', 'Revocation failed.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network connectivity issue.'));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleWebhook = async (id: string, currentlyActive: boolean) => {
    try {
        const res = await csrfFetch(`/api/webhooks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive: !currentlyActive }),
        });
        if (res.ok) {
            setWebhooks(webhooks.map(w => w.id === id ? { ...w, isActive: !currentlyActive } : w));
            toast.success(currentlyActive ? t('settings.webhooks.success.paused', 'Stream paused.') : t('settings.webhooks.success.activated', 'Stream resuming.'));
        }
    } catch {
        toast.error(t('common.errors.generic', 'Operation failed.'));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <Webhook className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.webhooks.title', 'Real-time Event Streams')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.webhooks.description', 'Stream gate telemetry and security events directly to your backend infrastructure.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl border-border border-2 font-bold uppercase tracking-widest text-[10px] h-11 px-6 shadow-sm">
            <ExternalLink className="h-4 w-4" />
            {t('settings.webhooks.payloads', 'Payload Refs')}
          </Button>
          <Button onClick={handleCreate} disabled={isCreating} className="w-full sm:w-auto px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t('settings.webhooks.registerEndpoint', 'Register Stream')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {webhooks.length === 0 ? (
          <Card className="rounded-2xl border-dashed-4 border-2 border-border bg-muted/20">
            <CardContent className="py-24 text-center">
              <div className="h-20 w-20 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground/30 mx-auto mb-6">
                 <Webhook className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{t('settings.webhooks.noActiveStreams', 'No Active Telemetry Streams')}</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                {t('settings.webhooks.emptyDesc', 'Synchronize your physical access nodes with your digital ecosystem. Register an HTTPS endpoint to begin receiving push telemetry.')}
              </p>
              <Button onClick={handleCreate} className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary h-12 px-10 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                {t('settings.webhooks.registerFirst', 'Initialize first stream')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((wh) => (
            <Card key={wh.id} className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card transition-all hover:border-primary/20 hover:shadow-xl group">
              <CardHeader className="pb-6 pt-6 px-8 border-b border-border/50 bg-muted/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-500 group-hover:scale-105",
                        wh.isActive ? 'bg-primary/5 border-primary/20 text-primary shadow-lg shadow-primary/5' : 'bg-muted border-border text-muted-foreground/30'
                    )}>
                      <Signal className={cn("h-7 w-7", wh.isActive && "animate-pulse")} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-foreground truncate uppercase tracking-tight">{wh.url}</h3>
                        <Badge variant="outline" className="h-5 rounded-full px-2 text-[8px] font-black uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5">SSL SECURED</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-border bg-muted/50 py-0.5 px-3 tracking-widest">
                          {wh.events.length} Active Events
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(wh.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-border rtl:border-r-0 rtl:border-l rtl:pl-6">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", wh.isActive ? "text-primary" : "text-muted-foreground/40")}>
                            {wh.isActive ? t('settings.webhooks.streaming', 'Streaming') : t('settings.webhooks.pausedStatus', 'Paused')}
                        </span>
                        <Switch checked={wh.isActive} onCheckedChange={() => toggleWebhook(wh.id, wh.isActive)} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                      onClick={() => handleDelete(wh.id)}
                      disabled={deletingId === wh.id}
                    >
                      {deletingId === wh.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-muted/20">
                <div className="px-8 py-6">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{t('settings.webhooks.performance', 'Live Delivery Telemetry')}</h4>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border text-muted-foreground/40">Queue: Optimal</Badge>
                   </div>
                   <div className="space-y-3">
                      {wh.deliveries.length === 0 ? (
                        <div className="py-8 rounded-xl border border-dashed border-border bg-background flex flex-col items-center justify-center gap-2">
                             <Signal className="h-6 w-6 text-muted-foreground/10" />
                             <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{t('settings.webhooks.listening', 'Awaiting system events...')}</p>
                        </div>
                      ) : (
                       wh.deliveries.map((delivery) => (
                         <div key={delivery.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50 shadow-sm transition-all hover:bg-muted/5 group/row">
                           <div className="flex items-center gap-4">
                            <div className={cn(
                                 "h-9 w-9 rounded-lg flex items-center justify-center transition-transform group-hover/row:scale-110",
                                 delivery.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 
                                 delivery.status === 'RETRYING' ? 'bg-amber-500/10 text-amber-500' :
                                 'bg-destructive/10 text-destructive'
                             )}>
                               {delivery.status === 'SUCCESS' ? <CheckCircle2 className="h-5 w-5" /> : 
                                delivery.status === 'RETRYING' ? <Clock className="h-5 w-5 animate-pulse" /> :
                                <XCircle className="h-5 w-5" />}
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[12px] font-black text-foreground uppercase tracking-tight">{delivery.event}</span>
                               <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                     <Clock className="h-3 w-3" />
                                     {new Date(delivery.createdAt).toLocaleTimeString()}
                               </span>
                             </div>
                           </div>
                           <div className="flex items-center gap-6">
                             <div className="text-right rtl:text-left">
                               <span className={cn(
                                   "text-[10px] font-black uppercase tracking-widest block",
                                   delivery.status === 'SUCCESS' ? 'text-emerald-500' : 
                                   delivery.status === 'RETRYING' ? 'text-amber-500' :
                                   'text-destructive'
                               )}>
                                 {delivery.status === 'RETRYING' ? t('common.retrying', 'Retrying') : (delivery.statusCode || 'ERROR')}
                               </span>
                               <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-0.5">
                                 {delivery.attemptCount} {delivery.attemptCount === 1 ? 'Attempt' : 'Attempts'}
                               </p>
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/20 group-hover/row:text-primary transition-colors">
                                <ArrowUpRight className="h-4 w-4" />
                             </Button>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
