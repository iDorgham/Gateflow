'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
} from '@gate-access/ui';
import { Trash2, Webhook, Send, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import { WebhookSheet } from './webhook-sheet';

export interface WebhookRow {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  deliveries?: { status: string }[];
}

interface WebhookTableProps {
  webhooks: WebhookRow[];
}

export function WebhookTable({ webhooks: initial }: WebhookTableProps) {
  const router = useRouter();
  const [hooks, setHooks] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const refresh = () => startTransition(() => router.refresh());

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webhook? All delivery history will be removed.')) return;

    const res = await csrfFetch(`/api/webhooks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setHooks((prev) => prev.filter((h) => h.id !== id));
      toast.success('Webhook deleted');
      refresh();
    } else {
      toast.error('Failed to delete webhook');
    }
  };

  const handleTest = async (id: string) => {
    const res = await csrfFetch(`/api/webhooks/${id}/test`, { method: 'POST' });
    if (res.ok) {
      toast.success('Test event sent to webhook endpoint');
    } else {
      toast.error('Failed to send test event');
    }
  };

  const lastStatus = (hook: WebhookRow) => {
    const last = hook.deliveries?.[0];
    if (!last) return null;
    return last.status;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground font-medium">
          {hooks.length} webhook{hooks.length !== 1 ? 's' : ''} configured
        </p>
        <WebhookSheet mode="create" onSuccess={refresh} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Endpoint URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Last Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">
                  No webhooks yet. Create one to receive real-time event notifications.
                </TableCell>
              </TableRow>
            ) : (
              hooks.map((hook) => {
                const status = lastStatus(hook);
                return (
                  <TableRow key={hook.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Webhook className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                        <code className="text-xs font-mono text-foreground truncate max-w-[260px]">
                          {hook.url}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hook.events.slice(0, 3).map((ev) => (
                          <Badge
                            key={ev}
                            variant="outline"
                            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0 bg-muted/50"
                          >
                            {ev.replace('_', '.')}
                          </Badge>
                        ))}
                        {hook.events.length > 3 && (
                          <Badge variant="outline" className="text-[9px] font-black px-1.5 py-0 bg-muted/50">
                            +{hook.events.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={hook.isActive ? 'default' : 'outline'}
                        className={hook.isActive
                          ? 'bg-success/10 text-success border-success/20 font-bold text-[10px] uppercase'
                          : 'opacity-50 font-bold text-[10px] uppercase'}
                      >
                        {hook.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {status ? (
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-black uppercase px-1.5 py-0 ${
                            status === 'SUCCESS'
                              ? 'bg-success/10 text-success border-success/20'
                              : status === 'FAILED'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : 'bg-muted/50'
                          }`}
                        >
                          {status}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTest(hook.id)}
                          disabled={isPending}
                          title="Send test event"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                        <WebhookSheet mode="edit" webhook={hook} onSuccess={refresh}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </WebhookSheet>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(hook.id)}
                          disabled={isPending}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
