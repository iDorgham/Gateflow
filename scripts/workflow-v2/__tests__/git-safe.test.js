const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const {
  buildCommitPlan,
  createWorktree,
  detectBaseBranch,
  removeWorktree,
  validateCommitMessage,
  validateMergeApproval,
  worktreePlan,
} = require('../git-safe');

function gitFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-git-safe-'));
  execFileSync('git', ['init', '-b', 'trunk'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'fixture@gateflow.test'], {
    cwd: root,
  });
  execFileSync('git', ['config', 'user.name', 'GateFlow Fixture'], {
    cwd: root,
  });
  fs.writeFileSync(path.join(root, 'README.md'), '# fixture\n');
  execFileSync('git', ['add', 'README.md'], { cwd: root });
  execFileSync('git', ['commit', '-m', 'chore: initialize fixture'], {
    cwd: root,
  });
  return root;
}

test('base detection uses repository truth rather than assuming master', () => {
  assert.equal(detectBaseBranch(gitFixture()), 'trunk');
});

test('worktree plan is deterministic and uses a pre-push-compatible branch name', () => {
  const plan = worktreePlan({
    repoRoot: '/repo',
    runId: '20260724-abc',
    target: 'client-dashboard-phase-1',
    baseBranch: 'trunk',
  });
  assert.equal(plan.branch, 'feat/loop-client-dashboard-phase-1-20260724-abc');
  assert.equal(plan.path, '/repo/.worktrees/loop/20260724-abc');
  assert.deepEqual(plan.command.slice(0, 3), ['git', 'worktree', 'add']);
});

test('worktree creation is idempotent and clean removal is safe', () => {
  const repo = gitFixture();
  const plan = worktreePlan({
    repoRoot: repo,
    runId: 'fixture-run',
    target: 'workspace-docs',
    baseBranch: 'trunk',
  });
  assert.equal(createWorktree(plan).created, true);
  assert.equal(createWorktree(plan).reused, true);
  assert.equal(removeWorktree(repo, plan.path).removed, true);
});

test('commit plans stage only explicitly owned files', () => {
  const plan = buildCommitPlan({
    delivery: 'local',
    shipPhaseApproved: true,
    ownedFiles: ['docs/a.md', 'scripts/a.js'],
    message: 'feat(workflow): add bounded loop',
  });
  assert.deepEqual(plan.stage.args, ['add', '--', 'docs/a.md', 'scripts/a.js']);
  assert.equal(plan.commit.args[2], 'feat(workflow): add bounded loop');
  assert.throws(
    () =>
      buildCommitPlan({
        delivery: 'local',
        shipPhaseApproved: false,
        ownedFiles: ['docs/a.md'],
        message: 'feat(workflow): add bounded loop',
      }),
    /ship-phase approval/
  );
});

test('conventional commits and merge SHA approvals are enforced', () => {
  assert.equal(validateCommitMessage('feat(workflow): add bounded loop'), true);
  assert.equal(validateCommitMessage('update stuff'), false);
  assert.doesNotThrow(() =>
    validateMergeApproval({
      approval: { prNumber: 8, headSha: 'abc' },
      prNumber: 8,
      currentHeadSha: 'abc',
    })
  );
  assert.throws(
    () =>
      validateMergeApproval({
        approval: { prNumber: 8, headSha: 'abc' },
        prNumber: 8,
        currentHeadSha: 'def',
      }),
    /stale/
  );
});
