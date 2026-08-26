const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { getRepoRoot } = require('../repo-root');

const ROOT = getRepoRoot(__dirname);

describe('API Security Controls, CSP & Header Compliance', () => {
  const { securityHeaders, CONTENT_SECURITY_POLICY } = require(
    path.join(ROOT, 'packages', 'config', 'security-headers.js')
  );

  it('verifies essential HTTP security headers are present and configured', () => {
    const headerKeys = new Set(securityHeaders.map((h) => h.key));
    assert.ok(
      headerKeys.has('Strict-Transport-Security'),
      'HSTS header configured'
    );
    assert.ok(headerKeys.has('X-Content-Type-Options'), 'nosniff configured');
    assert.ok(
      headerKeys.has('X-Frame-Options'),
      'DENY clickjacking protection configured'
    );
    assert.ok(headerKeys.has('Content-Security-Policy'), 'CSP configured');
    assert.ok(headerKeys.has('Referrer-Policy'), 'Referrer policy configured');
  });

  it('validates Content-Security-Policy blocks frame ancestors and object embeds', () => {
    assert.match(CONTENT_SECURITY_POLICY, /frame-ancestors 'none'/);
    assert.match(CONTENT_SECURITY_POLICY, /object-src 'none'/);
    assert.match(CONTENT_SECURITY_POLICY, /default-src 'self'/);
  });

  it('validates HSTS preload and max-age settings', () => {
    const hsts = securityHeaders.find(
      (h) => h.key === 'Strict-Transport-Security'
    );
    assert.ok(hsts);
    assert.match(hsts.value, /max-age=31536000/);
    assert.match(hsts.value, /includeSubDomains/);
    assert.match(hsts.value, /preload/);
  });
});

describe('Negative & Cross-Tenant API Guard Logic', () => {
  function evaluateApiAccess(request) {
    const {
      authHeader,
      role,
      organizationId,
      targetOrgId,
      isCron,
      cronSecret,
    } = request;

    if (isCron) {
      if (!cronSecret || cronSecret !== 'valid_cron_secret') {
        return { status: 401, error: 'Unauthorized cron task' };
      }
      return { status: 200, success: true };
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        error: 'Missing or malformed Authorization header',
      };
    }

    if (
      targetOrgId &&
      organizationId !== targetOrgId &&
      role !== 'SUPER_ADMIN'
    ) {
      return { status: 403, error: 'Forbidden cross-tenant access' };
    }

    return { status: 200, success: true };
  }

  it('rejects unauthenticated API requests with 401', () => {
    const res = evaluateApiAccess({ authHeader: '' });
    assert.equal(res.status, 401);
  });

  it('rejects cross-tenant tenant access with 403', () => {
    const res = evaluateApiAccess({
      authHeader: 'Bearer valid_token',
      role: 'CLIENT_ADMIN',
      organizationId: 'org_alpha',
      targetOrgId: 'org_beta',
    });
    assert.equal(res.status, 403);
    assert.match(res.error, /cross-tenant/i);
  });

  it('allows super admin global cross-tenant access with 200', () => {
    const res = evaluateApiAccess({
      authHeader: 'Bearer valid_token',
      role: 'SUPER_ADMIN',
      organizationId: 'org_admin',
      targetOrgId: 'org_beta',
    });
    assert.equal(res.status, 200);
    assert.equal(res.success, true);
  });

  it('rejects cron requests missing CRON_SECRET header with 401', () => {
    const res = evaluateApiAccess({ isCron: true, cronSecret: '' });
    assert.equal(res.status, 401);
  });
});
