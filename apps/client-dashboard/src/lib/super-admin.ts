import { BUILT_IN_ROLES } from '@gate-access/types';
import type { AccessTokenClaims } from './auth';

export function isSuperAdmin(claims: AccessTokenClaims | null): boolean {
  return claims?.roleName === BUILT_IN_ROLES.SUPER_ADMIN;
}
