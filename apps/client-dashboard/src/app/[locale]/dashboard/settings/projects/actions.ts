'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, GateMode } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

type Result<T = unknown> = { success: boolean; data?: T; error?: string };

export async function createProject(
  name: string,
  description?: string,
  gateMode: GateMode = GateMode.MULTI,
  gateIds: string[] = [],
  unitIds: string[] = []
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    if (!name.trim()) return { success: false, error: 'Project name is required.' };

    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          gateMode,
          organizationId: claims.orgId,
        },
      });

      // Link gates if provided
      if (gateIds.length > 0) {
        await tx.gate.updateMany({
          where: { id: { in: gateIds }, organizationId: claims.orgId },
          data: { projectId: newProject.id },
        });
      } else {
        // Default: create a Main Gate if no gates provided
        await tx.gate.create({
          data: {
            name: 'Main Gate',
            organizationId: claims.orgId,
            projectId: newProject.id,
          },
        });
      }

      // Link units if provided
      if (unitIds.length > 0) {
        await tx.unit.updateMany({
          where: { id: { in: unitIds }, organizationId: claims.orgId },
          data: { projectId: newProject.id },
        });
      }

      return newProject;
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/projects');
    return { success: true, data: project };
  } catch (error) {
    console.error('createProject error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    gateMode?: GateMode;
    gateIds?: string[];
    unitIds?: string[];
  }
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const existing = await prisma.project.findFirst({
      where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) return { success: false, error: 'Project not found.' };

    const updated = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: projectId },
        data: {
          name: data.name?.trim(),
          description: data.description?.trim(),
          gateMode: data.gateMode,
        },
      });

      // Update gate assignments if provided
      if (data.gateIds !== undefined) {
        await tx.gate.updateMany({
          where: { projectId, organizationId: claims.orgId, NOT: { id: { in: data.gateIds } } },
          data: { projectId: null },
        });
        if (data.gateIds.length > 0) {
          await tx.gate.updateMany({
            where: { id: { in: data.gateIds }, organizationId: claims.orgId },
            data: { projectId },
          });
        }
      }

      // Update unit assignments if provided
      if (data.unitIds !== undefined) {
        await tx.unit.updateMany({
          where: { projectId, organizationId: claims.orgId, NOT: { id: { in: data.unitIds } } },
          data: { projectId: null },
        });
        if (data.unitIds.length > 0) {
          await tx.unit.updateMany({
            where: { id: { in: data.unitIds }, organizationId: claims.orgId },
            data: { projectId },
          });
        }
      }

      return project;
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/projects');
    return { success: true, data: updated };
  } catch (error) {
    console.error('updateProject error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteProject(projectId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const count = await prisma.project.count({
      where: { organizationId: claims.orgId, deletedAt: null },
    });
    if (count <= 1) {
      return { success: false, error: 'Cannot delete the only project in your organization.' };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error('deleteProject error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function getResources(orgId: string) {
  try {
    const [gates, units] = await Promise.all([
      prisma.gate.findMany({
        where: { organizationId: orgId, deletedAt: null },
        select: { id: true, name: true, projectId: true },
      }),
      prisma.unit.findMany({
        where: { organizationId: orgId, deletedAt: null },
        select: { id: true, name: true, projectId: true },
      }),
    ]);
    return { gates, units };
  } catch (error) {
    console.error('getResources error:', error);
    return { gates: [], units: [] };
  }
}
