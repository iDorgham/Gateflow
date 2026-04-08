'use client';

import * as React from 'react';
import { StatGrid, FilterBar } from '@gateflow/components';
import {
  Users,
  UserCheck,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  PlusCircle,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { Button, ScrollArea, cn } from '@gateflow/ui';
import { motion } from 'framer-motion';

const MOCK_RESIDENTS = [
  {
    id: 'RS-42901',
    name: 'Khalid Al-Mansour',
    unit: 'Villa 12, Zone A',
    status: 'Active',
    last: '2h ago',
  },
  {
    id: 'RS-42902',
    name: 'Sarah Jenkins',
    unit: 'Apt 402, Block B',
    status: 'Pending',
    last: '15m ago',
  },
  {
    id: 'RS-42903',
    name: 'Mohammed Al-Said',
    unit: 'Villa 08, Zone A',
    status: 'Active',
    last: 'Just now',
  },
  {
    id: 'RS-42904',
    name: 'Fahad Al-Qasimi',
    unit: 'Apt 101, Block C',
    status: 'Suspended',
    last: '1d ago',
  },
  {
    id: 'RS-42905',
    name: 'Leyla Hassan',
    unit: 'Villa 45, Zone C',
    status: 'Active',
    last: '5m ago',
  },
];

export default function EntityManagementLab() {
  const [search, setSearch] = React.useState('');

  const stats = [
    {
      label: 'Total Members',
      value: '1,429',
      icon: Users,
      variant: 'primary' as const,
    },
    {
      label: 'Active Today',
      value: '842',
      trend: { value: '+12%', direction: 'up' as const },
      icon: UserCheck,
      variant: 'success' as const,
    },
    {
      label: 'Pending Verification',
      value: '14',
      icon: Clock,
      variant: 'warning' as const,
    },
    {
      label: 'Flags Detected',
      value: '3',
      trend: { value: '+1', direction: 'neutral' as const },
      icon: ShieldAlert,
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-1 rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-2xl overflow-hidden group">
      {/* Top Banner / Stat Grid */}
      <div className="p-8 pb-10 flex flex-col gap-8 bg-gradient-to-b from-[var(--ds-surface-sunken)] to-transparent">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Community Registry
          </h3>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Orchestrating high-density member management and verification
            protocols.
          </p>
        </div>
        <StatGrid stats={stats} columns={4} />
      </div>

      {/* Assembly Area */}
      <div className="px-8 pb-8 flex flex-col gap-6">
        {/* FilterBar Integration */}
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search Registry..."
          onClear={() => setSearch('')}
          filters={
            <div className="flex gap-2">
              {['Status', 'Zone', 'Type'].map((f) => (
                <Button
                  key={f}
                  variant="subtle"
                  size="sm"
                  className="h-8 text-[10px] font-black uppercase tracking-widest border border-[var(--ds-border-bold)] opacity-70 hover:opacity-100"
                >
                  {f} <ArrowUpDown size={10} className="ms-2 opacity-40" />
                </Button>
              ))}
            </div>
          }
          actions={
            <div className="flex gap-2">
              <Button
                variant="subtle"
                size="sm"
                className="h-8 border border-[var(--ds-border-bold)]"
              >
                <Download size={14} className="me-2" />{' '}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Export
                </span>
              </Button>
              <Button
                size="sm"
                className="h-8 bg-[var(--ds-background-brand-bold)] text-white shadow-xl shadow-[var(--ds-background-brand-bold)]/30 transition-shadow"
              >
                <PlusCircle size={14} className="me-2" />{' '}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Add Member
                </span>
              </Button>
            </div>
          }
          className="border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] rounded-2xl px-4 py-2 shadow-sm"
        />

        {/* High Density Table Assembly */}
        <div className="rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] overflow-hidden flex flex-col h-[320px]">
          <ScrollArea className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--ds-surface-subtle)]/80 backdrop-blur-xl z-20 border-b border-[var(--ds-border-bold)]">
                <tr>
                  {['ID', 'Name', 'Unit', 'Status', 'Activity', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ds-border-subtle)]">
                {MOCK_RESIDENTS.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-[var(--ds-background-selected)]/5 group/row transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-[10px] font-mono font-bold text-[var(--ds-primary-accent)]">
                      {r.id}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-[var(--ds-background-brand-bold)] flex items-center justify-center text-[10px] font-black text-white shadow-md">
                          {r.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-[11px] font-black text-[var(--ds-text-primary)]">
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[11px] font-bold text-[var(--ds-text-subtle)] opacity-70">
                      {r.unit}
                    </td>
                    <td className="px-5 py-3">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                          r.status === 'Active' &&
                            'bg-[var(--gf-color-success)]/10 text-[var(--gf-color-success)] border-[var(--gf-color-success)]/30',
                          r.status === 'Pending' &&
                            'bg-[var(--gf-color-warning)]/10 text-[var(--gf-color-warning)] border-[var(--gf-color-warning)]/30',
                          r.status === 'Suspended' &&
                            'bg-[var(--gf-color-danger)]/10 text-[var(--gf-color-danger)] border-[var(--gf-color-danger)]/30'
                        )}
                      >
                        {r.status}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-bold text-[var(--ds-text-subtlest)]">
                      {r.last}
                    </td>
                    <td className="px-5 py-3 text-inline-end">
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
        </div>
      </div>
    </div>
  );
}
