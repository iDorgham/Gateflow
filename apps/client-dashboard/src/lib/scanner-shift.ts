/**
 * Helpers for scanner guard ShiftLog windows (clock-in / clock-out).
 * All queries are organization-scoped. ShiftLog has no deletedAt field.
 */

import { Prisma, prisma, withSerializableRetry } from '@gate-access/db';

export type ActiveShift = {
  id: string;
  gateId: string;
  guardId: string;
  organizationId: string;
  startTime: Date;
  endTime: Date | null;
};

export type SerializedShift = {
  id: string;
  gateId: string;
  guardId: string;
  organizationId: string;
  startTime: string;
  endTime: string | null;
};

export function serializeShift(shift: ActiveShift): SerializedShift {
  return {
    id: shift.id,
    gateId: shift.gateId,
    guardId: shift.guardId,
    organizationId: shift.organizationId,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime?.toISOString() ?? null,
  };
}

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
      gate: {
        organizationId: params.organizationId,
        isActive: true,
        deletedAt: null,
      },
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
      gate: {
        organizationId: params.organizationId,
        isActive: true,
        deletedAt: null,
      },
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

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Lock the open shift row for this guard+gate (FOR UPDATE) so clock-out waits
 * for in-flight validate transactions (and vice versa under row locking).
 */
export async function lockOpenShiftForGate(
  tx: TxClient,
  params: {
    organizationId: string;
    guardId: string;
    gateId: string;
  }
): Promise<ActiveShift | null> {
  const rows = await tx.$queryRaw<ActiveShift[]>(Prisma.sql`
    SELECT
      "ShiftLog".id,
      "ShiftLog"."gateId",
      "ShiftLog"."guardId",
      "ShiftLog"."organizationId",
      "ShiftLog"."startTime",
      "ShiftLog"."endTime"
    FROM "ShiftLog"
    INNER JOIN "Gate" ON "Gate".id = "ShiftLog"."gateId"
    WHERE "ShiftLog"."organizationId" = ${params.organizationId}
      AND "ShiftLog"."guardId" = ${params.guardId}
      AND "ShiftLog"."gateId" = ${params.gateId}
      AND "ShiftLog"."endTime" IS NULL
      AND "Gate"."organizationId" = ${params.organizationId}
      AND "Gate"."isActive" = TRUE
      AND "Gate"."deletedAt" IS NULL
    ORDER BY "ShiftLog"."startTime" DESC
    LIMIT 1
    FOR UPDATE
  `);
  return rows[0] ?? null;
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
  return withSerializableRetry<{ shift: ActiveShift; reused: boolean }>(
    prisma,
    async (tx) => {
      const gate = await tx.gate.findFirst({
        where: {
          id: params.gateId,
          organizationId: params.organizationId,
          isActive: true,
          deletedAt: null,
        },
        select: { id: true },
      });
      if (!gate) {
        throw new Error('Cannot start a shift at an inactive or deleted gate');
      }

      // Coordinate reuse with scan validation and clock-out, which lock the
      // same open row before making their decision.
      const existingAtGate = await lockOpenShiftForGate(tx, params);
      if (existingAtGate) {
        // Keep single-active-shift: close any other open rows for this guard.
        await tx.shiftLog.updateMany({
          where: {
            organizationId: params.organizationId,
            guardId: params.guardId,
            endTime: null,
            NOT: { id: existingAtGate.id },
          },
          data: { endTime: new Date() },
        });
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
    }
  );
}
