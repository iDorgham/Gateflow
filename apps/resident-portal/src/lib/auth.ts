import { jwtVerify, type JWTPayload } from 'jose';
import { Permission } from '@gate-access/types';
import { getJwtSecretKey } from './jwt-secret';

export { getJwtSecretKey } from './jwt-secret';

export interface AccessTokenClaims extends JWTPayload {
  sub: string; // userId
  email: string;
  roleId: string;
  roleName: string;
  permissions: Record<Permission, boolean>;
  orgId: string | null; // organizationId
  /** Legacy claim some issuers may still emit */
  org?: string | null;
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, getJwtSecretKey(), {
    issuer: 'gateflow',
    audience: 'gateflow-api',
  });

  if (
    !payload.sub ||
    !payload.email ||
    !payload.roleId ||
    !payload.permissions
  ) {
    throw new Error('Invalid token claims: missing required fields');
  }

  return payload as AccessTokenClaims;
}
