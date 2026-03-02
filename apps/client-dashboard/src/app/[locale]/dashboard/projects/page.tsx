import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProjectsTab } from '../settings/tabs/projects-tab';

export const metadata = { title: 'Projects | GateFlow' };

export default async function ProjectsPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const projects = await prisma.project.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { gates: true, qrCodes: true } },
      units: {
        select: {
          type: true,
          contacts: { select: { contactId: true } },
        },
      },
    },
  });

  const projectsWithCounts = projects.map((p) => {
    const uniqueContacts = new Set(
      p.units.flatMap((u) => u.contacts.map((c) => c.contactId))
    );
    return {
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      _count: {
        gates: p._count.gates,
        qrCodes: p._count.qrCodes,
        units: p.units.length,
        unitTypes: new Set(p.units.map((u) => u.type)).size,
        contacts: uniqueContacts.size,
      },
    };
  });

  return (
    <div className="space-y-6">
      <ProjectsTab
        projects={projectsWithCounts}
        allowCreateWhenEmpty={false}
      />
    </div>
  );
}
