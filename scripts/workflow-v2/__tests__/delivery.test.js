const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildDraftPrRequest,
  buildMergePlan,
  buildVersionPlan,
  inspectPrFixture,
  queuePrRepair,
} = require('../delivery');
const { approveMerge, createLoop } = require('../loop-lib');

function draftLoop() {
  return createLoop({
    runId: 'delivery-run',
    profile: 'phase',
    delivery: 'draft-pr',
    target: { type: 'plan', id: 'plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'base-sha',
    branch: 'codex/loop-client-dashboard-delivery-run',
    ownedFiles: ['apps/client-dashboard/src/page.tsx'],
  });
}

test('draft PR request is explicit, focused, and targets detected base', () => {
  const request = buildDraftPrRequest(draftLoop(), {
    baseBranch: 'trunk',
    headSha: 'head-sha',
    title: 'feat(client-dashboard): complete pilot phase',
    body: 'Outcome\n\nTests\n\nRisks\n\nRollback',
  });
  assert.equal(request.draft, true);
  assert.equal(request.base, 'trunk');
  assert.equal(request.head, 'codex/loop-client-dashboard-delivery-run');
  assert.equal(request.allowMaintainerEdits, false);
});

test('mocked PR inspection distinguishes ready, needs-fix, and unrelated failures', () => {
  const result = inspectPrFixture({
    headSha: 'head-sha',
    checks: [
      { name: 'lint', required: true, status: 'success' },
      { name: 'preview', required: false, status: 'failure', classification: 'unrelated' },
    ],
    reviews: [{ state: 'approved' }],
    findings: [],
  });
  assert.equal(result.verdict, 'ready');
  assert.deepEqual(result.unrelatedFailures, ['preview']);
});

test('PR repair rounds are bounded by the loop repair limit', () => {
  let loop = draftLoop();
  loop = queuePrRepair(loop, 'ci:lint', { result: 'failed' });
  loop = queuePrRepair(loop, 'ci:lint', { result: 'failed' });
  loop = queuePrRepair(loop, 'ci:lint', { result: 'failed' });
  assert.throws(() => queuePrRepair(loop, 'ci:lint', {}), /repair limit/);
});

test('merge plan requires approval for the current PR head', () => {
  const approved = approveMerge(draftLoop(), { prNumber: 12, headSha: 'head-sha' });
  const plan = buildMergePlan(approved, {
    prNumber: 12,
    currentHeadSha: 'head-sha',
    strategy: 'squash',
  });
  assert.equal(plan.authorized, true);
  assert.throws(() => buildMergePlan(approved, {
    prNumber: 12,
    currentHeadSha: 'changed',
    strategy: 'squash',
  }), /stale/);
});

test('version plan never grants deployment or migration', () => {
  const plan = buildVersionPlan({
    currentVersion: '0.2.0',
    bump: 'minor',
    targetCommit: 'merged-sha',
    affected: ['client-dashboard'],
  });
  assert.equal(plan.recommendedVersion, '0.3.0');
  assert.equal(plan.deploymentAuthorized, false);
  assert.equal(plan.migrationAuthorized, false);
});
