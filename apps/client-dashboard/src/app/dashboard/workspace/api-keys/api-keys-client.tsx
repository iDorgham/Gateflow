'use client';

import { useState, useTransition, useEffect } from 'react';
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
import { toast } from 'sonner';
import { AlertCircle, Check, Copy, KeyRound, Plus, Trash2, X, Lock, RefreshCw, Zap, ShieldAlert } from 'lucide-react';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';

// ─── Constants & Types ────────────────────────────────────────────────────────

const SCOPE_OPTIONS = [
  { value: 'QR_CREATE', label: 'Create QR Codes' },
  { value: 'QR_READ', label: 'Read QR Codes' },
  { value: 'QR_VALIDATE', label: 'Validate QR Codes' },
  { value: 'SCANS_READ', label: 'Read Scan Logs' },
  { value: 'ANALYTICS_READ', label: 'Read Analytics' },
  { value: 'WEBHOOK_WRITE', label: 'Manage Webhooks' },
] as const;

type ApiScopeValue = (typeof SCOPE_OPTIONS)[number]['value'];

type FilterTab = 'all' | 'active' | 'expired';

export interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: ApiScopeValue[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) <= new Date();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

interface CreateModalProps {
  onSubmit: (name: string, scopes: ApiScopeValue[], expiresAt: string | null) => void;
  onClose: () => void;
  isPending: boolean;
}

function CreateApiKeyModal({ onSubmit, onClose, isPending }: CreateModalProps) {
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<ApiScopeValue[]>([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [nameError, setNameError] = useState('');

  function toggleScope(scope: ApiScopeValue) {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }

  function handleSubmit() {
    if (!name.trim()) {
      setNameError('Key name is required.');
      return;
    }
    if (scopes.length === 0) return;
    onSubmit(name.trim(), scopes, expiresAt || null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Min date for expiry picker = tomorrow
  const minDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

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
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <KeyRound className="h-6 w-6 text-blue-500" aria-hidden="true" />
            Create API Key
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="keyName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Key name</Label>
            <Input
              id="keyName"
              placeholder="e.g. Scrapers, Monitoring, Mobile App"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
            {nameError && <p className="text-xs font-medium text-red-600">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyExpiry" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry date <span className="text-xs font-normal text-slate-400">(optional)</span></Label>
            <Input
              id="keyExpiry"
              type="date"
              min={minDate}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permissions (scopes)</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {SCOPE_OPTIONS.map((scope) => (
                <label
                  key={scope.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-all",
                    scopes.includes(scope.value) 
                      ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500/10" 
                      : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={scopes.includes(scope.value)}
                    onChange={() => toggleScope(scope.value)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className={cn("font-medium", scopes.includes(scope.value) ? "text-blue-900 dark:text-blue-400" : "text-slate-600 dark:text-slate-300")}>
                    {scope.label}
                  </span>
                </label>
              ))}
            </div>
            {scopes.length === 0 && (
              <p className="text-xs font-medium text-red-600">Select at least one permission.</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending || !name.trim() || scopes.length === 0}
              className="flex-1 gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Generate key
                </>
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

// ─── Revoke Confirm Modal ─────────────────────────────────────────────────────

function RevokeConfirmModal({
  name,
  onConfirm,
  onClose,
  isPending,
}: {
  name: string;
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
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revoke API key?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The key{' '}
            <span className="font-medium text-slate-900 dark:text-white">{name}</span> will be permanently
            deleted. Any applications using it will immediately lose access.
          </p>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Revoking…' : 'Revoke key'}
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

// ─── Key Row ──────────────────────────────────────────────────────────────────

function ApiKeyRow({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKeyRow;
  onRevoke: (key: ApiKeyRow) => void;
}) {
  const expired = isExpired(apiKey.expiresAt);

  return (
    <div className="group flex items-start justify-between gap-4 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all px-4 -mx-4 rounded-xl">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-bold text-slate-900 dark:text-white">{apiKey.name}</span>
          {expired ? (
            <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0">
              Expired
            </Badge>
          ) : (
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0 border-none">
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-100/50 dark:bg-slate-800 w-fit px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-700">
          <KeyRound className="h-3 w-3" />
          {apiKey.keyPrefix}••••••••••••••••••••
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {apiKey.scopes.map((s) => (
            <span
              key={s}
              className="rounded-lg bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tight"
            >
              {SCOPE_OPTIONS.find((o) => o.value === s)?.label ?? s}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <Plus className="h-3 w-3" />
            Created {formatDate(apiKey.createdAt)}
          </span>
          {apiKey.lastUsedAt && (
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3" />
              Last used {formatDate(apiKey.lastUsedAt)}
            </span>
          )}
          {apiKey.expiresAt && !expired && (
            <span className="flex items-center gap-1.5 text-orange-600">
              <AlertCircle className="h-3 w-3" />
              Expires {formatDate(apiKey.expiresAt)}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
        onClick={() => onRevoke(apiKey)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function ApiKeysClient({ initialKeys }: { initialKeys: ApiKeyRow[] }) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [filter, setFilter] = useState<FilterTab>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyRow | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [error, setError] = useState('');

  const [isPendingCreate, startCreate] = useTransition();
  const [isPendingRevoke, startRevoke] = useTransition();

  function createKey(name: string, scopes: ApiScopeValue[], expiresAt: string | null) {
    setError('');
    startCreate(async () => {
      const body: Record<string, unknown> = { name, scopes };
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();

      const res = await csrfFetch('/api/api-keys', {
        method: 'POST',
        body: JSON.stringify(body),
      }).catch(() => null);

      if (!res?.ok) {
        const json = await res?.json().catch(() => null);
        setError(json?.message ?? 'Failed to create API key.');
        return;
      }

      const json = await res.json();
      const { key, ...rowData } = json.data as ApiKeyRow & { key: string };
      setKeys((prev) => [rowData, ...prev]);
      setNewKey(key);
      setShowCreate(false);
    });
  }

  function revokeKey() {
    if (!revokeTarget) return;
    setError('');
    startRevoke(async () => {
      const res = await csrfFetch(`/api/api-keys/${revokeTarget.id}`, {
        method: 'DELETE',
      }).catch(() => null);

      if (!res?.ok) {
        setError('Failed to revoke API key.');
        return;
      }
      setKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
      setRevokeTarget(null);
    });
  }

  function copyKey() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  }

  const filteredKeys = keys.filter((k) => {
    if (filter === 'active') return !isExpired(k.expiresAt);
    if (filter === 'expired') return isExpired(k.expiresAt);
    return true;
  });

  const activeCount = keys.filter((k) => !isExpired(k.expiresAt)).length;
  const expiredCount = keys.filter((k) => isExpired(k.expiresAt)).length;

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Security Best Practices" icon={Lock}>
        <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <div className="flex gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Never share your secret key</p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">We only show it once. Store it securely in a vault or environment variable.</p>
            </div>
          </div>
          <div className="flex gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
            <RefreshCw className="h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Rotate keys regularly</p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">For maximum security, rotate your API keys every 90 days.</p>
            </div>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="API Rate Limits" icon={Zap}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">REST API</span>
              <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">1,000 req/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Events API</span>
              <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">500 req/min</span>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed">
            Limits are applied per organization. Contact support if you need a higher quota.
          </p>
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">API Keys</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage programmatic access to your workspace resources.</p>
          </div>
          <Button
            onClick={() => {
              setShowCreate(true);
              setNewKey(null);
            }}
            className="w-full sm:w-auto gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create API Key
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
            className="flex h-6 w-6 items-center justify-center rounded text-red-400 hover:bg-red-100 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* One-time key banner */}
      {newKey && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">
              API key created — copy it now
            </CardTitle>
            <CardDescription className="text-green-700">
              This key will only be shown once. Store it in a secure location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <code className="flex-1 overflow-x-auto rounded border border-green-200 bg-white px-3 py-2 font-mono text-sm text-green-900">
                {newKey}
              </code>
              <Button size="sm" variant="outline" onClick={copyKey} className="shrink-0 gap-1.5">
                {keyCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-green-700">
              Pass it in the{' '}
              <code className="rounded bg-white px-1">Authorization: Bearer &lt;key&gt;</code>{' '}
              header on API requests.
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-700"
              onClick={() => setNewKey(null)}
            >
              I&apos;ve saved it — dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 w-fit">
        {(
          [
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'expired', label: `Expired (${expiredCount})` },
            { id: 'all', label: `All (${keys.length})` },
          ] as { id: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Keys list */}
      <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="text-lg font-bold">
            {filter === 'all'
              ? 'All API Keys'
              : filter === 'active'
              ? 'Active Keys'
              : 'Expired Keys'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <KeyRound className="h-12 w-12 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {keys.length === 0
                  ? 'No API keys yet'
                  : `No ${filter} keys found`}
              </p>
              <p className="mt-1 text-xs text-slate-500 max-w-[240px]">
                {keys.length === 0 
                  ? 'Key-based authentication is the most secure way to integrate with our API.' 
                  : `Try adjusting your filter to see more keys.`}
              </p>
              {keys.length === 0 && (
                <Button variant="outline" className="mt-6 rounded-xl font-bold border-slate-200" onClick={() => setShowCreate(true)}>
                  Create your first key
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700 px-6">
              {filteredKeys.map((key) => (
                <ApiKeyRow key={key.id} apiKey={key} onRevoke={setRevokeTarget} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Docs callout */}
      <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">Authentication:</span> Include your API key in
            every request as{' '}
            <code className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-1 py-0.5 text-xs">
              Authorization: Bearer gflv_…
            </code>
            . Keys are hashed with SHA-256 — GateFlow never stores the raw value.
          </p>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreate && (
        <CreateApiKeyModal
          onSubmit={createKey}
          onClose={() => setShowCreate(false)}
          isPending={isPendingCreate}
        />
      )}
      {revokeTarget && (
        <RevokeConfirmModal
          name={revokeTarget.name}
          onConfirm={revokeKey}
          onClose={() => setRevokeTarget(null)}
          isPending={isPendingRevoke}
        />
      )}
      </div>
    </WorkspacePageLayout>
  );
}
