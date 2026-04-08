'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  Info,
  Search,
  ShieldCheck,
  Activity,
  Users,
  Settings,
  Bell,
  Calendar,
  Map,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Input } from '@gateflow/ui';

const iconPrinciples = [
  {
    title: '1.5px Stroke Weight',
    description:
      'We never use thick strokes. A constant 1.5px weight ensures icons feels precise and serious in a high-density environment.',
  },
  {
    title: 'Sentinel Glow Lab',
    description:
      'Icons use Brand Glow tints instead of just solid colors to draw professional attention without overwhelming the user.',
  },
  {
    title: 'Optical Alignment',
    description:
      'Every icon is centered within a 24px grid to maintain visual rhythm during layout shifts.',
  },
];

const iconCategories = [
  {
    name: 'Security & Access',
    icons: [
      { icon: ShieldCheck, name: 'ShieldCheck' },
      { icon: Activity, name: 'Activity' },
      { icon: CheckCircle, name: 'CheckCircle' },
      { icon: AlertCircle, name: 'AlertCircle' },
      { icon: XCircle, name: 'XCircle' },
    ],
  },
  {
    name: 'Dashboard UI',
    icons: [
      { icon: Users, name: 'Users' },
      { icon: Settings, name: 'Settings' },
      { icon: Bell, name: 'Bell' },
      { icon: Calendar, name: 'Calendar' },
      { icon: Map, name: 'Map' },
    ],
  },
];

export default function IconographyFoundationsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Iconography"
        subtitle="Precision icons that serve as clear, non-ambiguous visual anchors for the GateFlow interface."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Iconography' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {iconPrinciples.map((p, idx) => (
          <div
            key={p.title}
            className="flex flex-col gap-3 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)]"
          >
            <div className="text-[var(--ds-accent-bold)] font-black text-xs uppercase tracking-widest opacity-60">
              {idx + 1}. Principle
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

      {/* Sentinel Glow Lab */}
      <section className="flex flex-col gap-6 p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-[var(--ds-surface-subtle)] shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ds-accent-subtle)] to-transparent opacity-20 pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10">
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Sentinel Glow Lab
          </h3>
          <p className="text-sm text-[var(--ds-text-subtle)] max-w-lg leading-relaxed">
            Interactive lab for testing icon radiance. Notice how the glow tint
            scales with the{' '}
            <code className="text-[var(--ds-text-accent)]">
              --ds-primary-accent
            </code>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 relative z-10">
          {[ShieldCheck, Activity, Users, Settings, Bell, Calendar].map(
            (Icon, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--ds-background-default)] border border-[var(--ds-border-subtle)] hover:scale-105 transition-all group/icon"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[var(--ds-accent-bold)] blur-[12px] opacity-0 group-hover/icon:opacity-40 transition-opacity animate-pulse" />
                  <Icon
                    size={32}
                    strokeWidth={1.5}
                    className="relative z-10 text-[var(--ds-text-subtlest)] group-hover/icon:text-[var(--ds-text-accent)] transition-colors"
                  />
                </div>
                <span className="text-[10px] uppercase font-black tracking-tighter opacity-0 group-hover/icon:opacity-100 transition-opacity">
                  Active Glow
                </span>
              </div>
            )
          )}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)] leading-none">
              Standardized Library
            </h2>
            <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60">
              A curated selection of Lucide icons optimized for the GateFlow
              monorepo.
            </p>
          </div>
          <div className="relative group w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtlest)]"
            />
            <Input
              placeholder="Search icon set..."
              className="pl-9 bg-[var(--ds-background-default)] h-9 rounded-lg border-[var(--ds-border-bold)] text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {iconCategories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-4">
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--ds-text-accent)]">
                {cat.name}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {cat.icons.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] group hover:border-[var(--ds-accent-bold)] transition-all"
                  >
                    <item.icon
                      size={24}
                      strokeWidth={1.5}
                      className="text-[var(--ds-text-subtlest)] group-hover:text-[var(--ds-text-primary)] transition-colors"
                    />
                    <span className="text-[9px] font-bold text-[var(--ds-text-subtle)] uppercase mt-3 opacity-0 group-hover:opacity-100 transition-opacity text-center line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-background-neutral-subtle)] to-transparent relative group mt-12 shadow-md">
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Dynamic Stroke Scaling
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              Our icons are responsive. For smaller touch targets (Scanner-App),
              the stroke-weight automatically expands to 2px using CSS
              variables, ensuring high tactile visibility regardless of screen
              density.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
