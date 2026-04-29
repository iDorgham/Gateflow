'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { ShieldCheck, Palette, SunMoon, Info } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { AccentProfileLab } from '../../../../components/foundations/AccentProfileLab';

const colorPrinciples = [
  {
    title: 'Perceptual Uniformity',
    description:
      'Using OKLCH, we maintain consistent lightness (L) across all hues. This ensures that Kimchi, Cobalt, and Emerald feel equally bright and readable.',
    icon: SunMoon,
  },
  {
    title: 'Satin-Charcoal Depth',
    description:
      'We use a warm-charcoal base (Hue 250) for all dark mode surfaces. Lightness tiers (8-22%) create "Satin" depth without the harshness of pure black.',
    icon: ShieldCheck,
  },
  {
    title: 'Semantic Mapping',
    description:
      'All UI is built using semantic --ds- tokens. If you change a profile, every component updates instantly without a build step.',
    icon: Palette,
  },
];

const neutralSwatches = [
  { name: 'Neutral-10', var: '--gf-color-neutral-10', label: 'Canvas / Deep' },
  { name: 'Neutral-20', var: '--gf-color-neutral-20', label: 'Sidebar / Nav' },
  { name: 'Neutral-30', var: '--gf-color-neutral-30', label: 'Surface / Card' },
  { name: 'Neutral-40', var: '--gf-color-neutral-40', label: 'Raised / Hover' },
  {
    name: 'Neutral-50',
    var: '--gf-color-neutral-50',
    label: 'Overlay / Modal',
  },
];

const semanticSwatches = [
  {
    name: 'Background',
    var: '--ds-background-default',
    label: 'Institutional Base',
  },
  {
    name: 'Surface Subtle',
    var: '--ds-surface-subtle',
    label: 'Inset / Sidebar',
  },
  {
    name: 'Surface Raised',
    var: '--ds-surface-raised',
    label: 'Component Base',
  },
  {
    name: 'Surface Overlay',
    var: '--ds-surface-overlay',
    label: 'Elevated UI',
  },
  { name: 'Surface Glass', var: '--ds-surface-glass', label: 'Glassmorphism' },
];

const textSwatches = [
  { name: 'Text Primary', var: '--ds-text-primary', label: 'High contrast' },
  { name: 'Text Subtle', var: '--ds-text-subtle', label: 'Secondary body' },
  { name: 'Text Inverse', var: '--ds-text-inverse', label: 'On light bg' },
  {
    name: 'Text Accent',
    var: '--ds-text-accent',
    label: 'Primary brand links',
  },
];

const accentSwatches = [
  { name: 'Kimchi Core', var: '--ds-primary-accent', label: 'Energy / Brand' },
  { name: 'Accent Bold', var: '--ds-accent-bold', label: 'Interactive Base' },
  { name: 'Accent Hover', var: '--ds-accent-hover', label: 'Pressed State' },
  {
    name: 'Accent Subtle',
    var: '--ds-accent-subtle',
    label: 'Translucent fill',
  },
];

export default function ColorFoundationsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto py-10 px-6">
      <PageHeader
        title="Color Foundations"
        subtitle="The GateFlow color system is built on institutional OKLCH foundations, emphasizing depth, serious professionalism, and high contrast."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Color' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colorPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
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
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
          Accent Profile Lab
        </h2>
        <AccentProfileLab />
      </div>

      <SwatchSection
        title="Satin-Charcoal Neutrals"
        description="The backbone of the design system. These tier-based ramps provide the deep institutional depth characteristic of GateFlow."
      >
        <SwatchGrid swatches={neutralSwatches} bordered />
      </SwatchSection>

      <SwatchSection
        title="Semantic Surface Layer"
        description="Every component is built using these semantic mappings. This ensures theme-shifting works automatically across light/dark and accent profiles."
      >
        <SwatchGrid swatches={semanticSwatches} bordered glass />
      </SwatchSection>

      <SwatchSection
        title="Institutional Typography"
        description="Semantic text tones ensure that readability is prioritized, with dedicated inverse and accent variants for brand expression."
      >
        <SwatchGrid swatches={textSwatches} />
      </SwatchSection>

      <SwatchSection
        title="Active Accent Mapping"
        description="These tokens reflect the currently active accent profile (Kimchi, Cobalt, or Emerald). Switch the lab above to see them in action."
      >
        <SwatchGrid swatches={accentSwatches} />
      </SwatchSection>

      <SwatchSection
        title="Phase 2 GF Tokens"
        description="The newly mapped tokens from Phase 2 for direct reference."
      >
        <SwatchGrid
          swatches={[
            { name: 'Brand 50', var: '--gf-color-brand-50', label: '' },
            { name: 'Brand 300', var: '--gf-color-brand-300', label: '' },
            {
              name: 'Brand 500 (Kimchi)',
              var: '--gf-color-brand-500',
              label: '',
            },
            { name: 'Brand 700', var: '--gf-color-brand-700', label: '' },
            { name: 'BG Page', var: '--gf-color-bg-page', label: '' },
            { name: 'BG Subtle', var: '--gf-color-bg-subtle', label: '' },
            {
              name: 'BG Default (Card)',
              var: '--gf-color-bg-default',
              label: '',
            },
            { name: 'BG Raised', var: '--gf-color-bg-raised', label: '' },
            { name: 'BG Overlay', var: '--gf-color-bg-overlay', label: '' },
            { name: 'Text', var: '--gf-color-text', label: '' },
            { name: 'Text Subtle', var: '--gf-color-text-subtle', label: '' },
            { name: 'Border', var: '--gf-color-border', label: '' },
            { name: 'Success', var: '--gf-color-success', label: '' },
            { name: 'Warning', var: '--gf-color-warning', label: '' },
            { name: 'Danger', var: '--gf-color-danger', label: '' },
            { name: 'Info', var: '--gf-color-info', label: '' },
          ]}
          bordered
        />
      </SwatchSection>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-accent-subtle)] to-transparent relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <Palette size={120} />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Institutional OKLCH Protocol
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              We leverage OKLCH for institutional stability. By locking Chrome
              (C) and Hue (H) while strictly managing Lightness (L), we generate
              accessible palettes that look identical in contrast across
              different browser engines. This prevents the
              &quot;flickering&quot; contrast issues common in traditional
              HEX/HSL systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SwatchSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)] leading-none">
          {title}
        </h2>
        <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function SwatchGrid({
  swatches,
  bordered = false,
  glass = false,
}: {
  swatches: { name: string; var: string; label: string }[];
  bordered?: boolean;
  glass?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {swatches.map((s) => (
        <Swatch key={s.var} {...s} bordered={bordered} glass={glass} />
      ))}
    </div>
  );
}

function Swatch({
  name,
  var: cssVar,
  label,
  bordered,
  glass,
}: {
  name: string;
  var: string;
  label: string;
  bordered?: boolean;
  glass?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 group/swatch">
      <div
        className={cn(
          'h-20 w-full rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 group-hover/swatch:scale-[1.03] group-hover/swatch:shadow-md',
          bordered && 'border border-[var(--ds-border-bold)]',
          glass && 'glass shadow-inner'
        )}
        style={{
          backgroundColor: glass ? undefined : `var(${cssVar})`,
        }}
      >
        {/* Subtle grid pattern for transparency preview on glass */}
        {glass && (
          <div className="absolute inset-0 opacity-[0.2] -z-10 bg-[radial-gradient(var(--ds-text-primary)_0.5px,transparent_0.5px)] bg-[length:12px_12px]" />
        )}
      </div>
      <div className="flex flex-col gap-1 px-1">
        <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
          {name}
        </span>
        <code className="text-[9px] font-mono font-bold text-[var(--ds-text-accent)] truncate bg-[var(--ds-accent-subtle)] px-1 py-0.5 rounded w-fit">
          {cssVar}
        </code>
        <span className="text-[9px] font-black uppercase tracking-tight text-[var(--ds-text-subtle)] opacity-50">
          {label}
        </span>
      </div>
    </div>
  );
}
