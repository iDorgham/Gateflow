const path = require('node:path');
const { execFileSync } = require('node:child_process');

function git(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function detectBaseBranch(repoRoot) {
  try {
    const remoteHead = git(repoRoot, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']);
    if (remoteHead.startsWith('origin/')) return remoteHead.slice('origin/'.length);
  } catch {
    // A local-only repository may have no origin.
  }
  return git(repoRoot, ['branch', '--show-current']);
}

function sanitize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function worktreePlan({ repoRoot, runId, target, baseBranch }) {
  const branch = `codex/loop-${sanitize(target)}-${sanitize(runId)}`;
  const worktreePath = path.join(repoRoot, '.worktrees', 'loop', sanitize(runId));
  return {
    branch,
    path: worktreePath,
    baseBranch,
    command: ['git', 'worktree', 'add', '-b', branch, worktreePath, baseBranch],
  };
}

function createWorktree(plan) {
  const fs = require('node:fs');
  if (fs.existsSync(plan.path)) {
    const branch = git(plan.path, ['branch', '--show-current']);
    if (branch !== plan.branch) {
      throw new Error(`Existing worktree uses ${branch}, expected ${plan.branch}`);
    }
    return { ...plan, created: false, reused: true };
  }
  fs.mkdirSync(path.dirname(plan.path), { recursive: true });
  execFileSync(plan.command[0], plan.command.slice(1), {
    cwd: path.dirname(path.dirname(path.dirname(plan.path))),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return { ...plan, created: true, reused: false };
}

function removeWorktree(repoRoot, worktreePath) {
  const status = git(worktreePath, ['status', '--porcelain']);
  if (status) throw new Error('Refusing to remove a dirty worktree');
  execFileSync('git', ['worktree', 'remove', worktreePath], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return { removed: true, path: worktreePath };
}

function validateCommitMessage(message) {
  return /^(feat|fix|docs|test|refactor|perf|chore|ci|build|revert)(\([a-z0-9._-]+\))?!?: .{3,}$/.test(message);
}

function buildCommitPlan({
  delivery,
  shipPhaseApproved,
  ownedFiles,
  message,
}) {
  if (!Array.isArray(ownedFiles) || ownedFiles.length === 0) {
    throw new Error('No loop-owned files are available to commit');
  }
  if (delivery === 'local' && !shipPhaseApproved) {
    throw new Error('Local delivery requires ship-phase approval before staging or commit');
  }
  if (!validateCommitMessage(message)) {
    throw new Error('Commit message must follow Conventional Commits');
  }
  return {
    stage: { command: 'git', args: ['add', '--', ...ownedFiles] },
    commit: { command: 'git', args: ['commit', '-m', message] },
  };
}

function validateMergeApproval({ approval, prNumber, currentHeadSha }) {
  if (!approval) throw new Error('Merge approval receipt is required');
  if (Number(approval.prNumber) !== Number(prNumber)) throw new Error('Merge approval targets another PR');
  if (approval.headSha !== currentHeadSha) throw new Error('Merge approval is stale because PR head changed');
  return true;
}

module.exports = {
  buildCommitPlan,
  createWorktree,
  detectBaseBranch,
  removeWorktree,
  validateCommitMessage,
  validateMergeApproval,
  worktreePlan,
};
