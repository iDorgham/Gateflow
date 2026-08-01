/**
 * Helpers for scanner guard ShiftLog windows (clock-in / clock-out).
 * All queries are organization-scoped. ShiftLog has no deletedAt field.
 */

import { prisma } from '@gate-access/db';

export type ActiveShift = {
  id: string;
  gateId: string;
  guardId: string;
  organizationId: string;
  startTime: Date;
  endTime: Date | null;
};

/** Open shift for a guard at a gate within an org (endTime is null). */
export async function findOpenShiftForGate(params: {
  organizationId: string;
  guardId: string;
  gateId: string;
}): Promise<ActiveShift | null> {
  return prisma.shiftLog.findFirst({
    where: {
      organizationId: params.organizationId,
      guardId: params.guardId,
      gateId: params.gateId,
      endTime: null,
    },
    orderBy: { startTime: 'desc' },
  });
}

/** Any open shift for a guard in the org (any gate). */
export async function findOpenShiftForGuard(params: {
  organizationId: string;
  guardId: string;
}): Promise<ActiveShift | null> {
  return prisma.shiftLog.findFirst({
    where: {
      organizationId: params.organizationId,
      guardId: params.guardId,
      endTime: null,
    },
    orderBy: { startTime: 'desc' },
  });
}

export async function closeShift(params: {
  organizationId: string;
  guardId: string;
  shiftLogId: string;
  endTime?: Date;
}): Promise<ActiveShift | null> {
  const existing = await prisma.shiftLog.findFirst({
    where: {
      id: params.shiftLogId,
      organizationId: params.organizationId,
      guardId: params.guardId,
      endTime: null,
    },
  });
  if (!existing) return null;

  return prisma.shiftLog.update({
    where: { id: existing.id },
    data: { endTime: params.endTime ?? new Date() },
  });
}
