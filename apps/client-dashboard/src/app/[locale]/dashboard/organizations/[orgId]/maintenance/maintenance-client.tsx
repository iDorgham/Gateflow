'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DynamicTable,
  Button,
  MaintenanceStatusBadge,
  AvatarTag,
  Badge,
  cn,
} from '@gateflow/ui';
import { MaintenanceStatus, MaintenancePriority } from '@gate-access/types';
import { format } from 'date-fns';
import { Plus, Filter, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import { BUILT_IN_ROLES, WorkOrderWithRelations } from '@gate-access/types';
import { MaintenanceSheet } from './maintenance-sheet';
import { MaintenanceCreateModal } from './maintenance-create-modal';

interface MaintenanceClientProps {
  initialData: WorkOrderWithRelations[];
  role: (typeof BUILT_IN_ROLES)[keyof typeof BUILT_IN_ROLES];
}

export function MaintenanceClient({
  initialData,
  role,
}: MaintenanceClientProps) {
  const { t } = useTranslation(['dashboard', 'common']);
  const isResident = role === BUILT_IN_ROLES.RESIDENT;
  const router = useRouter();
  const [data, setData] = React.useState<WorkOrderWithRelations[]>(
    initialData as WorkOrderWithRelations[]
  );
  const [selectedWorkOrder, setSelectedWorkOrder] =
    React.useState<WorkOrderWithRelations | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleUpdate = React.useCallback(
    (updated: WorkOrderWithRelations) => {
      setData((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      if (selectedWorkOrder?.id === updated.id) {
        setSelectedWorkOrder(updated);
      }
    },
    [selectedWorkOrder?.id]
  );

  const handleCreateSuccess = React.useCallback(
    (newWorkOrder: WorkOrderWithRelations) => {
      setData((prev) => [newWorkOrder, ...prev]);
    },
    []
  );

  const columns = React.useMemo(
    () => [
      {
        key: 'title',
        label: t('maintenance.table.issue', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--ds-text,#172B4D)]">
              {row.title}
            </span>
            <span className="text-xs text-[var(--ds-text-subtle,#42526E)]">
              {row.id.substring(0, 8).toUpperCase()} • {row.category}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: t('maintenance.table.status', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => (
          <MaintenanceStatusBadge status={row.status} />
        ),
      },
      {
        key: 'priority',
        label: t('maintenance.table.priority', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => (
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              row.priority === MaintenancePriority.URGENT && 'text-red-600',
              row.priority === MaintenancePriority.HIGH && 'text-orange-600',
              row.priority === MaintenancePriority.MEDIUM && 'text-blue-600',
              row.priority === MaintenancePriority.LOW && 'text-gray-600'
            )}
          >
            {row.priority}
          </span>
        ),
      },
      {
        key: 'asset',
        label: t('maintenance.table.asset', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => {
          const label =
            row.gate?.name ||
            row.unit?.name ||
            row.project?.name ||
            row.locationId ||
            'Global';
          const type = row.locationType;
          return (
            <div className="flex flex-col">
              <span className="text-sm">{label}</span>
              <span className="text-[10px] text-[var(--ds-text-subtle,#42526E)] uppercase font-medium">
                {type}
              </span>
            </div>
          );
        },
      },
      {
        key: 'assignee',
        label: t('maintenance.table.assignee', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => (
          <AvatarTag
            label={
              row.assignee?.name ||
              t('maintenance.dashboard.unassigned', {
                ns: 'dashboard',
                defaultValue: 'Unassigned',
              })
            }
            src={row.assignee?.avatarUrl}
          />
        ),
      },
      {
        key: 'updatedAt',
        label: t('maintenance.table.lastUpdated', { ns: 'dashboard' }),
        render: (row: WorkOrderWithRelations) => (
          <span className="text-sm text-[var(--ds-text-subtle,#42526E)]">
            {format(new Date(row.updatedAt), 'MMM dd, HH:mm')}
          </span>
        ),
      },
      {
        key: 'actions',
        label: '',
        render: (row: WorkOrderWithRelations) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/maintenance/${row.id}`)}
              >
                {t('maintenance.actions.view', { ns: 'dashboard' })}
              </DropdownMenuItem>
              {!isResident && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedWorkOrder(row);
                  }}
                >
                  {t('maintenance.actions.assign', { ns: 'dashboard' })}
                </DropdownMenuItem>
              )}
              {isResident && row.status === MaintenanceStatus.OPEN && (
                <DropdownMenuItem className="text-red-600">
                  {t('maintenance.actions.cancel', { ns: 'dashboard' })}
                </DropdownMenuItem>
              )}
              {!isResident && (
                <DropdownMenuItem className="text-red-600">
                  {t('maintenance.actions.cancel', { ns: 'dashboard' })}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t, isResident, router]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {t('common.filter', { ns: 'dashboard' })}
          </Button>
          <div className="flex gap-1">
            <Badge variant="secondary" className="cursor-pointer">
              {t('organizations.allStatus', {
                ns: 'admin',
                defaultValue: 'All',
              })}
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              {t('maintenance.dashboard.openOrders', { ns: 'dashboard' })}
            </Badge>
          </div>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          {isResident
            ? t('maintenance.actions.create', { ns: 'dashboard' })
            : t('maintenance.actions.create', { ns: 'dashboard' })}
        </Button>
      </div>

      <DynamicTable
        columns={columns}
        items={data}
        onRowClick={(item) =>
          setSelectedWorkOrder(item as WorkOrderWithRelations)
        }
        emptyState={
          <div className="flex flex-col items-center justify-center p-8">
            <span className="text-sm text-[var(--ds-text-subtle)]">
              {t('organizations.noResults', { ns: 'admin' })}
            </span>
          </div>
        }
      />

      <MaintenanceSheet
        workOrder={selectedWorkOrder}
        open={!!selectedWorkOrder}
        onOpenChange={(open) => !open && setSelectedWorkOrder(null)}
        onUpdate={handleUpdate}
        role={role}
      />

      <MaintenanceCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
        role={role}
      />
    </div>
  );
}
