import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Type, Ruler, ArrowRightLeft } from 'lucide-react';
import { cn } from '@gateflow/ui';

const typographyPrinciples = [
  {
    title: 'Inter-Locked',
    description:
      'We use Inter for all UI. Balanced geometric and humanist traits for screen legibility.',
    icon: Type,
  },
  {
    title: 'Scaling System',
    description:
      'A 1.250 Major Third scale ensures clear hierarchy from tiny captions to large displays.',
    icon: Ruler,
  },
  {
    title: 'Logical Properties',
    description:
      'All text alignment and margins use logical properties (start/end) for RTL/LTR parity.',
    icon: ArrowRightLeft,
  },
];

export default function TypographyFoundationsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Typography"
        subtitle="Hierarchy and rhythm that prioritize information clarity and cross-platform readability."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Foundations', href: '/foundations' },
          { label: 'Typography' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {typographyPrinciples.map((p) => (
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

      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)]">
          The Type Scale
        </h2>
        <div className="flex flex-col gap-4 max-w-2xl text-sm text-[var(--ds-text-subtle)] leading-relaxed">
          <p>
            Our typographic hierarchy is rooted in a **Modular Scale**. This
            ensures that the relationship between font sizes is consistent and
            mathematically predictable.
          </p>
        </div>

        <div className="flex flex-col border border-[var(--ds-border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--ds-border-subtle)]">
          <TypeScalePreview
            label="Display L"
            token="text-6xl"
            pixels="60px"
            weight="Black"
            sample="GateFlow"
          />
          <TypeScalePreview
            label="H1 / Heading"
            token="text-4xl"
            pixels="36px"
            weight="Black"
            sample="The future of access."
          />
          <TypeScalePreview
            label="H3 / Subheading"
            token="text-xl"
            pixels="20px"
            weight="Bold"
            sample="Operational security primitives."
          />
          <TypeScalePreview
            label="Base / Body"
            token="text-base"
            pixels="16px"
            weight="Medium"
            sample="An enterprise-grade design system for secure access and community resilience."
          />
          <TypeScalePreview
            label="Small / Caption"
            token="text-xs"
            pixels="12px"
            weight="Bold"
            sample="LAST UPDATED: APRIL 2026"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)]">
          Weights & Rhythm
        </h2>
        <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
          We use **Variable Weights** to express hierarchy without relying
          solely on color. Bold and Black weights are used for headlines and
          navigation to create a strong visual anchor.
        </p>
      </section>
    </div>
  );
}

function TypeScalePreview({
  label,
  token,
  pixels,
  weight,
  sample,
}: {
  label: string;
  token: string;
  pixels: string;
  weight: string;
  sample: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 p-8 bg-[var(--ds-background-neutral-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-all">
      <div className="flex flex-col gap-1 w-48 shrink-0">
        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)] opacity-60 leading-none">
          {label}
        </span>
        <code className="text-[11px] font-mono font-bold text-[var(--ds-text-brand)]">
          {token}
        </code>
        <span className="text-[10px] font-bold text-[var(--ds-text-subtle)]">
          {pixels} / {weight}
        </span>
      </div>
      <p
        className={cn(
          'flex-1 text-[var(--ds-text)] tracking-tight leading-[1.1]',
          token
        )}
      >
        {sample}
      </p>
    </div>
  );
}
