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
  SUCCESS: 'bg-green-100 text-green-700 border-green-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-amber-100 text-amber-700 border-amber-200',
  MAX_USES_REACHED: 'bg-orange-100 text-orange-700 border-orange-200',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
  DENIED: 'bg-rose-100 text-rose-700 border-rose-200',
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
      <FilterBar className="bg-white dark:bg-[#1D2125] p-3 rounded-xl border border-[#DFE1E6] dark:border-[#343A46] shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B778C] pointer-events-none" />
          <FilterBar.Search
            placeholder={t('scans.filters.searchPlaceholder', { defaultValue: 'Search QR code…' })}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              debounced(debounceQ, 'q', e.target.value);
            }}
            className="w-full pl-9 bg-[#F4F5F7] dark:bg-[#2C333A] border-[#DFE1E6] dark:border-[#343A46] focus:bg-white dark:focus:bg-[#1D2125] h-10 transition-all rounded-lg text-sm"
            containerClassName="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <FilterBar.Select
            value={currentStatus}
            onChange={(e) => immediate('status', e.target.value)}
            className="h-10 bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#343A46] text-[#42526E] dark:text-[#A5ADBA] font-bold rounded-lg hover:border-[#0052CC] transition-colors"
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
              className="h-10 bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#343A46] text-[#42526E] dark:text-[#A5ADBA] font-bold rounded-lg hover:border-[#0052CC] transition-colors"
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
            className="h-10 bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#343A46] text-[#42526E] dark:text-[#A5ADBA] font-bold rounded-lg hover:border-[#0052CC] transition-colors"
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
            className="h-10 bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#343A46] text-[#42526E] dark:text-[#A5ADBA] font-bold rounded-lg hover:border-[#0052CC] transition-colors"
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
      <div className="flex flex-wrap items-end gap-4 bg-[#FAFBFC] dark:bg-[#091E42]/10 p-4 rounded-sm border border-[#DFE1E6] dark:border-[#343A46]">
        <div className="flex items-end gap-2">
          <DatePicker
            label={t('scans.filters.dateFrom', { defaultValue: 'From Date' })}
            value={currentDateFrom}
            onChange={(e) => immediate('dateFrom', e.target.value)}
            onClear={() => clearFilter('dateFrom')}
            className="w-[160px]"
          />
          <div className="pb-2 text-[#DFE1E6] dark:text-[#343A46] font-bold">—</div>
          <DatePicker
            label={t('scans.filters.dateTo', { defaultValue: 'To Date' })}
            value={currentDateTo}
            onChange={(e) => immediate('dateTo', e.target.value)}
            onClear={() => clearFilter('dateTo')}
            className="w-[160px]"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-bold text-[#6B778C] dark:text-[#97A0AF] uppercase tracking-wider block ml-1 mb-1.5">
            {t('scans.filters.deviceIdPlaceholder', { defaultValue: 'Hardware Device' })}
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <input
              type="text"
              placeholder={t('scans.filters.deviceIdPlaceholder', { defaultValue: 'Filter by Device ID…' })}
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                debounced(debounceDevice, 'deviceId', e.target.value);
              }}
              className="h-8 w-full pl-7 bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#343A46] rounded-sm text-xs font-mono font-semibold text-[#172B4D] dark:text-emerald-400 placeholder-[#6B778C] transition-all focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] hover:bg-[#FAFBFC] dark:hover:bg-[#2C333A]"
            />
          </div>
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            onClick={() => window.open(exportHref, '_blank')}
            className="h-8 px-4 border-[#DFE1E6] dark:border-[#343A46] text-[#42526E] dark:text-[#A5ADBA] font-bold rounded-sm hover:bg-[#F4F5F7] dark:hover:bg-[#2C333A] transition-all active:scale-95 group"
          >
            <Download className="h-3.5 w-3.5 mr-2 text-[#6B778C] group-hover:text-[#0052CC] transition-colors" />
            {t('scans.filters.exportCsv', { defaultValue: 'Export CSV' })}
          </Button>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.length > 0 ? (
            <>
              <span className="text-[11px] font-black text-[#6B778C] dark:text-[#97A0AF] uppercase tracking-widest mr-2">Active Filters:</span>
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm transition-all animate-in zoom-in-95 duration-200",
                    f.key === 'status' && currentStatus
                      ? (STATUS_CHIP[currentStatus] ?? 'bg-[#F4F5F7] text-[#42526E] border-[#DFE1E6]')
                      : f.key === 'project'
                      ? 'bg-[#DEEBFF] text-[#0747A6] border-[#B3D4FF]'
                      : 'bg-[#F4F5F7] text-[#172B4D] border-[#DFE1E6] dark:bg-[#2C333A] dark:text-[#D1D5DB] dark:border-[#343A46]'
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
                className="text-[11px] font-black text-[#0052CC] hover:bg-[#DEEBFF] h-6 px-3 rounded-full"
              >
                {t('scans.filters.clearAll', { defaultValue: 'CLEAR ALL' })}
              </Button>
            </>
          ) : (
             <div className="flex items-center gap-2 text-[#6B778C] opacity-50">
               <div className="h-1 w-1 rounded-full bg-[#6B778C]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('scans.filters.noFilters', { defaultValue: 'Live Audit Trail' })}</span>
             </div>
          )}
        </div>

        <p className="text-[11px] font-black text-[#6B778C] dark:text-[#97A0AF] uppercase tracking-widest">
           {filteredCount.toLocaleString()} {t('scans.filters.showingResultsSimple', { defaultValue: 'Entries Found' })}
        </p>
      </div>
    </div>
  );
}
