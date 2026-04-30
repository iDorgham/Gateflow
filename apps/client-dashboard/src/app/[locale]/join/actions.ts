'use server';

import { z } from 'zod';
import { prisma } from '@gate-access/db';
import {
  hashPassword,
  signAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth';
import { setAuthCookies } from '@/lib/auth-cookies';

type Result<T = unknown> = { success: boolean; data?: T; error?: string };

const JoinSchema = z.object({
  token: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function validateInvitation(
  token: string
): Promise<Result<{ email: string; orgName: string }>> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation)
      return { success: false, error: 'Invalid invitation link.' };
    if (invitation.acceptedAt)
      return { success: false, error: 'Invitation already accepted.' };
    if (invitation.expiresAt < new Date())
      return { success: false, error: 'Invitation expired.' };

    return {
      success: true,
      data: {
        email: invitation.email,
        orgName: invitation.organization.name,
      },
    };
  } catch (error) {
    console.error('validateInvitation error:', error);
    return { success: false, error: 'Failed to validate invitation.' };
  }
}

export async function acceptInvitation(
  data: z.infer<typeof JoinSchema>
): Promise<Result> {
  try {
    const validation = JoinSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token: data.token },
      include: { role: true, organization: true },
    });

    if (!invitation) return { success: false, error: 'Invalid invitation.' };
    if (invitation.acceptedAt)
      return { success: false, error: 'Invitation already accepted.' };
    if (invitation.expiresAt < new Date())
      return { success: false, error: 'Invitation expired.' };

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (user) {
      // If user exists, just update their role and org (assuming they are new or switching?)
      // PRD multi-tenancy rules: one user per org for now? Or join another?
      // In GateFlow, user belongs to one org at a time.
      await prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId: invitation.organizationId,
          roleId: invitation.roleId,
          deletedAt: null, // Restore if they were soft-deleted
        },
      });
    } else {
      // Create new user
      const passwordHash = await hashPassword(data.password);
      user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: data.name,
          passwordHash,
          organizationId: invitation.organizationId,
          roleId: invitation.roleId,
        },
      });
    }

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    // Sign them in
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const accessToken = await signAccessToken(
      user.id,
      user.email,
      user.organizationId,
      user.organizationType,
      {
        id: invitation.roleId,
        name: invitation.role.name,
        permissions: invitation.role.permissions as Record<string, boolean>,
      }
    );

    setAuthCookies(accessToken, refreshToken);

    return { success: true };
  } catch (error) {
    console.error('acceptInvitation error:', error);
    return { success: false, error: 'Failed to join team.' };
  }
}
