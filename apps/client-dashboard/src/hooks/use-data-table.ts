'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { SortingState } from '@gate-access/ui';

export interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState[];
  globalFilter: string;
}

export interface UseDataTableOptions {
  defaultPageSize?: number;
  defaultSorting?: SortingState[];
}

/**
 * useDataTable — URL-driven state for AdvancedTable (server-side).
 *
 * URL params:
 *   ?page=2          — 1-indexed page number (default 1)
 *   ?limit=20        — rows per page (default 20)
 *   ?sort=name:asc,email:desc — comma-separated multi-sort
 *   ?q=text          — global search term
 *
 * Returns stable callbacks compatible with AdvancedTableProps.
 */
export function useDataTable(options: UseDataTableOptions = {}) {
  const { defaultPageSize = 20, defaultSorting = [] } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 0-indexed for AdvancedTable
  const pageIndex = Math.max(0, Number(searchParams.get('page') ?? '1') - 1);
  const pageSize = Number(searchParams.get('limit') ?? String(defaultPageSize));
  const globalFilter = searchParams.get('q') ?? '';

  // Parse "name:asc,email:desc" → SortingState[]
  const sortParam = searchParams.get('sort') ?? '';
  const sorting: SortingState[] = sortParam
    ? sortParam.split(',').flatMap((s) => {
        const parts = s.split(':');
        if (!parts[0]) return [];
        return [{ id: parts[0], desc: parts[1] === 'desc' }];
      })
    : defaultSorting;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const onPageChange = useCallback(
    (newPageIndex: number) => {
      updateParams({ page: String(newPageIndex + 1) });
    },
    [updateParams],
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      updateParams({ limit: String(size), page: '1' });
    },
    [updateParams],
  );

  const onSortingChange = useCallback(
    (newSorting: SortingState[]) => {
      const sortValue = newSorting
        .map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`)
        .join(',');
      updateParams({ sort: sortValue || null, page: '1' });
    },
    [updateParams],
  );

  const onGlobalFilterChange = useCallback(
    (filter: string) => {
      updateParams({ q: filter || null, page: '1' });
    },
    [updateParams],
  );

  return {
    /** Current table state derived from URL */
    state: {
      pageIndex,
      pageSize,
      sorting,
      globalFilter,
    } satisfies DataTableState,
    onPageChange,
    onPageSizeChange,
    onSortingChange,
    onGlobalFilterChange,
  };
}
