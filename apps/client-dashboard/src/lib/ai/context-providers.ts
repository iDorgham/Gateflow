import { prisma } from '@gate-access/db';

export interface OrganizationContext {    
  name: string;
  totalProjects: number;
  projectNames: string[];
  totalGates: number;
  gateNames: string[];
  stats: {
    totalScans: number;
    successScans: number;
    failedScans: number;
    deniedScans: number;
  };
  capacity: {
    totalUnits: number;
    totalResidents: number;
  };
}

/**
 * Fetches a summary of organization data to provide context for AI.
 * strictly scoped by orgId and filtered by deletedAt: null.
 */
export async function getOrganizationContext(orgId: string): Promise<OrganizationContext | null> {
  const org = await prisma.organization.findFirst({
    where: { id: orgId, deletedAt: null },
    select: { name: true }
  });

  if (!org) return null;

  const [
    projects,
    gates,
    scans,
    units,
    residents
  ] = await Promise.all([
    prisma.project.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { name: true }
    }),
    prisma.gate.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { name: true }
    }),
    prisma.scanLog.groupBy({
      by: ['status'],
      where: {
        qrCode: { organizationId: orgId, deletedAt: null }
      },
      _count: true
    }),
    prisma.unit.count({
      where: { organizationId: orgId, deletedAt: null }
    }),
    prisma.user.count({
      where: { organizationId: orgId, deletedAt: null, role: { name: 'RESIDENT' } }
    })
  ]);

  const stats = {
    totalScans: scans.reduce((acc, curr) => acc + curr._count, 0),
    successScans: scans.find(s => s.status === 'SUCCESS')?._count || 0,
    failedScans: scans.find(s => s.status === 'FAILED')?._count || 0,
    deniedScans: scans.find(s => s.status === 'DENIED')?._count || 0,
  };

  return {
    name: org.name,
    totalProjects: projects.length,
    projectNames: projects.map(p => p.name),
    totalGates: gates.length,
    gateNames: gates.map(g => g.name),
    stats,
    capacity: {
      totalUnits: units,
      totalResidents: residents
    }
  };
}
