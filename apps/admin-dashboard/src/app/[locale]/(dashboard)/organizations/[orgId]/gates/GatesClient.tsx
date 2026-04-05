'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  PageHeader,
  Badge,
  Button,
  DynamicTable,
  Column,
  cn,
} from '@gateflow/ui';
import {
  Plus,
  DoorOpen,
  Building2,
  ScanLine,
  MapPin,
  Calendar,
  MoreHorizontal,
  FolderOpen,
} from 'lucide-react';
import { AddGateSheet } from '@/components/gates/AddGateSheet';
import { GateDetailSheet } from '@/components/gates/GateDetailSheet';

export interface Gate {
  id: string;
  name: string;
  deletedAt: string | null;
  createdAt: string;
  isActive: boolean;
  project: { id: string; name: string } | null;
  organization: { id: string; name: string } | null;
  _count: { scanLogs: number };
}

interface GatesClientProps {
  projects: { id: string; name: string }[];
  gates: Gate[];
  locale: string;
  filters: React.ReactNode;
  translations: {
    title: string;
    subtitle: string;
    addLabel: string;
    totalActive: string;
    emptyTitle: string;
    emptySubtitle: string;
    totalHardware: string;
    statusArchived: string;
    statusCommissioned: string;
    statusStandby: string;
    columns: {
      gate: string;
      parent: string;
      usage: string;
      status: string;
    };
  };
}

export function GatesClient({
  projects,
  gates,
  locale,
  filters,
  translations,
}: GatesClientProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);

  const columns = useMemo<Column<Gate>[]>(
    () => [
      {
        key: 'gate',
        label: translations.columns.gate,
        render: (gate) => (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm shrink-0 transition-colors',
                !gate.isActive || gate.deletedAt
                  ? 'bg-ds-background-neutral text-ds-text-subtle'
                  : 'bg-ds-background-success-bold text-ds-text-inverse'
              )}
            >
              <DoorOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ds-text truncate leading-tight group-hover:text-ds-text-brand transition-colors">
                {gate.name}
              </span>
              <span className="text-[10px] font-mono text-ds-text-subtlest mt-1 uppercase">
                {gate.id.slice(0, 10)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'parent',
        label: translations.columns.parent,
        render: (gate) => (
          <div className="flex flex-col gap-1">
            {gate.project && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-ds-text uppercase tracking-tight">
                <FolderOpen className="h-3 w-3 text-ds-text-subtlest" />
                {gate.project.name}
              </div>
            )}
            {gate.organization && (
              <div className="flex items-center gap-1.5 text-[10px] text-ds-text-subtle">
                <Building2 className="h-3 w-3" />
                {gate.organization.name}
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'usage',
        label: translations.columns.usage,
        align: 'center',
        render: (gate) => (
          <div
            className="flex flex-col items-center group/metric"
            title="Total Scans"
          >
            <ScanLine className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
            <span className="text-[11px] font-bold text-ds-text tabular-nums">
              {gate._count.scanLogs.toLocaleString(locale)}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: translations.columns.status,
        render: (gate) => (
          <Badge
            variant={gate.isActive && !gate.deletedAt ? 'success' : 'subtle'}
            className="h-6 px-2 font-bold uppercase text-[9px]"
          >
            {gate.deletedAt
              ? translations.statusArchived
              : gate.isActive
                ? translations.statusCommissioned
                : translations.statusStandby}
          </Badge>
        ),
      },
      {
        key: 'actions',
        label: '',
        align: 'right',
        render: (gate) => (
          <Button
            variant="subtle"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGateId(gate.id);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [locale, setSelectedGateId, translations]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        titleClassName="italic uppercase text-ds-text font-black"
        title={translations.title}
        subtitle={translations.subtitle}
        actions={
          <Button
            onClick={() => setIsAddSheetOpen(true)}
            size="sm"
            className="bg-ds-background-success-bold hover:bg-ds-background-success-bold/90 text-ds-text-inverse font-black uppercase tracking-widest h-10 px-6 rounded-full shadow-lg shadow-ds-background-success-bold/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
          >
            <Plus className="h-4 w-4" /> {translations.addLabel}
          </Button>
        }
        badge={
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 font-bold text-xs"
          >
            {translations.totalActive}
          </Badge>
        }
      />

      {filters}

      <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-sm overflow-hidden">
        <DynamicTable
          columns={columns}
          items={gates}
          onRowClick={(gate) => setSelectedGateId(gate.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                <DoorOpen className="h-10 w-10 text-ds-text-subtlest" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ds-text">
                  {translations.emptyTitle}
                </h3>
                <p className="text-sm text-ds-text-subtle">
                  {translations.emptySubtitle}
                </p>
              </div>
            </div>
          }
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-[11px] font-bold text-ds-text-subtle uppercase tracking-widest tabular-nums italic">
          {translations.totalHardware}: {gates.length}
        </p>
      </div>

      <AddGateSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        projects={projects}
      />

      <GateDetailSheet
        gateId={selectedGateId}
        onClose={() => setSelectedGateId(null)}
      />
    </div>
  );
}
