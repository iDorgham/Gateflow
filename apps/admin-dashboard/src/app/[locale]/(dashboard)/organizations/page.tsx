import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { Badge } from '@gate-access/ui';
import { PageHeader } from '@/components/page-header';
import { OrgsClient } from '@/components/organizations/OrgsClient';

export const metadata = { title: 'Organizations' };

interface SearchParams { q?: string; plan?: string; status?: string }

export default async function OrganizationsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const search = searchParams.q?.trim() ?? '';
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
    ...(planFilter && ['FREE', 'PRO'].includes(planFilter) ? { plan: planFilter as 'FREE' | 'PRO' } : {}),
    ...(statusFilter === 'active'
      ? { deletedAt: null }
      : statusFilter === 'suspended'
      ? { NOT: { deletedAt: null } }
      : {}),
  };

  const [orgs, total] = await Promise.all([
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
    prisma.organization.count({ where }),
  ]);

  // Scans last 30 days per org
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
  const scansByGate = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: thirtyDaysAgo } },
    _count: true,
  });
  const gateIds = scansByGate.map((s) => s.gateId);
  const gates = await prisma.gate.findMany({
    where: { id: { in: gateIds } },
    select: { id: true, organizationId: true },
  });
  const gateOrgMap = new Map(gates.map((g) => [g.id, g.organizationId]));
  const orgScanMap = new Map<string, number>();
  for (const s of scansByGate) {
    const orgId = gateOrgMap.get(s.gateId);
    if (orgId) orgScanMap.set(orgId, (orgScanMap.get(orgId) ?? 0) + s._count);
  }

  // Serialize for client component
  const serializedOrgs = orgs.map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
    plan: o.plan,
    deletedAt: o.deletedAt?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
    _count: o._count,
    scansLast30d: orgScanMap.get(o.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('organizations.title')}
        subtitle={t('organizations.subtitle')}
        badge={
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold text-xs px-2.5 py-1">
            {total.toLocaleString(locale)}
          </Badge>
        }
      />

      <OrgsClient
        orgs={serializedOrgs}
        locale={locale}
        search={search}
        planFilter={planFilter}
        statusFilter={statusFilter}
        total={total}
      />
    </div>
  );
}
