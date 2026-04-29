import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { ProjectTable } from '@/components/settings/projects/project-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gate-access/ui';

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
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Project Management</CardTitle>
          <CardDescription>
            Manage logical grouping of resources and physical access points.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <ProjectTable projects={projects} />
        </CardContent>
      </Card>
      
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500/80 text-xs">
        <p className="font-bold uppercase tracking-widest mb-1">Information</p>
        <p>Resource mapping enables organization isolation. Any gate or unit not assigned to a project will remain in the global workspace pool.</p>
      </div>
    </div>
  );
}
