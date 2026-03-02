'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, UnitType } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

type Result<T = unknown> = { success: boolean; data?: T; error?: string };

export async function updateResidentDefaults(data: {
  maskResidentNameOnLandingPage?: boolean;
  showUnitOnLandingPage?: boolean;
}): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    await prisma.organization.update({
      where: { id: claims.orgId },
      data: {
        maskResidentNameOnLandingPage: data.maskResidentNameOnLandingPage,
        showUnitOnLandingPage: data.showUnitOnLandingPage,
      },
    });

    revalidatePath('/dashboard/settings/residents');
    return { success: true };
  } catch (error) {
    console.error('updateResidentDefaults error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function upsertResidentLimit(
  unitType: UnitType,
  monthlyQuota: number,
  canCreateOpenQR: boolean = false
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    await prisma.residentLimit.upsert({
      where: {
        organizationId_unitType: {
          organizationId: claims.orgId,
          unitType,
        },
      },
      update: {
        monthlyQuota,
        canCreateOpenQR,
      },
      create: {
        organizationId: claims.orgId,
        unitType,
        monthlyQuota,
        canCreateOpenQR,
      },
    });

    revalidatePath('/dashboard/settings/residents');
    return { success: true };
  } catch (error) {
    console.error('upsertResidentLimit error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function bulkUpdateUnitQuotas(unitIds: string[], qrQuota: number | null): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    await prisma.unit.updateMany({
      where: {
        id: { in: unitIds },
        organizationId: claims.orgId,
      },
      data: { qrQuota },
    });

    revalidatePath('/dashboard/settings/residents');
    return { success: true };
  } catch (error) {
    console.error('bulkUpdateUnitQuotas error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function getUnitsWithStats(search?: string) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return [];

    const units = await prisma.unit.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        _count: {
          select: {
            visitorQRs: {
              where: {
                qrCode: {
                  deletedAt: null,
                  // We might need to filter by ACTIVE status if we want "Active only"
                  // For now, let's count all non-deleted ones as "issued"
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' },
    });

    return units;
  } catch (error) {
    console.error('getUnitsWithStats error:', error);
    return [];
  }
}

export async function getResidentLimits() {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return [];

    return await prisma.residentLimit.findMany({
      where: { organizationId: claims.orgId },
    });
  } catch (error) {
    console.error('getResidentLimits error:', error);
    return [];
  }
}
