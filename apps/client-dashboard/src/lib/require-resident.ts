import { getSessionClaims } from '@/lib/auth-cookies';
import type { AccessTokenClaims } from '@/lib/auth';

export type ResidentAuthResult =
  | { success: true; claims: AccessTokenClaims & { sub: string } }
  | { success: false; status: number; message: string };

/**
 * Verifies the request has a valid resident session.
 *
 * Security: resident routes rely on ownership-based isolation
 * (querying by userId = claims.sub) rather than role-name checking,
 * since roles are custom-named entities in this system.
 *
 * Returns the full claims so routes can use sub, orgId, etc.
 */
export async function requireResident(): Promise<ResidentAuthResult> {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return { success: false, status: 401, message: 'Unauthorized' };
  }
  return { success: true, claims: claims as AccessTokenClaims & { sub: string } };
}
