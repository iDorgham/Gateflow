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
 * Strictly scoped by orgId and filtered by deletedAt: null.
 */
export async function getOrganizationContext(orgId: string): Promise<OrganizationContext | null> {
  try {
    const org = await prisma.organization.findFirst({
      where: { id: orgId, deletedAt: null },
      select: { name: true }
    });

    if (!org) {
      console.warn('[GateAI] Organization not found or deleted:', orgId);
      return null;
    }

    // 1. Fetch Basic Totals & Names
    const [projects, gates, scansRaw, unitsCount, residentsCount] = await Promise.all([
      prisma.project.findMany({
        where: { organizationId: orgId, deletedAt: null },
        select: { name: true },
        take: 20 // Limit to avoid prompt bloating
      }),
      prisma.gate.findMany({
        where: { organizationId: orgId, deletedAt: null },
        select: { name: true },
        take: 20
      }),
      prisma.scanLog.groupBy({
        by: ['status'],
        where: {
          gate: { organizationId: orgId, deletedAt: null }
        },
        _count: {
          _all: true
        }
      }),
      prisma.unit.count({
        where: { organizationId: orgId, deletedAt: null }
      }),
      prisma.user.count({
        where: { 
          organizationId: orgId, 
          deletedAt: null,
          role: { is: { name: 'RESIDENT' } }
        }
      })
    ]).catch(err => {
      console.error('[GateAI] Error in context Promise.all:', err);
      // Return defaults to allow partial success
      return [[], [], [], 0, 0];
    });

    const stats = {
      totalScans: (scansRaw as any[]).reduce((acc, curr) => acc + (curr._count?._all || 0), 0),
      successScans: (scansRaw as any[]).find(s => s.status === 'SUCCESS')?._count?._all || 0,
      failedScans: (scansRaw as any[]).find(s => s.status === 'FAILED')?._count?._all || 0,
      deniedScans: (scansRaw as any[]).find(s => s.status === 'DENIED')?._count?._all || 0,
    };

    return {
      name: org.name,
      totalProjects: (projects as any[]).length,
      projectNames: (projects as any[]).map(p => p.name),
      totalGates: (gates as any[]).length,
      gateNames: (gates as any[]).map(g => g.name),
      stats,
      capacity: {
        totalUnits: unitsCount as number,
        totalResidents: residentsCount as number
      }
    };
  } catch (error) {
    console.error('[GateAI] Global context error:', error);
    return null;
  }
}
