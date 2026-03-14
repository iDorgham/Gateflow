import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/dashboard-auth';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { DashboardLayout as DashboardLayoutClient } from '@/components/dashboard/dashboard-layout';

import { Locale } from '@/lib/i18n';

function getRoleName(user: { role: { name: string } | string }): string {
  return typeof user.role === 'object' ? user.role.name : user.role;
}

export default async function DashboardLayout({ 
  children,
  params
}: { 
  children: React.ReactNode; 
  params: { locale: Locale };
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
      redirect(`/${params.locale}/no-unit-linked`);
    }
  }

  let projects: { id: string; name: string }[] = [];
  let currentProjectId: string | null = null;
  let hideGates = false;

  if (org) {
    const [dbProjects, validatedProjectId] = await Promise.all([
      prisma.project.findMany({
        where: { organizationId: org.id, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: { 
          id: true, 
          name: true,
          _count: {
            select: { gates: { where: { deletedAt: null } } }
          }
        },
      }),
      getValidatedProjectId(org.id),
    ]);
    projects = dbProjects.map(p => ({ id: p.id, name: p.name }));
    currentProjectId = validatedProjectId;
    
    // Hide gates if all projects have 0 or 1 gate
    hideGates = dbProjects.length > 0 && dbProjects.every(p => p._count.gates <= 1);
  }

  // To use the new DashboardLayout (mini header, ⌘K search, collapsible sidebars, AI+Tasks panel), replace DashboardShell with DashboardLayout and pass the same props.
  return (
    <DashboardLayoutClient
      user={{ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: claims.roleName ?? getRoleName(user) 
      }}
      org={org ? { id: org.id, name: org.name, plan: org.plan } : null}
      projects={projects}
      currentProjectId={currentProjectId}
      locale={params.locale}
      permissions={claims.permissions as Record<string, boolean>}
    >
      {children}
    </DashboardLayoutClient>
  );
}
