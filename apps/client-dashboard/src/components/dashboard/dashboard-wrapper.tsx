import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/dashboard-auth';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { DashboardLayout as DashboardLayoutClient } from '@/components/dashboard/dashboard-layout';
import { Locale } from '@/lib/i18n';
import { isSuperAdmin } from '@/lib/super-admin';
import { OrganizationFeaturesProvider } from '@/context/OrganizationFeaturesContext';
import { OrganizationType } from '@gate-access/types';

function getRoleName(user: { role: { name: string } | string }): string {
  return typeof user.role === 'object' ? user.role.name : user.role;
}

export async function DashboardWrapper({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const { user, org, claims } = await requireAuth();

  // RESIDENT guard: require linked unit to access dashboard
  const roleName = claims.roleName ?? getRoleName(user);
  if (roleName?.toUpperCase() === 'RESIDENT') {
    const unit = await prisma.unit.findFirst({
      where: { userId: user.id, deletedAt: null },
      select: { id: true },
    });
    if (!unit) {
      redirect(`/${locale}/no-unit-linked`);
    }
  }

  let projects: { id: string; name: string }[] = [];
  let currentProjectId: string | null = null;

  if (org) {
    const [dbProjects, validatedProjectId] = await Promise.all([
      prisma.project.findMany({
        where: { organizationId: org.id, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
        },
      }),
      getValidatedProjectId(org.id),
    ]);
    projects = dbProjects.map((p) => ({ id: p.id, name: p.name }));
    currentProjectId = validatedProjectId;
  }

  return (
    <OrganizationFeaturesProvider type={org?.type ?? OrganizationType.REAL_ESTATE}>
      <DashboardLayoutClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: claims.roleName ?? getRoleName(user),
        }}
        org={org ? { id: org.id, name: org.name, plan: org.plan, type: org.type } : null}
        projects={projects}
        currentProjectId={currentProjectId}
        locale={locale}
        permissions={claims.permissions as Record<string, boolean>}
        isSuperAdmin={isSuperAdmin(claims)}
      >
        {children}
      </DashboardLayoutClient>
    </OrganizationFeaturesProvider>
  );
}
