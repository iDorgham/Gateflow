import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { ProjectTable } from '@/components/settings/projects/project-table';

export default async function ProjectsSettings() {
  const { org } = await requireAuth();

  if (!org) return null;

  const projects = await prisma.project.findMany({
    where: {
      organizationId: org.id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          gates: true,
          qrCodes: true,
          units: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <ProjectTable projects={projects} />

      <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 text-warning/80 text-xs">
        <p className="font-bold uppercase tracking-widest mb-1">Information</p>
        <p>
          Resource mapping enables organization isolation. Any gate or unit not
          assigned to a project will remain in the global workspace pool.
        </p>
      </div>
    </div>
  );
}
