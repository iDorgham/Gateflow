'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Badge, Button, DynamicTable, Column, cn } from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
import {
  Plus,
  FolderOpen,
  Building2,
  DoorOpen,
  QrCode,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';
import { AddProjectSheet } from '@/components/projects/AddProjectSheet';
import { ProjectDetailSheet } from '@/components/projects/ProjectDetailSheet';

interface Project {
  id: string;
  name: string;
  deletedAt: string | null;
  createdAt: string;
  organization: { id: string; name: string; plan: string | null } | null;
  _count: { gates: number; qrCodes: number };
}

interface ProjectsClientProps {
  organizations: { id: string; name: string }[];
  projects: Project[];
  locale: string;
  filters: React.ReactNode;
  translations: {
    title: string;
    subtitle: string;
    addLabel: string;
    totalActive: string;
    emptyTitle: string;
    emptySubtitle: string;
    totalInfrastructure: string;
    columns: {
      project: string;
      org: string;
      metrics: string;
      created: string;
    };
  };
}

export function ProjectsClient({
  organizations,
  projects,
  locale,
  filters,
  translations,
}: ProjectsClientProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const columns = useMemo<Column<Project>[]>(
    () => [
      {
        key: 'project',
        label: translations.columns.project,
        render: (proj) => (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm shrink-0 transition-colors',
                proj.deletedAt
                  ? 'bg-ds-background-neutral text-ds-text-subtle'
                  : 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
              )}
            >
              <FolderOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ds-text truncate leading-tight group-hover:text-ds-text-brand transition-colors">
                {proj.name}
              </span>
              <span className="text-[10px] font-mono text-ds-text-subtlest mt-1 uppercase">
                {proj.id.slice(0, 10)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'organization',
        label: translations.columns.org,
        render: (proj) =>
          proj.organization ? (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-ds-text truncate leading-tight uppercase tracking-tight">
                {proj.organization.name}
              </span>
              <Badge
                variant={
                  proj.organization.plan === 'PRO' ? 'primary' : 'subtle'
                }
                className="w-fit text-[9px] h-4 px-1.5 border-ds-border-selected/20"
              >
                {proj.organization.plan}
              </Badge>
            </div>
          ) : null,
      },
      {
        key: 'metrics',
        label: translations.columns.metrics,
        align: 'center',
        render: (proj) => (
          <div className="flex items-center justify-center gap-6">
            <div
              className="flex flex-col items-center group/metric"
              title="Gates"
            >
              <DoorOpen className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
              <span className="text-[11px] font-bold text-ds-text tabular-nums">
                {proj._count.gates.toLocaleString(locale)}
              </span>
            </div>
            <div
              className="flex flex-col items-center group/metric"
              title="QR Codes"
            >
              <QrCode className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
              <span className="text-[11px] font-bold text-ds-text tabular-nums">
                {proj._count.qrCodes.toLocaleString(locale)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'created',
        label: translations.columns.created,
        render: (proj) => (
          <div className="flex items-center gap-1.5 text-xs font-medium text-ds-text-subtle tabular-nums">
            <Calendar className="h-3 w-3" />
            {new Date(proj.createdAt).toLocaleDateString(locale)}
          </div>
        ),
      },
      {
        key: 'actions',
        label: '',
        align: 'right',
        render: (proj) => (
          <Button
            variant="subtle"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProjectId(proj.id);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [locale, setSelectedProjectId, translations]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        titleClassName="italic uppercase"
        title={translations.title}
        subtitle={translations.subtitle}
        actions={
          <Button
            onClick={() => setIsAddSheetOpen(true)}
            size="sm"
            className="bg-ds-background-brand-bold hover:bg-ds-background-brand-bold/90 text-ds-text-inverse font-black uppercase tracking-widest h-10 px-6 rounded-full shadow-lg shadow-ds-background-brand-bold/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
          >
            <Plus className="h-4 w-4" /> {translations.addLabel}
          </Button>
        }
        badge={
          <Badge
            variant="outline"
            className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800 font-bold text-xs"
          >
            {translations.totalActive}
          </Badge>
        }
      />

      {filters}

      <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-sm overflow-hidden">
        <DynamicTable
          columns={columns}
          items={projects}
          onRowClick={(proj) => setSelectedProjectId(proj.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                <FolderOpen className="h-10 w-10 text-ds-text-subtlest" />
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
          {translations.totalInfrastructure}: {projects.length}
        </p>
      </div>

      <AddProjectSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        organizations={organizations}
      />

      <ProjectDetailSheet
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </div>
  );
}
