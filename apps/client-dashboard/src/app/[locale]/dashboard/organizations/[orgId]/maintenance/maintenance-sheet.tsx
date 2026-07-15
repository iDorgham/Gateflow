'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Button,
  MaintenanceStatusBadge,
  AvatarTag,
  Badge,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import {
  MaintenanceStatus,
  MaintenancePriority,
  BUILT_IN_ROLES,
  WorkOrderWithRelations,
} from '@gate-access/types';
import { format } from 'date-fns';
import { Calendar, MapPin, User, Wrench, Clock, History } from 'lucide-react';
import { maintenanceApi } from '@gate-access/api-client';
import { toast } from 'sonner';

interface MaintenanceSheetProps {
  workOrder: WorkOrderWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updated: WorkOrderWithRelations) => void;
  role: (typeof BUILT_IN_ROLES)[keyof typeof BUILT_IN_ROLES];
}

export const MaintenanceSheet = React.memo(
  ({
    workOrder,
    open,
    onOpenChange,
    onUpdate,
    role,
  }: MaintenanceSheetProps) => {
    const { t } = useTranslation(['dashboard', 'common', 'admin']);
    const isResident = role === BUILT_IN_ROLES.RESIDENT;
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleStatusChange = React.useCallback(
      async (newStatus: MaintenanceStatus) => {
        if (!workOrder) return;
        try {
          setIsUpdating(true);
          const response = await maintenanceApi.updateWorkOrder(workOrder.id, {
            status: newStatus,
          });
          if (response.success) {
            toast.success(t('common.success.settingsSaved', { ns: 'admin' }));
            onUpdate?.(response.data as WorkOrderWithRelations);
          } else {
            toast.error(
              response.message || t('common.errors.saveFailed', { ns: 'admin' })
            );
          }
        } catch (error) {
          toast.error(t('common.errors.saveFailed', { ns: 'admin' }));
        } finally {
          setIsUpdating(false);
        }
      },
      [workOrder, t, onUpdate]
    );

    const handlePriorityChange = React.useCallback(
      async (newPriority: MaintenancePriority) => {
        if (!workOrder) return;
        try {
          setIsUpdating(true);
          const response = await maintenanceApi.updateWorkOrder(workOrder.id, {
            priority: newPriority,
          });
          if (response.success) {
            toast.success(t('common.success.settingsSaved', { ns: 'admin' }));
            onUpdate?.(response.data as WorkOrderWithRelations);
          } else {
            toast.error(
              response.message || t('common.errors.saveFailed', { ns: 'admin' })
            );
          }
        } catch (error) {
          toast.error(t('common.errors.saveFailed', { ns: 'admin' }));
        } finally {
          setIsUpdating(false);
        }
      },
      [workOrder, t, onUpdate]
    );

    if (!workOrder) return null;

    const locationLabel =
      workOrder.gate?.name ||
      workOrder.unit?.name ||
      workOrder.project?.name ||
      workOrder.locationId ||
      t('common.global', { ns: 'common', defaultValue: 'Global' });

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="space-y-4 pb-6 border-b">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider"
              >
                {workOrder.id.substring(0, 8).toUpperCase()}
              </Badge>
              <MaintenanceStatusBadge status={workOrder.status} />
            </div>
            <SheetTitle className="text-xl font-bold leading-tight">
              {workOrder.title}
            </SheetTitle>
            <SheetDescription className="text-sm">
              {workOrder.description ||
                t('common.noDescription', { ns: 'dashboard' })}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-8">
            {/* Status & Priority Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                  {t('maintenance.table.status', { ns: 'dashboard' })}
                </label>
                <Select
                  value={workOrder.status}
                  onValueChange={(val) =>
                    handleStatusChange(val as MaintenanceStatus)
                  }
                  disabled={isUpdating || isResident}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MaintenanceStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`dashboard.overview.scanStatus.${status}`, {
                          ns: 'dashboard',
                          defaultValue: status.replace('_', ' '),
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                  {t('maintenance.table.priority', { ns: 'dashboard' })}
                </label>
                <Select
                  value={workOrder.priority}
                  onValueChange={(val) =>
                    handlePriorityChange(val as MaintenancePriority)
                  }
                  disabled={isUpdating || isResident}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MaintenancePriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[var(--ds-background-neutral-subtle)]">
                  <MapPin className="h-4 w-4 text-[var(--ds-icon-subtle)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                    {t('maintenance.table.asset', { ns: 'dashboard' })}
                  </span>
                  <span className="text-sm font-medium">
                    {locationLabel} ({workOrder.locationType})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[var(--ds-background-neutral-subtle)]">
                  <Wrench className="h-4 w-4 text-[var(--ds-icon-subtle)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                    {t('maintenance.table.issue', { ns: 'dashboard' })}
                  </span>
                  <span className="text-sm font-medium">
                    {workOrder.category}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[var(--ds-background-neutral-subtle)]">
                  <Calendar className="h-4 w-4 text-[var(--ds-icon-subtle)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                    {t('admin.projects.created', { ns: 'admin' })}
                  </span>
                  <span className="text-sm font-medium">
                    {format(new Date(workOrder.createdAt), 'PPP p')}
                  </span>
                </div>
              </div>

              {workOrder.dueDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-[var(--ds-background-danger-subtle)]">
                    <Clock className="h-4 w-4 text-[var(--ds-icon-danger)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase text-[var(--ds-text-danger)]">
                      Due Date
                    </span>
                    <span className="text-sm font-medium text-[var(--ds-text-danger)]">
                      {format(new Date(workOrder.dueDate), 'PPP')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* People Section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                  Reporter
                </span>
                <div className="flex items-center gap-3">
                  <AvatarTag
                    label={workOrder.reporter?.name || 'Unknown'}
                    src={workOrder.reporter?.avatarUrl}
                  />
                  <span className="text-xs text-[var(--ds-text-subtle)]">
                    {workOrder.reporter?.email}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase text-[var(--ds-text-subtle)]">
                  {t('maintenance.table.assignee', { ns: 'dashboard' })}
                </span>
                <div className="flex items-center gap-3">
                  {workOrder.assignee ? (
                    <AvatarTag
                      label={workOrder.assignee.name}
                      src={workOrder.assignee.avatarUrl}
                    />
                  ) : !isResident ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 py-1 text-xs border-dashed"
                    >
                      <User className="mr-2 h-3 w-3" />
                      {t('maintenance.actions.assign', { ns: 'dashboard' })}
                    </Button>
                  ) : (
                    <span className="text-sm italic text-[var(--ds-text-subtle)]">
                      {t('maintenance.dashboard.unassigned', {
                        ns: 'dashboard',
                        defaultValue: 'Not yet assigned',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 pt-6 border-t">
            <div className="w-full flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--ds-text-subtle)]"
              >
                <History className="mr-2 h-4 w-4" />
                {t('admin.auditLogs.title', { ns: 'admin' })}
              </Button>
              {!isResident && (
                <Button variant="destructive" size="sm">
                  {t('common.delete', { ns: 'dashboard' })}
                </Button>
              )}
              {isResident && workOrder.status === MaintenanceStatus.OPEN && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200"
                >
                  {t('maintenance.actions.cancel', { ns: 'dashboard' })}
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);

MaintenanceSheet.displayName = 'MaintenanceSheet';
