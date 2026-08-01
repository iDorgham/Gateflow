/**
 * Gate–account assignment helpers for scan enforcement.
 * When an org has at least one assignment, operators may only scan at gates they are assigned to.
 */

import { prisma } from '@gate-access/db';
import type { AccessTokenClaims } from './auth';

/** True if the org has any active (non–soft-deleted) gate assignments. */
export async function orgHasAssignments(orgId: string): Promise<boolean> {
  const count = await prisma.gateAssignment.count({
    where: { organizationId: orgId, deletedAt: null },
  });
  return count > 0;
}

/** Set of gate IDs the user is assigned to in the org (active assignments only). */
export async function getUserAssignedGateIds(
  userId: string,
  orgId: string
): Promise<Set<string>> {
  const list = await prisma.gateAssignment.findMany({
    where: { userId, organizationId: orgId, deletedAt: null },
    select: { gateId: true },
  });
  return new Set(list.map((a) => a.gateId));
}

type AssignmentWindow = {
  startTime: Date | null;
  endTime: Date | null;
  shiftStart: string | null;
  shiftEnd: string | null;
};

/** True if `now` falls within the assignment's date range and time-of-day window (if set). */
function isAssignmentActiveAt(
  assignment: AssignmentWindow,
  now: Date
): boolean {
  if (assignment.startTime && now < assignment.startTime) return false;
  if (assignment.endTime && now > assignment.endTime) return false;

  if (assignment.shiftStart && assignment.shiftEnd) {
    const start = parseHHMM(assignment.shiftStart);
    const end = parseHHMM(assignment.shiftEnd);
    if (start != null && end != null) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const inWindow =
        start <= end
          ? nowMinutes >= start && nowMinutes <= end
          : // Overnight window (e.g. 22:00–06:00) wraps past midnight.
            nowMinutes >= start || nowMinutes <= end;
      if (!inWindow) return false;
    }
  }

  return true;
}

function parseHHMM(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * If the org uses assignments, ensures the current user is assigned to the given gate
 * and that a matching assignment's date range / shift-time window is active now.
 * Returns an error message (or null if allowed).
 * Use after auth and gate resolution; callers should return 403 with this message when non-null.
 */
export async function checkGateAssignment(
  claims: AccessTokenClaims,
  gateId: string
): Promise<string | null> {
  const orgId = claims.orgId;
  if (!orgId) return null; // No org → no assignment enforcement (e.g. platform admin)

  const hasAny = await orgHasAssignments(orgId);
  if (!hasAny) return null;

  const assignments = await prisma.gateAssignment.findMany({
    where: {
      userId: claims.sub,
      organizationId: orgId,
      gateId,
      deletedAt: null,
    },
    select: {
      startTime: true,
      endTime: true,
      shiftStart: true,
      shiftEnd: true,
    },
  });
  if (assignments.length === 0) {
    return 'You are not allowed to scan at this gate.';
  }

  const now = new Date();
  if (!assignments.some((a) => isAssignmentActiveAt(a, now))) {
    return 'Your gate assignment is not active at this time.';
  }

  return null;
}
