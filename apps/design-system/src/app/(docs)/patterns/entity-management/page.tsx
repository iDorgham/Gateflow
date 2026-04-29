'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  LayoutDashboard,
  LayoutGrid,
  Filter,
  Code2,
  Info,
  ShieldCheck,
  Package,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for the lab
const ManagementLab = dynamic(() => import('./ManagementLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[750px] w-full bg-[var(--ds-surface-subtle)] animate-pulse rounded-[2.5rem] border border-[var(--ds-border-bold)] shadow-xl" />
  ),
});

const managementPrinciples = [
  {
    title: 'Data Density',
    description:
      'Utilize standard StatGrid metrics to provide immediate contextual depth before delving into list details.',
    icon: LayoutDashboard,
  },
  {
    title: 'Atomic Entities',
    description:
      'Every item must be encapsulated in an EntityCard, ensuring visual consistency across different data types.',
    icon: Package,
  },
  {
    title: 'Fluid Filtering',
    description:
      'Search and filter operations must remain reactive and easily accessible at the top of the interaction flow.',
    icon: Filter,
  },
];

export default function EntityManagementPage() {
  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto py-12 px-6">
      <PageHeader
        title="Entity & Composition"
        subtitle="Standardizing management interfaces across GateFlow. Patterns for lists, directories, and high-density project views."
        packageName="@gateflow/components"
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Entity Management' },
        ]}
      />

      {/* Principles Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {managementPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-5 p-8 rounded-[2rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 w-fit rounded-xl bg-[var(--ds-background-brand-bold)] text-white shadow-lg shadow-[var(--ds-background-brand-bold)]/20 transition-transform group-hover:rotate-12">
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

      {/* Interactive Hub */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Management Lab
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70 max-w-2xl">
            Test the GateFlow management pattern below. This demonstrates how
            `StatGrid`, `FilterBar`, and `EntityCard` compose a high-fidelity
            resident directory.
          </p>
        </div>

        <ManagementLab />
      </div>

      {/* Structural Composition */}
      <section className="flex flex-col gap-12 pt-10 border-t border-[var(--ds-border-bold)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Code2 className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Institutional Assembly
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70 max-w-3xl leading-relaxed">
            Standard management pages follow a recursive composition model.
            Metrics flow from the top down, followed by global actions and
            atomic entity lists.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* List Assembly */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ds-primary-accent)]">
                1. The Standard List Pattern
              </h4>
              <p className="text-xs font-bold text-[var(--ds-text-subtle)] opacity-60">
                Combine FilterBar and EntityCard for a consistent management
                experience.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[12px] leading-relaxed overflow-x-auto shadow-inner">
              <pre className="text-[var(--ds-text-primary)]">
                {`import { EntityCard, FilterBar, StatGrid } from '@gateflow/components';

export function ResidentList() {
  return (
    <div className="flex flex-col gap-6">
      <StatGrid stats={metrics} />
      <FilterBar onSearch={setSearch} actions={<AddButton />} />
      <div className="grid grid-cols-2 gap-4">
        {data.map(item => (
          <EntityCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}`}
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
              Clarity vs Density
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-bold opacity-80">
              When dealing with large datasets, prioritize the `FilterBar`
              operations. Never overwhelm the user with more than 12 entities
              per page without pagination or infinite scroll patterns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
