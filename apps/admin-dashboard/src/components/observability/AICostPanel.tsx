'use client';

import React from 'react';
import {
  Sparkles,
  Coins,
  Zap,
  Layers,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@gateflow/ui/utils';

type AICostResponse = {
  success: boolean;
  windowDays: number;
  totals: {
    totalActions: number;
    totalTokens: number;
    completionTokens: number;
    promptTokens: number;
    totalCost: number;
  };
  series: {
    date: string;
    actions: number;
    totalTokens: number;
    estimatedCost: number;
  }[];
  byActionType: {
    actionType: string;
    actions: number;
    totalTokens: number;
    estimatedCost: number;
  }[];
};

export function AICostPanel() {
  const [data, setData] = React.useState<AICostResponse | null>(null);
  const [days, setDays] = React.useState(30);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async (windowDays: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/analytics/ai-cost?days=${windowDays}`,
        {
          headers: { 'x-admin-key': 'admin' },
          cache: 'no-store',
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Failed to load AI cost analytics');
        return;
      }
      setData(json);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to load AI cost analytics'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load(days);
  }, [days, load]);

  const dateLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = (data?.series ?? []).map((s) => ({
    ...s,
    label: dateLabel(s.date),
    cost: s.estimatedCost,
  }));

  const tokensFmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1000
        ? `${(n / 1000).toFixed(1)}k`
        : `${n}`;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]">
            <Sparkles size={20} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black uppercase tracking-tight text-[var(--ds-text-heading)]">
              Global AI Cost &amp; Token Analytics
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)]">
              Aggregate GateAI spend across all organizations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all',
                days === d
                  ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                  : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)]'
              )}
            >
              {d}d
            </button>
          ))}
          <button
            onClick={() => load(days)}
            className="ms-1 inline-flex items-center gap-1.5 rounded-lg border border-[var(--ds-border-bold)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] transition-all"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--ds-border-danger)] bg-[var(--ds-background-danger-subtle)] px-4 py-3 text-xs font-bold text-[var(--ds-text-danger)]">
          <TriangleAlert size={14} /> {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex h-40 items-center justify-center text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)] animate-pulse">
          Loading…
        </div>
      )}

      {data && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              icon={<Zap size={14} />}
              label="Actions"
              value={`${data.totals.totalActions.toLocaleString()}`}
            />
            <MetricCard
              icon={<Layers size={14} />}
              label="Total Tokens"
              value={tokensFmt(data.totals.totalTokens)}
            />
            <MetricCard
              icon={<Coins size={14} />}
              label="Estimated Cost"
              value={`$${data.totals.totalCost.toFixed(2)}`}
            />
            <MetricCard
              icon={<Sparkles size={14} />}
              label="Prompt / Completion"
              value={`${tokensFmt(data.totals.promptTokens)} / ${tokensFmt(
                data.totals.completionTokens
              )}`}
            />
          </div>

          <div className="h-56 rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="aiCostFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--ds-background-brand-bold)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--ds-background-brand-bold)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.12)"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: 'var(--ds-text-subtle)',
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: 'var(--ds-text-subtle)',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--ds-background-neutral)',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                  formatter={(value, name) => {
                    const v =
                      typeof value === 'number' ? value : Number(value ?? 0);
                    return [
                      name === 'Tokens'
                        ? tokensFmt(v)
                        : name === 'Cost'
                          ? `$${v.toFixed(2)}`
                          : v,
                      name,
                    ] as [string | number, React.ReactNode];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalTokens"
                  name="Tokens"
                  stroke="var(--ds-background-brand-bold)"
                  strokeWidth={2}
                  fill="url(#aiCostFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
              Spend by action type
            </h4>
            <div className="flex flex-col gap-1.5">
              {[...data.byActionType]
                .sort((a, b) => b.estimatedCost - a.estimatedCost)
                .map((row) => (
                  <div
                    key={row.actionType}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] px-4 py-2"
                  >
                    <span className="text-xs font-bold text-[var(--ds-text)]">
                      {row.actionType}
                    </span>
                    <div className="flex items-center gap-4 text-[11px] tabular-nums">
                      <span className="text-[var(--ds-text-subtle)]">
                        {row.actions} actions
                      </span>
                      <span className="text-[var(--ds-text-subtle)]">
                        {tokensFmt(row.totalTokens)} tok
                      </span>
                      <span className="font-black text-[var(--ds-text-brand)]">
                        ${row.estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              {data.byActionType.length === 0 && (
                <div className="rounded-xl border border-dashed border-[var(--ds-border-subtle)] px-4 py-6 text-center text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                  No AI activity in this window
                </div>
              )}
            </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
        {icon}
        {label}
      </span>
      <span className="text-lg font-black tabular-nums text-[var(--ds-text-heading)]">
        {value}
      </span>
    </div>
  );
}
