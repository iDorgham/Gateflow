'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Checkbox,
  Skeleton,
  cn,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, GripVertical, RefreshCw, AlignJustify, List, LayoutList } from 'lucide-react';
import type { QRCodeRow } from '@/lib/qrcodes/use-qrcodes';
import { useUserPreferences, type TableDensity } from '@/lib/residents/use-user-preferences';

const STATUS_BADGE: Record<string, { variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  ACTIVE: { className: 'bg-success/10 text-success border-success/20' },
  INACTIVE: { className: 'bg-muted text-muted-foreground' },
  EXPIRED: { className: 'bg-warning/10 text-warning border-warning/20' },
  MAX_USES_REACHED: { className: 'bg-primary/10 text-primary border-primary/20' },
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  EXPIRED: 'Expired',
  MAX_USES_REACHED: 'Max Uses',
};

interface QRCodesTableProps {
  data: QRCodeRow[];
  isLoading: boolean;
  isFetching?: boolean;
  error: Error | null;
  onRefresh: () => void;
  locale: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (nextSortBy: string, nextSortOrder: 'asc' | 'desc') => void;
  selectedIds: string[];
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAllOnPage: (checked: boolean, idsOnPage: string[]) => void;
}

const DENSITY_CELL_CLASS: Record<TableDensity, string> = {
  compact: 'py-1',
  default: 'py-2',
  comfortable: 'py-3',
};

const DENSITY_OPTIONS: { value: TableDensity; label: string; icon: React.ReactNode }[] = [
  { value: 'compact', label: 'Compact', icon: <List className="h-3.5 w-3.5" /> },
  { value: 'default', label: 'Default', icon: <AlignJustify className="h-3.5 w-3.5" /> },
  { value: 'comfortable', label: 'Comfortable', icon: <LayoutList className="h-3.5 w-3.5" /> },
];

export function QRCodesTable({
  data,
  isLoading,
  isFetching = false,
  error,
  onRefresh,
  locale,
  sortBy,
  sortOrder,
  onSortChange,
  selectedIds,
  onToggleRow,
  onToggleAllOnPage,
}: QRCodesTableProps) {
  const { t } = useTranslation('dashboard');
  const { preferences, updatePreferences } = useUserPreferences();
  const [density, setDensity] = useState<TableDensity>('default');

  // Sync density from preferences once loaded
  useEffect(() => {
    const saved = preferences?.tableViews?.qrcodes?.density;
    if (saved) setDensity(saved);
  }, [preferences?.tableViews?.qrcodes?.density]);

  const handleDensityChange = useCallback(
    (next: TableDensity) => {
      setDensity(next);
      updatePreferences({ tableViews: { qrcodes: { density: next } } }).catch(() => {
        // non-fatal
      });
    },
    [updatePreferences]
  );

  const allSelectedOnPage =
    data.length > 0 && data.every((r) => selectedIds.includes(r.id));

  const baseColumns = useMemo<ColumnDef<QRCodeRow>[]>(() => {
    return [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={allSelectedOnPage}
            onChange={(e) =>
              onToggleAllOnPage(e.target.checked, data.map((d) => d.id))
            }
            aria-label={t('common.selectAll', 'Select all')}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            onChange={(e) => onToggleRow(row.original.id, e.target.checked)}
            aria-label={t('common.selectRow', 'Select row')}
          />
        ),
      },
      {
        id: 'code',
        header: () => t('qrcodes.code', 'Code'),
        cell: ({ row }) => {
          const code = row.original.code;
          // Truncate long signed payloads; short legacy codes display in full
          const display = code.length > 28
            ? `${code.slice(0, 14)}…${code.slice(-6)}`
            : code;
          return (
            <div className="space-y-0.5">
              <Link
                href={`/${locale}/dashboard/qrcodes?q=${encodeURIComponent(code)}`}
                className="font-mono text-xs font-bold text-primary hover:underline"
                title={code}
              >
                {display}
              </Link>
            </div>
          );
        },
      },
      {
        id: 'type',
        header: () => t('qrcodes.type', 'Type'),
        cell: ({ row }) => (
          <span className="text-sm">
            {t(`qrcodes.types.${row.original.type}`, row.original.type)}
          </span>
        ),
      },
      {
        id: 'status',
        header: () => t('qrcodes.table.status', 'Status'),
        cell: ({ row }) => {
          const status = row.original.status;
          const badge = STATUS_BADGE[status] ?? STATUS_BADGE.INACTIVE;
          return (
            <Badge variant="outline" className={badge.className ?? 'bg-muted'}>
              {STATUS_LABEL[status] ?? status}
            </Badge>
          );
        },
      },
      {
        id: 'createdAt',
        header: () => t('qrcodes.createdAt', 'Created'),
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(
            locale === 'ar-EG' ? 'ar-EG' : 'en-US',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }
          ),
      },
      {
        id: 'expiresAt',
        header: () => t('qrcodes.expiresAt', 'Expires'),
        cell: ({ row }) => {
          const exp = row.original.expiresAt;
          if (!exp) return '—';
          return new Date(exp).toLocaleDateString(
            locale === 'ar-EG' ? 'ar-EG' : 'en-US',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }
          );
        },
      },
      {
        id: 'scansCount',
        header: () => t('qrcodes.scansCount', 'Scans'),
        cell: ({ row }) => (
          <span className="tabular-nums font-medium">
            {row.original.scansCount}
          </span>
        ),
      },
      {
        id: 'lastScanAt',
        header: () => t('qrcodes.lastScanAt', 'Last scan'),
        cell: ({ row }) => {
          const last = row.original.lastScanAt;
          if (!last) return '—';
          return new Date(last).toLocaleString(
            locale === 'ar-EG' ? 'ar-EG' : 'en-US',
            {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          );
        },
      },
      {
        id: 'gateName',
        header: () => t('qrcodes.gate', 'Gate'),
        cell: ({ row }) => row.original.gateName ?? '—',
      },
      {
        id: 'projectName',
        header: () => t('qrcodes.project', 'Project'),
        cell: ({ row }) => row.original.projectName ?? '—',
      },
      {
        id: 'guestName',
        header: () => t('qrcodes.guestName', 'Name'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.guestName ?? '—'}</span>
        ),
      },
      {
        id: 'guestEmail',
        header: () => t('qrcodes.guestEmail', 'Email'),
        cell: ({ row }) => (
          <span className="text-sm font-mono text-xs">{row.original.guestEmail ?? '—'}</span>
        ),
      },
      {
        id: 'guestPhone',
        header: () => t('qrcodes.guestPhone', 'Phone'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.guestPhone ?? '—'}</span>
        ),
      },
    ];
  }, [
    allSelectedOnPage,
    data,
    locale,
    onToggleAllOnPage,
    onToggleRow,
    selectedIds,
    t,
  ]);

  const baseOrder = useMemo(
    () => baseColumns.map((col) => String(col.id)),
    [baseColumns]
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(baseOrder);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sortableIds = useMemo(
    () =>
      new Set([
        'createdAt',
        'expiresAt',
        'code',
        'type',
        'scansCount',
        'gateName',
        'projectName',
      ]),
    []
  );

  const reorderableIds = useMemo(
    () => new Set(baseOrder.filter((id) => id !== 'select')),
    [baseOrder]
  );

  const toggleSort = (columnId: string) => {
    if (!sortableIds.has(columnId)) return;
    if (sortBy === columnId) {
      onSortChange(columnId, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(columnId, 'desc');
    }
  };

  // Load saved column order: preferences API first, then localStorage fallback
  useEffect(() => {
    const prefsOrder = preferences?.tableViews?.qrcodes?.columnOrder;
    if (prefsOrder && prefsOrder.length > 0) {
      const valid = prefsOrder.filter((id) => baseOrder.includes(id));
      const normalized = valid.includes('select') ? valid : ['select', ...valid.filter((id) => id !== 'select')];
      if (normalized.length === baseOrder.length && normalized[0] === 'select') {
        setColumnOrder(normalized);
        return;
      }
    }
    // Fallback to localStorage
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('client-dashboard.qrcodes.columns');
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[] | null;
      if (!Array.isArray(parsed)) return;
      const valid = parsed.filter((id) => baseOrder.includes(id));
      const normalized = valid.includes('select') ? valid : ['select', ...valid.filter((id) => id !== 'select')];
      if (normalized.length === baseOrder.length && normalized[0] === 'select') {
        setColumnOrder(normalized);
      }
    } catch {
      // ignore parse errors
    }
  // Only run when preferences or baseOrder first load — not on every column change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences?.tableViews?.qrcodes?.columnOrder, baseOrder]);

  // Persist column order to preferences API + localStorage fallback
  useEffect(() => {
    if (!columnOrder || columnOrder.length === 0) return;
    const normalized = columnOrder[0] === 'select'
      ? columnOrder
      : ['select', ...columnOrder.filter((id) => id !== 'select')];
    // Write to preferences API (fire-and-forget)
    updatePreferences({ tableViews: { qrcodes: { columnOrder: normalized } } }).catch(() => {});
    // Keep localStorage as fallback for offline/non-auth scenarios
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('client-dashboard.qrcodes.columns', JSON.stringify(normalized));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnOrder]);

  const columns = useMemo(
    () =>
      columnOrder.map((id) => {
        const col = baseColumns.find((c) => c.id === id);
        return col ?? baseColumns.find((c) => c.id === 'code')!;
      }),
    [baseColumns, columnOrder]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: (updater) => {
      setColumnOrder((prev) =>
        typeof updater === 'function' ? updater(prev) : updater
      );
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const handleReorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    if (!reorderableIds.has(sourceId) || !reorderableIds.has(targetId)) return;
    setColumnOrder((prev) => {
      const current = prev.length === baseOrder.length ? prev : baseOrder;
      const from = current.indexOf(sourceId);
      const to = current.indexOf(targetId);
      if (from === -1 || to === -1) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">{error.message}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('common.retry', 'Retry')}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.id}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Density toolbar */}
      <div className="flex items-center justify-end gap-1" aria-label="Table density">
        {DENSITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleDensityChange(opt.value)}
            title={opt.label}
            aria-pressed={density === opt.value}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all',
              density === opt.value
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className={`rounded-xl border border-border overflow-x-auto overflow-hidden bg-card relative ${isFetching ? 'opacity-80 transition-opacity' : ''}`}>
        <Table className="min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const colId = String(header.column.id);
                  return (
                    <TableHead key={header.id} className="select-none">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden={colId === 'select'}
                          draggable
                          onDragStart={() => {
                            if (!reorderableIds.has(colId)) return;
                            setDraggingId(colId);
                          }}
                          onDragOver={(event) => {
                            event.preventDefault();
                          }}
                          onDrop={() => {
                            if (draggingId) {
                              handleReorder(draggingId, colId);
                              setDraggingId(null);
                            }
                          }}
                          className={
                            reorderableIds.has(colId)
                              ? 'inline-flex items-center cursor-grab active:cursor-grabbing'
                              : 'inline-flex items-center opacity-0 pointer-events-none'
                          }
                          aria-label={t('common.reorder', 'Reorder column')}
                          title={t('common.reorder', 'Reorder column')}
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground/60" />
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSort(colId)}
                          disabled={!sortableIds.has(colId)}
                          className="inline-flex items-center gap-1 text-left disabled:cursor-default"
                          aria-label={t('common.sort', 'Sort')}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sortableIds.has(colId) && (
                            <ArrowUpDown
                              className={
                                sortBy === colId
                                  ? 'h-3 w-3 text-foreground'
                                  : 'h-3 w-3 text-muted-foreground/60'
                              }
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {t('qrcodes.empty', 'No QR codes yet. Create your first one.')}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={DENSITY_CELL_CLASS[density]}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
