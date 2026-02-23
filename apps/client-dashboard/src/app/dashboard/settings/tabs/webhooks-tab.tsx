'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Switch,
} from '@gate-access/ui';
import { Webhook, Plus, Trash2, Activity, Globe, CheckCircle2, XCircle, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

export interface WebhookRow {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  deliveries: {
    id: string;
    event: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    statusCode: number | null;
    attemptCount: number;
    lastAttemptAt: string | null;
    createdAt: string;
  }[];
}

export function WebhooksTab({ initialWebhooks }: { initialWebhooks: WebhookRow[] }) {
  const [webhooks, setWebhooks] = useState<WebhookRow[]>(initialWebhooks);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    const url = prompt('Enter the Webhook URL (must start with https://):');
    if (!url) return;
    if (!url.startsWith('https://')) {
        return toast.error('URL must use HTTPS for security.');
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
        toast.success('Webhook endpoint registered');
      } else {
        toast.error(data.message ?? 'Registration failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Revoke this webhook? Event streams will be terminated immediately.')) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== id));
        toast.success('Endpoint revoked');
      } else {
        toast.error('Failed to revoke endpoint');
      }
    } catch {
      toast.error('Network error');
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
            toast.success(currentlyActive ? 'Endpoint paused' : 'Endpoint activated');
        }
    } catch {
        toast.error('Failed to update endpoint status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Real-time Webhooks</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stream scan events and gate alerts directly to your internal systems.</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="w-full sm:w-auto gap-2 rounded-xl bg-primary font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-primary/10">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Register Endpoint
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {webhooks.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardContent className="py-20 text-center">
              <Webhook className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Active Streams</p>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Connect your backend to GateFlow. Register an HTTPS endpoint to receive push notifications for all access events.
              </p>
              <Button onClick={handleCreate} className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary h-10 px-8 shadow-lg shadow-primary/10">
                Register first webhook
              </Button>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((wh) => (
            <Card key={wh.id} className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800 transition-all hover:border-primary/20">
              <CardHeader className="pb-6 pt-6 px-6 border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 ${wh.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-900 dark:border-slate-800'}`}>
                      <Globe className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{wh.url}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-0.5 px-2 tracking-widest">
                          {wh.events.length} Events
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created {new Date(wh.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{wh.isActive ? 'Streaming' : 'Paused'}</span>
                        <Switch checked={wh.isActive} onCheckedChange={() => toggleWebhook(wh.id, wh.isActive)} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                      onClick={() => handleDelete(wh.id)}
                      disabled={deletingId === wh.id}
                    >
                      {deletingId === wh.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-slate-50/30 dark:bg-slate-900/20">
                <div className="px-6 py-4">
                   <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-3.5 w-3.5 text-blue-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Delivery Performance (Last 5)</h4>
                   </div>
                   <div className="space-y-2">
                     {wh.deliveries.length === 0 ? (
                       <p className="text-[11px] font-medium text-slate-400 italic">Listening for events. No deliveries recorded yet.</p>
                     ) : (
                       wh.deliveries.map((delivery) => (
                         <div key={delivery.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:translate-x-1">
                           <div className="flex items-center gap-3">
                             {delivery.status === 'SUCCESS' ? (
                               <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                             ) : (
                               <XCircle className="h-4 w-4 text-red-500" />
                             )}
                             <div className="flex flex-col">
                               <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{delivery.event}</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(delivery.createdAt).toLocaleTimeString()}
                               </span>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <div className="text-right">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${delivery.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'}`}>
                                 {delivery.statusCode ?? 'ERR'}
                               </span>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{delivery.attemptCount} {delivery.attemptCount === 1 ? 'Attempt' : 'Attempts'}</p>
                             </div>
                             <ChevronRight className="h-4 w-4 text-slate-300" />
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
