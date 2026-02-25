import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import * as argon2 from 'argon2';
import { randomBytes, randomUUID } from 'crypto';
import { UserRole } from '@gate-access/types';

// ─── Configuration ────────────────────────────────────────────────────────────

const _jwtSecret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;

if (!_jwtSecret || _jwtSecret.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[auth] NEXTAUTH_SECRET is missing or shorter than 32 characters. ' +
      'Set NEXTAUTH_SECRET to a random 64-char string before deploying.'
    );
  } else {
    console.warn('[auth] NEXTAUTH_SECRET not set — using insecure fallback. Set it in .env.local');
  }
}

const JWT_SECRET = new TextEncoder().encode(_jwtSecret ?? 'dev-insecure-fallback-change-me');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

// ─── JWT Claims ───────────────────────────────────────────────────────────────

export interface AccessTokenClaims extends JWTPayload {
  sub: string;         // userId
  email: string;
  role: UserRole;
  orgId: string | null; // organizationId
}

// ─── Access Token ─────────────────────────────────────────────────────────────

export async function signAccessToken(
  userId: string,
  email: string,
  orgId: string | null,
  role: UserRole
): Promise<string> {
  return new SignJWT({
    email,
    role,
    orgId,
  } satisfies Omit<AccessTokenClaims, 'sub' | 'iat' | 'exp'>)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuer('gateflow')
    .setAudience('gateflow-api')
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: 'gateflow',
    audience: 'gateflow-api',
  });

  // Validate required claims
  if (!payload.sub || !payload.email || !payload.role) {
    throw new Error('Invalid token claims: missing required fields');
  }

  return payload as AccessTokenClaims;
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

// ─── Password Hashing (Argon2id per PRD §7) ──────────────────────────────────

const ARGON2_OPTIONS: argon2.Options & { raw: false } = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MiB
  timeCost: 3,         // 3 iterations
  parallelism: 4,
  raw: false,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}

// ─── Exports for testing ──────────────────────────────────────────────────────

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_DAYS };
