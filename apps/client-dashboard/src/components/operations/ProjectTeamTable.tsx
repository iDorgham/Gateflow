'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdvancedTable, Button, Badge, Skeleton } from '@gate-access/ui';
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
import { token } from '@atlaskit/tokens';
import { GateAssignmentForm } from './GateAssignmentForm';

interface ProjectTeamTableProps {
  projectId: string;
  locale: string;
  canManage: boolean;
}

export function ProjectTeamTable({
  projectId,
  locale,
  canManage,
}: ProjectTeamTableProps) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const {
    state,
    onPageChange,
    onPageSizeChange,
    onSortingChange,
    onGlobalFilterChange,
  } = useDataTable({
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
    mutationFn: async (values: any) => {
      const res = await fetch(`/api/projects/${projectId}/team`, {
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

  const handleEdit = (assignment: any) => {
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
      label: 'Team Member',
      render: (a: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center text-xs font-bold text-[var(--ds-text-subtle)]">
            {a.user.avatarUrl ? (
              <img
                src={a.user.avatarUrl}
                alt=""
                className="h-full w-full rounded-full"
              />
            ) : (
              a.user.name?.[0] || 'U'
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--ds-text)]">
              {a.user.name || 'Anonymous'}
            </span>
            <span className="text-[10px] text-[var(--ds-text-subtle)]">
              {a.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'gate',
      label: 'Assigned Gate',
      render: (a: any) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'font-bold border-none',
              'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)]'
            )}
          >
            {a.gate.name}
          </Badge>
        </div>
      ),
    },
    {
      key: 'shift',
      label: 'Shift / Schedule',
      render: (a: any) => (
        <div className="flex flex-col gap-1">
          {a.shiftStart || a.shiftEnd ? (
            <div className="flex items-center gap-1.5 text-xs text-[var(--ds-text-subtle)] font-medium">
              <Clock className="h-3 w-3" />
              {a.shiftStart || '00:00'} — {a.shiftEnd || '23:59'}
            </div>
          ) : (
            <span
              className={cn(
                'text-[10px] uppercase font-bold tracking-tight',
                'text-[var(--ds-text-subtle,#6B778C)]'
              )}
            >
              Full-time access
            </span>
          )}
          {a.endTime && (
            <span
              className={cn(
                'text-[9px] font-bold',
                'text-[var(--ds-text-danger,#BF2600)]'
              )}
            >
              Expires: {new Date(a.endTime).toLocaleDateString(locale)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a: any) => {
        const now = new Date();
        const isExpired = a.endTime && new Date(a.endTime) < now;
        const isStarted = !a.startTime || new Date(a.startTime) <= now;
        const isActive = isStarted && !isExpired;

        return (
          <Badge
            className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              isActive
                ? 'bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)]'
                : 'bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)]'
            )}
          >
            {isActive ? (
              <>
                <ShieldCheck className="h-3 w-3 me-1 inline" /> Active
              </>
            ) : (
              <>
                <ShieldAlert className="h-3 w-3 me-1 inline" />{' '}
                {isExpired ? 'Expired' : 'Pending'}
              </>
            )}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button
            onClick={handleAdd}
            className={cn(
              'h-10 rounded-xl font-bold gap-2',
              'bg-[var(--ds-background-danger-bold,#ED4B00)] hover:bg-[var(--ds-background-danger-bold-hover,#ED4B00)] text-[var(--ds-text-inverse,#FFFFFF)]'
            )}
          >
            <UserPlus className="h-4 w-4" />
            Assign Member
          </Button>
        </div>
      )}

      <AdvancedTable
        columns={columns as any}
        data={assignments}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        pageCount={1}
        onPageChange={onPageChange}
        isLoading={isLoading}
        onRowClick={canManage ? handleEdit : undefined}
        rowActions={
          canManage
            ? (a) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleEdit(a)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )
            : null
        }
      />

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
