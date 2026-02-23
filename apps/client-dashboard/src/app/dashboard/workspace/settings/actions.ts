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

import { Prisma } from '@gate-access/db';

export async function updateWorkspaceSettingsAction(data: { name: string; email: string; domain?: string | null }) {
  try {
    const claims = await getSessionClaims();
    console.log('[DEBUG action] Settings update hit. Claims parsed:', claims);
    
    if (!claims?.orgId) {
      console.log('[DEBUG action] Bouncing as Unauthorized. OrgId missing.');
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

    revalidatePath('/dashboard/workspace/settings');
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
