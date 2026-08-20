const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { classifyRuntimeProof, validateEvidence } = require('../runtime-proof');

test('classifies browser, device, API, database and access runtime proof', () => {
  const result = classifyRuntimeProof([
    'apps/client-dashboard/app/api/gates/route.ts',
    'apps/scanner-app/src/lib/scanner.ts',
    'packages/db/prisma/schema.prisma',
  ]);
  assert.equal(result.requiresRuntimeProof, true);
  assert.deepEqual(
    result.requirements.map((item) => item.id),
    ['database-runtime', 'api-runtime', 'mobile-device', 'access-decision']
  );
});

test('documentation-only changes do not invent runtime requirements', () => {
  const result = classifyRuntimeProof(['docs/workspace/WORKFLOW_V2.md']);
  assert.equal(result.requiresRuntimeProof, false);
  assert.deepEqual(result.requirements, []);
});

test('evidence must be complete and bound to the current head', () => {
  const plan = classifyRuntimeProof(['apps/scanner-app/src/lib/scanner.ts']);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-proof-'));
  const artifact = path.join(root, 'device.json');
  fs.writeFileSync(artifact, '{"result":"passed"}\n');
  const artifactSha256 = crypto
    .createHash('sha256')
    .update(fs.readFileSync(artifact))
    .digest('hex');
  const valid = validateEvidence(
    plan,
    {
      entries: plan.requirements.map((item) => ({
        requirement: item.id,
        artifact: 'device.json',
        artifactSha256,
        owner: 'qa-session-1',
        environment: 'ios-simulator',
        assertions: ['grant passed', 'denial passed'],
        capturedAt: '2026-08-20T10:00:00Z',
        commit: 'abc123',
      })),
    },
    'abc123',
    { root, now: '2026-08-20T11:00:00Z' }
  );
  assert.equal(valid.valid, true);
  assert.equal(
    validateEvidence(plan, { entries: [] }, 'abc123', { root }).valid,
    false
  );
});
