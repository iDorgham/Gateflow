'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, Button, Input, Select } from '@gate-access/ui';
import { useProjectFilter } from '@/context/ProjectFilterContext';
import type { ResidentsFilters } from '@/lib/residents/residents-filters';

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

export interface TagOption {
  id: string;
  name: string;
  color?: string | null;
}

interface ResidentsFilterBarProps {
  filters: ResidentsFilters;
  onFiltersChange: (updates: Partial<ResidentsFilters>) => void;
  gates?: Gate[];
  tags?: TagOption[];
  className?: string;
}

export function ResidentsFilterBar({
  filters,
  onFiltersChange,
  gates: initialGates = [],
  tags = [],
  className,
}: ResidentsFilterBarProps) {
  const { t } = useTranslation('dashboard');
  const { projects, currentProjectId } = useProjectFilter();
  const [customFrom, setCustomFrom] = useState(filters.from);
  const [customTo, setCustomTo] = useState(filters.to);
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        onFiltersChange({ search: value, page: 1 });
        searchDebounceRef.current = null;
      }, 400);
    },
    [onFiltersChange]
  );

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

  const handleRangePreset = (preset: '7d' | '30d') => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const to = now.toISOString().split('T')[0];
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - (preset === '7d' ? 6 : 29));
    fromDate.setHours(0, 0, 0, 0);
    const from = fromDate.toISOString().split('T')[0];
    onFiltersChange({ from, to, page: 1 });
    setCustomFrom(from);
    setCustomTo(to);
  };

  const handleCustomDateApply = () => {
    if (customFrom && customTo) {
      onFiltersChange({ from: customFrom, to: customTo, page: 1 });
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
  const is7d = (() => {
    const from = new Date(filters.from + 'T00:00:00');
    const to = new Date(filters.to + 'T23:59:59');
    const days = Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
    return days <= 7;
  })();
  const is30d = (() => {
    const from = new Date(filters.from + 'T00:00:00');
    const to = new Date(filters.to + 'T23:59:59');
    const days = Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
    return days > 7 && days <= 31;
  })();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {t('analytics.filterDateRange', 'Date range')}
        </span>
        <Button
          variant={is7d ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleRangePreset('7d')}
        >
          {t('analytics.range7d', 'Last 7 days')}
        </Button>
        <Button
          variant={is30d ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleRangePreset('30d')}
        >
          {t('analytics.range30d', 'Last 30 days')}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={customFrom}
          onChange={(e) => setCustomFrom(e.target.value)}
          className="w-[140px]"
          aria-label={t('analytics.fromDate', 'From date')}
        />
        <Input
          type="date"
          value={customTo}
          onChange={(e) => setCustomTo(e.target.value)}
          className="w-[140px]"
          aria-label={t('analytics.toDate', 'To date')}
        />
        <Button size="sm" onClick={handleCustomDateApply}>
          {t('analytics.apply', 'Apply')}
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 sr-only">
            {t('analytics.filterProject', 'Project')}
          </label>
          <Select
            value={projectValue}
            onChange={(e) => onFiltersChange({ projectId: e.target.value, page: 1 })}
            className="w-[180px]"
          >
            <option value="">{t('analytics.filterAllProjects', 'All projects')}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {gates.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 sr-only">
            {t('analytics.filterGate', 'Gate')}
          </label>
          <Select
            value={filters.gateId}
            onChange={(e) => onFiltersChange({ gateId: e.target.value, page: 1 })}
            className="w-[160px]"
          >
            <option value="">{t('analytics.filterAllGates', 'All gates')}</option>
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 sr-only">
          {t('analytics.filterUnitType', 'Unit type')}
        </label>
        <Select
          value={filters.unitType}
          onChange={(e) => onFiltersChange({ unitType: e.target.value, page: 1 })}
          className="w-[160px]"
        >
          <option value="">{t('analytics.filterAllUnitTypes', 'All unit types')}</option>
          {UNIT_TYPES.map((u) => (
            <option key={u} value={u}>
              {unitTypeLabels[u] ?? u}
            </option>
          ))}
        </Select>
      </div>

      <Input
        type="search"
        placeholder={t('contacts.searchPlaceholder', 'Search contacts…')}
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-[180px]"
        aria-label={t('analytics.filterSearch', 'Search')}
      />

      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 sr-only">
            {t('residents.filterByTag', 'Filter by tag')}
          </label>
          <Select
            value={filters.tagIds || ''}
            onChange={(e) => {
              const val = e.target.value;
              onFiltersChange({ tagIds: val, page: 1 });
            }}
            className="w-[160px]"
          >
            <option value="">{t('residents.allTags', 'All tags')}</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
