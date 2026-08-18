'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { hashPassword } from '@/lib/password';

type ActionResult = { success: boolean; error?: string };

export async function completeForcedPasswordChange(
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims) return { success: false, error: 'Unauthorized.' };
    if (newPassword.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters.',
      };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    const user = await prisma.user.findFirst({
      where: { id: claims.sub, deletedAt: null },
      select: { mustChangePassword: true },
    });
    if (!user) return { success: false, error: 'User not found.' };
    if (!user.mustChangePassword) {
      return { success: false, error: 'Password change is not required.' };
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: claims.sub },
      data: { passwordHash, mustChangePassword: false },
    });

    return { success: true };
  } catch (error) {
    console.error('completeForcedPasswordChange error:', error);
    return { success: false, error: 'Failed to update password.' };
  }
}
