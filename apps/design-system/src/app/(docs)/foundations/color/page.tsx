import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Info, Palette, ShieldCheck, SunMoon } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';

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
      'Tokens map symmetrically across Light and Dark modes using OKLCH for perceptual uniformity.',
    icon: SunMoon,
  },
];

const brandSwatches = [
  { name: 'Brand 50', var: '--gf-color-brand-50', label: 'Tint' },
  { name: 'Brand 100', var: '--gf-color-brand-100', label: 'Light' },
  { name: 'Brand 200', var: '--gf-color-brand-200', label: 'Soft' },
  { name: 'Brand 300', var: '--gf-color-brand-300', label: 'Muted' },
  {
    name: 'Brand 400',
    var: '--gf-color-brand-400',
    label: 'Dark mode primary',
  },
  { name: 'Brand 500', var: '--gf-color-brand-500', label: 'Kimchi #ED4B00' },
  { name: 'Brand 600', var: '--gf-color-brand-600', label: 'Hover' },
  { name: 'Brand 700', var: '--gf-color-brand-700', label: 'Bold' },
  { name: 'Brand 800', var: '--gf-color-brand-800', label: 'Deep' },
  { name: 'Brand 900', var: '--gf-color-brand-900', label: 'Dark' },
];

const surfaceSwatches = [
  { name: 'BG Page', var: '--gf-color-bg-page', label: 'Page canvas' },
  { name: 'BG Subtle', var: '--gf-color-bg-subtle', label: 'Sidebar / inset' },
  { name: 'BG Default', var: '--gf-color-bg-default', label: 'Cards' },
  {
    name: 'BG Raised',
    var: '--gf-color-bg-raised',
    label: 'Dropdowns / popovers',
  },
  { name: 'BG Overlay', var: '--gf-color-bg-overlay', label: 'Modals' },
];

const textSwatches = [
  { name: 'Text', var: '--gf-color-text', label: 'Primary body' },
  { name: 'Text Subtle', var: '--gf-color-text-subtle', label: 'Secondary' },
  {
    name: 'Text Subtlest',
    var: '--gf-color-text-subtlest',
    label: 'Placeholder',
  },
  { name: 'Text Brand', var: '--gf-color-text-brand', label: 'Kimchi links' },
  { name: 'Text Inverse', var: '--gf-color-text-inverse', label: 'On dark bg' },
];

const borderSwatches = [
  { name: 'Border', var: '--gf-color-border', label: 'Default' },
  { name: 'Border Subtle', var: '--gf-color-border-subtle', label: 'Hairline' },
  { name: 'Border Bold', var: '--gf-color-border-bold', label: 'Emphasis' },
  {
    name: 'Border Focused',
    var: '--gf-color-border-focused',
    label: 'Focus ring',
  },
];

const statusSwatches = [
  {
    name: 'Success Subtle',
    var: '--gf-color-success-subtle',
    label: 'Background',
  },
  { name: 'Success', var: '--gf-color-success', label: 'Default' },
  {
    name: 'Success Bold',
    var: '--gf-color-success-bold',
    label: 'Text / icon',
  },
  {
    name: 'Warning Subtle',
    var: '--gf-color-warning-subtle',
    label: 'Background',
  },
  { name: 'Warning', var: '--gf-color-warning', label: 'Default' },
  {
    name: 'Warning Bold',
    var: '--gf-color-warning-bold',
    label: 'Text / icon',
  },
  {
    name: 'Danger Subtle',
    var: '--gf-color-danger-subtle',
    label: 'Background',
  },
  { name: 'Danger', var: '--gf-color-danger', label: 'Default' },
  { name: 'Danger Bold', var: '--gf-color-danger-bold', label: 'Text / icon' },
  { name: 'Info', var: '--gf-color-info', label: 'Default' },
  { name: 'Info Bold', var: '--gf-color-info-bold', label: 'Text / icon' },
];

const analyticSwatches = [
  { name: 'Chart 1', var: '--gf-color-chart-1', label: 'Primary (Kimchi)' },
  { name: 'Chart 2', var: '--gf-color-chart-2', label: 'Secondary (Blue)' },
  { name: 'Chart 3', var: '--gf-color-chart-3', label: 'Emerald' },
  { name: 'Chart 4', var: '--gf-color-chart-4', label: 'Amber' },
  { name: 'Chart 5', var: '--gf-color-chart-5', label: 'Plum' },
];

const aiSwatches = [
  { name: 'AI Surface', var: '--gf-color-ai-surface', label: 'Glow canvas' },
  { name: 'AI Accent', var: '--gf-color-ai-accent', label: 'Orchid' },
];

export default function ColorFoundationsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Color"
        subtitle="Our color system is built on warm OKLCH neutrals, Kimchi brand, and a 5-level surface hierarchy for light and dark modes."
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
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--gf-color-border)] bg-[var(--gf-color-bg-subtle)]"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--gf-color-primary)] text-white shadow-sm">
              <p.icon size={20} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-[var(--gf-color-text)]">
              {p.title}
            </h3>
            <p className="text-sm text-[var(--gf-color-text-subtle)] leading-relaxed">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <SwatchSection
        title="Brand — Kimchi"
        description="Primary brand palette derived from Kimchi #ED4B00. Brand-500 is used as the primary action color in light mode; Brand-400 in dark mode."
      >
        <SwatchGrid swatches={brandSwatches} />
      </SwatchSection>

      <SwatchSection
        title="Surfaces"
        description="Five-level background hierarchy. Each level adds visual elevation. Page is the canvas; Overlay sits atop everything."
      >
        <SwatchGrid swatches={surfaceSwatches} bordered />
      </SwatchSection>

      <SwatchSection
        title="Text"
        description="Semantic text tokens that automatically invert in dark mode."
      >
        <SwatchGrid swatches={textSwatches} bordered />
      </SwatchSection>

      <SwatchSection
        title="Borders"
        description="Border tokens for structure, focus states, and emphasis."
      >
        <SwatchGrid swatches={borderSwatches} bordered />
      </SwatchSection>

      <SwatchSection
        title="Status"
        description="Success, Warning, Danger, and Info each have three levels: subtle (background), default (icon/badge), and bold (text on light bg)."
      >
        <SwatchGrid swatches={statusSwatches} />
      </SwatchSection>

      <SwatchSection
        title="Predictive & AI (Virtual Lab)"
        description="Specialized orchid and violet tones for Artificial Intelligence features. AI Surface uses a unique glow palette."
      >
        <SwatchGrid swatches={aiSwatches} bordered />
      </SwatchSection>

      <SwatchSection
        title="Analytics & Data Viz"
        description="A curated 5-color palette for charts, trends, and performance metrics, optimized for both light and dark backgrounds."
      >
        <SwatchGrid swatches={analyticSwatches} />
      </SwatchSection>

      <section className="rounded-3xl border border-[var(--gf-color-info-subtle)] bg-[var(--gf-color-info-subtle)] p-8">
        <div className="flex gap-4">
          <Info className="text-[var(--gf-color-info)] shrink-0" size={24} />
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold text-[var(--gf-color-text)] leading-none uppercase tracking-tight">
              Why OKLCH?
            </h4>
            <p className="text-sm text-[var(--gf-color-text-subtle)] leading-relaxed">
              Unlike HSL or RGB, the OKLCH color space is perceptually uniform.
              Adjusting lightness by 10% looks like 10% to the human eye,
              regardless of hue. This lets us build the dark mode palette
              mathematically — charcoal surfaces at 12–20% lightness with
              consistent chroma, ensuring readability without manual tuning.
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
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--gf-color-text)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--gf-color-text-subtle)] max-w-2xl">
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
}: {
  swatches: { name: string; var: string; label: string }[];
  bordered?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {swatches.map((s) => (
        <Swatch key={s.var} {...s} bordered={bordered} />
      ))}
    </div>
  );
}

function Swatch({
  name,
  var: cssVar,
  label,
  bordered,
}: {
  name: string;
  var: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'h-16 w-full rounded-xl shadow-sm',
          bordered && 'border border-[var(--gf-color-border)]'
        )}
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[var(--gf-color-text)]">
          {name}
        </span>
        <code className="text-[10px] font-mono text-[var(--gf-color-text-subtlest)] truncate">
          {cssVar}
        </code>
        <span className="text-[10px] uppercase font-semibold tracking-tight text-[var(--gf-color-text-subtle)]">
          {label}
        </span>
      </div>
    </div>
  );
}
