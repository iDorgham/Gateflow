import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Info, Palette, ShieldCheck, SunMoon } from 'lucide-react';
import { cn } from '@gateflow/ui';

const colorPrinciples = [
  {
    title: 'Accessible Contrast',
    description:
      'We meet WCAG 2.1 AA (4.5:1) for all critical UI text and iconography.',
    icon: ShieldCheck,
  },
  {
    title: 'Semantic-First',
    description:
      'Design with purpose, not hex codes. Usage dictates naming (background, brand, information).',
    icon: Palette,
  },
  {
    title: 'Color Mode Harmony',
    description:
      'Tokens map symmetrically across Light and Dark modes using OKLCH logic.',
    icon: SunMoon,
  },
];

export default function ColorFoundationsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Color"
        subtitle="Our color system is built to balance expressive brand identity with enterprise-level accessibility."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Foundations', href: '/foundations' },
          { label: 'Color' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colorPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-sm">
              <p.icon size={20} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text)]">
              {p.title}
            </h3>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)]">
          Semantic Tokens
        </h2>
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
            GateFlow uses a **Semantic Color System**. Instead of using
            primitives like &quot;Blue 500&quot;, components use functional
            variables that automatically adapt context and mode.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-1 border border-[var(--ds-border-subtle)] rounded-3xl overflow-hidden">
          <ColorRow
            name="--ds-background-brand-bold"
            desc="Primary action background. High brand visibility."
            preview="bg-[var(--ds-background-brand-bold)]"
          />
          <ColorRow
            name="--ds-text"
            desc="Primary body text. High contrast for readability."
            preview="bg-[var(--ds-text)]"
          />
          <ColorRow
            name="--ds-border"
            desc="Standard structure divider. Subtle separation."
            preview="bg-[var(--ds-border)]"
          />
          <ColorRow
            name="--ds-background-neutral-subtle"
            desc="Sidebar/Chrome background. Low visual weight."
            preview="bg-[var(--ds-background-neutral-subtle)]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--ds-border-information-subtle)] bg-[var(--ds-background-information-subtle)] p-8">
        <div className="flex gap-4">
          <Info
            className="text-[var(--ds-icon-information)] shrink-0"
            size={24}
          />
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold text-[var(--ds-text-information)] leading-none uppercase tracking-tight">
              The Power of OKLCH
            </h4>
            <p className="text-sm text-[var(--ds-text-information)] leading-relaxed opacity-80">
              Unlike HSL or RGB, the **OKLCH** color space is perceptually
              uniform. This allows us to programmatically adjust lightness and
              chroma while keeping the visible color intensity predictable
              across different hues. This is the engine behind our accessible
              Token system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ColorRow({
  name,
  desc,
  preview,
}: {
  name: string;
  desc: string;
  preview: string;
}) {
  return (
    <div className="flex items-center gap-6 p-4 bg-[var(--ds-background-neutral-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-colors">
      <div
        className={cn(
          'h-12 w-12 rounded-xl border border-[var(--ds-border-subtle)] shadow-inner',
          preview
        )}
      />
      <div className="flex flex-col">
        <code className="text-xs font-mono font-bold text-[var(--ds-text)]">
          {name}
        </code>
        <span className="text-[10px] uppercase font-black tracking-tight text-[var(--ds-text-subtlest)]">
          {desc}
        </span>
      </div>
    </div>
  );
}
