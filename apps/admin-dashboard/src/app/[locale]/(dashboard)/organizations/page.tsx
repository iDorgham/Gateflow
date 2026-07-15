import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { OrgsClient } from '@/components/organizations/OrgsClient';

export const metadata = { title: 'Organizations' };

interface SearchParams {
  q?: string;
  plan?: string;
  status?: string;
}

export default async function OrganizationsPage(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale } = params;

  await requireAdmin(locale);
  const { t } = (await getTranslation(locale, 'admin')) as {
    t: (key: string, options?: Record<string, unknown> | string) => string;
  };

  const search =
    typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
  const planFilter = searchParams.plan ?? '';
  const statusFilter = searchParams.status ?? 'all';

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(planFilter && ['FREE', 'PRO'].includes(planFilter)
      ? { plan: planFilter as 'FREE' | 'PRO' }
      : {}),
    ...(statusFilter === 'active'
      ? { deletedAt: null }
      : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
  };

  const [orgs, total] = await Promise.all([
    // skip-organization-check (Global Admin List)
    prisma.organization.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        deletedAt: true,
        createdAt: true,
        _count: { select: { users: true, qrCodes: true, gates: true } },
      },
    }),
    // skip-organization-check (Global Admin Count)
    prisma.organization.count({ where }),
  ]);

  // Scans last 30 days per org
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
  // skip-organization-check (Global Admin Aggregation)
  const scansByGate = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: thirtyDaysAgo } },
    _count: true,
  });
  const gateIds = scansByGate.map((s: { gateId: string }) => s.gateId);
  // skip-organization-check (Global Admin Fetch)
  const gates = await prisma.gate.findMany({
    where: { id: { in: gateIds } },
    select: { id: true, organizationId: true },
  });
  const gateOrgMap = new Map<string, string>(
    gates.map((g: { id: string; organizationId: string }) => [
      g.id,
      g.organizationId,
    ])
  );
  const orgScanMap = new Map<string, number>();
  for (const s of scansByGate) {
    const orgId = gateOrgMap.get(s.gateId);
    if (orgId) orgScanMap.set(orgId, (orgScanMap.get(orgId) ?? 0) + s._count);
  }

  // Serialize for client component
  const serializedOrgs = orgs.map(
    (o: {
      id: string;
      name: string;
      email: string;
      plan: string;
      deletedAt: Date | null;
      createdAt: Date;
      _count: { users: number; qrCodes: number; gates: number };
    }) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      plan: o.plan,
      deletedAt: o.deletedAt?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
      _count: o._count,
      scansLast30d: orgScanMap.get(o.id) ?? 0,
    })
  );

  return (
    <OrgsClient
      orgs={serializedOrgs}
      locale={locale}
      search={search}
      planFilter={planFilter}
      statusFilter={statusFilter}
      total={total}
      translations={{
        title: t('organizations.title'),
        subtitle: t('organizations.subtitle'),
        addLabel: t('organizations.add'),
        searchPlaceholder: t('organizations.searchPlaceholder'),
        allPlans: t('organizations.allPlans'),
        anyStatus: t('organizations.anyStatus'),
        active: t('organizations.active'),
        suspended: t('organizations.suspended'),
        filter: t('organizations.filter'),
        emptyTitle: t('organizations.title'),
        emptySubtitle: t('organizations.noResultsDesc'),
        totalUnits: t('organizations.org'),
        auditLogNotice: t('monitoring.hub.stats.successful_seeds'), // Generic placeholder for verified
        columns: {
          org: t('organizations.org'),
          type: t('organizations.vertical', 'Vertical'),
          plan: t('organizations.plan'),
          metrics: t('organizations.metrics'),
          status: t('organizations.status'),
        },
        addOrganization: t('addOrganization', {
          returnObjects: true,
        }) as any, // Cast to any for the nested object from i18n
      }}
    />
  );
}
