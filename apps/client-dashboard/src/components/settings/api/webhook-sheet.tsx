'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  Button,
  Input,
  Label,
  Checkbox,
  Switch,
} from '@gate-access/ui';
import { Plus, Webhook } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import type { WebhookRow } from './webhook-table';

const WEBHOOK_EVENTS = [
  { id: 'QR_CREATED', label: 'QR Created', description: 'A new access QR code was generated' },
  { id: 'QR_SCANNED', label: 'QR Scanned', description: 'A QR code was scanned at a gate' },
  { id: 'QR_REVOKED', label: 'QR Revoked', description: 'An access code was manually revoked' },
  { id: 'QR_EXPIRED', label: 'QR Expired', description: 'A QR code reached its expiry date' },
  { id: 'SCAN_SUCCESS', label: 'Scan Approved', description: 'Entry was granted at a gate' },
  { id: 'SCAN_FAILED', label: 'Scan Denied', description: 'Entry was denied or code invalid' },
];

interface WebhookSheetProps {
  mode: 'create' | 'edit';
  webhook?: WebhookRow;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export function WebhookSheet({ mode, webhook, onSuccess, children }: WebhookSheetProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      setUrl(webhook?.url ?? '');
      setSelectedEvents(webhook?.events ?? []);
      setIsActive(webhook?.isActive ?? true);
    }
  }, [open, webhook]);

  const toggleEvent = (id: string) =>
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return toast.error('Endpoint URL is required');
    if (!url.startsWith('https://')) return toast.error('Webhook URL must start with https://');
    if (selectedEvents.length === 0) return toast.error('Select at least one event');

    startTransition(async () => {
      let res: Response;
      if (mode === 'create') {
        res = await csrfFetch('/api/webhooks', {
          method: 'POST',
          body: JSON.stringify({ url: url.trim(), events: selectedEvents }),
        });
      } else {
        res = await csrfFetch(`/api/webhooks/${webhook!.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ url: url.trim(), events: selectedEvents, isActive }),
        });
      }

      if (res.ok) {
        toast.success(mode === 'create' ? 'Webhook created' : 'Webhook updated');
        if (mode === 'create') {
          const data = (await res.json()) as { secret?: string };
          if (data.secret) {
            toast.info(`Webhook secret (save it): ${data.secret}`, { duration: 15000 });
          }
        }
        setOpen(false);
        onSuccess();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error ?? 'Failed to save webhook');
      }
    });
  };

  const trigger = children ?? (
    <Button className="gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]">
      <Plus className="h-4 w-4" />
      Add Webhook
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-xl font-black uppercase tracking-tight">
            {mode === 'create' ? 'Add Webhook' : 'Edit Webhook'}
          </SheetTitle>
          <SheetDescription>
            Receive real-time POST requests to your endpoint on selected events.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-8 space-y-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="wh-url" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Endpoint URL * (HTTPS only)
              </Label>
              <Input
                id="wh-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-server.com/webhook"
                className="h-11 rounded-xl font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Events to subscribe *
              </Label>
              <div className="space-y-2">
                {WEBHOOK_EVENTS.map((ev) => (
                  <div
                    key={ev.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedEvents.includes(ev.id)
                        ? 'bg-primary/5 border-primary/20'
                        : 'border-border hover:bg-muted/30'
                    }`}
                    onClick={() => toggleEvent(ev.id)}
                  >
                    <Checkbox
                      checked={selectedEvents.includes(ev.id)}
                      onChange={() => toggleEvent(ev.id)}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{ev.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mode === 'edit' && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">Active</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Paused webhooks stop receiving events temporarily.
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            )}
          </div>

          <SheetFooter className="p-8 pt-0 border-t border-border">
            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px]">
              {isPending ? 'Saving...' : mode === 'create' ? 'Create Webhook' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
