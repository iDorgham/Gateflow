'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowData,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@gate-access/ui';
import { format } from 'date-fns';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

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
  const columns = React.useMemo<ColumnDef<MaintenanceHubRow>[]>(
    () => [
      {
        accessorKey: 'gateName',
        header: 'Resource / Gate',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-ds-text">
              {row.original.gateName}
            </span>
            <span className="text-[10px] text-ds-text-subtle uppercase tracking-tight">
              ID: {row.original.id.slice(-8)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={
                status === 'RESOLVED'
                  ? 'success'
                  : status === 'ASSIGNED'
                    ? 'info'
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
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => {
          const priority = row.original.priority;
          const isUrgent = priority === 'URGENT' || priority === 'HIGH';
          return (
            <div
              className={cn(
                'flex items-center gap-1 text-[11px] font-medium',
                isUrgent ? 'text-destructive' : 'text-ds-text-subtle'
              )}
            >
              {isUrgent && <AlertTriangle size={12} />}
              {priority}
            </div>
          );
        },
      },
      {
        accessorKey: 'reason',
        header: 'Reason / Insight',
        cell: ({ row }) => (
          <div
            className="max-w-[200px] truncate text-[11px] text-ds-text-subtle"
            title={row.original.reason}
          >
            {row.original.reason}
          </div>
        ),
      },
      {
        accessorKey: 'vendorName',
        header: 'Agent / Vendor',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.vendorName ? (
              <>
                <div className="w-5 h-5 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center text-[10px] font-bold">
                  {row.original.vendorName[0]}
                </div>
                <span className="text-[11px] font-medium">
                  {row.original.vendorName}
                </span>
              </>
            ) : (
              <span className="text-[10px] italic text-ds-text-subtle">
                Unassigned
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Detected',
        cell: ({ row }) => (
          <div className="text-[11px] text-ds-text-subtle">
            {format(row.original.createdAt, 'MMM d, HH:mm')}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowData: getCoreRowData(),
  });

  return (
    <div className="rounded-md border border-ds-border bg-ds-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-ds-background-neutral-subtle border-b border-ds-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ds-text-subtle"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-ds-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td
                      key={j}
                      className="px-3 py-3 h-12 bg-ds-background-neutral-subtle/20"
                    />
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-ds-background-neutral-subtle/30 transition-colors group cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 whitespace-nowrap align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-ds-text-subtle text-xs"
                >
                  No autonomous operations detected in the current scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
