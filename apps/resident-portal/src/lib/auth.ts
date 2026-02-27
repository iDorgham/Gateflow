import { jwtVerify, type JWTPayload } from 'jose';
import { Permission } from '@gate-access/types';

const _jwtSecret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(_jwtSecret || 'dev-insecure-fallback-change-me');

export interface AccessTokenClaims extends JWTPayload {
  sub: string;         // userId
  email: string;
  roleId: string;
  roleName: string;
  permissions: Record<Permission, boolean>;
  orgId: string | null; // organizationId
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: 'gateflow',
    audience: 'gateflow-api',
  });

  if (!payload.sub || !payload.email || !payload.roleId || !payload.permissions) {
    throw new Error('Invalid token claims: missing required fields');
  }

  return payload as AccessTokenClaims;
}
