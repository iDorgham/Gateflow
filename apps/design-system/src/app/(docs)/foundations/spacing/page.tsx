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

const spacingTokens = [
  { name: 'Space 1', var: '--ds-space-block', value: '8px', label: 'Atomic' },
  {
    name: 'Space 2',
    var: '--ds-space-md',
    value: '16px',
    label: 'Default Gap',
  },
  { name: 'Space 3', var: '--ds-space-lg', value: '24px', label: 'Section' },
  { name: 'Space 4', var: '--ds-space-xl', value: '32px', label: 'Loose' },
];

export default function SpacingFoundationsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Spacing & Grid"
        subtitle="Our layout strategy is built on a mathematical 8pt grid, ensuring consistency from high-density dashboards to expansive landing pages."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Spacing' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spacingPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)] leading-none">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      {/* Grid Visualizer Lab */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            The 8pt Lab
          </h2>
          <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60 uppercase tracking-widest leading-relaxed">
            Experience the mathematical rhythm of the GateFlow space. Use these
            tokens for all margins, paddings, and absolute positioning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 border border-[var(--ds-border-bold)] rounded-3xl overflow-hidden shadow-xl bg-[var(--ds-background-default)]">
              {spacingTokens.map((token) => (
                <div
                  key={token.var}
                  className="flex items-center gap-6 p-6 hover:bg-[var(--ds-surface-subtle)] transition-all group/row"
                >
                  <div className="flex flex-col gap-1 w-32 shrink-0">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                      {token.name}
                    </span>
                    <code className="text-[11px] font-mono font-bold text-[var(--ds-accent-bold)]">
                      {token.value}
                    </code>
                    <span className="text-[9px] font-bold text-[var(--ds-text-subtle)] opacity-60 uppercase">
                      {token.label}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-6 rounded-md bg-[var(--ds-accent-subtle)] border border-[var(--ds-accent-bold)]/20 shadow-inner relative group/bar transition-all hover:scale-[1.01]"
                      style={{ width: token.value }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(var(--ds-accent-bold)_1px,transparent_1px)] bg-[length:16px_16px]" />
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <LayoutGrid
                  size={18}
                  className="text-[var(--ds-accent-bold)]"
                />
                <h3 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
                  Rhythm Preview
                </h3>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <div className="p-4 rounded-xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-lg relative group/item">
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover/item:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black font-mono">
                      P-16
                    </span>
                  </div>
                  <div className="h-8 w-2/3 rounded-lg bg-[var(--ds-accent-subtle)] animate-pulse" />
                </div>
                <div className="p-4 rounded-xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-lg relative group/item">
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover/item:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black font-mono">
                      GAP-24
                    </span>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <div className="h-10 flex-1 rounded-lg bg-[var(--ds-surface-raised)] border border-[var(--ds-border-subtle)]" />
                    <div className="h-10 flex-1 rounded-lg bg-[var(--ds-surface-raised)] border border-[var(--ds-border-subtle)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-accent-subtle)] to-transparent relative group mt-12 shadow-md">
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Institutional Gutter Policy
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              We strictly enforce a 16px gutter policy for all operational
              dashboards. For high-conversion marketing pages, we expand to a
              32px fluid gutter. This ensures that the densest parts of GateFlow
              (Audit Logs, Residents List) remain calm and readable without
              excessive &quot;whitespace&quot;.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
