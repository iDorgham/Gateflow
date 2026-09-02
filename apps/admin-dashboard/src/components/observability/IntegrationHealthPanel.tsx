'use client';

import React from 'react';
import {
  PlugZap,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Layers,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';

type IntegrationHealthResponse = {
  success: boolean;
  generatedAt: string;
  totals: {
    totalCredentials: number;
    providerCount: number;
    orgCount: number;
    healthyProviders: number;
  };
  providers: {
    provider: string;
    count: number;
    orgCount: number;
    lastUpdated: string;
    health: 'healthy' | 'stale';
  }[];
};

export function IntegrationHealthPanel() {
  const [data, setData] = React.useState<IntegrationHealthResponse | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/integrations/health', {
        headers: { 'x-admin-key': 'admin' },
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Failed to load integration health');
        return;
      }
      setData(json);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to load integration health'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const healthRatio = data
    ? data.totals.providerCount > 0
      ? `${data.totals.healthyProviders}/${data.totals.providerCount}`
      : '—'
    : '—';

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]">
            <PlugZap size={20} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black uppercase tracking-tight text-[var(--ds-text-heading)]">
              Integration Health
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)]">
              Global status of third-party provider credentials across all
              organizations
            </p>
          </div>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ds-border-bold)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] transition-all"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--ds-border-danger)] bg-[var(--ds-background-danger-subtle)] px-4 py-3 text-xs font-bold text-[var(--ds-text-danger)]">
          <TriangleAlert size={14} /> {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex h-32 items-center justify-center text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)] animate-pulse">
          Loading…
        </div>
      )}

      {data && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              icon={<Layers size={14} />}
              label="Credentials"
              value={`${data.totals.totalCredentials}`}
            />
            <MetricCard
              icon={<PlugZap size={14} />}
              label="Providers"
              value={`${data.totals.providerCount}`}
            />
            <MetricCard
              icon={<Building2 size={14} />}
              label="Organizations"
              value={`${data.totals.orgCount}`}
            />
            <MetricCard
              icon={<ShieldCheck size={14} />}
              label="Healthy"
              value={healthRatio}
              tone={
                data.totals.healthyProviders === data.totals.providerCount
                  ? 'success'
                  : 'warning'
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
              Providers
            </h4>
            {data.providers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--ds-border-subtle)] px-4 py-6 text-center text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                No integrations configured yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.providers.map((p) => (
                  <div
                    key={p.provider}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm font-black uppercase tracking-tight text-[var(--ds-text)]">
                        {p.provider}
                      </span>
                      <span className="text-[10px] text-[var(--ds-text-subtle)]">
                        {p.orgCount} org{p.orgCount === 1 ? '' : 's'} · last
                        updated {timeAgo(p.lastUpdated)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-black tabular-nums text-[var(--ds-text-heading)]">
                        {p.count} cred
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest',
                          p.health === 'healthy'
                            ? 'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]'
                            : 'bg-[var(--ds-background-warning-subtle)] text-[var(--ds-text-warning)]'
                        )}
                      >
                        {p.health === 'healthy' ? (
                          <ShieldCheck size={10} />
                        ) : (
                          <ShieldAlert size={10} />
                        )}
                        {p.health}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          'text-lg font-black tabular-nums',
          tone === 'success' && 'text-[var(--ds-text-success)]',
          tone === 'warning' && 'text-[var(--ds-text-warning)]',
          tone === 'default' && 'text-[var(--ds-text-heading)]'
        )}
      >
        {value}
      </span>
    </div>
  );
}
