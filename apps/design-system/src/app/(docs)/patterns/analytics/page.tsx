'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  BarChart3,
  Info,
  RefreshCcw,
  Palette,
  ShieldCheck,
  Code2,
  Layout,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for the lab to manage client-side state correctly in Next.js 15
const AnalyticsDashboardLab = dynamic(() => import('./AnalyticsDashboardLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-[var(--ds-surface-subtle)] animate-pulse rounded-[2.5rem] border border-[var(--ds-border-bold)]" />
  ),
});

const analyticsPrinciples = [
  {
    title: 'Data Density',
    description:
      'We pack high-signal information into compact, scannable layouts using StatGrid and specialized chart configurations.',
    icon: Layout,
  },
  {
    title: 'Institutional Palette',
    description:
      'We use a semantic 5-color palette for data. Color 1 is always the active Accent Profile (Kimchi/Cobalt/Emerald).',
    icon: Palette,
  },
  {
    title: 'Profile Sync',
    description:
      'Charts and stats use CSS variables exclusively. When a profile or theme changes, the entire suite updates instantly.',
    icon: RefreshCcw,
  },
];

export default function AnalyticsPatternsPage() {
  return (
    <div className="flex flex-col gap-16 max-w-5xl mx-auto py-12 px-6">
      <PageHeader
        title="Analytics Patterns"
        subtitle="High-density, institutional-grade data visualization for gated community management. Built for deep telemetry and rapid scanning."
        packageName="@gateflow/components"
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Analytics' },
        ]}
      />

      {/* Principles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {analyticsPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-5 p-8 rounded-[2rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 w-fit rounded-xl bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-12">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-bold opacity-80">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Lab Section */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Intelligence Lab
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70 max-w-2xl">
            This lab represents the standard &quot;Intelligence Hub&quot; found
            in Admin and Client dashboards. Test the responsiveness and accent
            profile synchronization below.
          </p>
        </div>

        <AnalyticsDashboardLab />
      </div>

      {/* Assembly Documentation */}
      <section className="flex flex-col gap-12 pt-10 border-t border-[var(--ds-border-bold)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Code2 className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Implementation
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
            Analytics patterns are assembled using the `StatGrid` and `ChartLab`
            compositions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ds-primary-accent)]">
              1. Stat Grid Assembly
            </h4>
            <div className="p-6 rounded-2xl bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre className="text-[var(--ds-text-primary)]">
                {`import { StatGrid } from '@gateflow/components';

<StatGrid 
  columns={4}
  stats={[
    { label: 'Active', value: '2k', trend: { value: '+5%', direction: 'up' } },
    { label: 'Latency', value: '14ms', variant: 'primary' }
  ]} 
/>`}
              </pre>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ds-primary-accent)]">
              2. Chart Theming
            </h4>
            <div className="p-6 rounded-2xl bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre className="text-[var(--ds-text-primary)]">
                {`// Always use CSS variables for Recharts
<Bar 
  dataKey="value" 
  fill="var(--ds-primary-accent)" 
  radius={[6, 6, 0, 0]} 
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="p-10 rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-gradient-to-br from-[var(--ds-surface-subtle)] to-[var(--ds-surface-sunken)] relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 p-2 opacity-10 scale-[2.5] rotate-12 transition-all duration-700 group-hover:rotate-0">
          <ShieldCheck size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-6 relative z-10">
          <div className="p-3 h-fit w-fit rounded-xl bg-[var(--ds-background-brand-bold)] text-white shadow-xl">
            <Info size={24} />
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Rigor over Rust
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-bold opacity-80">
              By mapping Recharts components to institutional tokens like{' '}
              <code className="bg-[var(--ds-background-neutral-subtle)] px-2 py-0.5 rounded text-xs">
                --ds-primary-accent
              </code>
              , we ensure that every dashboard in the GateFlow monorepo remains
              synchronized with its organization&apos;s brand profile even as
              the platform scales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
