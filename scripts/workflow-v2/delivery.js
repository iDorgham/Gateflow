const { recordRepairAttempt } = require('./loop-lib');
const { validateMergeApproval, validateCommitMessage } = require('./git-safe');

function buildDraftPrRequest(loop, input) {
  if (loop.delivery !== 'draft-pr' || !loop.permissions.createDraftPr) {
    throw new Error('Draft PR creation is not authorized by this loop');
  }
  if (!loop.branch || loop.branch === input.baseBranch) {
    throw new Error('Draft PR requires a focused feature branch');
  }
  if (!input.headSha || !input.baseBranch) throw new Error('Base branch and head SHA are required');
  if (!validateCommitMessage(input.title)) throw new Error('PR title must follow Conventional Commits');
  for (const section of ['Outcome', 'Tests', 'Risks', 'Rollback']) {
    if (!input.body?.includes(section)) throw new Error(`PR body is missing ${section}`);
  }
  return {
    draft: true,
    base: input.baseBranch,
    head: loop.branch,
    headSha: input.headSha,
    title: input.title,
    body: input.body,
    allowMaintainerEdits: false,
    ownedFiles: loop.ownedFiles,
  };
}

function inspectPrFixture(fixture) {
  const requiredFailures = fixture.checks
    .filter((check) => check.required && check.status !== 'success')
    .map((check) => check.name);
  const unrelatedFailures = fixture.checks
    .filter((check) => !check.required && check.status === 'failure' && check.classification === 'unrelated')
    .map((check) => check.name);
  const changesRequested = fixture.reviews.some((review) => review.state === 'changes_requested');
  const blockingFindings = fixture.findings.filter((finding) => ['P0', 'P1'].includes(finding.severity));
  let verdict = 'ready';
  if (requiredFailures.length || changesRequested || blockingFindings.length) verdict = 'needs-fix';
  if (fixture.externalBlocker) verdict = 'blocked';
  return {
    headSha: fixture.headSha,
    verdict,
    requiredFailures,
    unrelatedFailures,
    blockingFindings,
  };
}

function queuePrRepair(loop, failureId, evidence) {
  if (loop.delivery !== 'draft-pr' || !loop.permissions.fixPr) {
    throw new Error('PR fixes are not authorized');
  }
  return recordRepairAttempt(loop, failureId, evidence);
}

function buildMergePlan(loop, { prNumber, currentHeadSha, strategy }) {
  validateMergeApproval({
    approval: loop.approvals.merge,
    prNumber,
    currentHeadSha,
  });
  if (!['squash', 'merge', 'rebase'].includes(strategy)) {
    throw new Error('Merge strategy must follow repository policy');
  }
  return {
    authorized: true,
    prNumber,
    headSha: currentHeadSha,
    strategy,
    bypassBranchProtection: false,
    deleteBranch: false,
  };
}

function increment(version, bump) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error('Current version must be stable SemVer');
  let [, major, minor, patch] = match.map(Number);
  if (bump === 'major') {
    major += 1; minor = 0; patch = 0;
  } else if (bump === 'minor') {
    minor += 1; patch = 0;
  } else if (bump === 'patch') patch += 1;
  else throw new Error('Bump must be major, minor, or patch');
  return `${major}.${minor}.${patch}`;
}

function buildVersionPlan({ currentVersion, bump, targetCommit, affected }) {
  if (!targetCommit || !Array.isArray(affected) || !affected.length) {
    throw new Error('Target commit and affected workspaces are required');
  }
  return {
    version: 1,
    currentVersion,
    bump,
    recommendedVersion: increment(currentVersion, bump),
    targetCommit,
    affected,
    deploymentAuthorized: false,
    migrationAuthorized: false,
  };
}

module.exports = {
  buildDraftPrRequest,
  buildMergePlan,
  buildVersionPlan,
  inspectPrFixture,
  queuePrRepair,
};
