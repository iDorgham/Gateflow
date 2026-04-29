'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Card } from '@gateflow/ui';
import Link from 'next/link';
import {
  BarChart3,
  Bot,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  FormInput,
} from 'lucide-react';

const patternSections = [
  {
    href: '/patterns/analytics',
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Dashboard layouts, KPI cards, data-dense tables, and chart compositions for compound security reporting.',
    color: 'bg-blue-500',
  },
  {
    href: '/patterns/ai-ui',
    icon: Bot,
    title: 'AI UI',
    description:
      'Conversational interfaces, streaming responses, tool-call states, and hybrid text/chart reply patterns for GateAI.',
    color: 'bg-purple-500',
  },
  {
    href: '/patterns/auth-branding',
    icon: ShieldCheck,
    title: 'Auth & Branding',
    description:
      'Login screens, compound-branded portals, multi-tenant auth flows, and identity surfaces.',
    color: 'bg-emerald-500',
  },
  {
    href: '/patterns/calendar',
    icon: Calendar,
    title: 'Calendar',
    description:
      'Event scheduling, visitor booking, time-slot grids, and recurring-event patterns for gate access management.',
    color: 'bg-amber-500',
  },
  {
    href: '/patterns/complex-ui',
    icon: Layers,
    title: 'Complex UI',
    description:
      'Multi-step wizards, split-panel layouts, nested drawers, comboboxes, and advanced composition patterns.',
    color: 'bg-rose-500',
  },
  {
    href: '/patterns/entity-management',
    icon: Users,
    title: 'Entity Management',
    description:
      'Resident profiles, visitor records, staff management lists, and high-density compound project views.',
    color: 'bg-cyan-500',
  },
  {
    href: '/patterns/forms',
    icon: FormInput,
    title: 'Forms',
    description:
      'Validated form layouts, multi-step forms, inline edit patterns, and field-level error handling for data entry.',
    color: 'bg-orange-500',
  },
];

export default function PatternsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Patterns"
        subtitle="Reusable UI patterns and composition blueprints built on GateFlow foundations. Each pattern is designed for enterprise-grade compound security workflows."
        packageName="@gateflow/ui"
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Patterns' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patternSections.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card className="h-full p-8 rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] text-[var(--ds-text)] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col gap-6 cursor-pointer">
              <div
                className={`h-12 w-12 rounded-2xl ${section.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <section.icon size={22} />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                  {section.description}
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text-subtlest)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                View patterns →
              </span>
            </Card>
          </Link>
        ))}
      </section>

      <section className="p-10 rounded-3xl border border-dashed border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] flex flex-col gap-3 text-center items-center">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
          More patterns coming soon
        </h2>
        <p className="text-xs text-[var(--ds-text-subtle)] max-w-md leading-relaxed">
          Additional pattern libraries for notifications, onboarding flows,
          empty states, and error boundaries are planned for the next phase of
          the GateFlow Design System roadmap.
        </p>
      </section>
    </div>
  );
}
