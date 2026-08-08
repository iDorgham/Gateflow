'use server';

import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { sendEmail, buildInvitationEmailHtml } from '@/lib/email';
import { logAuditAction } from '@/lib/audit';

type Result<T = unknown> = { success: boolean; data?: T; error?: string };

const InviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Role is required'),
});

import { Permission } from '@gate-access/types';

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<Permission, boolean>;
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

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
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
          select: { scanLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: users as unknown as TeamMember[] };
  } catch (error) {
    console.error('getTeamMembers error:', error);
    return { success: false, error: 'Failed to fetch team members.' };
  }
}

export async function inviteTeamMember(
  email: string,
  roleId: string
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const validation = InviteSchema.safeParse({ email, roleId });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email already exists.',
      };
    }

    // Check if invitation already exists
    const existingInvite = await prisma.invitation.findFirst({
      where: { email, organizationId: claims.orgId, acceptedAt: null },
    });
    if (existingInvite) {
      return {
        success: false,
        error: 'An invitation is already pending for this email.',
      };
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
      },
    });

    // Send invitation email
    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
      select: { name: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gateflow.site';
    const joinUrl = `${baseUrl}/join?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: `You've been invited to join ${org?.name || 'a team'} on GateFlow`,
        html: buildInvitationEmailHtml(org?.name || 'GateFlow Team', joinUrl),
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
    }

    // AUDIT LOG
    await logAuditAction({
      action: 'INVITE_MEMBER',
      entityType: 'INVITATION',
      entityId: email,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { roleId },
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
      orderBy: { createdAt: 'desc' },
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
      where: { id, organizationId: claims.orgId },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'REVOKE_INVITATION',
      entityType: 'INVITATION',
      entityId: id,
      orgId: claims.orgId,
      userId: claims.sub,
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('revokeInvitation error:', error);
    return { success: false, error: 'Failed to revoke invitation.' };
  }
}

export async function updateMemberRole(
  userId: string,
  roleId: string
): Promise<Result> {
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
      data: { roleId },
    });

    // AUTOMATED SESSION REVOCATION: Force logout to refresh JWT with new role
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'UPDATE_MEMBER_ROLE',
      entityType: 'USER',
      entityId: userId,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { roleId },
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
      data: { deletedAt: new Date() },
    });

    // AUTOMATED SESSION REVOCATION: Force immediate logout
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'REMOVE_MEMBER',
      entityType: 'USER',
      entityId: userId,
      orgId: claims.orgId,
      userId: claims.sub,
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
      data: { revokedAt: new Date() },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'REVOKE_SESSIONS',
      entityType: 'USER',
      entityId: userId,
      orgId: claims.orgId,
      userId: claims.sub,
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
        OR: [{ isBuiltIn: true }, { organizationId: claims.orgId }],
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { success: true, data: roles as unknown as Role[] };
  } catch (error) {
    console.error('getRoles error:', error);
    return { success: false, error: 'Failed to fetch roles.' };
  }
}

export async function getActivityLogs(): Promise<Result<ActivityLog[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const logs = await prisma.auditLog.findMany({
      where: { organizationId: claims.orgId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50
    });

    return { success: true, data: logs as unknown as ActivityLog[] };
  } catch (error) {
    console.error('getActivityLogs error:', error);
    return { success: false, error: 'Failed to fetch activity logs.' };
  }
}

const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.record(z.string(), z.boolean()),
});

export async function createRole(
  data: z.infer<typeof RoleSchema>
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const validation = RoleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const role = await prisma.role.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        permissions: validation.data.permissions,
        organizationId: claims.orgId,
        isBuiltIn: false,
      },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'CREATE_ROLE',
      entityType: 'ROLE',
      entityId: role.id,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { name: role.name },
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('createRole error:', error);
    return { success: false, error: 'Failed to create role.' };
  }
}

export async function updateRole(
  data: z.infer<typeof RoleSchema>
): Promise<Result> {
  try {
    if (!data.id) return { success: false, error: 'Role ID is required.' };

    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const validation = RoleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const existing = await prisma.role.findFirst({
      where: { id: data.id, organizationId: claims.orgId },
    });
    if (!existing)
      return { success: false, error: 'Role not found or cannot be edited.' };

    await prisma.role.update({
      where: { id: data.id },
      data: {
        name: validation.data.name,
        description: validation.data.description,
        permissions: validation.data.permissions,
      },
    });

    // AUTOMATED SESSION REVOCATION: Force logout for ALL users with this role
    // This ensures new permissions are applied immediately on next login.
    await prisma.refreshToken.updateMany({
      where: { user: { roleId: data.id } },
      data: { revokedAt: new Date() },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'UPDATE_ROLE',
      entityType: 'ROLE',
      entityId: data.id,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { name: validation.data.name },
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('updateRole error:', error);
    return { success: false, error: 'Failed to update role.' };
  }
}

export async function deleteRole(id: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['roles:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const existing = await prisma.role.findFirst({
      where: { id, organizationId: claims.orgId },
    });
    if (!existing)
      return { success: false, error: 'Role not found or cannot be deleted.' };

    // Check if role is in use
    const userCount = await prisma.user.count({
      where: { roleId: id, deletedAt: null },
    });
    if (userCount > 0) {
      return {
        success: false,
        error:
          'This role is currently assigned to team members and cannot be deleted.',
      };
    }

    await prisma.role.delete({
      where: { id },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'DELETE_ROLE',
      entityType: 'ROLE',
      entityId: id,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { name: existing.name },
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('deleteRole error:', error);
    return { success: false, error: 'Failed to delete role.' };
  }
}

// ─── GATE ASSIGNMENTS ──────────────────────────────────────────────────────────

export interface GateAssignment {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  gateId: string;
  gate: { id: string; name: string; location: string | null };
  shiftStart: string | null;
  shiftEnd: string | null;
  createdAt: Date;
}

export interface LiteGate {
  id: string;
  name: string;
  location: string | null;
}

export async function getGateAssignments(): Promise<Result<GateAssignment[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const assignments = await prisma.gateAssignment.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        gate: { select: { id: true, name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: assignments as unknown as GateAssignment[] };
  } catch (error) {
    console.error('getGateAssignments error:', error);
    return { success: false, error: 'Failed to fetch assignments.' };
  }
}

export async function unassignGate(id: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['gates:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    await prisma.gateAssignment.update({
      where: { id, organizationId: claims.orgId },
      data: { deletedAt: new Date() },
    });

    // AUDIT LOG
    await logAuditAction({
      action: 'UNASSIGN_GATE',
      entityType: 'GATE_ASSIGNMENT',
      entityId: id,
      orgId: claims.orgId,
      userId: claims.sub,
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('unassignGate error:', error);
    return { success: false, error: 'Failed to remove assignment.' };
  }
}

export async function assignGates(
  userId: string,
  gateIds: string[],
  shiftStart?: string,
  shiftEnd?: string
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['gates:manage']) {
      return { success: false, error: 'Unauthorized.' };
    }

    const orgId = claims.orgId;

    // Bulk creation with upsert logic for soft-deleted
    for (const gateId of gateIds) {
      await prisma.gateAssignment.upsert({
        where: { userId_gateId: { userId, gateId } },
        update: {
          deletedAt: null,
          shiftStart: shiftStart || null,
          shiftEnd: shiftEnd || null,
          updatedAt: new Date(),
        },
        create: {
          userId,
          gateId,
          organizationId: orgId,
          shiftStart: shiftStart || null,
          shiftEnd: shiftEnd || null,
        },
      });
    }

    // AUDIT LOG
    await logAuditAction({
      action: 'ASSIGN_GATES',
      entityType: 'USER',
      entityId: userId,
      orgId: claims.orgId,
      userId: claims.sub,
      metadata: { gateIds, shiftStart, shiftEnd },
    });

    revalidatePath('/dashboard/settings/team');
    return { success: true };
  } catch (error) {
    console.error('assignGates error:', error);
    return { success: false, error: 'Failed to assign gates.' };
  }
}

export async function getGates(): Promise<Result<LiteGate[]>> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const gates = await prisma.gate.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      select: { id: true, name: true, location: true },
      orderBy: { name: 'asc' },
    });

    return { success: true, data: gates };
  } catch (error) {
    console.error('getGates error:', error);
    return { success: false, error: 'Failed to fetch gates.' };
  }
}
