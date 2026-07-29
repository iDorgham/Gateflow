/**
 * Pure session identity helpers for Resident Portal.
 * No Next.js imports — unit-testable with node:test.
 */

export type OrgClaims = {
  sub?: unknown;
  orgId?: unknown;
  org?: unknown;
};

export function resolveOrganizationId(claims: OrgClaims): string | null {
  if (typeof claims.orgId === 'string' && claims.orgId.trim().length > 0) {
    return claims.orgId.trim();
  }
  if (typeof claims.org === 'string' && claims.org.trim().length > 0) {
    return claims.org.trim();
  }
  return null;
}

export function requireSessionIdentity(claims: OrgClaims | null): {
  userId: string;
  organizationId: string;
} {
  if (!claims || typeof claims.sub !== 'string' || claims.sub.length === 0) {
    throw new Error('UNAUTHORIZED');
  }
  const organizationId = resolveOrganizationId(claims);
  if (!organizationId) {
    throw new Error('ORGANIZATION_MISSING');
  }
  return { userId: claims.sub, organizationId };
}
