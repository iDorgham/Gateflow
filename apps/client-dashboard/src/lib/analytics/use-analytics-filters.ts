'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  type AnalyticsFilters,
  type AnalyticsMode,
  parseFiltersFromSearchParams,
  buildSearchParams,
  mergeFilters,
} from './analytics-filters';

export function useAnalyticsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const parsed = parseFiltersFromSearchParams(searchParams);
    return mergeFilters(parsed);
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<AnalyticsFilters>) => {
      const next = { ...filters, ...updates };
      const sp = buildSearchParams(next);
      const query = sp.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router]
  );

  const setMode = useCallback(
    (mode: AnalyticsMode) => {
      updateFilters({ mode });
    },
    [updateFilters]
  );

  return { filters, updateFilters, setMode };
}
