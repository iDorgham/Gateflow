import { requireAuth } from '@/lib/dashboard-auth';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { DashboardShell } from '@/components/dashboard/shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, org } = await requireAuth();

  let projects: { id: string; name: string }[] = [];
  let currentProjectId: string | null = null;

  if (org) {
    [projects, currentProjectId] = await Promise.all([
      prisma.project.findMany({
        where: { organizationId: org.id, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: { id: true, name: true },
      }),
      getValidatedProjectId(org.id),
    ]);
  }

  return (
    <DashboardShell
      user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      org={org ? { id: org.id, name: org.name, plan: org.plan } : null}
      projects={projects}
      currentProjectId={currentProjectId}
    >
      {children}
    </DashboardShell>
  );
}
