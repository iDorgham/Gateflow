import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { getTranslation, Locale, isRtl } from '@/lib/i18n';
import { Card, CardContent } from '@gate-access/ui';
import { ScansFilters } from './scans-filters';
import { PageHeader } from '@/components/dashboard/page-header';
import type { ScanStatus } from '@gate-access/db';
import type { Prisma } from '@gate-access/db';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('scans.title', { defaultValue: 'Scan Logs' }) };
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  EXPIRED: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  MAX_USES_REACHED: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  INACTIVE: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  DENIED: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
};

const VALID_STATUSES = new Set([
  'SUCCESS',
  'FAILED',
  'EXPIRED',
  'MAX_USES_REACHED',
  'INACTIVE',
  'DENIED',
]);
const VALID_SORT_COLS = new Set(['scannedAt', 'status', 'gate']);

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="ml-1 text-slate-300">↕</span>;
  return <span className="ml-1 text-blue-600">{dir === 'asc' ? '↑' : '↓'}</span>;
}

type SearchParams = {
  page?: string;
  status?: string;
  gate?: string;
  project?: string;
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  deviceId?: string;
  sort?: string;
};

export default async function ScansPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: { locale: Locale };
}) {
  const claims = await getSessionClaims();
  const { t } = await getTranslation(params.locale, 'dashboard');
  const orgId = claims.orgId;

  // Cookie-based project filter (existing behaviour — may be null for "all")
  const cookieProjectId = await getValidatedProjectId(orgId);

  const page = Math.max(1, parseInt(searchParams.page ?? '1'));
  const pageSize = 25;

  // Parse + sanitise filter params
  const rawStatus = searchParams.status ?? '';
  const statusFilter = VALID_STATUSES.has(rawStatus)
    ? (rawStatus as ScanStatus)
    : undefined;
  const gateFilter = searchParams.gate || undefined;
  const qFilter = searchParams.q?.trim() || undefined;
  const dateFrom = searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined;
  const dateTo = searchParams.dateTo
    ? new Date(new Date(searchParams.dateTo).setHours(23, 59, 59, 999))
    : undefined;
  const userIdFilter = searchParams.userId || undefined;
  const deviceIdFilter = searchParams.deviceId?.trim() || undefined;

  // Parse sort
  const [sortCol, sortDirRaw] = (searchParams.sort ?? 'scannedAt:desc').split(':');
  const validSortCol = VALID_SORT_COLS.has(sortCol) ? sortCol : 'scannedAt';
  const sortDir: 'asc' | 'desc' = sortDirRaw === 'asc' ? 'asc' : 'desc';

  const orderBy =
    validSortCol === 'gate'
      ? { gate: { name: sortDir } }
      : { [validSortCol]: sortDir };

  // ── Project filter ─────────────────────────────────────────────────────────
  // Fetch projects for the org (needed for filter dropdown + validation).
  const projects = await prisma.project.findMany({
    where: { organizationId: orgId, deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const validProjectIds = new Set(projects.map((p) => p.id));
  const urlProjectParam = searchParams.project; // undefined | 'all' | project-id

  // Determine the effective project ID for DB filtering:
  //   URL param absent         → fall back to cookie (existing behaviour)
  //   URL param = '' or 'all' → explicit "all projects" (overrides cookie)
  //   URL param = valid id     → filter by that project
  //   URL param = invalid id   → fall back to cookie
  let effectiveProjectId: string | null;
  if (urlProjectParam === undefined) {
    effectiveProjectId = cookieProjectId;
  } else if (!urlProjectParam || urlProjectParam === 'all') {
    effectiveProjectId = null;
  } else {
    effectiveProjectId = validProjectIds.has(urlProjectParam)
      ? urlProjectParam
      : cookieProjectId;
  }

  // Dropdown value shown in the filter UI
  const currentProjectDropdownValue = effectiveProjectId ?? 'all';

  // ── Prisma where clause ────────────────────────────────────────────────────
  const where = {
    qrCode: {
      organizationId: orgId,
      ...(effectiveProjectId ? { projectId: effectiveProjectId } : {}),
      ...(qFilter ? { code: { contains: qFilter } } : {}),
    },
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(gateFilter ? { gateId: gateFilter } : {}),
    ...(userIdFilter ? { userId: userIdFilter } : {}),
    ...(deviceIdFilter ? { deviceId: { contains: deviceIdFilter } } : {}),
    ...(dateFrom || dateTo
      ? {
          scannedAt: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {}),
  };

  const totalWhere = {
    qrCode: {
      organizationId: orgId,
      ...(effectiveProjectId ? { projectId: effectiveProjectId } : {}),
    },
  };

  const [totalUnfiltered, total, scans, gates, operators] = await Promise.all([
    prisma.scanLog.count({ where: totalWhere }),
    prisma.scanLog.count({ where }),
    prisma.scanLog.findMany({
      where,
      orderBy: orderBy as Prisma.ScanLogOrderByWithRelationInput,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        qrCode: {
          select: {
            code: true,
            type: true,
            project: { select: { id: true, name: true } },
          },
        },
        gate: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.gate.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        // Scope gate list to the active project when one is selected
        ...(effectiveProjectId ? { projectId: effectiveProjectId } : {}),
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    // Operators: users with scan logs in this org
    prisma.user.findMany({
      where: { organizationId: orgId, deletedAt: null, scanLogs: { some: {} } },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const showProjectColumn = projects.length > 0;

  // ── URL helpers ────────────────────────────────────────────────────────────

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      status: rawStatus || undefined,
      gate: gateFilter,
      project: urlProjectParam,
      q: qFilter,
      dateFrom: searchParams.dateFrom,
      dateTo: searchParams.dateTo,
      userId: userIdFilter,
      deviceId: deviceIdFilter,
      sort: searchParams.sort,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    const s = p.toString();
    return `/dashboard/scans${s ? '?' + s : ''}`;
  }

  function sortUrl(col: string) {
    const newDir = validSortCol === col && sortDir === 'desc' ? 'asc' : 'desc';
    return buildUrl({ sort: `${col}:${newDir}`, page: '1' });
  }

  // Build export URL with current filters (including project)
  const exportParams = new URLSearchParams();
  if (rawStatus) exportParams.set('status', rawStatus);
  if (gateFilter) exportParams.set('gate', gateFilter);
  // Fix: Use effectiveProjectId instead of raw URL param to ensure export respects cookie filter
  exportParams.set('project', effectiveProjectId ?? 'all');
  if (qFilter) exportParams.set('q', qFilter);
  if (searchParams.dateFrom) exportParams.set('dateFrom', searchParams.dateFrom);
  if (searchParams.dateTo) exportParams.set('dateTo', searchParams.dateTo);
  if (userIdFilter) exportParams.set('userId', userIdFilter);
  if (deviceIdFilter) exportParams.set('deviceId', deviceIdFilter);
  const exportHref = `/api/scans/export${exportParams.toString() ? '?' + exportParams.toString() : ''}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('scans.title', { defaultValue: 'Access Logs' })}
        subtitle={t('scans.description', { defaultValue: 'Full audit trail of all access attempts for your organisation.' })}
      />

      {/* Filters */}
      <ScansFilters
        gates={gates}
        operators={operators}
        projects={projects}
        currentProjectId={currentProjectDropdownValue}
        totalCount={totalUnfiltered}
        filteredCount={total}
        exportHref={exportHref}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="mb-4 h-12 w-12 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300">{t('scans.empty.title', { defaultValue: 'No scans found' })}</p>
              <p className="mt-1 text-sm text-slate-400">
                {total === 0 && totalUnfiltered > 0
                  ? t('scans.empty.filtered', { defaultValue: 'Try adjusting or clearing your filters.' })
                  : t('scans.empty.none', { defaultValue: 'Scans will appear here once access QR codes are used.' })}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Scan logs">
                <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3" scope="col">
                      <a
                        href={sortUrl('scannedAt')}
                        className="inline-flex items-center hover:text-slate-800"
                      >
                        {t('scans.table.dateTime', { defaultValue: 'Date / Time' })}
                        <SortIcon active={validSortCol === 'scannedAt'} dir={sortDir} />
                      </a>
                    </th>
                    <th className="px-4 py-3" scope="col">{t('scans.table.qrCode', { defaultValue: 'QR Code' })}</th>
                    {showProjectColumn && (
                      <th className="px-4 py-3" scope="col">{t('scans.table.project', { defaultValue: 'Project' })}</th>
                    )}
                    <th className="px-4 py-3" scope="col">
                      <a
                        href={sortUrl('gate')}
                        className="inline-flex items-center hover:text-slate-800"
                      >
                        {t('scans.table.gate', { defaultValue: 'Gate' })}
                        <SortIcon active={validSortCol === 'gate'} dir={sortDir} />
                      </a>
                    </th>
                    <th className="px-4 py-3" scope="col">{t('scans.table.operator', { defaultValue: 'Operator' })}</th>
                    <th className="px-4 py-3" scope="col">{t('scans.table.device', { defaultValue: 'Device' })}</th>
                    <th className="px-4 py-3" scope="col">
                      <a
                        href={sortUrl('status')}
                        className="inline-flex items-center hover:text-slate-800"
                      >
                        {t('scans.table.status', { defaultValue: 'Status' })}
                        <SortIcon active={validSortCol === 'status'} dir={sortDir} />
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                        {new Date(scan.scannedAt).toLocaleString(params.locale)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-500">
                          {scan.qrCode?.code?.slice(0, 22)}…
                        </span>
                        {scan.qrCode?.type && (
                          <span className="ml-1.5 rounded bg-slate-100 dark:bg-slate-700 px-1 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {scan.qrCode.type}
                          </span>
                        )}
                      </td>
                      {showProjectColumn && (
                        <td className="px-4 py-3">
                          {scan.qrCode?.project?.name ? (
                            <span className="rounded bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                              {scan.qrCode.project.name}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {scan.gate?.name ?? <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {scan.user ? (
                          <span title={scan.user.email}>{scan.user.name}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {scan.deviceId ?? <span className="not-italic text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            STATUS_COLORS[scan.status] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          )}
                        >
                          {t(`scans.status.${scan.status}`, { defaultValue: scan.status.replace(/_/g, ' ') })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          <span>
            {t('scans.pagination.label', { page, total: totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
            {' · '}
            {t('scans.pagination.range', { 
              start: ((page - 1) * pageSize + 1).toLocaleString(params.locale), 
              end: Math.min(page * pageSize, total).toLocaleString(params.locale), 
              total: total.toLocaleString(params.locale),
              defaultValue: `${((page - 1) * pageSize + 1).toLocaleString()}–${Math.min(page * pageSize, total).toLocaleString()} of ${total.toLocaleString()}`
            })}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={buildUrl({ page: String(page - 1) })} className="rounded border border-slate-200 dark:border-slate-600 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700">
                {isRtl(params.locale) ? '→ ' : '← '}
                {t('scans.pagination.previous', { defaultValue: 'Previous' })}
              </a>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <a
                  key={p}
                  href={buildUrl({ page: String(p) })}
                  className={cn(
                    'rounded border px-3 py-1.5',
                    p === page
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 font-medium text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  {p}
                </a>
              );
            })}
            {page < totalPages && (
              <a href={buildUrl({ page: String(page + 1) })} className="rounded border border-slate-200 dark:border-slate-600 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700">
                {t('scans.pagination.next', { defaultValue: 'Next' })}
                {isRtl(params.locale) ? ' ←' : ' →'}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
