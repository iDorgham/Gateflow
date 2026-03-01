'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@gate-access/ui';
import { csrfFetch } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { Link2, MoreHorizontal, Plus, Terminal, X, Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';

// ─── Constants & Types ────────────────────────────────────────────────────────

const ALL_EVENTS = [
  { value: 'QR_CREATED', label: 'QR Created' },
  { value: 'QR_SCANNED', label: 'QR Scanned' },
  { value: 'QR_REVOKED', label: 'QR Revoked' },
  { value: 'QR_EXPIRED', label: 'QR Expired' },
  { value: 'SCAN_SUCCESS', label: 'Scan Success' },
  { value: 'SCAN_FAILED', label: 'Scan Failed' },
] as const;

type WebhookEventType = (typeof ALL_EVENTS)[number]['value'];

interface Delivery {
  id: string;
  event: string;
  status: 'PENDING' | 'RETRYING' | 'SUCCESS' | 'FAILED';
  statusCode: number | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  createdAt: string;
}

export interface WebhookRow {
  id: string;
  url: string;
  events: WebhookEventType[];
  isActive: boolean;
  createdAt: string;
  deliveries: Delivery[];
}

interface TestResult {
  success: boolean;
  statusCode: number | null;
  body: string | null;
  durationMs: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  RETRYING: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

function DeliveryStatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Webhook Form Modal ───────────────────────────────────────────────────────

interface WebhookFormModalProps {
  title: string;
  initial?: { url: string; events: WebhookEventType[] };
  onSubmit: (url: string, events: WebhookEventType[]) => void;
  onClose: () => void;
  isPending: boolean;
  submitLabel: string;
}

function WebhookFormModal({
  title,
  initial,
  onSubmit,
  onClose,
  isPending,
  submitLabel,
}: WebhookFormModalProps) {
  const [url, setUrl] = useState(initial?.url ?? '');
  const [events, setEvents] = useState<WebhookEventType[]>(initial?.events ?? []);
  const [urlError, setUrlError] = useState('');

  function toggleEvent(ev: WebhookEventType) {
    setEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev],
    );
  }

  function validateUrl(): boolean {
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Must be a valid URL (e.g. https://example.com/webhook)');
      return false;
    }
  }

  function handleSubmit() {
    if (!validateUrl() || events.length === 0) return;
    onSubmit(url.trim(), events);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="whUrl" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Endpoint URL</Label>
            <Input
              id="whUrl"
              type="url"
              placeholder="https://your-api.com/webhooks"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={validateUrl}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
            {urlError && <p className="text-xs font-medium text-red-600">{urlError}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Events to receive</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_EVENTS.map((ev) => (
                <label
                  key={ev.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-all",
                    events.includes(ev.value)
                      ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500/10"
                      : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={events.includes(ev.value)}
                    onChange={() => toggleEvent(ev.value)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className={cn("font-medium", events.includes(ev.value) ? "text-blue-900 dark:text-blue-400" : "text-slate-600 dark:text-slate-300")}>
                    {ev.label}
                  </span>
                </label>
              ))}
            </div>
            {events.length === 0 && (
              <p className="text-xs font-medium text-red-600">Select at least one event.</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending || events.length === 0}
              className="flex-1 gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </>
              ) : (
                submitLabel
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isPending} className="flex-1 rounded-xl font-bold border-slate-200">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  url,
  onConfirm,
  onClose,
  isPending,
}: {
  url: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Delete webhook?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The endpoint{' '}
            <span className="rounded bg-slate-100 dark:bg-slate-700 px-1 py-0.5 font-mono text-xs">
              {url}
            </span>{' '}
            will stop receiving events. Delivery history will be preserved.
          </p>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Deleting…' : 'Delete webhook'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Webhook Card ─────────────────────────────────────────────────────────────

interface WebhookCardProps {
  webhook: WebhookRow;
  onEdit: (wh: WebhookRow) => void;
  onDelete: (wh: WebhookRow) => void;
  onToggleActive: (wh: WebhookRow) => void;
}

function WebhookCard({ webhook, onEdit, onDelete, onToggleActive }: WebhookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testError, setTestError] = useState('');
  const [isTesting, startTest] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  function sendTest() {
    setTestResult(null);
    setTestError('');
    startTest(async () => {
      const res = await csrfFetch(`/api/webhooks/${webhook.id}/test`, {
        method: 'POST',
      }).catch(() => null);
      if (!res) {
        setTestError('Network error — could not reach the server.');
        return;
      }
      const json = await res.json().catch(() => null);
      if (json?.data) {
        setTestResult(json.data as TestResult);
      } else {
        setTestError('Test failed to execute.');
      }
    });
  }

  return (
    <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <CardContent className="pt-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Link2 className="h-4 w-4" />
              </div>
              <span className="max-w-[32ch] truncate font-mono text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                {webhook.url}
              </span>
              <Badge
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none",
                  webhook.isActive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                )}
              >
                {webhook.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {webhook.events.map((ev) => (
                <span
                  key={ev}
                  className="rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tight"
                >
                  {ev.replace('_', ' ')}
                </span>
              ))}
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Terminal className="h-3 w-3" />
              Created {relativeTime(webhook.createdAt)}
            </p>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors"
              aria-label="Webhook actions"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 z-20 min-w-[160px] rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50 overflow-hidden">
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(webhook);
                  }}
                >
                  Edit settings
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleActive(webhook);
                  }}
                >
                  {webhook.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(webhook);
                  }}
                >
                  Delete webhook
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" onClick={sendTest} disabled={isTesting} className="rounded-lg font-bold border-slate-200">
            {isTesting ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent mr-2" />
                Sending…
              </>
            ) : 'Send test payload'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDeliveries((s) => !s)}
            className="text-slate-500 font-bold hover:text-slate-700"
          >
            {showDeliveries
              ? 'Hide history'
              : `View history (${webhook.deliveries.length})`}
          </Button>
        </div>

        {/* Test result panel */}
        {(testResult || testError) && (
          <div
            className={cn(
               "mt-4 rounded-xl border p-4 shadow-sm",
              testResult?.success ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-sm font-bold", testResult?.success ? 'text-green-800' : 'text-red-800')}>
                {testResult?.success ? '✓ Delivery successful' : '✗ Delivery failed'}
              </span>
              <button
                onClick={() => {
                  setTestResult(null);
                  setTestError('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {testResult && (
              <div className="flex gap-4 text-xs font-bold text-slate-500 mb-3">
                <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">HTTP {testResult.statusCode ?? '—'}</span>
                <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">{testResult.durationMs}ms</span>
              </div>
            )}
            {testResult?.body && (
              <pre className="max-h-32 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 shadow-inner">
                {testResult.body}
              </pre>
            )}
            {testError && <p className="text-xs font-bold text-red-700">{testError}</p>}
          </div>
        )}

        {/* Delivery history */}
        {showDeliveries && (
          <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Recent Activity
            </p>
            {webhook.deliveries.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-400">No events delivered yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
                {webhook.deliveries.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 text-[11px] hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <DeliveryStatusBadge status={d.status} />
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">
                      {d.event.replace('_', ' ')}
                    </span>
                    <span className="font-medium text-slate-400">
                      HTTP {d.statusCode ?? '—'}
                    </span>
                    <span className="ml-auto font-bold text-slate-400">
                      {d.lastAttemptAt
                        ? relativeTime(d.lastAttemptAt)
                        : relativeTime(d.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function WebhooksClient({
  initialWebhooks,
}: {
  initialWebhooks: WebhookRow[];
}) {
  const [webhooks, setWebhooks] = useState<WebhookRow[]>(initialWebhooks);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<WebhookRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebhookRow | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [error, setError] = useState('');

  const [isPendingCreate, startCreate] = useTransition();
  const [isPendingEdit, startEdit] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();

  function createWebhook(url: string, events: WebhookEventType[]) {
    setError('');
    startCreate(async () => {
      const res = await csrfFetch('/api/webhooks', {
        method: 'POST',
        body: JSON.stringify({ url, events }),
      }).catch(() => null);

      if (!res?.ok) {
        const json = await res?.json().catch(() => null);
        setError(json?.message ?? 'Failed to create webhook.');
        return;
      }

      const json = await res.json();
      const { secret, ...newWh } = json.data as WebhookRow & { secret: string };
      setWebhooks((prev) => [{ ...newWh, deliveries: [] }, ...prev]);
      setNewSecret(secret);
      setShowCreate(false);
    });
  }

  function editWebhook(url: string, events: WebhookEventType[]) {
    if (!editTarget) return;
    setError('');
    startEdit(async () => {
      const res = await csrfFetch(`/api/webhooks/${editTarget.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ url, events }),
      }).catch(() => null);

      if (!res?.ok) {
        const json = await res?.json().catch(() => null);
        setError(json?.message ?? 'Failed to update webhook.');
        return;
      }

      const json = await res.json();
      setWebhooks((prev) =>
        prev.map((wh) =>
          wh.id === editTarget.id ? { ...wh, ...json.data } : wh,
        ),
      );
      setEditTarget(null);
    });
  }

  function toggleActive(webhook: WebhookRow) {
    setError('');
    // Optimistic update
    setWebhooks((prev) =>
      prev.map((wh) =>
        wh.id === webhook.id ? { ...wh, isActive: !wh.isActive } : wh,
      ),
    );
    csrfFetch(`/api/webhooks/${webhook.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !webhook.isActive }),
    })
      .then((res) => {
        if (!res.ok) {
          // Revert on failure
          setWebhooks((prev) =>
            prev.map((wh) =>
              wh.id === webhook.id ? { ...wh, isActive: webhook.isActive } : wh,
            ),
          );
          setError('Failed to update webhook status.');
        }
      })
      .catch(() => {
        setWebhooks((prev) =>
          prev.map((wh) =>
            wh.id === webhook.id ? { ...wh, isActive: webhook.isActive } : wh,
          ),
        );
        setError('Network error.');
      });
  }

  function deleteWebhook() {
    if (!deleteTarget) return;
    setError('');
    startDelete(async () => {
      const res = await csrfFetch(`/api/webhooks/${deleteTarget.id}`, {
        method: 'DELETE',
      }).catch(() => null);

      if (!res?.ok) {
        setError('Failed to delete webhook.');
        return;
      }
      setWebhooks((prev) => prev.filter((wh) => wh.id !== deleteTarget.id));
      setDeleteTarget(null);
    });
  }

  function copySecret() {
    if (!newSecret) return;
    navigator.clipboard.writeText(newSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  }

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Webhook Health" icon={Activity}>
        <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Success Rate</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">100%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full w-full bg-emerald-500" />
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Based on the last 100 delivery attempts.
          </p>
        </div>
      </SidebarSection>

      <SidebarSection title="Security Check" icon={ShieldCheck}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
            Always verify the <code className="text-blue-600 font-bold uppercase">X-GateFlow-Signature</code> header to ensure payloads are authentic and haven&apos;t been tampered with.
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full gap-2 rounded-xl text-[11px] font-bold border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
            View verification guide
            <HelpCircle className="h-3 w-3" />
          </Button>
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Webhooks</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enable real-time event notifications for your applications.</p>
          </div>
          <Button
            onClick={() => {
              setShowCreate(true);
              setNewSecret(null);
            }}
            className="w-full sm:w-auto gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </Button>
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* One-time secret banner */}
      {newSecret && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">
              Webhook created — save your signing secret now
            </CardTitle>
            <CardDescription className="text-green-700">
              This secret is used to sign all payloads via HMAC-SHA256. It will not be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <code className="flex-1 overflow-x-auto rounded border border-green-200 bg-white px-3 py-2 font-mono text-sm text-green-900">
                {newSecret}
              </code>
              <Button size="sm" variant="outline" onClick={copySecret}>
                {secretCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-green-700">
              Verify incoming requests by computing{' '}
              <code className="rounded bg-white px-1">HMAC-SHA256(secret, rawBody)</code> and
              comparing it to the{' '}
              <code className="rounded bg-white px-1">X-GateFlow-Signature</code> header (
              <code className="rounded bg-white px-1">sha256=&lt;hex&gt;</code>).
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-700"
              onClick={() => setNewSecret(null)}
            >
              I&apos;ve saved it — dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Webhooks list or empty state */}
      {webhooks.length === 0 ? (
        <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardContent className="py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 mx-auto mb-6">
              <Link2 className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">No webhooks yet</p>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Add a webhook endpoint to receive real-time notifications about QR codes and scans.
            </p>
            <Button className="mt-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => setShowCreate(true)}>
              + Add your first webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((wh) => (
            <WebhookCard
              key={wh.id}
              webhook={wh}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      )}

      {/* Docs callout */}
      <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">Payload verification:</span> Every request includes an{' '}
            <code className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-1 py-0.5 text-xs">
              X-GateFlow-Signature
            </code>{' '}
            header ({' '}
            <code className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-1 py-0.5 text-xs">sha256=&lt;hex&gt;</code>
            ) computed with HMAC-SHA256. GateFlow retries failed deliveries up to 3 times
            with exponential back-off (0 s → 1 s → 2 s).
          </p>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreate && (
        <WebhookFormModal
          title="Add webhook"
          onSubmit={createWebhook}
          onClose={() => setShowCreate(false)}
          isPending={isPendingCreate}
          submitLabel="Create webhook"
        />
      )}
      {editTarget && (
        <WebhookFormModal
          title="Edit webhook"
          initial={{ url: editTarget.url, events: editTarget.events }}
          onSubmit={editWebhook}
          onClose={() => setEditTarget(null)}
          isPending={isPendingEdit}
          submitLabel="Save changes"
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          url={deleteTarget.url}
          onConfirm={deleteWebhook}
          onClose={() => setDeleteTarget(null)}
          isPending={isPendingDelete}
        />
      )}
      </div>
    </WorkspacePageLayout>
  );
}
