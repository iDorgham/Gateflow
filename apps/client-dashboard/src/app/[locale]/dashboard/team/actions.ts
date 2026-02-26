'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth';
import { UserRole } from '@gate-access/db';

type MemberResult = {
  success: boolean;
  error?: string;
  member?: { id: string; name: string; email: string; role: string; createdAt: string };
};

type SimpleResult = { success: boolean; error?: string };

const ALLOWED_ROLES = new Set(['TENANT_ADMIN', 'TENANT_USER', 'VISITOR']);

export async function inviteMember(
  email: string,
  name: string,
  role: string,
): Promise<MemberResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };
    if (!ALLOWED_ROLES.has(role)) return { success: false, error: 'Invalid role.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Invalid email.' };

    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) return { success: false, error: 'A user with that email already exists.' };

    // In production: send an invitation email with a temp password link.
    // For now: create the user with a random temporary password.
    const tempPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(tempPassword);

    const member = await prisma.user.create({
      data: {
        email,
        name,
        role: role as UserRole,
        passwordHash,
        organizationId: claims.orgId,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    console.log(`inviteMember: Success - Invited ${email} as ${role} to org ${claims.orgId}`);
    return {
      success: true,
      member: { ...member, createdAt: member.createdAt.toISOString() },
    };
  } catch (error) {
    console.error('inviteMember: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function removeMember(memberId: string): Promise<SimpleResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };
    if (claims.sub === memberId) return { success: false, error: 'You cannot remove yourself.' };

    const member = await prisma.user.findFirst({
      where: { id: memberId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!member) return { success: false, error: 'Member not found.' };

    await prisma.user.update({ where: { id: memberId }, data: { deletedAt: new Date() } });
    console.log(`removeMember: Success - Removed user ${memberId} from org ${claims.orgId}`);
    return { success: true };
  } catch (error) {
    console.error('removeMember: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function changeRole(memberId: string, newRole: string): Promise<SimpleResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };
    if (!ALLOWED_ROLES.has(newRole)) return { success: false, error: 'Invalid role.' };
    if (claims.sub === memberId) return { success: false, error: 'You cannot change your own role.' };

    const member = await prisma.user.findFirst({
      where: { id: memberId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!member) return { success: false, error: 'Member not found.' };

    await prisma.user.update({ where: { id: memberId }, data: { role: newRole as UserRole } });
    console.log(`changeRole: Success - Changed user ${memberId} role to ${newRole} in org ${claims.orgId}`);
    return { success: true };
  } catch (error) {
    console.error('changeRole: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
