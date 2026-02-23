import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProjectsClient } from './projects-client';

export const metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const projects = await prisma.project.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { gates: true, qrCodes: true } } },
  });

  return (
    <ProjectsClient projects={projects} />
  );
}
