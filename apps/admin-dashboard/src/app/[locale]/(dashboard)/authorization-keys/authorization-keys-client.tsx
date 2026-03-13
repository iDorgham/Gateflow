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
import { cn } from '@gate-access/ui';
import {
  AlertCircle,
  Check,
  Copy,
  KeyRound,
  Plus,
  Trash2,
  X,
  Shield,
  ShieldCheck,
  Building2,
} from 'lucide-react';

type FilterTab = 'all' | 'active' | 'expired';

interface AuthKey {
  id: string;
  name: string;
  keyPrefix: string;
  type: 'admin' | 'service';
  organizationId?: string;
  organizationName?: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
}

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

export function AuthKeysClient() {
  const [keys, setKeys] = useState<AuthKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<AuthKey | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [error, setError] = useState('');

  const [isPendingCreate, startCreate] = useTransition();
  const [isPendingRevoke, startRevoke] = useTransition();

  useEffect(() => {
    async function fetchKeys() {
      try {
        const res = await fetch('/api/admin/authorization-keys');
        if (res.ok) {
          const json = await res.json();
          setKeys(json.data || []);
        }
      } catch {
        // Keep empty on error
      } finally {
        setLoading(false);
      }
    }
    fetchKeys();
  }, []);

  function createKey(
    name: string,
    type: 'admin' | 'service',
    expiresAt: string | null,
    organizationId?: string
  ) {
    setError('');
    startCreate(async () => {
      try {
        const payload: any = { name, type, expiresAt };
        if (type === 'service' && organizationId) {
          payload.organizationId = organizationId;
        }
        const res = await fetch('/api/admin/authorization-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const json = await res.json();
          setError(json?.message ?? 'Failed to create authorization key.');
          return;
        }

        const json = await res.json();
        const { key, ...rowData } = json.data as AuthKey & { key: string };
        setKeys((prev) => [rowData, ...prev]);
        setNewKey(key);
        setShowCreate(false);
      } catch {
        setError('Failed to create authorization key.');
      }
    });
  }

  function revokeKey() {
    if (!revokeTarget) return;
    setError('');
    startRevoke(async () => {
      try {
        const res = await fetch(
          `/api/admin/authorization-keys/${revokeTarget.id}`,
          {
            method: 'DELETE',
          }
        );

        if (!res.ok) {
          setError('Failed to revoke authorization key.');
          return;
        }

        setKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
        setRevokeTarget(null);
      } catch {
        setError('Failed to revoke authorization key.');
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Authorization Keys
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage platform-wide authorization keys and service accounts.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreate(true);
            setNewKey(null);
          }}
          className="w-full sm:w-auto gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Authorization Key
        </Button>
      </div>

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
        <Card className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800 dark:text-green-400">
              Authorization key created — copy it now
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-500">
              This key will only be shown once. Store it in a secure location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <code className="flex-1 overflow-x-auto rounded border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/50 px-3 py-2 font-mono text-sm text-green-900 dark:text-green-400">
                {newKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyKey}
                className="shrink-0 gap-1.5"
              >
                {keyCopied ? (
                  <>
                    <Check
                      className="h-3.5 w-3.5 text-green-600"
                      aria-hidden="true"
                    />
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
            <p className="text-xs text-green-700 dark:text-green-500">
              Pass it in the{' '}
              <code className="rounded bg-white dark:bg-green-900/50 px-1">
                Authorization: Bearer &lt;key&gt;
              </code>{' '}
              header on API requests.
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-700 dark:text-green-500"
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
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              filter === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Keys */}
      <Card className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="text-lg font-bold">
            {filter === 'all'
              ? 'All Authorization Keys'
              : filter === 'active'
                ? 'Active Keys'
                : 'Expired Keys'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShieldCheck className="h-12 w-12 text-slate-200 dark:text-slate-700 mb-4" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {keys.length === 0
                  ? 'No authorization keys yet'
                  : `No ${filter} keys found`}
              </p>
              <p className="mt-1 text-xs text-slate-500 max-w-[240px]">
                {keys.length === 0
                  ? 'Platform-level authorization keys provide super-admin access to all organizations.'
                  : `Try adjusting your filter to see more keys.`}
              </p>
              {keys.length === 0 && (
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl font-bold border-slate-200"
                  onClick={() => setShowCreate(true)}
                >
                  Create your first key
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700 px-6">
              {filteredKeys.map((key) => (
                <div
                  key={key.id}
                  className="group flex items-start justify-between gap-4 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {key.name}
                      </span>
                      {key.type === 'admin' ? (
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold px-2 py-0">
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0">
                          Service
                        </Badge>
                      )}
                      {isExpired(key.expiresAt) ? (
                        <Badge
                          variant="destructive"
                          className="text-[10px] font-bold px-2 py-0"
                        >
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
                      {key.keyPrefix}••••••••••••••••••••
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-400">
                      {key.organizationName && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3" />
                          {key.organizationName}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Plus className="h-3 w-3" />
                        Created {formatDate(key.createdAt)}
                      </span>
                      {key.lastUsedAt && (
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3 w-3" />
                          Last used {formatDate(key.lastUsedAt)}
                        </span>
                      )}
                      {key.expiresAt && !isExpired(key.expiresAt) && (
                        <span className="flex items-center gap-1.5 text-orange-600">
                          <AlertCircle className="h-3 w-3" />
                          Expires {formatDate(key.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => setRevokeTarget(key)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Modal */}
      {revokeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setRevokeTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Revoke authorization key?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The key{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {revokeTarget.name}
                </span>{' '}
                will be permanently deleted. Any applications using it will
                immediately lose access.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={revokeKey}
                  disabled={isPendingRevoke}
                >
                  {isPendingRevoke ? 'Revoking…' : 'Revoke key'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRevokeTarget(null)}
                  disabled={isPendingRevoke}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateAuthKeyModal
          onSubmit={createKey}
          onClose={() => setShowCreate(false)}
          isPending={isPendingCreate}
        />
      )}
    </div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateAuthKeyModal({
  onSubmit,
  onClose,
  isPending,
}: {
  onSubmit: (
    name: string,
    type: 'admin' | 'service',
    expiresAt: string | null,
    organizationId?: string
  ) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'admin' | 'service'>('admin');
  const [expiresAt, setExpiresAt] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [nameError, setNameError] = useState('');
  const [orgError, setOrgError] = useState('');

  function handleSubmit() {
    if (!name.trim()) {
      setNameError('Key name is required.');
      return;
    }
    if (type === 'service' && !organizationId.trim()) {
      setOrgError('Organization is required for service keys.');
      return;
    }
    onSubmit(name.trim(), type, expiresAt || null, organizationId.trim() || undefined);
  }

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
            <Shield className="h-6 w-6 text-purple-500" aria-hidden="true" />
            Create Authorization Key
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
            <Label
              htmlFor="keyName"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Key name
            </Label>
            <Input
              id="keyName"
              placeholder="e.g. CI/CD Service, Monitoring, Support Tool"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
            {nameError && (
              <p className="text-xs font-medium text-red-600">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Key type
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-all',
                  type === 'admin'
                    ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 ring-1 ring-purple-500/10'
                    : 'border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                )}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'admin'}
                  onChange={() => setType('admin')}
                  className="h-4 w-4 border-slate-300 text-purple-600 focus:ring-purple-500/20"
                />
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'font-medium',
                      type === 'admin'
                        ? 'text-purple-900 dark:text-purple-400'
                        : 'text-slate-600 dark:text-slate-300'
                    )}
                  >
                    Admin Key
                  </span>
                  <span className="text-xs text-slate-400">
                    Full platform access
                  </span>
                </div>
              </label>
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-all',
                  type === 'service'
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500/10'
                    : 'border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                )}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'service'}
                  onChange={() => setType('service')}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'font-medium',
                      type === 'service'
                        ? 'text-blue-900 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-300'
                    )}
                  >
                    Service Key
                  </span>
                  <span className="text-xs text-slate-400">
                    Limited scope access
                  </span>
                </div>
              </label>
            </div>
          </div>

          {type === 'service' && (
            <div className="space-y-2">
              <Label
                htmlFor="organizationId"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Organization
              </Label>
              <Input
                id="organizationId"
                placeholder="Enter organization ID"
                value={organizationId}
                onChange={(e) => {
                  setOrganizationId(e.target.value);
                  setOrgError('');
                }}
                className="rounded-lg border-slate-200 focus:ring-blue-500/20"
              />
              {orgError && (
                <p className="text-xs font-medium text-red-600">{orgError}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="keyExpiry"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Expiry date{' '}
              <span className="text-xs font-normal text-slate-400">
                (optional)
              </span>
            </Label>
            <Input
              id="keyExpiry"
              type="date"
              min={minDate}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="rounded-lg border-slate-200 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending || !name.trim()}
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
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-xl font-bold border-slate-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
