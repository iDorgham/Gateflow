'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const inputCls =
  'w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

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
  totalCount,
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
    router.push('/dashboard/scans');
  }

  const currentStatus = sp.get('status') ?? '';
  const currentGate = sp.get('gate') ?? '';
  const currentUserId = sp.get('userId') ?? '';
  const currentDateFrom = sp.get('dateFrom') ?? '';
  const currentDateTo = sp.get('dateTo') ?? '';

  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter grid — row 1: text search + up-to-4 dropdowns */}
      <div className={`grid gap-3 sm:grid-cols-2 ${hasProjects ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        {/* QR search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('scans.filters.searchPlaceholder', { defaultValue: 'Search QR code…' })}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              debounced(debounceQ, 'q', e.target.value);
            }}
            className={inputCls}
          />
          {q && (
            <button
              onClick={() => { setQ(''); navigate({ q: '' }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Status */}
        <select
          value={currentStatus}
          onChange={(e) => immediate('status', e.target.value)}
          className={inputCls}
        >
          <option value="">{t('scans.filters.allStatuses', { defaultValue: 'All statuses' })}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`scans.status.${s}`, { defaultValue: s.replace(/_/g, ' ') })}
            </option>
          ))}
        </select>

        {/* Project — only shown when the org has projects */}
        {hasProjects && (
          <select
            value={currentProjectId}
            onChange={(e) => immediate('project', e.target.value)}
            className={inputCls}
            aria-label={t('scans.filters.allProjects', { defaultValue: 'All projects' })}
          >
            <option value="all">{t('scans.filters.allProjects', { defaultValue: 'All projects' })}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Gate */}
        <select
          value={currentGate}
          onChange={(e) => immediate('gate', e.target.value)}
          className={inputCls}
        >
          <option value="">{t('scans.filters.allGates', { defaultValue: 'All gates' })}</option>
          {gates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Operator */}
        <select
          value={currentUserId}
          onChange={(e) => immediate('userId', e.target.value)}
          className={inputCls}
        >
          <option value="">{t('scans.filters.allOperators', { defaultValue: 'All operators' })}</option>
          {operators.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Second row: dates + device */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Date from */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('scans.filters.dateFrom', { defaultValue: 'From' })}</label>
          <input
            type="date"
            value={currentDateFrom}
            onChange={(e) => immediate('dateFrom', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">{t('scans.filters.dateTo', { defaultValue: 'To' })}</label>
          <input
            type="date"
            value={currentDateTo}
            onChange={(e) => immediate('dateTo', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Device ID */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">{t('scans.table.device', { defaultValue: 'Device ID' })}</label>
          <input
            type="text"
            placeholder={t('scans.filters.deviceIdPlaceholder', { defaultValue: 'Filter by device…' })}
            value={deviceId}
            onChange={(e) => {
              setDeviceId(e.target.value);
              debounced(debounceDevice, 'deviceId', e.target.value);
            }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Active filter chips + results count */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.length > 0 ? (
            <>
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    f.key === 'status' && currentStatus
                      ? (STATUS_CHIP[currentStatus] ?? 'bg-slate-100 text-slate-600 border-slate-200')
                      : f.key === 'project'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {f.label}
                  <button
                    onClick={() => clearFilter(f.key)}
                    className="ml-0.5 rounded-full hover:opacity-70"
                    aria-label={`Remove ${f.label} filter`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs font-medium text-slate-400 hover:text-slate-700 underline underline-offset-2"
              >
                {t('scans.filters.clearAll', { defaultValue: 'Clear all' })}
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400">{t('scans.filters.noFilters', { defaultValue: 'No filters applied' })}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {t('scans.filters.showingResults', { 
              filtered: filteredCount.toLocaleString(), 
              total: totalCount.toLocaleString(),
              defaultValue: `Showing ${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} results`
            })}
          </p>
          <a
            href={exportHref}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 whitespace-nowrap"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
            </svg>
            {t('scans.filters.exportCsv', { defaultValue: 'Export CSV' })}
          </a>
        </div>
      </div>
    </div>
  );
}
