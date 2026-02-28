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

/**
 * If the org uses assignments, ensures the current user is assigned to the given gate.
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

  const assigned = await getUserAssignedGateIds(claims.sub, orgId);
  if (assigned.has(gateId)) return null;

  return 'You are not allowed to scan at this gate.';
}
