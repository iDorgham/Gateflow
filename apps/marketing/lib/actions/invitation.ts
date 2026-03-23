'use server';

import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

export async function updateVisitorName(qrId: string, name: string) {
  if (!qrId || !name) return { success: false, message: 'Invalid data' };

  try {
    await prisma.visitorQR.update({
      where: { qrCodeId: qrId },
      data: { visitorName: name },
    });

    // Using a more general revalidate if needed, or keeping it specific
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('updateVisitorName error:', error);
    return { success: false, message: 'Failed to update name' };
  }
}
