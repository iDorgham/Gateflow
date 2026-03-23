'use client';

import * as React from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  AlignJustify,
  AlignCenter,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Pagination } from '../ui/pagination';
import { Checkbox } from '../ui/checkbox';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface AdvancedColumn<T> {
  key: string;
  label: string;
  isSortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export type DensityMode = 'compact' | 'comfortable';

export interface AdvancedTableProps<T extends { id: string | number }> {
  columns: AdvancedColumn<T>[];
  data: T[];
  /** 0-indexed current page */
  pageIndex: number;
  pageSize: number;
  /** Total number of pages (for Pagination component, 1-indexed) */
  pageCount: number;
  /** Active multi-column sort state */
  sorting?: SortingState[];
  /** Current global search term */
  globalFilter?: string;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Called when user clicks a sortable column header */
  onSortingChange?: (sorting: SortingState[]) => void;
  /** Called when the search input changes */
  onGlobalFilterChange?: (filter: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  /** Controlled row selection */
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  /** Bulk action toolbar rendered above table when rows are selected */
  bulkActions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  /** Per-row action buttons rendered in last column (pass null to hide) */
  rowActions?: ((item: T) => React.ReactNode) | null;
  searchPlaceholder?: string;
  /** Allow hiding the toolbar (search + density toggle) */
  showToolbar?: boolean;
  className?: string;
}

/* ─── Sort helpers ───────────────────────────────────────────────────────── */

function getSortDirection(sorting: SortingState[], id: string): 'asc' | 'desc' | null {
  const found = sorting.find((s) => s.id === id);
  if (!found) return null;
  return found.desc ? 'desc' : 'asc';
}

/**
 * Toggle multi-sort logic (mirrors TanStack Table v8 default behavior):
 * none → asc → desc → remove
 */
function toggleSortColumn(sorting: SortingState[], id: string): SortingState[] {
  const existing = sorting.find((s) => s.id === id);
  if (!existing) {
    return [...sorting, { id, desc: false }];
  }
  if (!existing.desc) {
    return sorting.map((s) => (s.id === id ? { ...s, desc: true } : s));
  }
  return sorting.filter((s) => s.id !== id);
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (direction === 'asc') {
    return <ChevronUp className="h-3.5 w-3.5 text-[var(--ds-text-selected)]" />;
  }
  if (direction === 'desc') {
    return <ChevronDown className="h-3.5 w-3.5 text-[var(--ds-text-selected)]" />;
  }
  return (
    <ChevronsUpDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
  );
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/* ─── AdvancedTable ──────────────────────────────────────────────────────── */

/**
 * AdvancedTable — server-side data table with:
 * - URL-driven pagination & multi-column sorting (state lives in `use-data-table`)
 * - Global search
 * - Compact / Comfortable density toggle
 * - Row selection with bulk-action toolbar
 * - Loading skeleton
 * - LTR/RTL aware via logical CSS properties
 */
export function AdvancedTable<T extends { id: string | number }>({
  columns,
  data,
  pageIndex,
  pageSize,
  pageCount,
  sorting = [],
  globalFilter = '',
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  onGlobalFilterChange,
  isLoading = false,
  emptyState,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
  onRowClick,
  rowActions,
  searchPlaceholder = 'Search…',
  showToolbar = true,
  className,
}: AdvancedTableProps<T>) {
  const [density, setDensity] = React.useState<DensityMode>('comfortable');
  const [localFilter, setLocalFilter] = React.useState(globalFilter);

  // Sync local filter with external globalFilter prop
  React.useEffect(() => {
    setLocalFilter(globalFilter);
  }, [globalFilter]);

  const isCompact = density === 'compact';
  const hasSelection = selectedIds.length > 0;
  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id));

  const hasRowActions = rowActions !== null && rowActions !== undefined;
  const effectiveColumns = hasRowActions
    ? [...columns, { key: '__actions__', label: '' }]
    : columns;

  /* ── selection helpers ── */
  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !data.find((r) => r.id === id)));
    } else {
      onSelectionChange(Array.from(new Set([...selectedIds, ...data.map((r) => r.id)])));
    }
  };

  const toggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id],
    );
  };

  /* ── search submit ── */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onGlobalFilterChange?.(localFilter);
    }
  };

  const handleClearSearch = () => {
    setLocalFilter('');
    onGlobalFilterChange?.('');
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* ── Toolbar ── */}
      {showToolbar && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Global search */}
          {onGlobalFilterChange && (
            <div className="relative flex-1 min-w-[200px] max-w-[360px]">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-icon-subtle)] pointer-events-none" />
              <input
                type="search"
                value={localFilter}
                onChange={(e) => setLocalFilter(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={() => onGlobalFilterChange(localFilter)}
                placeholder={searchPlaceholder}
                className={cn(
                  'w-full rounded-md border border-[var(--ds-border-input)] bg-[var(--ds-background-input)]',
                  'ps-9 pe-9 py-2 text-sm text-[var(--ds-text)] placeholder:text-[var(--ds-text-subtlest)]',
                  'outline-none focus:ring-2 focus:ring-[var(--ds-border-focused)] transition-shadow',
                )}
              />
              {localFilter && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--ds-icon-subtle)] hover:text-[var(--ds-icon)]"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2 ms-auto">
            {/* Density toggle */}
            <div className="flex rounded-md border border-[var(--ds-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                title="Comfortable view"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                  density === 'comfortable'
                    ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                    : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)]',
                )}
              >
                <AlignJustify className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Comfortable</span>
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                title="Compact view"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-s border-[var(--ds-border)]',
                  density === 'compact'
                    ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                    : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)]',
                )}
              >
                <AlignCenter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Compact</span>
              </button>
            </div>

            {/* Page size */}
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className={cn(
                  'rounded-md border border-[var(--ds-border)] bg-[var(--ds-background-input)]',
                  'px-2 py-1.5 text-xs text-[var(--ds-text)] outline-none',
                  'focus:ring-2 focus:ring-[var(--ds-border-focused)]',
                )}
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} / page
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* ── Bulk action toolbar ── */}
      {hasSelection && bulkActions && (
        <div className="flex items-center gap-3 rounded-md border border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] px-4 py-2 text-sm">
          <span className="text-[var(--ds-text-subtle)] font-medium">
            {selectedIds.length} selected
          </span>
          <div className="ms-auto flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="w-full overflow-x-auto rounded-md border border-[var(--ds-border)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-[var(--ds-border)] bg-[var(--ds-background-subtle)]">
              {onSelectionChange && (
                <TableHead className={cn('w-10', isCompact ? 'px-3' : 'px-4')}>
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {effectiveColumns.map((col) => {
                if (col.key === '__actions__') {
                  return <TableHead key="__actions__" className="w-10" />;
                }
                const sortDir = getSortDirection(sorting, col.key);
                return (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      'text-[var(--ds-text-subtle)] font-bold text-xs uppercase tracking-wider select-none',
                      isCompact ? 'h-8 px-3' : 'h-11 px-4',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                    )}
                  >
                    {col.isSortable && onSortingChange ? (
                      <button
                        type="button"
                        onClick={() => onSortingChange(toggleSortColumn(sorting, col.key))}
                        className={cn(
                          'group flex items-center gap-1 rounded px-1.5 py-1 -mx-1.5',
                          'hover:bg-[var(--ds-background-neutral-subtle)] transition-colors',
                          sortDir && 'text-[var(--ds-text-selected)]',
                        )}
                      >
                        {col.label}
                        <SortIcon direction={sortDir} />
                      </button>
                    ) : (
                      <span>{col.label}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize > 10 ? 8 : pageSize }).map((_, i) => (
                <TableRow key={i} className="border-b border-[var(--ds-border-subtle)]">
                  {onSelectionChange && (
                    <TableCell className={isCompact ? 'px-3' : 'px-4'}>
                      <Skeleton className="h-4 w-4 rounded-sm" />
                    </TableCell>
                  )}
                  {effectiveColumns.map((col) => (
                    <TableCell key={col.key} className={isCompact ? 'py-1.5 px-3' : 'py-4 px-4'}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={effectiveColumns.length + (onSelectionChange ? 1 : 0)}
                  className="h-48 text-center text-sm text-[var(--ds-text-subtle)]"
                >
                  {emptyState ?? 'No results found. Try adjusting your search or filters.'}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'group border-b border-[var(--ds-border-subtle)] transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-[var(--ds-background-neutral-subtle)]',
                    selectedIds.includes(row.id) && 'bg-[var(--ds-background-selected)]',
                  )}
                >
                  {onSelectionChange && (
                    <TableCell
                      className={isCompact ? 'px-3' : 'px-4'}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'text-sm text-[var(--ds-text)]',
                        isCompact ? 'py-1.5 px-3' : 'py-3.5 px-4',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </TableCell>
                  ))}
                  {hasRowActions && (
                    <TableCell
                      className={cn('text-right', isCompact ? 'py-1 px-3' : 'py-2 px-4')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions!(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-xs text-[var(--ds-text-subtle)]">
            Page {pageIndex + 1} of {pageCount}
          </p>
          <Pagination
            currentPage={pageIndex + 1}
            totalPages={pageCount}
            onPageChange={(p) => onPageChange(p - 1)}
          />
        </div>
      )}
    </div>
  );
}
