'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './table';
import { Skeleton } from './skeleton';
import { EmptyState } from './empty-state';
import { Checkbox } from './checkbox';

export interface Column<T> {
  key: string;
  label: string;
  isSortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DynamicTableProps<T> {
  columns: Column<T>[];
  items: T[];
  isLoading?: boolean;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  rowClassName?: (item: T) => string;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  isSelectable?: boolean;
}

export function DynamicTable<T extends { id: string | number }>({
  columns,
  items,
  isLoading,
  sortKey,
  sortOrder,
  onSort,
  onRowClick,
  emptyState,
  rowClassName,
  selectedIds = [],
  onSelectionChange,
  isSelectable = false,
}: DynamicTableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) onSort(key);
  };

  const allSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));
  const someSelected = items.some(item => selectedIds.includes(item.id)) && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter(id => !items.find(item => item.id === id)));
    } else {
      const newIds = Array.from(new Set([...selectedIds, ...items.map(item => item.id)]));
      onSelectionChange(newIds);
    }
  };

  const toggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-[var(--ds-border,#DFE1E6)]">
            {isSelectable && (
              <TableHead className="w-10 px-4">
                <Checkbox
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  'h-11 text-[var(--ds-text-subtle,#42526E)] font-bold text-xs uppercase tracking-wider px-4',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {column.isSortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className={cn(
                      "flex items-center gap-1.5 hover:text-[var(--ds-text,#172B4D)] transition-colors group p-1 -m-1 rounded",
                      sortKey === column.key && "text-[var(--ds-text-selected,#0747A6)]"
                    )}
                  >
                    {column.label}
                    <div className="flex flex-col">
                      {sortKey === column.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5 text-[var(--ds-icon-selected,#0052CC)]" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-[var(--ds-icon-selected,#0052CC)]" />
                        )
                      ) : (
                        <ChevronUp className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30 transition-opacity" />
                      )}
                    </div>
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-[var(--ds-border-subtle,#EBECF0)]">
                {isSelectable && (
                  <TableCell className="px-4">
                    <Skeleton className="h-4 w-4 rounded-sm opacity-50" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full opacity-50" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (isSelectable ? 1 : 0)} className="h-48 text-center">
                {emptyState || <EmptyState icon={Search} title="No results found" description="Try adjusting your filters" />}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'group border-b border-[var(--ds-border-subtle,#EBECF0)] hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] transition-colors cursor-pointer',
                  selectedIds.includes(item.id) && 'bg-[var(--ds-background-selected,#DEEBFF)] hover:bg-[var(--ds-background-selected-hovered,#B3D4FF)]',
                  rowClassName?.(item)
                )}
              >
                {isSelectable && (
                  <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleRow(item.id)}
                      aria-label={`Select row ${item.id}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'text-sm text-[var(--ds-text,#172B4D)] py-4',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
