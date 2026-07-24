const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildQrVectors,
  checkEnvironmentNames,
  checkReasonCodes,
  releaseChecklist,
  scanTenantScope,
} = require('../operations');

test('QR vectors cover required positive and negative decisions without secrets', () => {
  const vectors = buildQrVectors('fixture-secret-at-least-32-characters');
  assert.deepEqual(vectors.map((item) => item.expected), [
    'ACCEPTED', 'TAMPERED', 'EXPIRED', 'REVOKED', 'ALREADY_USED',
    'WRONG_GATE', 'WRONG_PROJECT', 'WRONG_TENANT',
  ]);
  assert.doesNotMatch(JSON.stringify(vectors), /fixture-secret/);
});

test('reason-code checker rejects unknown codes', () => {
  assert.deepEqual(checkReasonCodes(['ACCEPTED', 'EXPIRED']), []);
  assert.match(checkReasonCodes(['MAYBE'])[0], /Unknown scan decision/);
});

test('environment checker reports names only', () => {
  const result = checkEnvironmentNames('client-dashboard', { DATABASE_URL: 'top-secret' });
  assert.ok(result.missing.includes('NEXTAUTH_SECRET'));
  assert.doesNotMatch(JSON.stringify(result), /top-secret/);
});

test('tenant static check flags obvious id-only Prisma lookups', () => {
  assert.equal(scanTenantScope("prisma.gate.findFirst({ where: { id } })").length, 1);
  assert.equal(scanTenantScope("prisma.gate.findFirst({ where: { id, organizationId } })").length, 0);
});

test('release checklist is local and includes rollback and monitoring', () => {
  const checklist = releaseChecklist('client-dashboard');
  assert.equal(checklist.app, 'client-dashboard');
  assert.ok(checklist.items.some((item) => item.includes('Rollback')));
  assert.ok(checklist.items.some((item) => item.includes('monitoring')));
});
