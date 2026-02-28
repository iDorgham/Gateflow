'use server';

import { logger } from '@/lib/logger';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth';

type MemberResult = {
  success: boolean;
  error?: string;
  member?: { id: string; name: string; email: string; role: string; createdAt: string };
};

type SimpleResult = { success: boolean; error?: string };

const ALLOWED_ROLES = new Set(['TENANT_ADMIN', 'TENANT_USER', 'VISITOR', 'RESIDENT']);

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

    const roleRecord = await prisma.role.findFirst({
      where: {
        name: { equals: role, mode: 'insensitive' },
        OR: [{ organizationId: claims.orgId }, { organizationId: null }],
      },
    });
    if (!roleRecord) return { success: false, error: 'Role not found.' };

    const member = await prisma.user.create({
      data: {
        email,
        name,
        roleId: roleRecord.id,
        passwordHash,
        organizationId: claims.orgId,
      },
      select: { id: true, name: true, email: true, role: { select: { name: true } }, createdAt: true },
    });

    logger.info(`inviteMember: Success - Invited ${email} as ${role} to org ${claims.orgId}`);
    return {
      success: true,
      member: { ...member, role: member.role.name, createdAt: member.createdAt.toISOString() },
    };
  } catch (error) {
    logger.error('inviteMember: Unexpected error:', error);
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
    logger.info(`removeMember: Success - Removed user ${memberId} from org ${claims.orgId}`);
    return { success: true };
  } catch (error) {
    logger.error('removeMember: Unexpected error:', error);
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

    const newRoleRecord = await prisma.role.findFirst({
      where: {
        name: { equals: newRole, mode: 'insensitive' },
        OR: [{ organizationId: claims.orgId }, { organizationId: null }],
      },
    });
    if (!newRoleRecord) return { success: false, error: 'Role not found.' };
    await prisma.user.update({ where: { id: memberId }, data: { roleId: newRoleRecord.id } });
    logger.info(`changeRole: Success - Changed user ${memberId} role to ${newRole} in org ${claims.orgId}`);
    return { success: true };
  } catch (error) {
    logger.error('changeRole: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
