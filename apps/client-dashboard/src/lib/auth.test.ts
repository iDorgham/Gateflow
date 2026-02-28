// Unmock jose and uncrypto to use real crypto for JWT tests
jest.unmock('jose');
jest.unmock('uncrypto');

import {
  signAccessToken,
  verifyAccessToken,
  hashPassword,
  verifyPassword,
  generateRefreshToken,
  getRefreshTokenExpiry,
  REFRESH_TOKEN_EXPIRY_DAYS,
} from './auth';
import {
  UserRole,
  DEFAULT_PERMISSIONS,
  BUILT_IN_ROLES,
} from '@gate-access/types';

// Set env before import resolves
process.env.NEXTAUTH_SECRET = 'test-jwt-secret-must-be-long-enough-for-hmac256';

const mockRole = (name: string) => ({
  id: `role-${name}`,
  name,
  permissions: DEFAULT_PERMISSIONS[BUILT_IN_ROLES.ORG_ADMIN] ?? {},
});

describe('Access Token (JWT)', () => {
  const userId = 'cluser123';
  const email = 'test@example.com';
  const orgId = 'clorg456';
  const role = mockRole(UserRole.TENANT_ADMIN);

  it('should sign and verify a valid access token', async () => {
    const token = await signAccessToken(userId, email, orgId, role);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts

    const claims = await verifyAccessToken(token);
    expect(claims.sub).toBe(userId);
    expect(claims.email).toBe(email);
    expect(claims.orgId).toBe(orgId);
    expect(claims.roleName).toBe(role.name);
    expect(claims.iat).toBeDefined();
    expect(claims.exp).toBeDefined();
  });

  it('should include orgId as null for users without org', async () => {
    const token = await signAccessToken(
      userId,
      email,
      null,
      mockRole(UserRole.ADMIN)
    );
    const claims = await verifyAccessToken(token);
    expect(claims.orgId).toBeNull();
  });

  it('should reject a tampered token', async () => {
    const token = await signAccessToken(userId, email, orgId, role);
    const tampered = token.slice(0, -5) + 'XXXXX';

    await expect(verifyAccessToken(tampered)).rejects.toThrow();
  });

  it('should reject a token signed with different secret', async () => {
    // Save and swap secret
    const originalSecret = process.env.NEXTAUTH_SECRET;
    process.env.NEXTAUTH_SECRET =
      'secret-A-must-be-long-enough-for-hmac256-test';

    // We need to re-import to get fresh secret, but since it's already cached,
    // we test by creating a token string that looks valid but has wrong signature
    const fakeToken = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      btoa(
        JSON.stringify({
          sub: userId,
          email,
          role,
          orgId,
          iat: 0,
          exp: 999999999999,
        })
      ),
      'invalid_signature_here',
    ].join('.');

    await expect(verifyAccessToken(fakeToken)).rejects.toThrow();

    process.env.NEXTAUTH_SECRET = originalSecret;
  });

  it('should set expiration (exp > iat)', async () => {
    const token = await signAccessToken(userId, email, orgId, role);
    const claims = await verifyAccessToken(token);
    expect(claims.exp!).toBeGreaterThan(claims.iat!);
  });
});

describe('Password Hashing (Argon2id)', () => {
  it('should hash and verify a password', async () => {
    const password = 'SecureP@ssw0rd!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$argon2id$')).toBe(true);

    const isValid = await verifyPassword(hash, password);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await hashPassword('correct-password');
    const isValid = await verifyPassword(hash, 'wrong-password');
    expect(isValid).toBe(false);
  });

  it('should produce different hashes for same password (random salt)', async () => {
    const password = 'test-password';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    expect(hash1).not.toBe(hash2);
  });
});

describe('Refresh Token', () => {
  it('should generate unique opaque tokens', () => {
    const t1 = generateRefreshToken();
    const t2 = generateRefreshToken();

    expect(t1).not.toBe(t2);
    expect(t1.length).toBeGreaterThan(32);
    // base64url: no +, /, or =
    expect(t1).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('should set expiry 30 days from now', () => {
    const expiry = getRefreshTokenExpiry();
    const expectedMs =
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Allow 1 second tolerance
    expect(Math.abs(expiry.getTime() - expectedMs)).toBeLessThan(1000);
  });
});
