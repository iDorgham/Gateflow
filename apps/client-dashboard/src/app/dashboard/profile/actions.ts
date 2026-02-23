'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

type ActionResult = { success: boolean; error?: string };

export async function updateProfile(userId: string, name: string): Promise<ActionResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims || claims.sub !== userId) return { success: false, error: 'Unauthorized.' };
    if (!name.trim()) return { success: false, error: 'Name cannot be empty.' };

    await prisma.user.update({ where: { id: userId }, data: { name: name.trim() } });
    console.log(`updateProfile: Success - Updated name for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('updateProfile: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims) return { success: false, error: 'Unauthorized.' };
    if (newPassword.length < 8)
      return { success: false, error: 'New password must be at least 8 characters.' };

    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { passwordHash: true },
    });
    if (!user) return { success: false, error: 'User not found.' };

    const valid = await verifyPassword(user.passwordHash, currentPassword);
    if (!valid) return { success: false, error: 'Current password is incorrect.' };

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: claims.sub }, data: { passwordHash: newHash } });
    console.log(`changePassword: Success - Updated password for user ${claims.sub}`);
    return { success: true };
  } catch (error) {
    console.error('changePassword: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
