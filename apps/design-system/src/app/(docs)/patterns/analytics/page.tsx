'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { BarChart3, Info, RefreshCcw, Palette, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for the entire chart component to avoid SSR and typing synchronization issues
const ChartLab = dynamic(() => import('./ChartLab'), { ssr: false });

const analyticsPrinciples = [
  {
    title: 'Institutional Palette',
    description: 'We use a 5-color palette for data visualization. Color 1 is always the active Accent Profile (Kimchi/Cobalt/Emerald).',
    icon: Palette,
  },
  {
    title: 'Perceptual Uniformity',
    description: 'All chart colors are calibrated to consistent OKLCH lightness levels to ensure accessibility and readability in dark mode.',
    icon: ShieldCheck,
  },
  {
    title: 'Responsive Adaptation',
    description: 'Charts use CSS variables exclusively. When a profile or theme changes, the entire analytics suite updates instantly.',
    icon: RefreshCcw,
  },
];

export default function AnalyticsPatternsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Analytics & Charts"
        subtitle="The GateFlow analytics system provides high-density, institutional-grade data visualization that respects the active workspace profile."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Analytics' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Chart Profile Explorer
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Observe how chart colors synchronize with the global --ds-primary-accent.
          </p>
        </div>
        <ChartLab />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <BarChart3 size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Tokenized Visualization
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              We do not hardcode colors in charts. By mapping Recharts components to institutional tokens like <strong>--gf-color-info</strong> and <strong>--ds-primary-accent</strong>, we ensure that every dashboard in the monorepo adheres to the same institutional rigor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
