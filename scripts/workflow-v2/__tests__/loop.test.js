const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  approveMerge,
  approveRelease,
  approveTaskContract,
  createLoop,
  createTaskContract,
  recordRepairAttempt,
  resumeLoop,
  pauseLoop,
  stopLoop,
  validateLoop,
  validateTaskContract,
  verifyTaskApproval,
  hashPlanContent,
} = require('../loop-lib');

function task(overrides = {}) {
  return createTaskContract({
    slug: 'workspace-docs',
    target: { type: 'workspace', id: 'workspace' },
    scope: { include: ['docs/workspace/'], exclude: ['apps/'] },
    acceptanceCriteria: ['Documentation explains the bounded loop'],
    securityBoundaries: ['Do not print environment values'],
    checks: ['pnpm docs:changelog:check'],
    rollback: ['Revert loop documentation changes'],
    prohibitedActions: ['push', 'merge', 'deploy', 'migrate'],
    ...overrides,
  }, '2026-07-24T00:00:00.000Z');
}

test('task contracts require every safety section', () => {
  const contract = task({ rollback: [] });
  assert.match(validateTaskContract(contract).join('\n'), /rollback/);
});

test('task approval is hash-bound and editing invalidates it', () => {
  const approved = approveTaskContract(task(), 'user', '2026-07-24T01:00:00.000Z');
  assert.equal(verifyTaskApproval(approved), true);
  approved.scope.include.push('scripts/');
  assert.equal(verifyTaskApproval(approved), false);
});

test('plan approval hash tolerates progress checkboxes but not scope edits', () => {
  const approved = '# Plan\n- [ ] task\nScope: client dashboard\n';
  const progressed = '# Plan\n- [x] task\nScope: client dashboard\n';
  const changed = '# Plan\n- [x] task\nScope: resident portal\n';
  assert.equal(hashPlanContent(approved), hashPlanContent(progressed));
  assert.notEqual(hashPlanContent(approved), hashPlanContent(changed));
});

test('loop persists bounded batch and repair limits', () => {
  const contract = approveTaskContract(task(), 'user');
  const loop = createLoop({
    runId: 'run-1',
    profile: 'task',
    delivery: 'local',
    target: { type: 'task', id: contract.slug, hash: contract.approval.contractHash },
    focusedApp: 'client-dashboard',
    startCommit: 'abc123',
    ownedFiles: ['docs/workspace/WORKFLOW_V2.md'],
  });
  assert.equal(loop.limits.taskBatch, 3);
  assert.equal(loop.limits.repairAttempts, 3);
  assert.deepEqual(validateLoop(loop), []);
  let current = loop;
  current = recordRepairAttempt(current, 'lint-failure', { command: 'pnpm lint', result: 'failed' });
  current = recordRepairAttempt(current, 'lint-failure', { command: 'pnpm lint', result: 'failed' });
  current = recordRepairAttempt(current, 'lint-failure', { command: 'pnpm lint', result: 'failed' });
  assert.throws(() => recordRepairAttempt(current, 'lint-failure', {}), /repair limit/);
});

test('pause, resume, and stop are deterministic', () => {
  const base = createLoop({
    runId: 'run-2',
    profile: 'phase',
    delivery: 'local',
    target: { type: 'plan', id: 'approved-plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc123',
  });
  const paused = pauseLoop(base, 'user');
  assert.equal(paused.status, 'paused');
  assert.equal(resumeLoop(paused).status, 'running');
  assert.equal(stopLoop(paused, 'cancelled').status, 'stopped');
  assert.throws(() => resumeLoop(stopLoop(paused, 'cancelled')), /stopped/);
});

test('delivery permissions keep local commits and every merge gated', () => {
  const local = createLoop({
    runId: 'run-local',
    profile: 'phase',
    delivery: 'local',
    target: { type: 'plan', id: 'plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc',
  });
  assert.equal(local.permissions.createWorktree, true);
  assert.equal(local.permissions.commit, false);
  assert.equal(local.permissions.push, false);
  const draftPr = createLoop({
    runId: 'run-pr',
    profile: 'phase',
    delivery: 'draft-pr',
    target: { type: 'plan', id: 'plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc',
  });
  assert.equal(draftPr.permissions.commit, true);
  assert.equal(draftPr.permissions.push, true);
  assert.equal(draftPr.permissions.merge, false);
});

test('merge approval is bound to current PR head', () => {
  const loop = createLoop({
    runId: 'run-pr',
    profile: 'phase',
    delivery: 'draft-pr',
    target: { type: 'plan', id: 'plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc',
  });
  const approved = approveMerge(loop, { prNumber: 42, headSha: 'head-1' });
  assert.equal(approved.approvals.merge.headSha, 'head-1');
  const reapproved = approveMerge(approved, { prNumber: 42, headSha: 'head-2' });
  assert.equal(reapproved.approvals.merge.headSha, 'head-2');
});

test('release approval never grants deployment or migration permission', () => {
  const loop = createLoop({
    runId: 'run-release',
    profile: 'pilot',
    delivery: 'draft-pr',
    target: { type: 'plan', id: 'plan', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc',
  });
  const approved = approveRelease(loop, { releasePlanId: 'release-1', targetCommit: 'abc' });
  assert.equal(approved.approvals.release.releasePlanId, 'release-1');
  assert.equal(approved.permissions.deploy, false);
  assert.equal(approved.permissions.migrate, false);
});

test('loop checkpoints write atomically', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-loop-'));
  const file = path.join(root, 'loops', 'run.json');
  const loop = createLoop({
    runId: 'run-atomic',
    profile: 'task',
    delivery: 'local',
    target: { type: 'task', id: 'task', hash: 'hash' },
    focusedApp: 'client-dashboard',
    startCommit: 'abc',
  });
  const { saveLoop, loadLoop } = require('../loop-lib');
  saveLoop(file, loop);
  assert.deepEqual(loadLoop(file), loop);
  assert.equal(fs.existsSync(`${file}.tmp`), false);
});
