'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, Button, Input, NativeSelect } from '@gate-access/ui';
import { useProjectFilter } from '@/context/ProjectFilterContext';
import type { AnalyticsFilters, DateRangePreset } from '@/lib/analytics/analytics-filters';

const UNIT_TYPES = [
  'STUDIO',
  'ONE_BR',
  'TWO_BR',
  'THREE_BR',
  'FOUR_BR',
  'VILLA',
  'PENTHOUSE',
  'COMMERCIAL',
] as const;

interface Gate {
  id: string;
  name: string;
}

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters;
  onFiltersChange: (updates: Partial<AnalyticsFilters>) => void;
  /** Pre-loaded gates from server; if empty, will fetch from /api/gates */
  gates?: Gate[];
  className?: string;
}

export function AnalyticsFilterBar({
  filters,
  onFiltersChange,
  gates: initialGates = [],
  className,
}: AnalyticsFilterBarProps) {
  const { t } = useTranslation('dashboard');
  const { projects, currentProjectId } = useProjectFilter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(filters.from);
  const [customTo, setCustomTo] = useState(filters.to);
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync custom dates and search when filters change externally
  useEffect(() => {
    setCustomFrom(filters.from);
    setCustomTo(filters.to);
    setSearchInput(filters.search);
  }, [filters.from, filters.to, filters.search]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        onFiltersChange({ search: value });
        searchDebounceRef.current = null;
      }, 400);
    },
    [onFiltersChange]
  );

  // Fetch gates when not provided
  useEffect(() => {
    if (initialGates.length > 0) {
      setGates(initialGates);
      return;
    }
    async function loadGates() {
      try {
        const res = await fetch('/api/gates');
        const json = await res.json();
        if (json.success && json.data) {
          setGates(json.data.map((g: { id: string; name: string }) => ({ id: g.id, name: g.name })));
        }
      } catch {
        // leave gates empty
      }
    }
    loadGates();
  }, [initialGates]);

  const handleRangePreset = (range: DateRangePreset) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const to = now.toISOString().split('T')[0];
    const fromDate = new Date(now);
    if (range === '7d') {
      fromDate.setDate(fromDate.getDate() - 6);
    } else {
      fromDate.setDate(fromDate.getDate() - 29);
    }
    fromDate.setHours(0, 0, 0, 0);
    const from = fromDate.toISOString().split('T')[0];
    onFiltersChange({ range, from, to });
    setCustomFrom(from);
    setCustomTo(to);
  };

  const handleCustomDateApply = () => {
    if (customFrom && customTo) {
      onFiltersChange({ range: 'custom', from: customFrom, to: customTo });
    }
  };

  const unitTypeLabels: Record<string, string> = {
    STUDIO: t('units.types.STUDIO', 'Studio'),
    ONE_BR: t('units.types.ONE_BR', '1 Bedroom'),
    TWO_BR: t('units.types.TWO_BR', '2 Bedrooms'),
    THREE_BR: t('units.types.THREE_BR', '3 Bedrooms'),
    FOUR_BR: t('units.types.FOUR_BR', '4 Bedrooms'),
    VILLA: t('units.types.VILLA', 'Villa'),
    PENTHOUSE: t('units.types.PENTHOUSE', 'Penthouse'),
    COMMERCIAL: t('units.types.COMMERCIAL', 'Commercial'),
  };

  const projectValue = filters.projectId || currentProjectId || '';

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-3',
        className
      )}
    >
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-foreground">
          {t('analytics.filters', 'Filters')}
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="min-h-11 px-3"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
        >
          {mobileOpen
            ? t('analytics.hideFilters', 'Hide filters')
            : t('analytics.showFilters', 'Show filters')}
        </Button>
      </div>

      <div
        className={cn(
          'mt-3 hidden flex-wrap items-center gap-3 sm:mt-0 sm:flex',
          mobileOpen && 'flex'
        )}
      >
        {/* Date range presets */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <span className="text-sm font-medium text-foreground">
            {t('analytics.filterDateRange', 'Date range')}
          </span>
          <Button
            variant={filters.range === '7d' ? 'secondary' : 'ghost'}
            size="sm"
            className="min-h-11"
            onClick={() => handleRangePreset('7d')}
          >
            {t('analytics.range7d', 'Last 7 days')}
          </Button>
          <Button
            variant={filters.range === '30d' ? 'secondary' : 'ghost'}
            size="sm"
            className="min-h-11"
            onClick={() => handleRangePreset('30d')}
          >
            {t('analytics.range30d', 'Last 30 days')}
          </Button>
        </div>

        {/* Custom range */}
        {filters.range === 'custom' && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="min-h-11 w-full sm:w-[160px]"
              aria-label={t('analytics.fromDate', 'From date')}
            />
            <Input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="min-h-11 w-full sm:w-[160px]"
              aria-label={t('analytics.toDate', 'To date')}
            />
            <Button size="sm" className="min-h-11 w-full sm:w-auto" onClick={handleCustomDateApply}>
              {t('analytics.apply', 'Apply')}
            </Button>
          </div>
        )}

        {/* Project */}
        {projects.length > 0 && (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label htmlFor="analytics-project" className="sr-only text-sm font-medium text-foreground">
              {t('analytics.filterProject', 'Project')}
            </label>
            <NativeSelect
              id="analytics-project"
              value={projectValue}
              onChange={(e) => onFiltersChange({ projectId: e.target.value })}
              className="min-h-11 w-full sm:w-[180px]"
            >
              <option value="">{t('analytics.filterAllProjects', 'All projects')}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Gate */}
        {gates.length > 0 && (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label htmlFor="analytics-gate" className="sr-only text-sm font-medium text-foreground">
              {t('analytics.filterGate', 'Gate')}
            </label>
            <NativeSelect
              id="analytics-gate"
              value={filters.gateId}
              onChange={(e) => onFiltersChange({ gateId: e.target.value })}
              className="min-h-11 w-full sm:w-[160px]"
            >
              <option value="">{t('analytics.filterAllGates', 'All gates')}</option>
              {gates.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Unit type */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label htmlFor="analytics-unittype" className="sr-only text-sm font-medium text-foreground">
            {t('analytics.filterUnitType', 'Unit type')}
          </label>
          <NativeSelect
            id="analytics-unittype"
            value={filters.unitType}
            onChange={(e) => onFiltersChange({ unitType: e.target.value })}
            className="min-h-11 w-full sm:w-[160px]"
          >
            <option value="">{t('analytics.filterAllUnitTypes', 'All unit types')}</option>
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {unitTypeLabels[u] ?? u}
              </option>
            ))}
          </NativeSelect>
        </div>

        {/* Search */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Input
            type="search"
            placeholder={t('analytics.filterSearchPlaceholder', 'Search…')}
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="min-h-11 w-full sm:w-[180px]"
            aria-label={t('analytics.filterSearch', 'Search')}
          />
        </div>
      </div>
    </div>
  );
}
