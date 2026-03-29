'use client';

import * as React from 'react';
import { AdvancedTable, Badge, cn, type AdvancedColumn } from '@gate-access/ui';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

/* ─────────────── Types ─────────────── */

export interface MaintenanceHubRow {
  id: string;
  gateName: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason: string;
  vendorName?: string;
  createdAt: Date;
  lastFailureAt?: Date;
}

/* ─────────────── Table Component ─────────────── */

interface MaintenanceHubTableProps {
  data: MaintenanceHubRow[];
  isLoading?: boolean;
}

export function MaintenanceHubTable({
  data,
  isLoading,
}: MaintenanceHubTableProps) {
  const columns: AdvancedColumn<MaintenanceHubRow>[] = React.useMemo(
    () => [
      {
        key: 'gateName',
        label: 'Resource / Gate',
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--ds-text)]">
              {row.gateName}
            </span>
            <span className="text-[10px] text-[var(--ds-text-subtle)] uppercase tracking-tight">
              ID: {row.id.slice(-8)}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => {
          const status = row.status;
          return (
            <Badge
              variant={
                status === 'RESOLVED'
                  ? 'success'
                  : status === 'ASSIGNED'
                    ? 'default'
                    : status === 'IN_PROGRESS'
                      ? 'warning'
                      : 'outline'
              }
              className="px-1.5 py-0 text-[10px] h-5 font-bold uppercase"
            >
              {status}
            </Badge>
          );
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        render: (row) => {
          const priority = row.priority;
          const isUrgent = priority === 'URGENT' || priority === 'HIGH';
          return (
            <div
              className={cn(
                'flex items-center gap-1 text-[11px] font-medium',
                isUrgent ? 'text-destructive' : 'text-[var(--ds-text-subtle)]'
              )}
            >
              {isUrgent && <AlertTriangle size={12} />}
              {priority}
            </div>
          );
        },
      },
      {
        key: 'reason',
        label: 'Reason / Insight',
        render: (row) => (
          <div
            className="max-w-[200px] truncate text-[11px] text-[var(--ds-text-subtle)]"
            title={row.reason}
          >
            {row.reason}
          </div>
        ),
      },
      {
        key: 'vendorName',
        label: 'Agent / Vendor',
        render: (row) => (
          <div className="flex items-center gap-2">
            {row.vendorName ? (
              <>
                <div className="w-5 h-5 rounded-full bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center text-[10px] font-bold">
                  {row.vendorName[0]}
                </div>
                <span className="text-[11px] font-medium">
                  {row.vendorName}
                </span>
              </>
            ) : (
              <span className="text-[10px] italic text-[var(--ds-text-subtle)]">
                Unassigned
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: 'Detected',
        render: (row) => (
          <div className="text-[11px] text-[var(--ds-text-subtle)]">
            {format(row.createdAt, 'MMM d, HH:mm')}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdvancedTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pageIndex={0}
      pageSize={data.length || 10}
      pageCount={1}
      onPageChange={() => {}}
      density="compact"
      showToolbar={false}
      emptyState={
        <div className="py-10 text-center text-[var(--ds-text-subtle)] text-xs">
          No autonomous operations detected in the current scope.
        </div>
      }
    />
  );
}
