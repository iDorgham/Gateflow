import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import {
  resolveOrganizationId,
  requireSessionIdentity,
} from './session-claims.ts';
import { getJwtSecretKey } from './jwt-secret.ts';

describe('resolveOrganizationId', () => {
  it('prefers orgId over org', () => {
    assert.equal(
      resolveOrganizationId({ orgId: 'org-a', org: 'org-b' }),
      'org-a'
    );
  });

  it('falls back to org when orgId missing', () => {
    assert.equal(resolveOrganizationId({ org: 'org-b' }), 'org-b');
  });

  it('returns null when neither claim is a non-empty string', () => {
    assert.equal(resolveOrganizationId({}), null);
    assert.equal(resolveOrganizationId({ orgId: null, org: '' }), null);
  });
});

describe('requireSessionIdentity', () => {
  it('returns userId and organizationId for valid claims', () => {
    assert.deepEqual(
      requireSessionIdentity({
        sub: 'user-1',
        orgId: 'org-1',
      }),
      { userId: 'user-1', organizationId: 'org-1' }
    );
  });

  it('rejects missing sub', () => {
    assert.throws(
      () => requireSessionIdentity({ orgId: 'org-1' }),
      /UNAUTHORIZED/
    );
    assert.throws(() => requireSessionIdentity(null), /UNAUTHORIZED/);
  });

  it('rejects missing organization', () => {
    assert.throws(
      () => requireSessionIdentity({ sub: 'user-1' }),
      /ORGANIZATION_MISSING/
    );
  });
});

describe('getJwtSecretKey', () => {
  const prevNextAuth = process.env.NEXTAUTH_SECRET;
  const prevJwt = process.env.JWT_SECRET;

  beforeEach(() => {
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.JWT_SECRET;
  });

  afterEach(() => {
    if (prevNextAuth === undefined) delete process.env.NEXTAUTH_SECRET;
    else process.env.NEXTAUTH_SECRET = prevNextAuth;
    if (prevJwt === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevJwt;
  });

  it('fails closed when no secret is configured', () => {
    assert.throws(() => getJwtSecretKey(), /NEXTAUTH_SECRET|JWT_SECRET/);
  });

  it('returns encoded secret when configured', () => {
    process.env.JWT_SECRET = 'test-secret-value';
    const key = getJwtSecretKey();
    assert.ok(key instanceof Uint8Array);
    assert.equal(new TextDecoder().decode(key), 'test-secret-value');
  });
});
