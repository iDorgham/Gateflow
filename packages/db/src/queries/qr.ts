import { prisma } from '../client';
import { QRCodeType } from '@prisma/client';
import { nanoid } from 'nanoid';

export interface CreateExpressInviteParams {
  organizationId: string;
  unitId: string;
  projectId?: string;
  expiresInHours?: number;
}

/**
 * Creates a "Silent" QRCode and its corresponding QrShortLink in an atomic transaction.
 * This link is "Anonymous" initially (guest details will be captured on the landing page).
 */
export async function createExpressInviteTransaction({
  organizationId,
  unitId,
  projectId,
  expiresInHours = 24,
}: CreateExpressInviteParams) {
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  const code = `EXP-${nanoid(10).toUpperCase()}`;
  const shortId = nanoid(8);

  return await prisma.$transaction(async (tx) => {
    // 1. Create the base QR Code (Status: Pending details)
    const qrCode = await tx.qRCode.create({
      data: {
        code,
        type: QRCodeType.VISITOR,
        organizationId,
        projectId,
        expiresAt,
        maxUses: 1, // Traditional guest pass
        isActive: true,
        // Metadata is filled by the guest later
      },
    });

    // 2. Wrap it with the VisitorQR metadata to link to the unit
    await tx.visitorQR.create({
      data: {
        qrCodeId: qrCode.id,
        unitId,
        isOpenQR: false,
        createdBy: 'SYSTEM_EXPRESS', // Resident via Express API
      },
    });

    // 3. Create the Short Link
    const shortLink = await tx.qrShortLink.create({
      data: {
        shortId,
        qrId: qrCode.id,
        organizationId,
        projectId,
        expiresAt,
        fullPayload: JSON.stringify({
          qrId: qrCode.id,
          orgId: organizationId,
          type: 'express_invite',
        }),
      },
    });

    return { qrCode, shortLink };
  });
}
