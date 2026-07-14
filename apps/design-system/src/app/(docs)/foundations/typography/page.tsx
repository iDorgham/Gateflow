'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Type, Ruler, ArrowRightLeft, Languages, Info } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';

const typographyPrinciples = [
  {
    title: 'Inter (UI Primary)',
    description:
      'The modern standard for clarity. Used for all structural UI, dashboards, and high-density data displays.',
    icon: Type,
  },
  {
    title: 'Cairo (Institutional Heading)',
    description:
      'A geometric font that provides corporate authority for Arabic/Middle-East markets. Scaled with Inter metrics.',
    icon: Languages,
  },
  {
    title: 'Fluid Major Third Scale',
    description:
      'Mathematical 1.250 scale ensures clarity. We use clamp() logic to prevent unreadable small sizes on mobile.',
    icon: Ruler,
  },
];

const typographySpecimen = [
  {
    label: 'Display XL',
    token: 'text-7xl',
    pixels: '64px–80px',
    weight: 'Black',
    sample: 'GateFlow Access Control',
  },
  {
    label: 'Heading L',
    token: 'text-5xl',
    pixels: '48px–60px',
    weight: 'Black',
    sample: 'Operational Resilience',
  },
  {
    label: 'Heading M',
    token: 'text-3xl',
    pixels: '30px–36px',
    weight: 'Bold',
    sample: 'Biometric Gateway Interface',
  },
  {
    label: 'Body L',
    token: 'text-lg',
    pixels: '18px',
    weight: 'Medium',
    sample:
      'An enterprise-grade design system built for institutional trust and community security.',
  },
  {
    label: 'Body M / Base',
    token: 'text-base',
    pixels: '16px',
    weight: 'Regular',
    sample: 'The system adapts to the user context automatically.',
  },
  {
    label: 'Caption S',
    token: 'text-xs',
    pixels: '12px',
    weight: 'Bold',
    sample: 'VERSION 3.0.0-ALPHA',
  },
];

export default function TypographyFoundationsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto py-10 px-6">
      <PageHeader
        title="Typography"
        subtitle="Our typographic system balances institutional authority (Cairo) with functional speed (Inter), using a fluid Major Third scale for ultimate clarity."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Typography' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {typographyPrinciples.map((p) => (
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

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Fluid Type Scale Specimen
          </h2>
          <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60 uppercase tracking-widest">
            Our hierarchy derived from a Major Third scale (1.250 ratio) using
            CSS Clamp() logic.
          </p>
        </div>

        <div className="flex flex-col border border-[var(--ds-border-bold)] rounded-3xl overflow-hidden divide-y divide-[var(--ds-border-subtle)] shadow-xl bg-[var(--ds-background-default)]">
          {typographySpecimen.map((spec) => (
            <TypeScalePreview key={spec.token} {...spec} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TypographyPrincipleCard
          title="RTL Parity (Cairo)"
          icon={Languages}
          description="We use Cairo for Arabic headings. Its geometric construction aligns perfectly with Inter's humanist spacing, ensuring no layout shift during language toggles."
        >
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--ds-surface-raised)] border border-[var(--ds-border-bold)]">
            <span className="text-[10px] font-black tracking-widest text-[var(--ds-accent-bold)] uppercase mb-2">
              Live RTL Specimen
            </span>
            <p
              className="text-2xl font-black leading-tight text-right text-[var(--ds-text-primary)]"
              dir="rtl"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              نظام إدارة الدخول الذكي{' '}
              <span className="text-[var(--ds-accent-bold)]">GateFlow</span>.
            </p>
            <p
              className="text-sm font-medium leading-relaxed text-right text-[var(--ds-text-subtle)]"
              dir="rtl"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              المبادئ والقيم الجوهرية التي تبني تجربة GateFlow في الشرق الأوسط.
            </p>
          </div>
        </TypographyPrincipleCard>

        <TypographyPrincipleCard
          title="Variable Logical Scale"
          icon={ArrowRightLeft}
          description="Every font size is mapped to a logical property in the tokens package. We never use static 'px' values for UI elements, ensuring consistent behavior across device resolutions."
        >
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[var(--ds-surface-raised)] border border-[var(--ds-border-bold)] font-mono text-[10px]">
            <div className="flex justify-between items-center border-b border-[var(--ds-border-subtle)] pb-2">
              <span className="text-[var(--ds-text-subtlest)] uppercase font-black">
                Token
              </span>
              <span className="text-[var(--ds-accent-bold)]">Property</span>
            </div>
            <div className="flex justify-between items-center group/code">
              <span className="text-[var(--ds-text-primary)] font-bold transition-all group-hover/code:translate-x-1">
                --ds-text-base
              </span>
              <span className="text-[var(--ds-text-subtle)]">
                clamp(1rem, 2vw, 1.25rem)
              </span>
            </div>
            <div className="flex justify-between items-center group/code">
              <span className="text-[var(--ds-text-primary)] font-bold transition-all group-hover/code:translate-x-1">
                --ds-text-display
              </span>
              <span className="text-[var(--ds-text-subtle)]">
                clamp(2.5rem, 5vw, 4rem)
              </span>
            </div>
          </div>
        </TypographyPrincipleCard>
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-background-neutral-subtle)] to-transparent relative overflow-hidden group shadow-lg">
        <div className="absolute top-2 right-2 p-2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none">
          <Type size={140} strokeWidth={1} />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg">
            <Info size={20} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              The Cine-Serious Motion Tint
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              Our typography isn&apos;t static. In Phase 5, all headings will
              inherit &quot;Cine-Entrance&quot; staggered animations. Each word
              is slightly offset by 50ms, creating a weight and presence derived
              from high-end architectural and automotive brand identities.
            </p>
          </div>
        </div>
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
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 p-8 hover:bg-[var(--ds-surface-subtle)] transition-all group/row">
      <div className="flex flex-col gap-2 w-56 shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ds-accent-bold)] opacity-0 group-hover/row:opacity-100 transition-opacity" />
          <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)] leading-none">
            {label}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <code className="text-[10px] font-mono font-bold text-[var(--ds-text-accent)] bg-[var(--ds-accent-subtle)] px-2 py-0.5 rounded">
            {token}
          </code>
          <span className="text-[10px] font-black uppercase tracking-tight text-[var(--ds-text-subtle)] opacity-60">
            {pixels} / {weight}
          </span>
        </div>
      </div>
      <p
        className={cn(
          'flex-1 text-[var(--ds-text-primary)] leading-[1.1] transition-all duration-500 group-hover/row:translate-x-2',
          token === 'text-7xl' &&
            'text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase',
          token === 'text-5xl' &&
            'text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase',
          token === 'text-3xl' &&
            'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight uppercase',
          token === 'text-lg' && 'text-lg font-medium leading-relaxed',
          token === 'text-base' && 'text-base font-medium leading-relaxed',
          token === 'text-xs' &&
            'text-xs font-black uppercase tracking-widest opacity-60'
        )}
      >
        {sample}
      </p>
    </div>
  );
}

function TypographyPrincipleCard({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon: React.ElementType;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-xl relative group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg transition-transform group-hover:scale-110">
          <Icon size={18} />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
          {title}
        </h3>
      </div>
      <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
        {description}
      </p>
      {children}
    </div>
  );
}
