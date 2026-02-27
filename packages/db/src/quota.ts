import { prisma } from './client';
import { UnitType } from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface QuotaCheckResult {
  allowed: boolean;
  remaining: number;
  used: number;
  quota: number;
  resetDate: Date;
}

export function getDefaultMonthlyQuota(unitType: UnitType): number {
  const quotas: Record<UnitType, number> = {
    STUDIO: 3,
    ONE_BR: 5,
    TWO_BR: 10,
    THREE_BR: 15,
    FOUR_BR: 20,
    VILLA: 30,
    PENTHOUSE: 25,
    COMMERCIAL: 50,
  };
  return quotas[unitType] ?? 5;
}

export async function checkAndConsumeQuota(unitId: string): Promise<QuotaCheckResult> {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { 
      organization: { 
        include: { 
          residentLimits: true 
        } 
      } 
    },
  });

  if (!unit) {
    throw new Error(`Unit with ID ${unitId} not found`);
  }

  const organizationLimit = unit.organization.residentLimits.find(
    (r) => r.unitType === unit.type
  );

  const quota = unit.qrQuota ?? organizationLimit?.monthlyQuota ?? getDefaultMonthlyQuota(unit.type);

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const used = await prisma.visitorQR.count({
    where: {
      unitId,
      createdAt: { gte: start, lte: end },
      qrCode: { 
        isActive: true,
        deletedAt: null
      },
    },
  });

  return {
    allowed: used < quota,
    remaining: Math.max(0, quota - used),
    used,
    quota,
    resetDate: end,
  };
}

export async function canCreateOpenQR(unitId: string): Promise<boolean> {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { 
      organization: { 
        include: { 
          residentLimits: true 
        } 
      } 
    },
  });

  if (!unit) return false;

  const organizationLimit = unit.organization.residentLimits.find(
    (r) => r.unitType === unit.type
  );

  return organizationLimit?.canCreateOpenQR ?? false;
}
