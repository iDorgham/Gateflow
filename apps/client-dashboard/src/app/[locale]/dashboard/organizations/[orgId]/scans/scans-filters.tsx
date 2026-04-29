'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, DoorOpen, Search, Download, X, User as UserIcon } from 'lucide-react';
import { FilterBar } from '@/components/dashboard/filter-bar';
import { Button, cn, DatePicker } from '@gate-access/ui';

export interface Gate {
  id: string;
  name: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
}

const STATUSES = [
  'SUCCESS',
  'FAILED',
  'EXPIRED',
  'MAX_USES_REACHED',
  'INACTIVE',
  'DENIED',
] as const;

const STATUS_CHIP: Record<string, string> = {
  SUCCESS: 'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)] border-[var(--ds-border-success)]/20',
  FAILED: 'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)] border-[var(--ds-border-danger)]/20',
  EXPIRED: 'bg-[var(--ds-background-warning-subtle)] text-[var(--ds-text-warning)] border-[var(--ds-border-warning)]/20',
  MAX_USES_REACHED: 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text)] border-[var(--ds-border)]',
  INACTIVE: 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] border-[var(--ds-border)]',
  DENIED: 'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)] border-[var(--ds-border-danger)]/20',
};

interface Props {
  gates: Gate[];
  operators: Operator[];
  projects: Project[];
  /** 'all' or a project id — reflects the currently active project filter. */
  currentProjectId: string;
  totalCount: number;
  filteredCount: number;
  exportHref: string;
}

export function ScansFilters({
  gates,
  operators,
  projects,
  currentProjectId,
  totalCount: _totalCount,
  filteredCount,
  exportHref,
}: Props) {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state just for controlled inputs (source of truth is the URL)
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [deviceId, setDeviceId] = useState(searchParams.get('deviceId') ?? '');
  const debounceQ = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceDevice = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: build URL by merging current params with overrides
  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // reset to first page on any filter change
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    const s = params.toString();
    router.push(`/dashboard/scans${s ? '?' + s : ''}`);
  }

  // Immediate update for select/date inputs
  function immediate(key: string, value: string) {
    navigate({ [key]: value });
  }

  // Debounced update for text inputs
  function debounced(
    ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    key: string,
    value: string
  ) {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => navigate({ [key]: value }), 400);
  }

  // Active filters derived from URL
  // Note: 'project' chip only shows when a specific project is explicitly chosen
  // ('all' = no filter applied, so no chip).
  const sp = searchParams;
  const urlProject = sp.get('project');
  const activeFilters: { label: string; key: string }[] = [
    sp.get('q') ? { label: t('scans.filters.labels.q', { value: sp.get('q'), defaultValue: `QR: "${sp.get('q')}"` }), key: 'q' } : null,
    sp.get('status')
      ? { label: t('scans.filters.labels.status', { value: t(`scans.status.${sp.get('status')}`, { defaultValue: sp.get('status') }), defaultValue: `Status: ${sp.get('status')}` }), key: 'status' }
      : null,
    urlProject && urlProject !== 'all'
      ? {
          label: t('scans.filters.labels.project', { value: projects.find((p) => p.id === urlProject)?.name ?? urlProject, defaultValue: `Project: ${urlProject}` }),
          key: 'project',
        }
      : null,
    sp.get('gate')
      ? { label: t('scans.filters.labels.gate', { value: gates.find((g) => g.id === sp.get('gate'))?.name ?? sp.get('gate'), defaultValue: `Gate: ${sp.get('gate')}` }), key: 'gate' }
      : null,
    sp.get('userId')
      ? {
          label: t('scans.filters.labels.operator', { value: operators.find((u) => u.id === sp.get('userId'))?.name ?? 'User', defaultValue: `Operator: ${sp.get('userId')}` }),
          key: 'userId',
        }
      : null,
    sp.get('deviceId') ? { label: t('scans.filters.labels.device', { value: sp.get('deviceId'), defaultValue: `Device: ${sp.get('deviceId')}` }), key: 'deviceId' } : null,
    sp.get('dateFrom') ? { label: t('scans.filters.labels.dateFrom', { value: sp.get('dateFrom'), defaultValue: `From: ${sp.get('dateFrom')}` }), key: 'dateFrom' } : null,
    sp.get('dateTo') ? { label: t('scans.filters.labels.dateTo', { value: sp.get('dateTo'), defaultValue: `To: ${sp.get('dateTo')}` }), key: 'dateTo' } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  function clearFilter(key: string) {
    if (key === 'q') setQ('');
    if (key === 'deviceId') setDeviceId('');
    // For project, navigate to 'all' rather than deleting the param entirely
    // so that the URL explicitly overrides any cookie-based project selection.
    if (key === 'project') {
      navigate({ project: 'all' });
      return;
    }
    navigate({ [key]: '' });
  }

  function clearAll() {
    setQ('');
    setDeviceId('');
    const params = new URLSearchParams();
    if (searchParams.get('project')) params.set('project', searchParams.get('project')!);
    const s = params.toString();
    router.push(`/dashboard/scans${s ? '?' + s : ''}`);
  }

  const currentStatus = sp.get('status') ?? '';
  const currentGate = sp.get('gate') ?? '';
  const currentUserId = sp.get('userId') ?? '';
  const currentDateFrom = sp.get('dateFrom') ?? '';
  const currentDateTo = sp.get('dateTo') ?? '';

  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search & Main Selects */}
      <FilterBar className="bg-[var(--ds-background-default)] p-3 rounded-xl border border-[var(--ds-border)] shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtle)] pointer-events-none" />
          <FilterBar.Search
            placeholder={t('scans.filters.searchPlaceholder', { defaultValue: 'Search QR code…' })}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              debounced(debounceQ, 'q', e.target.value);
            }}
            className="w-full pl-9 bg-[var(--ds-background-neutral-subtle)] border-[var(--ds-border)] focus:bg-[var(--ds-background-default)] h-10 transition-all rounded-lg text-sm"
            containerClassName="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <FilterBar.Select
            value={currentStatus}
            onChange={(e) => immediate('status', e.target.value)}
            className="h-10 bg-[var(--ds-background-default)] border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold rounded-lg hover:border-primary transition-colors"
            icon={<Layers className="h-4 w-4" />}
          >
            <option value="">{t('scans.filters.allStatuses', { defaultValue: 'All Statuses' })}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`scans.status.${s}`, { defaultValue: s.replace(/_/g, ' ') })}
              </option>
            ))}
          </FilterBar.Select>

          {hasProjects && (
            <FilterBar.Select
              value={currentProjectId}
              onChange={(e) => immediate('project', e.target.value)}
              className="h-10 bg-[var(--ds-background-default)] border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold rounded-lg hover:border-primary transition-colors"
              aria-label={t('scans.filters.allProjects', { defaultValue: 'All projects' })}
            >
              <option value="all">{t('scans.filters.allProjects', { defaultValue: 'All Projects' })}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FilterBar.Select>
          )}

          <FilterBar.Select
            value={currentGate}
            onChange={(e) => immediate('gate', e.target.value)}
            className="h-10 bg-[var(--ds-background-default)] border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold rounded-lg hover:border-primary transition-colors"
            icon={<DoorOpen className="h-4 w-4" />}
          >
            <option value="">{t('scans.filters.allGates', { defaultValue: 'All Gates' })}</option>
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </FilterBar.Select>

          <FilterBar.Select
            value={currentUserId}
            onChange={(e) => immediate('userId', e.target.value)}
            className="h-10 bg-[var(--ds-background-default)] border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold rounded-lg hover:border-primary transition-colors"
            icon={<UserIcon className="h-4 w-4" />}
          >
            <option value="">{t('scans.filters.allOperators', { defaultValue: 'All Operators' })}</option>
            {operators.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </FilterBar.Select>
        </div>
      </FilterBar>

      {/* Date Range & Device */}
      <div className="flex flex-wrap items-end gap-6 bg-[var(--ds-background-neutral-subtle)] p-5 rounded-xl border border-[var(--ds-border)]">
        <div className="flex items-end gap-3">
          <DatePicker
            label={t('scans.filters.dateFrom', { defaultValue: 'From Date' })}
            value={currentDateFrom}
            onChange={(e) => immediate('dateFrom', e.target.value)}
            onClear={() => clearFilter('dateFrom')}
            className="w-[180px]"
          />
          <div className="pb-3 text-[var(--ds-border)] font-black">—</div>
          <DatePicker
            label={t('scans.filters.dateTo', { defaultValue: 'To Date' })}
            value={currentDateTo}
            onChange={(e) => immediate('dateTo', e.target.value)}
            onClear={() => clearFilter('dateTo')}
            className="w-[180px]"
          />
        </div>

        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-[11px] font-black text-[var(--ds-text-subtle)] uppercase tracking-widest block ml-1">
            {t('scans.filters.deviceIdPlaceholder', { defaultValue: 'Hardware Device' })}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
               <div className="h-1.5 w-1.5 rounded-full bg-[var(--ds-text-success)] animate-pulse" />
            </div>
            <input
              type="text"
              placeholder={t('scans.filters.deviceIdPlaceholder', { defaultValue: 'Filter by Device ID…' })}
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                debounced(debounceDevice, 'deviceId', e.target.value);
              }}
              className="h-10 w-full pl-7 bg-[var(--ds-background-default)] border-[var(--ds-border)] rounded-lg text-sm font-mono font-bold text-[var(--ds-text)] placeholder-[var(--ds-text-subtle)] shadow-sm focus:ring-2 focus:ring-[var(--ds-border-focused)] transition-all"
            />
          </div>
        </div>

        <div className="ml-auto">
          <Button
            onClick={() => window.open(exportHref, '_blank')}
            className="bg-[var(--ds-background-default)] border border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold h-10 px-5 rounded-lg shadow-sm hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-all active:scale-95 group"
          >
            <Download className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            {t('scans.filters.exportCsv', { defaultValue: 'Export CSV' })}
          </Button>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.length > 0 ? (
            <>
              <span className="text-[11px] font-black text-[var(--ds-text-subtlest)] uppercase tracking-widest mr-2">Active Filters:</span>
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm transition-all animate-in zoom-in-95 duration-200",
                    f.key === 'status' && currentStatus
                      ? (STATUS_CHIP[currentStatus] ?? 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] border-[var(--ds-border)]')
                      : f.key === 'project'
                      ? 'bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)] border-[var(--ds-border-brand)]/30'
                      : 'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text)] border-[var(--ds-border)]'
                  )}
                >
                  {f.label}
                  <button
                    onClick={() => clearFilter(f.key)}
                    className="ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-[11px] font-black text-primary hover:bg-primary/10 h-6 px-3 rounded-full"
              >
                {t('scans.filters.clearAll', { defaultValue: 'CLEAR ALL' })}
              </Button>
            </>
          ) : (
             <div className="flex items-center gap-2 text-[var(--ds-text-subtlest)] opacity-50">
               <div className="h-1 w-1 rounded-full bg-[var(--ds-text-subtlest)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('scans.filters.noFilters', { defaultValue: 'Live Audit Trail' })}</span>
             </div>
          )}
        </div>

        <p className="text-[11px] font-black text-[var(--ds-text-subtle)] uppercase tracking-widest">
           {filteredCount.toLocaleString()} {t('scans.filters.showingResultsSimple', { defaultValue: 'Entries Found' })}
        </p>
      </div>
    </div>
  );
}
