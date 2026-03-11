'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, Button, Input, NativeSelect } from '@gate-access/ui';
import { CalendarDays, ChevronDown, Search, DoorOpen, Layers, LayoutGrid } from 'lucide-react';
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
    <div className={cn('rounded-2xl border border-border bg-card', className)}>
      {/* Mobile toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 sm:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {t('analytics.filters', 'Filters')}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', mobileOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div className={cn('hidden flex-wrap items-center gap-2 px-4 py-3 sm:flex', mobileOpen && 'flex')}>

        {/* Date range presets */}
        <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRangePreset(r)}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all duration-200',
                filters.range === r
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              <CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />
              {r === '7d' ? '7d' : '30d'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onFiltersChange({ range: 'custom' })}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all duration-200',
              filters.range === 'custom'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            {t('analytics.rangeCustom', 'Custom')}
          </button>
        </div>

        {/* Custom range inputs */}
        {filters.range === 'custom' && (
          <>
            <Input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-9 w-[140px] rounded-xl text-xs"
              aria-label={t('analytics.fromDate', 'From date')}
            />
            <span className="text-muted-foreground text-xs">—</span>
            <Input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-9 w-[140px] rounded-xl text-xs"
              aria-label={t('analytics.toDate', 'To date')}
            />
            <Button size="sm" className="h-9 rounded-xl text-[11px] font-black uppercase tracking-widest" onClick={handleCustomDateApply}>
              {t('analytics.apply', 'Apply')}
            </Button>
          </>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-border/50 hidden sm:block" />

        {/* Project */}
        {projects.length > 0 && (
          <div className="relative flex items-center">
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" aria-hidden="true" />
            <NativeSelect
              id="analytics-project"
              value={projectValue}
              onChange={(e) => onFiltersChange({ projectId: e.target.value })}
              className="h-9 w-[160px] rounded-xl pl-8 text-xs"
            >
              <option value="">{t('analytics.filterAllProjects', 'All projects')}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Gate */}
        {gates.length > 0 && (
          <div className="relative flex items-center">
            <DoorOpen className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" aria-hidden="true" />
            <NativeSelect
              id="analytics-gate"
              value={filters.gateId}
              onChange={(e) => onFiltersChange({ gateId: e.target.value })}
              className="h-9 w-[150px] rounded-xl pl-8 text-xs"
            >
              <option value="">{t('analytics.filterAllGates', 'All gates')}</option>
              {gates.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Unit type */}
        <div className="relative flex items-center">
          <LayoutGrid className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" aria-hidden="true" />
          <NativeSelect
            id="analytics-unittype"
            value={filters.unitType}
            onChange={(e) => onFiltersChange({ unitType: e.target.value })}
            className="h-9 w-[150px] rounded-xl pl-8 text-xs"
          >
            <option value="">{t('analytics.filterAllUnitTypes', 'All unit types')}</option>
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>{unitTypeLabels[u] ?? u}</option>
            ))}
          </NativeSelect>
        </div>

        {/* Search */}
        <div className="relative flex items-center ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            placeholder={t('analytics.filterSearchPlaceholder', 'Search…')}
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 w-[160px] rounded-xl pl-8 text-xs"
            aria-label={t('analytics.filterSearch', 'Search')}
          />
        </div>
      </div>
    </div>
  );
}
