import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { randomBytes } from 'crypto';
import { Permission } from '@gate-access/types';
import { hash, verify } from '@node-rs/argon2';

// ─── Configuration ────────────────────────────────────────────────────────────

let _cachedJwtSecret: Uint8Array | null = null;

function getJwtSecret(): Uint8Array {
  if (_cachedJwtSecret) return _cachedJwtSecret;

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[auth] NEXTAUTH_SECRET is missing or shorter than 32 characters. ' +
          'Set NEXTAUTH_SECRET to a random 64-char string before deploying.'
      );
    }
    console.warn(
      '[auth] NEXTAUTH_SECRET not set — using insecure fallback. Set it in .env.local'
    );
  }

  _cachedJwtSecret = new TextEncoder().encode(
    secret ?? 'dev-insecure-fallback-change-me'
  );
  return _cachedJwtSecret;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

// ─── JWT Claims ───────────────────────────────────────────────────────────────

export interface AccessTokenClaims extends JWTPayload {
  sub: string; // userId
  email: string;
  roleId: string;
  roleName: string;
  permissions: Record<Permission, boolean>;
  orgId: string | null; // organizationId
}

// ─── Access Token ─────────────────────────────────────────────────────────────

export async function signAccessToken(
  userId: string,
  email: string,
  orgId: string | null,
  role: { id: string; name: string; permissions: Record<string, boolean> }
): Promise<string> {
  return new SignJWT({
    email,
    roleId: role.id,
    roleName: role.name,
    permissions: role.permissions as Record<Permission, boolean>,
    orgId,
  } satisfies Omit<AccessTokenClaims, 'sub' | 'iat' | 'exp'>)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuer('gateflow')
    .setAudience('gateflow-api')
    .sign(getJwtSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    issuer: 'gateflow',
    audience: 'gateflow-api',
  });

  // Validate required claims
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

/**
 * Utility to check if a user has a specific permission.
 */
export function hasPermission(
  claims: AccessTokenClaims | null,
  permission: Permission
): boolean {
  if (!claims || !claims.permissions) return false;
  return !!claims.permissions[permission];
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

// ─── Password Hashing (Argon2id) ───────────────────────────────────────────────

/**
 * Hash a password using Argon2id with recommended parameters.
 * @node-rs/argon2 uses safe defaults and native performance.
 */
export async function hashPassword(password: string): Promise<string> {
  // Use default options: Argon2id, 1 iteration, 64MB memory, 4 parallelism
  return await hash(password);
}

/**
 * Verify a password against a hash.
 */
export async function verifyPassword(
  hashString: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(hashString, password);
  } catch (err) {
    console.error('[auth] Password verification error:', err);
    return false;
  }
}

// ─── Exports for testing ──────────────────────────────────────────────────────

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_DAYS };
