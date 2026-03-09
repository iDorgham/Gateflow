'use server';

import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

type Result<T = unknown> = { success: boolean; data?: T; error?: string };

const InviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Role is required'),
});

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<string, boolean>;
  isBuiltIn: boolean;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
    invitations: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  _count: {
    scanLogs: number;
  };
  createdAt: Date;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  organizationId: string;
  acceptedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export async function getTeamMembers(): Promise<Result<TeamMember[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const users = await prisma.user.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      include: {
        role: true,
        _count: {
          select: { scanLogs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: users as unknown as TeamMember[] };
  } catch (error) {
    console.error('getTeamMembers error:', error);
    return { success: false, error: 'Failed to fetch team members.' };
  }
}

export async function inviteTeamMember(email: string, roleId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const validation = InviteSchema.safeParse({ email, roleId });
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return { success: false, error: 'A user with this email already exists.' };
    }

    // Check if invitation already exists
    const existingInvite = await prisma.invitation.findFirst({
      where: { email, organizationId: claims.orgId, acceptedAt: null }
    });
    if (existingInvite) {
      return { success: false, error: 'An invitation is already pending for this email.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    await prisma.invitation.create({
      data: {
        email,
        roleId,
        token,
        organizationId: claims.orgId,
        expiresAt,
      }
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('inviteTeamMember error:', error);
    return { success: false, error: 'Failed to send invitation.' };
  }
}

export async function getInvitations(): Promise<Result<Invitation[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const invitations = await prisma.invitation.findMany({
      where: { organizationId: claims.orgId, acceptedAt: null },
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: invitations as unknown as Invitation[] };
  } catch (error) {
    console.error('getInvitations error:', error);
    return { success: false, error: 'Failed to fetch invitations.' };
  }
}

export async function revokeInvitation(id: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    await prisma.invitation.delete({
      where: { id, organizationId: claims.orgId }
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('revokeInvitation error:', error);
    return { success: false, error: 'Failed to revoke invitation.' };
  }
}

export async function updateMemberRole(userId: string, roleId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Prevent changing own role if it's the last admin
    // For now, simple check: don't let anyone edit their own role via this action
    if (userId === claims.sub) {
      return { success: false, error: 'You cannot change your own role.' };
    }

    await prisma.user.update({
      where: { id: userId, organizationId: claims.orgId },
      data: { roleId }
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('updateMemberRole error:', error);
    return { success: false, error: 'Failed to update member role.' };
  }
}

export async function removeMember(userId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    if (userId === claims.sub) {
      return { success: false, error: 'You cannot remove yourself.' };
    }

    await prisma.user.update({
      where: { id: userId, organizationId: claims.orgId },
      data: { deletedAt: new Date() }
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('removeMember error:', error);
    return { success: false, error: 'Failed to remove member.' };
  }
}

export async function revokeUserSessions(userId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() }
    });

    return { success: true };
  } catch (error) {
    console.error('revokeUserSessions error:', error);
    return { success: false, error: 'Failed to revoke sessions.' };
  }
}

export async function getRoles(): Promise<Result<Role[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { isBuiltIn: true },
          { organizationId: claims.orgId }
        ]
      },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return { success: true, data: roles as unknown as Role[] };
  } catch (error) {
    console.error('getRoles error:', error);
    return { success: false, error: 'Failed to fetch roles.' };
  }
}
