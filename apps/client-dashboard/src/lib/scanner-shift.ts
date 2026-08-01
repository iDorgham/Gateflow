/**
 * Helpers for scanner guard ShiftLog windows (clock-in / clock-out).
 * All queries are organization-scoped. ShiftLog has no deletedAt field.
 */

import { Prisma, prisma } from '@gate-access/db';

export type ActiveShift = {
  id: string;
  gateId: string;
  guardId: string;
  organizationId: string;
  startTime: Date;
  endTime: Date | null;
};

type ShiftClient = Prisma.TransactionClient | typeof prisma;

/** Open shift for a guard at a gate within an org (endTime is null). */
export async function findOpenShiftForGate(
  params: {
    organizationId: string;
    guardId: string;
    gateId: string;
  },
  client: ShiftClient = prisma
): Promise<ActiveShift | null> {
  return client.shiftLog.findFirst({
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
export async function findOpenShiftForGuard(
  params: {
    organizationId: string;
    guardId: string;
  },
  client: ShiftClient = prisma
): Promise<ActiveShift | null> {
  return client.shiftLog.findFirst({
    where: {
      organizationId: params.organizationId,
      guardId: params.guardId,
      endTime: null,
    },
    orderBy: { startTime: 'desc' },
  });
}

/**
 * Compare-and-set clock-out: only closes when the row is still open and owned.
 * Returns null when no row matched (already ended / wrong owner / missing).
 */
export async function closeShift(params: {
  organizationId: string;
  guardId: string;
  shiftLogId: string;
  endTime?: Date;
}): Promise<ActiveShift | null> {
  const endTime = params.endTime ?? new Date();
  const result = await prisma.shiftLog.updateMany({
    where: {
      id: params.shiftLogId,
      organizationId: params.organizationId,
      guardId: params.guardId,
      endTime: null,
    },
    data: { endTime },
  });
  if (result.count === 0) return null;

  return prisma.shiftLog.findFirst({
    where: {
      id: params.shiftLogId,
      organizationId: params.organizationId,
      guardId: params.guardId,
    },
  });
}

function isRetryableTxnError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  // P2034 = write conflict / deadlock; serialization failures surface similarly.
  return error.code === 'P2034';
}

/**
 * Start (or reuse) an open shift for a guard at a gate.
 * Serialized transaction: closes other open shifts, then creates / reuses.
 */
export async function startOrReuseShift(params: {
  organizationId: string;
  guardId: string;
  gateId: string;
}): Promise<{ shift: ActiveShift; reused: boolean }> {
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const existingAtGate = await findOpenShiftForGate(params, tx);
          if (existingAtGate) {
            return { shift: existingAtGate, reused: true };
          }

          // Close any open shift at another gate (CAS: only rows with endTime null).
          await tx.shiftLog.updateMany({
            where: {
              organizationId: params.organizationId,
              guardId: params.guardId,
              endTime: null,
            },
            data: { endTime: new Date() },
          });

          const created = await tx.shiftLog.create({
            data: {
              organizationId: params.organizationId,
              guardId: params.guardId,
              gateId: params.gateId,
              startTime: new Date(),
            },
          });

          return { shift: created, reused: false };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error) {
      lastError = error;
      if (!isRetryableTxnError(error) || attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw lastError;
}
