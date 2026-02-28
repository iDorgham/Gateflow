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
  } catch (error: any) {
    console.error('Server Action Error - updateWorkspaceSettingsAction:', error);
    
    // Catch unique constraint failures (usually domain or email already taken)
    // Avoid 'instanceof Prisma...' checks as they can fail across monorepo boundaries
    if (error && error.code === 'P2002') {
      const target = error.meta?.target;
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Server Action Error - deleteRoleAction:', error);
    return { success: false, message: 'Failed to delete role' };
  }
}
