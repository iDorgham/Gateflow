'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdvancedTable, Button, Badge } from '@gateflow/ui';
import { useDataTable } from '@/hooks/use-data-table';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  Pencil,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { EditPanel } from '../dashboard/EditPanel';
import { cn } from '@/lib/utils';
import { GateAssignmentForm } from './GateAssignmentForm';
import { csrfFetch } from '@/lib/csrf';

interface ProjectTeamTableProps {
  projectId: string;
  locale: string;
  canManage: boolean;
}

interface TeamAssignment {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatarUrl?: string;
  };
  gate: {
    id: string;
    name: string;
  };
  shiftStart: string | null;
  shiftEnd: string | null;
  startTime: string | null;
  endTime: string | null;
}

export function ProjectTeamTable({
  projectId,
  locale,
  canManage,
}: ProjectTeamTableProps) {
  useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TeamAssignment | null>(null);

  const { state, onPageChange } = useDataTable({
    defaultPageSize: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['projects', projectId, 'team'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/team`);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (
      values: Partial<TeamAssignment>
    ): Promise<{ success: boolean; data: TeamAssignment }> => {
      const res = await csrfFetch(`/api/projects/${projectId}/team`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to save assignment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId, 'team'],
      });
      toast.success('Assignment updated successfully');
      setIsPanelOpen(false);
    },
  });

  const assignments = data?.data || [];

  const handleEdit = (assignment: TeamAssignment) => {
    setSelectedAssignment(assignment);
    setIsPanelOpen(true);
  };

  const handleAdd = () => {
    setSelectedAssignment(null);
    setIsPanelOpen(true);
  };

  const columns = [
    {
      key: 'user',
      label: 'Security Operator',
      render: (a: TeamAssignment) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center text-[10px] font-black text-ds-text-subtle shadow-sm shrink-0 border border-ds-border/10">
            {a.user.avatarUrl ? (
              <img
                src={a.user.avatarUrl}
                alt=""
                className="h-full w-full rounded-full"
              />
            ) : (
              a.user.name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xs text-ds-text-heading tracking-tight truncate">
              {a.user.name || 'Anonymous User'}
            </span>
            <span className="text-[9px] font-bold text-ds-text-subtle uppercase tracking-wider truncate opacity-70">
              {a.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'gate',
      label: 'Gate Zone',
      render: (a: TeamAssignment) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border-none',
              'bg-ds-background-selected/40 text-ds-text-selected'
            )}
          >
            {a.gate.name}
          </Badge>
        </div>
      ),
    },
    {
      key: 'shift',
      label: 'Operational Window',
      render: (a: TeamAssignment) => (
        <div className="flex flex-col gap-0.5">
          {a.shiftStart || a.shiftEnd ? (
            <div className="flex items-center gap-1 text-[10px] text-ds-text-heading font-black tabular-nums">
              <Clock className="h-3 w-3 text-ds-icon-subtle" />
              {a.shiftStart || '00:00'} — {a.shiftEnd || '23:59'}
            </div>
          ) : (
            <span
              className={cn(
                'text-[9px] uppercase font-black tracking-[0.1em]',
                'text-ds-text-subtle opacity-60'
              )}
            >
              Full-time access
            </span>
          )}
          {a.endTime && (
            <span
              className={cn(
                'text-[8px] font-black uppercase tracking-tighter',
                'text-ds-text-danger'
              )}
            >
              Exp: {new Date(a.endTime).toLocaleDateString(locale)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a: TeamAssignment) => {
        const now = new Date();
        const isExpired = a.endTime && new Date(a.endTime) < now;
        const isStarted = !a.startTime || new Date(a.startTime) <= now;
        const isActive = isStarted && !isExpired;

        return (
          <Badge
            className={cn(
              'text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border-none shadow-sm',
              isActive
                ? 'bg-ds-background-success-subtle text-ds-text-success shadow-ds-background-success-subtle/20'
                : 'bg-ds-background-danger-subtle text-ds-text-danger shadow-ds-background-danger-subtle/20'
            )}
          >
            {isActive ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5" /> SECURE
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-2.5 w-2.5" />{' '}
                {isExpired ? 'EXPIRED' : 'PENDING'}
              </span>
            )}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end pr-2">
          <Button
            onClick={handleAdd}
            className={cn(
              'h-9 px-5 rounded-lg font-black uppercase tracking-[0.1em] text-[10px] gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]',
              'bg-ds-background-brand-bold text-ds-text-inverse shadow-lg shadow-ds-background-brand-bold/20'
            )}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Assign Operator
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-ds-border overflow-hidden bg-ds-surface shadow-ds-shadow-raised relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-ds-background-selected/30 z-10" />
        <AdvancedTable
          columns={columns}
          data={assignments}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          pageCount={1}
          onPageChange={onPageChange}
          isLoading={isLoading}
          onRowClick={canManage ? handleEdit : undefined}
          rowActions={
            canManage
              ? (a: TeamAssignment) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-ds-surface-raised transition-colors"
                    onClick={() => handleEdit(a)}
                  >
                    <Pencil className="h-3 w-3 text-ds-icon-subtle" />
                  </Button>
                )
              : null
          }
        />
      </div>

      <EditPanel
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        title={
          selectedAssignment ? 'Edit Gate Assignment' : 'New Gate Assignment'
        }
        onSave={() => {
          document
            .getElementById('gate-assignment-form')
            ?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
        }}
        isSaving={saveMutation.isPending}
      >
        <GateAssignmentForm
          projectId={projectId}
          initialData={selectedAssignment}
          onSubmit={async (vals) => {
            saveMutation.mutate(vals);
          }}
        />
      </EditPanel>
    </div>
  );
}
