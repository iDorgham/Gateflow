'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Ruler, LayoutGrid, Info, ArrowLeftRight, Columns } from 'lucide-react';

const spacingPrinciples = [
  {
    title: '8pt Base Grid',
    description:
      'All spatial relationships follow an 8-point incrementally base. This ensures mathematical vertical and horizontal rhythm.',
    icon: Ruler,
  },
  {
    title: 'Logical Insets',
    description:
      'We use logical properties (padding-inline-start/end) to support LTR/RTL layout without custom overrides.',
    icon: ArrowLeftRight,
  },
  {
    title: 'Gutter Hierarchy',
    description:
      'Fixed gutter ratios for high-density dashboards (16px) versus marketing canvases (24px+).',
    icon: Columns,
  },
];

export default function SpacingFoundationsPage() {
  const [showGrid, setShowGrid] = React.useState(false);

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto py-10 px-6">
      <PageHeader
        title="Spacing & Grid"
        subtitle="Our layout strategy is built on a mathematical 8pt grid, ensuring consistency from high-density dashboards to expansive landing pages."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Spacing' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spacingPrinciples.map((p, _idx) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <p.icon size={80} strokeWidth={1} />
            </div>
            <div className="p-3 w-fit rounded-2xl bg-gradient-to-br from-[var(--ds-accent-bold)] to-[var(--ds-accent-hover)] text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
              <p.icon size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)] leading-none">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Grid Visualizer Lab */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--ds-text-primary)] leading-none">
              The 8pt Explorer
            </h2>
            <p className="text-sm font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60">
              Experience the mathematical rhythm of the GateFlow space.
            </p>
          </div>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <LayoutGrid size={14} />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Token List */}
          <div className="lg:col-span-5 flex flex-col gap-4 border border-[var(--ds-border-bold)] rounded-[2rem] overflow-hidden shadow-2xl bg-[var(--ds-background-default)]">
            <div className="p-6 bg-[var(--ds-surface-subtle)] border-b border-[var(--ds-border-subtle)]">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ds-text-accent)]">
                Spacing Tokens
              </h4>
            </div>
            <div className="flex flex-col">
              {[
                {
                  name: 'Atomic',
                  var: '--ds-space-050',
                  val: '4px',
                  color: 'from-blue-500/80 to-blue-400',
                },
                {
                  name: 'Core',
                  var: '--ds-space-100',
                  val: '8px',
                  color: 'from-[var(--ds-accent-bold)] to-orange-400',
                },
                {
                  name: 'Gap',
                  var: '--ds-space-200',
                  val: '16px',
                  color: 'from-[var(--ds-accent-bold)] to-orange-500',
                },
                {
                  name: 'Section',
                  var: '--ds-space-300',
                  val: '24px',
                  color: 'from-purple-500/80 to-purple-400',
                },
                {
                  name: 'Loose',
                  var: '--ds-space-400',
                  val: '32px',
                  color: 'from-emerald-500/80 to-emerald-400',
                },
                {
                  name: 'Hero',
                  var: '--ds-space-600',
                  val: '48px',
                  color: 'from-rose-500/80 to-rose-400',
                },
              ].map((token) => (
                <div
                  key={token.var}
                  className="flex items-center gap-6 p-6 hover:bg-[var(--ds-surface-subtle)] transition-all group/row border-b border-[var(--ds-border-subtle)]/30 last:border-0"
                >
                  <div className="flex flex-col gap-1 w-24 shrink-0">
                    <span className="text-[9px] uppercase font-black tracking-[0.1em] text-[var(--ds-text-subtlest)] opacity-50">
                      {token.name}
                    </span>
                    <code className="text-sm font-black text-[var(--ds-text-primary)] leading-none">
                      {token.val}
                    </code>
                  </div>
                  <div className="flex-1 flex items-center h-8">
                    <div
                      className={`h-6 rounded-lg bg-gradient-to-r ${token.color} shadow-[0_0_15px_-5px_rgba(237,75,0,0.4)] relative group/bar transition-all hover:scale-x-110 hover:shadow-[0_0_20px_-2px_rgba(237,75,0,0.6)] origin-left cursor-help`}
                      style={{ width: token.val }}
                      title={token.var}
                    >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30 rounded-full" />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <code className="text-[9px] font-mono text-[var(--ds-text-subtlest)] opacity-30 group-hover/row:opacity-100 transition-opacity bg-[var(--ds-background-neutral-subtle)] px-2 py-0.5 rounded border border-[var(--ds-border-subtle)]">
                      {token.var}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Preview Area */}
          <div className="lg:col-span-7 flex flex-col gap-6 p-1 rounded-[2.5rem] bg-gradient-to-br from-[var(--ds-border-bold)]/30 via-[var(--ds-accent-bold)]/5 to-transparent p-[1px] shadow-2xl">
            <div className="bg-[var(--ds-surface-subtle)] rounded-[2.4rem] overflow-hidden relative min-h-[520px] shadow-inner flex flex-col">
              {showGrid && (
                <div className="absolute inset-0 z-0 bg-[radial-gradient(var(--ds-border-bold)_1px,transparent_1px)] [background-size:8px_8px] opacity-[0.15] transition-opacity animate-ds-fade-in" />
              )}

              {/* Decorative mesh gradient */}
              <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-br from-[var(--ds-accent-bold)]/5 to-transparent pointer-events-none" />

              <div className="relative z-10 p-12 flex flex-col gap-12 flex-1">
                <div className="flex flex-col gap-4">
                  <div className="h-1.5 w-12 bg-gradient-to-r from-[var(--ds-accent-bold)] to-orange-400 rounded-full mb-4 shadow-[0_0_15px_rgba(237,75,0,0.5)]" />
                  <h3 className="text-5xl font-black uppercase tracking-tighter text-[var(--ds-text-primary)] max-w-sm leading-[0.9]">
                    Built on <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--ds-text-primary)] to-[var(--ds-text-subtle)]">
                      Certainty.
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-8 items-stretch h-full">
                  <div className="p-8 rounded-[2rem] bg-[var(--ds-background-default)] border border-[var(--ds-border-bold)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative group/card overflow-hidden hover:border-[var(--ds-accent-bold)]/30 transition-all flex flex-col justify-center">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--ds-accent-bold)] to-transparent opacity-40" />
                    <div className="flex flex-col gap-5">
                      <div className="h-8 w-16 rounded-xl bg-gradient-to-br from-[var(--ds-accent-subtle)] to-[var(--ds-accent-bold)]/10 border border-[var(--ds-accent-bold)]/20" />
                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-full bg-[var(--ds-surface-subtle)] rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-gradient-to-r from-[var(--ds-accent-bold)]/40 to-transparent" />
                        </div>
                        <div className="h-2 w-2/3 bg-[var(--ds-surface-subtle)] rounded-full" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-3 text-[9px] font-black font-mono text-[var(--ds-text-accent)] uppercase tracking-tighter opacity-40 group-hover/card:opacity-100 transition-opacity">
                      GAP: 32PX
                    </div>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-[var(--ds-background-default)] border border-[var(--ds-border-bold)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative group/card overflow-hidden hover:border-blue-500/30 transition-all flex flex-col justify-center">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-40" />
                    <div className="flex flex-col gap-5">
                      <div className="h-8 w-16 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/20 border border-blue-500/20" />
                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-full bg-[var(--ds-surface-subtle)] rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-gradient-to-r from-blue-500/40 to-transparent" />
                        </div>
                        <div className="h-2 w-1/2 bg-[var(--ds-surface-subtle)] rounded-full" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-3 text-[9px] font-black font-mono text-blue-500 uppercase tracking-tighter opacity-40 group-hover/card:opacity-100 transition-opacity">
                      GAP: 32PX
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-5 rounded-[1.5rem] bg-[var(--ds-surface-raised)]/60 backdrop-blur-2xl border border-[var(--ds-border-bold)] flex items-center justify-between shadow-lg">
                  <div className="flex gap-2.5">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                    <div className="h-3.5 w-3.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-accent)] animate-pulse">
                      Live Spacing Geometry
                    </span>
                    <span className="text-[8px] font-mono text-[var(--ds-text-subtlest)] opacity-50">
                      SCALED 1:1 TO SYSTEM TOKENS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Gutter */}
      <section className="relative mt-12 p-1 rounded-[2.5rem] bg-gradient-to-r from-[var(--ds-accent-bold)]/60 via-[var(--ds-accent-bold)]/5 to-[var(--ds-border-bold)]/20 shadow-2xl shadow-black/20">
        <div className="p-12 rounded-[2.5rem] border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-subtle)]/90 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 group-hover:scale-110">
            <Columns size={280} />
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10 font-sans">
            <div className="p-5 rounded-3xl bg-[var(--ds-accent-bold)] text-white shadow-[0_0_40px_rgba(237,75,0,0.35)] shrink-0 ring-4 ring-white/5">
              <Info size={28} />
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-[var(--ds-text-primary)]">
                Institutional Gutter Policy
              </h3>
              <p className="text-[15px] text-[var(--ds-text-subtle)] leading-[1.6] max-w-3xl font-medium tracking-tight">
                We strictly enforce a 16px gutter policy for all operational
                dashboards. For high-conversion marketing pages, we expand to a
                48px (Hero) fluid gutter. This ensures that the densest parts of
                GateFlow, like Audit Logs and Residents Lists, remain calm and
                readable without excessive &quot;whitespace&quot; fatigue.
              </p>
              <div className="flex gap-4 mt-2">
                <div className="px-5 py-2 rounded-full bg-[var(--ds-accent-subtle)] text-[var(--ds-accent-bold)] text-[11px] font-black uppercase tracking-[0.1em] border border-[var(--ds-accent-bold)]/10 shadow-sm transition-transform hover:scale-105">
                  Dashboard: 16px
                </div>
                <div className="px-5 py-2 rounded-full bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] text-[11px] font-black uppercase tracking-[0.1em] border border-[var(--ds-border-brand)]/10 shadow-sm transition-transform hover:scale-105">
                  Marketing: 48px
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
