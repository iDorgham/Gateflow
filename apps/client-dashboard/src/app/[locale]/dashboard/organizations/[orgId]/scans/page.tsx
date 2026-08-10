import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { ScansFilters } from './scans-filters';
import { ScansTableWithPagination } from './scans-table-with-pagination';
import { PageHeader } from '@gateflow/components';
import { Button } from '@gateflow/ui';
import { Download } from 'lucide-react';
import type { ScanStatus } from '@gate-access/db';
import type { Prisma } from '@gate-access/db';
import type { ScanLog } from '@/components/dashboard/scans/ScansTable';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('scans.title', { defaultValue: 'Scan Logs' }) };
}

const VALID_STATUSES = new Set([
  'SUCCESS',
  'FAILED',
  'EXPIRED',
  'MAX_USES_REACHED',
  'INACTIVE',
  'DENIED',
]);

const VALID_SORT_COLS = new Set(['scannedAt', 'status', 'gate']);

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

export default async function ScansPage(props: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');
  const { t } = await getTranslation(params.locale, 'dashboard');
  const orgId = claims.orgId;

  const cookieProjectId = await getValidatedProjectId(orgId);
  const page = Math.max(1, parseInt(searchParams.page ?? '1'));
  const pageSize = 25;

  const rawStatus = searchParams.status ?? '';
  const statusFilter = VALID_STATUSES.has(rawStatus)
    ? (rawStatus as ScanStatus)
    : undefined;
  const gateFilter = searchParams.gate || undefined;
  const qFilter = searchParams.q?.trim() || undefined;
  const dateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom)
    : undefined;
  const dateTo = searchParams.dateTo
    ? new Date(new Date(searchParams.dateTo).setHours(23, 59, 59, 999))
    : undefined;
  const userIdFilter = searchParams.userId || undefined;
  const deviceIdFilter = searchParams.deviceId?.trim() || undefined;

  const [sortCol, sortDirRaw] = (searchParams.sort ?? 'scannedAt:desc').split(
    ':'
  );
  const validSortCol = VALID_SORT_COLS.has(sortCol) ? sortCol : 'scannedAt';
  const sortDir: 'asc' | 'desc' = sortDirRaw === 'asc' ? 'asc' : 'desc';

  const orderBy =
    validSortCol === 'gate'
      ? { gate: { name: sortDir } }
      : { [validSortCol]: sortDir };

  const projects = await prisma.project.findMany({
    where: { organizationId: orgId, deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const validProjectIds = new Set(projects.map((p) => p.id));
  const urlProjectParam = searchParams.project;

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

  const currentProjectDropdownValue = effectiveProjectId ?? 'all';

  const where = {
    deletedAt: null,
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
    deletedAt: null,
    qrCode: {
      organizationId: orgId,
      ...(effectiveProjectId ? { projectId: effectiveProjectId } : {}),
    },
  };

  const [totalUnfiltered, total, scans, gates, operators] = await Promise.all([
    prisma.scanLog.count({ where: totalWhere }),
    prisma.scanLog.count({ where }),
    prisma.scanLog.findMany({
      // ignore-security-guard — scoped via qrCode.organizationId (ScanLog has no direct orgId field)
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
        ...(effectiveProjectId ? { projectId: effectiveProjectId } : {}),
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        scanLogs: { some: { deletedAt: null } },
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const showProjectColumn = projects.length > 0;

  const exportParams = new URLSearchParams();
  if (rawStatus) exportParams.set('status', rawStatus);
  if (gateFilter) exportParams.set('gate', gateFilter);
  exportParams.set('project', effectiveProjectId ?? 'all');
  if (qFilter) exportParams.set('q', qFilter);
  if (searchParams.dateFrom)
    exportParams.set('dateFrom', searchParams.dateFrom);
  if (searchParams.dateTo) exportParams.set('dateTo', searchParams.dateTo);
  if (userIdFilter) exportParams.set('userId', userIdFilter);
  if (deviceIdFilter) exportParams.set('deviceId', deviceIdFilter);
  const exportHref = `/api/scans/export${exportParams.toString() ? '?' + exportParams.toString() : ''}`;

  const rangeText = t('scans.pagination.range', {
    start: ((page - 1) * pageSize + 1).toLocaleString(params.locale),
    end: Math.min(page * pageSize, total).toLocaleString(params.locale),
    total: total.toLocaleString(params.locale),
  });

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      <PageHeader
        title={t('scans.title', { defaultValue: 'Access Logs' })}
        subtitle={t('scans.description', {
          defaultValue:
            'Full audit trail of all access attempts for your organisation.',
        })}
        breadcrumbs={[
          { label: 'Dashboard', href: `/${params.locale}/dashboard` },
          { label: 'Access Logs' },
        ]}
        homeHref={`/${params.locale}/dashboard`}
        actions={[
          <Button
            key="export-btn"
            // @ts-expect-error - href is valid but Button component types are being overly restrictive here
            href={exportHref}
            target="_blank"
            variant="outline"
            className="h-9 px-4 border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-lg shadow-sm group"
          >
            <Download className="h-4 w-4 me-2 group-hover:text-[var(--ds-icon-brand)] transition-colors" />
            {t('common.export', { defaultValue: 'Export Logs' })}
          </Button>,
        ]}
      />

      <div className="mt-8 space-y-6">
        <ScansFilters
          gates={gates}
          operators={operators}
          projects={projects}
          currentProjectId={currentProjectDropdownValue}
          totalCount={totalUnfiltered}
          filteredCount={total}
          exportHref={exportHref}
        />

        <ScansTableWithPagination
          data={
            scans.map((s) => ({ ...s, scannedAt: s.scannedAt })) as ScanLog[]
          }
          locale={params.locale}
          sortCol={validSortCol}
          sortDir={sortDir}
          showProjectColumn={showProjectColumn}
          page={page}
          totalPages={totalPages}
          rangeText={rangeText}
        />
      </div>
    </div>
  );
}
