'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  Database,
  Search,
  Layout,
  Layers,
  Info,
  Filter,
  Code2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@gateflow/ui';

const EntityManagementLab = dynamic(() => import('./EntityManagementLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[650px] w-full bg-[var(--ds-surface-subtle)] animate-pulse rounded-[2.5rem] border border-[var(--ds-border-bold)]" />
  ),
});

const entityPrinciples = [
  {
    title: 'Anatomy of Agency',
    description:
      'Standardized stacking order: PageHeader -> StatGrid -> FilterBar -> EntityList. This ensures predictable user mental models.',
    icon: Layout,
  },
  {
    title: 'Gutter Consistency',
    description:
      'A 32px vertical gap (--ds-space-gap-xl) separates major blocks, while internal table gutters are pinned at 16px.',
    icon: Layers,
  },
  {
    title: 'Contextual Slicing',
    description:
      'Every entity list must be preceded by a FilterBar to enable rapid data slicing and localized search actions.',
    icon: Filter,
  },
];

export default function EntityPatternsPage() {
  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto py-12 px-6">
      <PageHeader
        title="Entity Compositions"
        subtitle="Standardized assembly patterns for managing high-scale entities like Residents, Visitors, and Gates. Built for speed and predictability."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Entity Compositions' },
        ]}
      />

      {/* Principles Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {entityPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-5 p-8 rounded-[2rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 w-fit rounded-xl bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-12">
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
            <Database className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Entity Management Hub
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70 max-w-2xl">
            This lab represents the blueprint for every management page in the
            Admin and CRM apps. Test the assembly logic below.
          </p>
        </div>

        <EntityManagementLab />
      </div>

      {/* Code Assembly Section */}
      <section className="flex flex-col gap-12 pt-10 border-t border-[var(--ds-border-bold)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Code2 className="text-[var(--ds-primary-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Assembly Pattern
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
            Copy this composition to scaffold a new management page in seconds.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[11px] leading-relaxed overflow-x-auto relative group">
          <Button
            variant="subtle"
            size="sm"
            className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-white/10 opacity-40 group-hover:opacity-100"
          >
            Copy Snippet
          </Button>
          <pre className="text-[var(--ds-text-primary)]">
            {`import { StatGrid, FilterBar } from '@gateflow/components';
import { Table, Card } from '@gateflow/ui';

export default function MemberPage() {
  return (
    <div className="flex flex-col gap-8">
      <StatGrid stats={memberStats} columns={4} />
      
      <div className="flex flex-col gap-4">
        <FilterBar 
          onSearchChange={handleSearch}
          actions={<Button>Add Member</Button>} 
        />
        
        <Card className="overflow-hidden">
          <Table data={members} />
        </Card>
      </div>
    </div>
  );
}`}
          </pre>
        </div>
      </section>

      {/* Rationale Footer */}
      <section className="p-10 rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-gradient-to-br from-[var(--ds-surface-subtle)] to-[var(--ds-surface-sunken)] relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 p-2 opacity-10 scale-[2.5] rotate-12 transition-all duration-700 group-hover:rotate-0">
          <Search size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-6 relative z-10">
          <div className="p-3 h-fit w-fit rounded-xl bg-[var(--ds-background-brand-bold)] text-white shadow-xl">
            <Info size={24} />
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Consistency at Scale
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-bold opacity-80">
              The Entity Composition model ensures that whether a user is
              managing 10 residents or 10,000 visitors, the
              <span className="text-[var(--ds-primary-accent)] mx-1">
                navigation of intent
              </span>{' '}
              remains identical. This reduction in cognitive load is what
              defines the GateFlow institutional grade UI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
