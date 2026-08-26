'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn, Button, Input, NativeSelect } from '@gateflow/ui';
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

import { Check, Columns, Search } from 'lucide-react';

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
  onCustomizerOpen?: () => void;
  totalCount?: number;
  selectedCount?: number;
  searchPlaceholder?: string;
}

export function ResidentsFilterBar({
  filters,
  onFiltersChange,
  gates: initialGates = [],
  tags = [],
  className,
  onCustomizerOpen,
  totalCount: _totalCount,
  selectedCount: _selectedCount,
  searchPlaceholder,
}: ResidentsFilterBarProps) {
  const { t } = useTranslation('dashboard');
  const { currentProjectId } = useProjectFilter();
  const [customFrom, setCustomFrom] = useState(filters.from);
  const [customTo, setCustomTo] = useState(filters.to);
  const [_gates, setGates] = useState<Gate[]>(initialGates);
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
          setGates(
            json.data.map((g: { id: string; name: string }) => ({
              id: g.id,
              name: g.name,
            }))
          );
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

  const _projectValue = filters.projectId || currentProjectId || '';
  const is7d = (() => {
    if (!filters.from || !filters.to) return false;
    const from = new Date(filters.from + 'T00:00:00');
    const to = new Date(filters.to + 'T23:59:59');
    const days = Math.round(
      (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)
    );
    return days <= 7;
  })();
  const is30d = (() => {
    if (!filters.from || !filters.to) return false;
    const from = new Date(filters.from + 'T00:00:00');
    const to = new Date(filters.to + 'T23:59:59');
    const days = Math.round(
      (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)
    );
    return days > 7 && days <= 31;
  })();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 bg-[var(--ds-background-default)] bg-background p-3 rounded-xl border border-[var(--ds-border)] shadow-none',
        className
      )}
    >
      <div className="flex items-center gap-3 pr-4 border-r border-[var(--ds-border)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest)] pointer-events-none" />
          <Input
            type="search"
            placeholder={
              searchPlaceholder ||
              t('contacts.searchPlaceholder', 'Search contacts…')
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-[240px] h-9 pl-9 bg-[var(--ds-background-input)] bg-secondary border-[var(--ds-border)] focus:bg-[var(--ds-background-default)] dark:focus:bg-[var(--background)] transition-all text-[13px] rounded-[var(--ds-border-radius-100)] font-semibold"
            aria-label={t('analytics.filterSearch', 'Search')}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-[var(--ds-text-subtle)] uppercase tracking-tight">
          {t('analytics.filterDateRange', 'Range')}
        </span>
        <div className="flex rounded-[var(--ds-border-radius-100)] border border-[var(--ds-border)] p-0.5 bg-[var(--ds-background-neutral)] bg-background/50 overflow-hidden shadow-none">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-3 text-[12px] font-bold rounded-[calc(var(--ds-border-radius-100)-1px)] transition-all',
              is7d
                ? 'bg-[var(--ds-background-default)] bg-secondary text-[var(--ds-text-selected)] shadow-none'
                : 'text-[var(--ds-text-subtle)] hover:bg-background/50'
            )}
            onClick={() => handleRangePreset('7d')}
          >
            7d
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-3 text-[12px] font-bold rounded-[calc(var(--ds-border-radius-100)-1px)] transition-all',
              is30d
                ? 'bg-[var(--ds-background-default)] bg-secondary text-[var(--ds-text-selected)] shadow-none'
                : 'text-[var(--ds-text-subtle)] hover:bg-background/50'
            )}
            onClick={() => handleRangePreset('30d')}
          >
            30d
          </Button>
        </div>
        <div className="flex items-center gap-1.5 ml-1 bg-[var(--ds-background-input)] bg-secondary px-2 py-1 rounded-[var(--ds-border-radius-100)] border border-[var(--ds-border)]">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="w-[105px] h-6 bg-transparent border-none text-[11px] font-bold text-[var(--ds-text)] focus:ring-0 p-0"
          />
          <span className="text-[var(--ds-text-subtlest)] text-[10px] font-black opacity-30">
            —
          </span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="w-[105px] h-6 bg-transparent border-none text-[11px] font-bold text-[var(--ds-text)] focus:ring-0 p-0"
          />
          <Button
            size="sm"
            onClick={handleCustomDateApply}
            className="h-6 w-6 p-0 bg-[var(--ds-background-default)] bg-secondary border border-[var(--ds-border)] text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--secondary)] rounded shadow-none transition-transform active:scale-95"
          >
            <Check className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2">
          <NativeSelect
            value={filters.unitType}
            onChange={(e) =>
              onFiltersChange({ unitType: e.target.value, page: 1 })
            }
            className="w-[130px] h-9 text-[12px] font-semibold bg-[var(--ds-background-default)] bg-background border-[var(--ds-border)] rounded-[var(--ds-border-radius-100)] cursor-pointer hover:border-[var(--primary)] transition-colors"
          >
            <option value="">
              {t('analytics.filterAllUnitTypes', 'All Types')}
            </option>
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {unitTypeLabels[u] ?? u}
              </option>
            ))}
          </NativeSelect>

          <NativeSelect
            value={filters.tagIds || ''}
            onChange={(e) =>
              onFiltersChange({ tagIds: e.target.value, page: 1 })
            }
            className="w-[130px] h-9 text-[12px] font-semibold bg-[var(--ds-background-default)] bg-background border-[var(--ds-border)] rounded-[var(--ds-border-radius-100)] cursor-pointer hover:border-[var(--primary)] transition-colors"
          >
            <option value="">{t('residents.allTags', 'All Tags')}</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </NativeSelect>
        </div>

        {onCustomizerOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCustomizerOpen}
            className="h-9 px-4 border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--secondary)] rounded-[var(--ds-border-radius-100)] shadow-none group"
          >
            <Columns className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            {t('residents.columns', 'Columns')}
          </Button>
        )}
      </div>
    </div>
  );
}
