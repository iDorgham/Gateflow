import { redirect } from 'next/navigation';
import type { AccessTokenClaims } from './auth';
import { requireSessionIdentity } from './session-claims';

/**
 * RSC helper: require authenticated portal identity or redirect to login.
 * Never invents dev-* fallback IDs.
 */
export function requirePortalSession(claims: AccessTokenClaims | null): {
  userId: string;
  organizationId: string;
  claims: AccessTokenClaims;
} {
  try {
    const identity = requireSessionIdentity(claims);
    return {
      ...identity,
      claims: claims as AccessTokenClaims,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'UNAUTHORIZED' ||
        error.message === 'ORGANIZATION_MISSING')
    ) {
      redirect('/login');
    }
    throw error;
  }
}
