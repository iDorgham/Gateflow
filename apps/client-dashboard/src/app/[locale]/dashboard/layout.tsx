import { requireAuth } from '@/lib/dashboard-auth';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { DashboardShell } from '@/components/dashboard/shell';

import { Locale } from '@/lib/i18n';

export default async function DashboardLayout({ 
  children,
  params
}: { 
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { user, org } = await requireAuth();

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

  return (
    <DashboardShell
      user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      org={org ? { id: org.id, name: org.name, plan: org.plan } : null}
      projects={projects}
      currentProjectId={currentProjectId}
      locale={params.locale}
      hideGates={hideGates}
    >
      {children}
    </DashboardShell>
  );
}
