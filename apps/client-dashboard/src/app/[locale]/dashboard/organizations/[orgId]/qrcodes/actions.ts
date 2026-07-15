'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

type Result = { success: true } | { success: false; error: string };

export async function toggleQRActive(qrId: string, active: boolean): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      console.error(`toggleQRActive: Unauthorized. sub: ${claims?.sub}`);
      return { success: false, error: 'Unauthorized.' };
    }

    const qr = await prisma.qRCode.findFirst({
      where: { id: qrId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!qr) {
      console.error(`toggleQRActive: QR not found. id: ${qrId}, org: ${claims.orgId}`);
      return { success: false, error: 'QR code not found.' };
    }

    await prisma.qRCode.update({ where: { id: qrId }, data: { isActive: active } });
    console.log(`toggleQRActive: Success - ${active ? 'Activated' : 'Deactivated'} ${qrId}`);
    return { success: true };
  } catch (error) {
    console.error('toggleQRActive: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteQR(qrId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      console.error(`deleteQR: Unauthorized. sub: ${claims?.sub}`);
      return { success: false, error: 'Unauthorized.' };
    }

    const qr = await prisma.qRCode.findFirst({
      where: { id: qrId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!qr) {
      console.error(`deleteQR: QR not found. id: ${qrId}, org: ${claims.orgId}`);
      return { success: false, error: 'QR code not found.' };
    }

    await prisma.qRCode.update({ where: { id: qrId }, data: { deletedAt: new Date() } });
    console.log(`deleteQR: Success - Deleted ${qrId}`);
    return { success: true };
  } catch (error) {
    console.error('deleteQR: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
