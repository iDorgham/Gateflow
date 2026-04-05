import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { Badge, Button } from '@gate-access/ui';
import { PageHeader } from '@gate-access/ui';
import { UsersClient } from '@/components/users/UsersClient';
import { Plus } from 'lucide-react';

export const metadata = { title: 'Users' };

interface SearchParams {
  q?: string;
  role?: string;
  status?: string;
}

export default async function UsersPage(props: {
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

  const search = searchParams.q?.trim() ?? '';
  const roleFilter = searchParams.role ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(roleFilter ? { role: { name: roleFilter } } : {}),
    ...(statusFilter === 'active'
      ? { deletedAt: null }
      : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
  };

  const [users, total, roles] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true, plan: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.role.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const serializedUsers = users.map(
    (u: {
      id: string;
      name: string;
      email: string | null;
      deletedAt: Date | null;
      createdAt: Date;
      role: { id: string; name: string } | null;
      organization: { id: string; name: string; plan: string | null } | null;
    }) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      deletedAt: u.deletedAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
      role: u.role,
      organization: u.organization,
    })
  );

  return (
    <UsersClient
      users={serializedUsers}
      search={search}
      roleFilter={roleFilter}
      statusFilter={statusFilter}
      total={total}
      roles={roles as any}
      locale={locale}
      translations={{
        title: t('users.title'),
        subtitle: t('users.subtitle'),
        addLabel: t('users.add'),
        searchPlaceholder: t('users.searchPlaceholder'),
        allRoles: t('users.allRoles'),
        anyStatus: t('users.anyStatus'),
        active: t('users.active'),
        suspended: t('users.suspended'),
        filter: t('users.filter'),
        emptyTitle: t('users.title'),
        emptySubtitle: t('users.noResultsDesc'),
        totalUnits: t('users.userIdentity'),
        sortedBy: t('users.auditLogNotice').split('.')[0],
        columns: {
          user: t('users.userIdentity'),
          org: t('organizations.org'),
          role: t('users.securityRole'),
          status: t('users.status'),
        },
      }}
    />
  );
}
