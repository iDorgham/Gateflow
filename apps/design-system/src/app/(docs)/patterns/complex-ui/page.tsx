'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  Table,
  Layout,
  Layers,
  Info,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Lock,
  UserCheck,
  ShieldPlus,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Button, Badge, ScrollArea } from '@gateflow/ui';
import { motion } from 'framer-motion';

const complexPrinciples = [
  {
    title: '16px Institutional Gutter',
    description:
      'High-density tables use a strict 16px gutter (--ds-space-gap-md) between columns to maximize information density without clutter.',
    icon: Layout,
  },
  {
    title: 'Glass-Sticky Headers',
    description:
      'Table and dashboard headers use --ds-surface-glass with backdrop-blur-xl, allowing content to bleed subtly through during scroll.',
    icon: Layers,
  },
  {
    title: 'Stacking Protocol',
    description:
      'Overlays, Drawers, and Popovers use incremental z-index tiers (L10 -> L50) with unique shadow bloom multipliers for depth.',
    icon: Filter,
  },
];

const residents = [
  {
    id: 'RS-42901',
    name: 'Khalid Al-Mansour',
    unit: 'Villa 12, Zone A',
    status: 'Active',
    access: 'Standard',
    last: '2h ago',
  },
  {
    id: 'RS-42902',
    name: 'Sarah Jenkins',
    unit: 'Apt 402, Block B',
    status: 'Pending',
    access: 'Premium',
    last: '15m ago',
  },
  {
    id: 'RS-42903',
    name: 'Mohammed Al-Said',
    unit: 'Villa 08, Zone A',
    status: 'Active',
    access: 'Admin',
    last: 'Just now',
  },
  {
    id: 'RS-42904',
    name: 'Fahad Al-Qasimi',
    unit: 'Apt 101, Block C',
    status: 'Suspended',
    access: 'Standard',
    last: '1d ago',
  },
  {
    id: 'RS-42905',
    name: 'Leyla Hassan',
    unit: 'Villa 45, Zone C',
    status: 'Active',
    access: 'Guest',
    last: '5m ago',
  },
];

export default function ComplexUIPatternsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Complex UI & Tables"
        subtitle="Patterns for information-rich environments where density, performance, and institutional clarity are paramount."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Complex UI' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {complexPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
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
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            High-Density Table Lab
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Interactive demonstration of 16px gutter spacing and glassmorphic
            headers.
          </p>
        </div>
        <TableLab />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <Table size={120} className="text-[var(--ds-primary-accent)]" />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Subtle-Satin Borders
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              Table rows in the GateFlow system use{' '}
              <strong>--ds-border-subtle</strong> for initial separation and{' '}
              <strong>--ds-border-bold</strong> for grouping. This ensures that
              even with hundreds of rows, the UI maintains its institutional
              legibility without visual fatigue.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TableLab() {
  return (
    <div className="w-full rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-2xl overflow-hidden flex flex-col h-[450px]">
      {/* Sticky Glass Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-[var(--ds-surface-glass)] backdrop-blur-xl border-b border-[var(--ds-border-bold)] relative z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-[var(--ds-primary-accent)]" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-primary)]">
              Resident Registry
            </h4>
          </div>
          <Badge
            variant="outline"
            className="bg-[var(--ds-background-selected)]/10 text-[var(--ds-text-selected)] border-[var(--ds-border-brand)]/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          >
            1,429 Total
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-[var(--ds-background-neutral-subtle)]"
          >
            <Filter size={14} className="text-[var(--ds-text-subtlest)]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-[var(--ds-background-neutral-subtle)]"
          >
            <ArrowUpDown size={14} className="text-[var(--ds-text-subtlest)]" />
          </Button>
          <Button className="h-8 bg-[var(--ds-background-brand-bold)] text-white text-[9px] font-black uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-[var(--ds-background-brand-bold)]/20 gap-2 group">
            <ShieldPlus size={14} /> New Registry
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[var(--ds-surface-subtle)]/50 backdrop-blur-md z-10 border-b border-[var(--ds-border-subtle)]">
            <tr>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
                Registry ID
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
                Full Name
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
                Unit / Location
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
                Access Status
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]">
                Activity
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ds-border-subtle)]">
            {residents.map((r, i) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-[var(--ds-background-selected)]/5 transition-colors group/row cursor-pointer"
              >
                <td className="px-6 py-3 text-[10px] font-mono font-bold text-[var(--ds-text-accent)]">
                  {r.id}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-[var(--ds-background-brand-bold)] flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-1 ring-[var(--ds-border-brand)]/20 ring-offset-2 ring-offset-[var(--ds-background-default)]">
                      {r.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span className="text-[11px] font-black tracking-tight text-[var(--ds-text-primary)]">
                      {r.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-[11px] font-semibold text-[var(--ds-text-subtle)]">
                  {r.unit}
                </td>
                <td className="px-6 py-3">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                      r.status === 'Active'
                        ? 'bg-[var(--gf-color-success)]/10 text-[var(--gf-color-success)] border-[var(--gf-color-success)]/30'
                        : r.status === 'Pending'
                          ? 'bg-[var(--gf-color-warning)]/10 text-[var(--gf-color-warning)] border-[var(--gf-color-warning)]/30'
                          : 'bg-[var(--gf-color-danger)]/10 text-[var(--gf-color-danger)] border-[var(--gf-color-danger)]/30'
                    )}
                  >
                    <div className="h-1 w-1 rounded-full bg-current" />
                    {r.status}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--ds-text-subtlest)]">
                      {r.last}
                    </span>
                    {r.access === 'Admin' && (
                      <Lock
                        size={10}
                        className="text-[var(--gf-color-warning)]"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal
                      size={14}
                      className="text-[var(--ds-text-subtlest)]"
                    />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      {/* Footer / Summary */}
      <div className="shrink-0 px-6 py-3 bg-[var(--ds-surface-subtle)] border-t border-[var(--ds-border-bold)] flex justify-between items-center relative z-20">
        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
          Showing 5 of 1,429 Residents
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[9px] font-black uppercase tracking-widest gap-2 bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]"
          >
            Export CSV <ChevronRight size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
