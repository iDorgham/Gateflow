import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { Badge } from '@gate-access/ui';
import { PageHeader } from '@/components/page-header';
import { UsersClient } from '@/components/users/UsersClient';

export const metadata = { title: 'Users' };

interface SearchParams { q?: string; role?: string; status?: string; page?: string }

export default async function UsersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = (await getTranslation(locale, 'admin')) as { t: (key: string, options?: any) => string };

  const search = searchParams.q?.trim() ?? '';
  const roleFilter = searchParams.role ?? '';
  const statusFilter = searchParams.status ?? 'active';
  const page = Math.max(1, parseInt(searchParams.page ?? '1'));
  const take = 25;
  const skip = (page - 1) * take;

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
      skip,
      take,
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
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    deletedAt: u.deletedAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    role: u.role,
    organization: u.organization,
  }));

  const activeCount = users.filter((u) => u.deletedAt === null).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        badge={
          <Badge variant="outline" className="font-bold text-[10px] px-2.5 py-0.5 rounded-sm">
            {activeCount.toLocaleString(locale)} active
          </Badge>
        }
      />

      <UsersClient
        users={serializedUsers}
        locale={locale}
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        total={total}
        roles={roles}
        page={page}
        totalPages={Math.ceil(total / take)}
      />
    </div>
  );
}
