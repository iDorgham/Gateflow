import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Layers, Cuboid, BoxSelect, Sparkles } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';

const layeringPrinciples = [
  {
    title: '5-Tier Surface Hierarchy',
    description:
      'We never use more than 5 levels of Z-depth. This prevents visual clutter and ensures the user always knows what is modal.',
    icon: Layers,
  },
  {
    title: 'Standard Elevation Tags',
    description:
      'We use standardized Z-index tokens (Base, Raised, Overlay, etc.) instead of hardcoded values to prevent Z-index &quot;wars&quot;.',
    icon: Cuboid,
  },
  {
    title: 'Shadow + Glow depth',
    description:
      'Critical UI (Modals, Alerts) use brand-tinted glows instead of just black shadows to express "Virtual Institutionalism".',
    icon: Sparkles,
  },
];

const zStack = [
  {
    name: 'Base / Canvas',
    token: 'z-0',
    value: '0',
    description: 'The absolute foundation of the page.',
  },
  {
    name: 'Raised Surface',
    token: 'z-10',
    value: '10',
    description: 'Card base, sticky sidebars.',
  },
  {
    name: 'Floating Element',
    token: 'z-20',
    value: '20',
    description: 'Tooltips, simple popovers.',
  },
  {
    name: 'Sticky / Header',
    token: 'z-30',
    value: '30',
    description: 'Institutional navigation bars.',
  },
  {
    name: 'Modal / Overlay',
    token: 'z-max',
    value: '1000',
    description: 'Highest level task isolation.',
  },
];

export default function LayeringFoundationsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Layering & Depth"
        subtitle="Depth provides information architecture. By using standardized Z-stack tokens and premium elevation effects, we manage interface complexity."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Layering' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layeringPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)]"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg">
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

      {/* 3D Stack Lab */}
      <section className="flex flex-col gap-12 mt-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            The Z-Stack Visualizer
          </h2>
          <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60 uppercase tracking-widest leading-relaxed">
            Experience the isometric projection of our layering system. Higher
            Z-values inherit stronger shadows and &quot;Satin-Charcoal&quot;
            surface lifts.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 items-center">
          {/* Isometric Visualizer */}
          <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center p-12 perspective-[1000px] group">
            <div className="relative flex flex-col gap-[-40px] items-center justify-center rotate-x-[45deg] rotate-z-[-25deg] transition-all duration-1000 group-hover:rotate-x-[35deg] group-hover:rotate-z-[-35deg]">
              {zStack.map((layer, idx) => (
                <div
                  key={layer.token}
                  className={cn(
                    'h-24 w-48 rounded-2xl border-2 transition-all duration-500 flex flex-col p-4 shadow-2xl relative',
                    idx === 0 &&
                      'bg-[oklch(8%_0.015_250)] border-white/5 opacity-50 z-0',
                    idx === 1 &&
                      'bg-[oklch(14%_0.02_250)] border-white/10 z-10 translate-y-[-20px]',
                    idx === 2 &&
                      'bg-[oklch(16%_0.02_250)] border-white/15 z-20 translate-y-[-40px]',
                    idx === 3 &&
                      'bg-[oklch(18%_0.02_250)] border-white/20 z-30 translate-y-[-60px]',
                    idx === 4 &&
                      'bg-[oklch(22%_0.02_250)] border-[var(--ds-accent-bold)] z-[1000] translate-y-[-100px] shadow-[var(--ds-glow-accent)]'
                  )}
                >
                  <span className="text-[10px] font-black uppercase text-white/40">
                    {layer.token}
                  </span>
                  <span className="text-[11px] font-black uppercase text-white tracking-widest group-hover:translate-x-2 transition-transform">
                    {layer.name}
                  </span>
                  {idx === 4 && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--ds-accent-bold)] animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            {zStack.map((layer) => (
              <div
                key={layer.token}
                className="flex gap-4 p-6 rounded-2xl bg-[var(--ds-background-default)] border border-[var(--ds-border-bold)] hover:bg-[var(--ds-surface-subtle)] transition-all group/item"
              >
                <div className="w-20 shrink-0">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-accent-bold)]">
                    {layer.token}
                  </span>
                  <div className="h-0.5 w-8 bg-[var(--ds-accent-bold)] mt-1 group-hover/item:w-full transition-all duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
                    {layer.name}
                  </span>
                  <p className="text-xs text-[var(--ds-text-subtle)] font-medium leading-relaxed mt-1 opacity-70 group-hover/item:opacity-100 transition-opacity">
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-background-neutral-subtle)] to-transparent relative group mt-12 shadow-md">
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-md">
            <BoxSelect size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              The Modal Isolation Rule
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              Whenever a Z-MAX element is active, the rest of the interface must
              inherit a 16px blur backdrop filter. This isn&apos;t just
              aesthetic — it provides immediate operational focus on high-stakes
              tasks like QR Verification or User Management changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
