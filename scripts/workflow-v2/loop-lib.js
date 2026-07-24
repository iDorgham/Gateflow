const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const LOOP_PROFILES = new Set(['phase', 'task', 'pilot']);
const DELIVERY_MODES = new Set(['local', 'draft-pr']);
const LOOP_STATUSES = new Set([
  'running',
  'paused',
  'stopped',
  'blocked',
  'phase-green',
  'shipped',
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stable(value[key])])
    );
  }
  return value;
}

function hash(value) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(stable(value)))
    .digest('hex');
}

function hashPlanContent(content) {
  const normalized = String(content)
    .replace(/\[[ xX]\]/g, '[]')
    .replace(/\r\n/g, '\n');
  return hash(normalized);
}

function taskPayload(contract) {
  return {
    version: contract.version,
    slug: contract.slug,
    target: contract.target,
    scope: contract.scope,
    acceptanceCriteria: contract.acceptanceCriteria,
    securityBoundaries: contract.securityBoundaries,
    checks: contract.checks,
    rollback: contract.rollback,
    prohibitedActions: contract.prohibitedActions,
    createdAt: contract.createdAt,
  };
}

function createTaskContract(input, now = new Date().toISOString()) {
  return {
    version: 1,
    slug: input.slug,
    target: input.target,
    scope: input.scope,
    acceptanceCriteria: input.acceptanceCriteria || [],
    securityBoundaries: input.securityBoundaries || [],
    checks: input.checks || [],
    rollback: input.rollback || [],
    prohibitedActions: input.prohibitedActions || [],
    createdAt: now,
    updatedAt: now,
    approval: null,
  };
}

function validateTaskContract(contract) {
  const errors = [];
  if (contract?.version !== 1) errors.push('version must equal 1');
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(contract?.slug || '')) {
    errors.push('slug must use lowercase letters, digits, hyphen, or underscore');
  }
  if (!['app', 'workspace'].includes(contract?.target?.type)) {
    errors.push('target.type must be app or workspace');
  }
  if (!contract?.target?.id) errors.push('target.id is required');
  if (!Array.isArray(contract?.scope?.include) || contract.scope.include.length === 0) {
    errors.push('scope.include requires at least one path');
  }
  if (!Array.isArray(contract?.scope?.exclude)) errors.push('scope.exclude is required');
  for (const field of [
    'acceptanceCriteria',
    'securityBoundaries',
    'checks',
    'rollback',
    'prohibitedActions',
  ]) {
    if (!Array.isArray(contract?.[field]) || contract[field].length === 0) {
      errors.push(`${field} requires at least one item`);
    }
  }
  return errors;
}

function approveTaskContract(input, approvedBy = 'user', now = new Date().toISOString()) {
  const contract = clone(input);
  const errors = validateTaskContract(contract);
  if (errors.length) throw new Error(`Invalid task contract:\n- ${errors.join('\n- ')}`);
  contract.approval = {
    approvedBy,
    approvedAt: now,
    contractHash: hash(taskPayload(contract)),
  };
  contract.updatedAt = now;
  return contract;
}

function verifyTaskApproval(contract) {
  return Boolean(
    contract?.approval?.contractHash &&
    contract.approval.contractHash === hash(taskPayload(contract))
  );
}

function permissionsFor(delivery) {
  if (!DELIVERY_MODES.has(delivery)) throw new Error(`Unknown delivery mode: ${delivery}`);
  return {
    inspect: true,
    editFocusedScope: true,
    createBranch: true,
    createWorktree: true,
    stage: delivery === 'draft-pr',
    commit: delivery === 'draft-pr',
    fetch: delivery === 'draft-pr',
    push: delivery === 'draft-pr',
    createDraftPr: delivery === 'draft-pr',
    inspectPr: delivery === 'draft-pr',
    fixPr: delivery === 'draft-pr',
    merge: false,
    tag: false,
    release: false,
    deploy: false,
    migrate: false,
  };
}

function createLoop(input, now = new Date().toISOString()) {
  if (!LOOP_PROFILES.has(input.profile)) throw new Error(`Unknown loop profile: ${input.profile}`);
  const loop = {
    version: 1,
    runId: input.runId,
    profile: input.profile,
    delivery: input.delivery,
    target: input.target,
    focusedApp: input.focusedApp || null,
    phase: input.phase || null,
    allPhases: Boolean(input.allPhases),
    taskBatch: 1,
    verificationAttempt: 0,
    repairAttempts: {},
    status: 'running',
    branch: input.branch || null,
    worktree: input.worktree || null,
    startCommit: input.startCommit,
    ownedFiles: input.ownedFiles || [],
    preExistingDirty: input.preExistingDirty || [],
    sharedPackageJustifications: input.sharedPackageJustifications || {},
    evidence: [],
    blockers: [],
    approvals: {
      task: input.target?.type === 'task' ? input.target.hash : null,
      shipPhase: null,
      merge: null,
      release: null,
    },
    permissions: permissionsFor(input.delivery),
    limits: { taskBatch: 3, repairAttempts: 3 },
    nextAction: 'execute-task-batch',
    createdAt: now,
    updatedAt: now,
  };
  const errors = validateLoop(loop);
  if (errors.length) throw new Error(`Invalid loop:\n- ${errors.join('\n- ')}`);
  return loop;
}

function validateLoop(loop) {
  const errors = [];
  if (loop?.version !== 1) errors.push('version must equal 1');
  if (!loop?.runId) errors.push('runId is required');
  if (!LOOP_PROFILES.has(loop?.profile)) errors.push('invalid profile');
  if (!DELIVERY_MODES.has(loop?.delivery)) errors.push('invalid delivery mode');
  if (!LOOP_STATUSES.has(loop?.status)) errors.push('invalid status');
  if (!['plan', 'task'].includes(loop?.target?.type)) errors.push('target.type must be plan or task');
  if (!loop?.target?.id || !loop?.target?.hash) errors.push('target id and hash are required');
  if (!loop?.startCommit) errors.push('startCommit is required');
  if (loop?.limits?.taskBatch !== 3) errors.push('task batch limit must equal 3');
  if (loop?.limits?.repairAttempts !== 3) errors.push('repair limit must equal 3');
  if (loop?.permissions?.merge || loop?.permissions?.deploy || loop?.permissions?.migrate) {
    errors.push('base loop permissions cannot grant merge, deploy, or migrate');
  }
  return errors;
}

function updateStatus(input, status, nextAction, reason, now = new Date().toISOString()) {
  const loop = clone(input);
  if (!LOOP_STATUSES.has(status)) throw new Error(`Invalid loop status: ${status}`);
  loop.status = status;
  loop.nextAction = nextAction;
  if (reason) loop.blockers.push({ reason, recordedAt: now });
  loop.updatedAt = now;
  return loop;
}

function pauseLoop(loop, reason = 'user', now) {
  if (loop.status !== 'running' && loop.status !== 'blocked') {
    throw new Error(`Cannot pause loop from ${loop.status}`);
  }
  return updateStatus(loop, 'paused', 'resume', reason, now);
}

function resumeLoop(loop, now) {
  if (loop.status === 'stopped') throw new Error('Cannot resume a stopped loop');
  if (loop.status !== 'paused' && loop.status !== 'blocked') {
    throw new Error(`Cannot resume loop from ${loop.status}`);
  }
  return updateStatus(loop, 'running', 'execute-task-batch', null, now);
}

function stopLoop(loop, reason = 'user', now) {
  if (loop.status === 'stopped') return clone(loop);
  return updateStatus(loop, 'stopped', 'none', reason, now);
}

function recordRepairAttempt(input, failureId, evidence = {}, now = new Date().toISOString()) {
  const loop = clone(input);
  const attempts = loop.repairAttempts[failureId] || [];
  if (attempts.length >= loop.limits.repairAttempts) {
    throw new Error(`Automatic repair limit reached for ${failureId}`);
  }
  attempts.push({ attempt: attempts.length + 1, ...evidence, recordedAt: now });
  loop.repairAttempts[failureId] = attempts;
  loop.verificationAttempt = attempts.length;
  loop.updatedAt = now;
  return loop;
}

function approveShipPhase(input, approvedBy = 'user', now = new Date().toISOString()) {
  const loop = clone(input);
  if (loop.status !== 'phase-green') throw new Error('ship-phase requires phase-green status');
  loop.approvals.shipPhase = {
    approvedBy,
    approvedAt: now,
    targetHash: loop.target.hash,
    evidenceHash: hash(loop.evidence),
    ownedFilesHash: hash(loop.ownedFiles),
  };
  loop.permissions.stage = true;
  loop.permissions.commit = true;
  loop.nextAction = 'commit-owned-files';
  loop.updatedAt = now;
  return loop;
}

function approveMerge(input, approval, now = new Date().toISOString()) {
  const loop = clone(input);
  if (loop.delivery !== 'draft-pr') throw new Error('merge approval requires draft-pr delivery');
  if (!approval?.prNumber || !approval?.headSha) throw new Error('PR number and head SHA are required');
  loop.approvals.merge = { ...approval, approvedAt: now };
  loop.nextAction = 'validate-merge';
  loop.updatedAt = now;
  return loop;
}

function approveRelease(input, approval, now = new Date().toISOString()) {
  const loop = clone(input);
  if (!approval?.releasePlanId || !approval?.targetCommit) {
    throw new Error('Release plan ID and target commit are required');
  }
  loop.approvals.release = { ...approval, approvedAt: now };
  loop.permissions.tag = true;
  loop.permissions.release = true;
  loop.permissions.deploy = false;
  loop.permissions.migrate = false;
  loop.nextAction = 'prepare-approved-release';
  loop.updatedAt = now;
  return loop;
}

function saveJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
}

function saveLoop(file, loop) {
  const errors = validateLoop(loop);
  if (errors.length) throw new Error(`Invalid loop:\n- ${errors.join('\n- ')}`);
  saveJsonAtomic(file, loop);
}

function loadLoop(file) {
  const loop = JSON.parse(fs.readFileSync(file, 'utf8'));
  const errors = validateLoop(loop);
  if (errors.length) throw new Error(`Invalid loop:\n- ${errors.join('\n- ')}`);
  return loop;
}

function saveTaskContract(file, contract) {
  const errors = validateTaskContract(contract);
  if (errors.length) throw new Error(`Invalid task contract:\n- ${errors.join('\n- ')}`);
  saveJsonAtomic(file, contract);
}

module.exports = {
  approveMerge,
  approveRelease,
  approveShipPhase,
  approveTaskContract,
  createLoop,
  createTaskContract,
  hash,
  hashPlanContent,
  loadLoop,
  pauseLoop,
  permissionsFor,
  recordRepairAttempt,
  resumeLoop,
  saveLoop,
  saveTaskContract,
  stopLoop,
  validateLoop,
  validateTaskContract,
  verifyTaskApproval,
};
