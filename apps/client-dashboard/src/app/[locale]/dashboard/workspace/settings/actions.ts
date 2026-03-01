'use server';

import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

const SettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  domain: z.string().max(100).nullable().optional(),
});

const RetentionSchema = z.object({
  requiredIdentityLevel: z.number().int().min(0).max(2).optional(),
  scanLogRetentionMonths: z.number().int().min(1).max(120).nullable().optional(),
  visitorHistoryRetentionMonths: z.number().int().min(1).max(120).nullable().optional(),
  idArtifactRetentionMonths: z.number().int().min(1).max(120).nullable().optional(),
  incidentRetentionMonths: z.number().int().min(1).max(120).nullable().optional(),
  maskResidentNameOnLandingPage: z.boolean().optional(),
  showUnitOnLandingPage: z.boolean().optional(),
});

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const value = (error as { code?: unknown }).code;
    return typeof value === 'string' ? value : undefined;
  }
  return undefined;
}

function getErrorTarget(error: unknown): unknown {
  if (typeof error === 'object' && error !== null && 'meta' in error) {
    const meta = (error as { meta?: unknown }).meta;
    if (typeof meta === 'object' && meta !== null && 'target' in meta) {
      return (meta as { target?: unknown }).target;
    }
  }
  return undefined;
}

export async function updateWorkspaceSettingsAction(data: { name: string; email: string; domain?: string | null }) {
  try {
    const claims = await getSessionClaims();
    
    if (!claims?.orgId) {
      return { success: false, message: 'Unauthorized' };
    }

    const validation = SettingsSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: 'Invalid data provided' };
    }

    const { name, email, domain } = validation.data;

    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
    });

    if (!org || org.deletedAt) {
      return { success: false, message: 'Organization not found' };
    }

    await prisma.organization.update({
      where: { id: claims.orgId },
      data: {
        name,
        email,
        domain: domain?.trim() || null,
      },
    });

    revalidatePath('/dashboard/settings');

    return { success: true };
  } catch (error: unknown) {
    console.error('Server Action Error - updateWorkspaceSettingsAction:', error);
    
    // Catch unique constraint failures (usually domain or email already taken)
    // Avoid 'instanceof Prisma...' checks as they can fail across monorepo boundaries
    if (getErrorCode(error) === 'P2002') {
      const target = getErrorTarget(error);
      const targetStr = Array.isArray(target) ? target.join(',') : String(target || '');
      
      if (targetStr.includes('domain')) {
        return { success: false, message: 'This custom domain is already in use by another organization.' };
      }
      if (targetStr.includes('email')) {
         return { success: false, message: 'This email is already in use.' };
      }
    }

    return { success: false, message: 'An internal server error occurred while saving.' };
  }
}

export async function updateRetentionAndPrivacyAction(data: {
  requiredIdentityLevel?: number;
  scanLogRetentionMonths?: number | null;
  visitorHistoryRetentionMonths?: number | null;
  idArtifactRetentionMonths?: number | null;
  incidentRetentionMonths?: number | null;
  maskResidentNameOnLandingPage?: boolean;
  showUnitOnLandingPage?: boolean;
}) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, message: 'Unauthorized' };
    if (!claims.permissions?.['workspace:manage'] && !claims.permissions?.['gates:manage']) {
      return { success: false, message: 'Permission required to change retention settings' };
    }

    const validation = RetentionSchema.safeParse(data);
    if (!validation.success) return { success: false, message: 'Invalid data provided' };

    const org = await prisma.organization.findFirst({
      where: { id: claims.orgId, deletedAt: null },
    });
    if (!org) return { success: false, message: 'Organization not found' };

    const update: Record<string, unknown> = {};
    if (data.requiredIdentityLevel !== undefined) update.requiredIdentityLevel = data.requiredIdentityLevel;
    if (data.scanLogRetentionMonths !== undefined) update.scanLogRetentionMonths = data.scanLogRetentionMonths;
    if (data.visitorHistoryRetentionMonths !== undefined) update.visitorHistoryRetentionMonths = data.visitorHistoryRetentionMonths;
    if (data.idArtifactRetentionMonths !== undefined) update.idArtifactRetentionMonths = data.idArtifactRetentionMonths;
    if (data.incidentRetentionMonths !== undefined) update.incidentRetentionMonths = data.incidentRetentionMonths;
    if (data.maskResidentNameOnLandingPage !== undefined) update.maskResidentNameOnLandingPage = data.maskResidentNameOnLandingPage;
    if (data.showUnitOnLandingPage !== undefined) update.showUnitOnLandingPage = data.showUnitOnLandingPage;

    await prisma.organization.update({
      where: { id: claims.orgId },
      data: update as Parameters<typeof prisma.organization.update>[0]['data'],
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error('Server Action Error - updateRetentionAndPrivacyAction:', error);
    return { success: false, message: 'An internal server error occurred.' };
  }
}

const RoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50),
  description: z.string().max(200).optional().nullable(),
  permissions: z.record(z.string(), z.boolean()),
});

export async function createRoleAction(data: { name: string; description?: string | null; permissions: Record<string, boolean> }) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions['roles:manage']) {
      return { success: false, message: 'Unauthorized' };
    }

    const validation = RoleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: 'Invalid data provided' };
    }

    await prisma.role.create({
      data: {
        name: validation.data.name,
        description: validation.data.description ?? null,
        permissions: validation.data.permissions,
        organizationId: claims.orgId,
        isBuiltIn: false,
      },
    });

    revalidatePath('/dashboard/workspace/settings');
    return { success: true };
  } catch (error: unknown) {
    console.error('Server Action Error - createRoleAction:', error);
    return { success: false, message: 'Failed to create role' };
  }
}

export async function updateRoleAction(id: string, data: { name: string; description?: string | null; permissions: Record<string, boolean> }) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions['roles:manage']) {
      return { success: false, message: 'Unauthorized' };
    }

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role || role.organizationId !== claims.orgId || role.isBuiltIn) {
      return { success: false, message: 'Role not found or cannot be edited' };
    }

    const validation = RoleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: 'Invalid data provided' };
    }

    await prisma.role.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath('/dashboard/workspace/settings');
    return { success: true };
  } catch (error: unknown) {
    console.error('Server Action Error - updateRoleAction:', error);
    return { success: false, message: 'Failed to update role' };
  }
}

export async function deleteRoleAction(id: string) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions['roles:manage']) {
      return { success: false, message: 'Unauthorized' };
    }

    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!role || role.organizationId !== claims.orgId || role.isBuiltIn) {
      return { success: false, message: 'Role not found or cannot be deleted' };
    }

    if (role._count.users > 0) {
      return { success: false, message: 'Cannot delete a role that is assigned to users' };
    }

    await prisma.role.delete({ where: { id } });

    revalidatePath('/dashboard/workspace/settings');
    return { success: true };
  } catch (error: unknown) {
    console.error('Server Action Error - deleteRoleAction:', error);
    return { success: false, message: 'Failed to delete role' };
  }
}
