#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
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
  recordRepairAttempt,
  resumeLoop,
  saveLoop,
  saveTaskContract,
  stopLoop,
  validateTaskContract,
  verifyTaskApproval,
} = require('./loop-lib');
const {
  acquireLock,
  certifyApp,
  loadState,
  nextApp,
  releaseLock,
  saveState,
} = require('./lib');
const { validateLoopScope, validateOwnedFiles } = require('./loop-scope');
const { createWorktree, detectBaseBranch, worktreePlan } = require('./git-safe');

const ROOT = path.resolve(__dirname, '..', '..');
const WORKFLOW_ROOT = path.join(ROOT, '.ai', 'workflow-v2');
const LOOPS_DIR = path.join(WORKFLOW_ROOT, 'loops');
const TASKS_DIR = path.join(WORKFLOW_ROOT, 'tasks');
const STATE_FILE = path.join(WORKFLOW_ROOT, 'state.json');

function usage() {
  return `GateFlow bounded development loop

Usage:
  loop-cli start <plan-slug> [--phase <n>|--all] [--profile phase|pilot] --delivery local|draft-pr [--dry-run]
  loop-cli start task:<task-slug> --delivery local|draft-pr
  loop-cli task draft <task-slug> --from <contract-input.json>
  loop-cli task approve <task-slug> [--approved-by <id>]
  loop-cli status [--run <runId>] [--json]
  loop-cli pause|resume|stop [--run <runId>] [--reason <text>]
  loop-cli checkpoint --run <runId> --input <checkpoint.json>
  loop-cli repair --run <runId> --failure <id> --evidence <file>
  loop-cli ship-phase --run <runId> [--approved-by <id>]
  loop-cli review-pr|fix-pr --run <runId> --receipt <file>
  loop-cli approve-merge --run <runId> --pr <n> --head <sha>
  loop-cli prepare-release --run <runId> --target-commit <sha>
  loop-cli approve-release --run <runId> --release-plan <id> --target-commit <sha>
  loop-cli certify-app --run <runId> --evidence <file> --confirm
  loop-cli next-app --run <runId> [--confirm]
  loop-cli certify-pilot --run <runId> --evidence <file> --confirm

Commands are local-only unless draft-pr delivery and a later explicit workflow
action authorize the exact remote mutation. Merge, deployment, and migration are
never granted by base loop state.`;
}

function parse(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const equals = arg.indexOf('=');
    if (equals > 2) {
      flags[arg.slice(2, equals)] = arg.slice(equals + 1);
      continue;
    }
    const key = arg.slice(2);
    if (['all', 'json', 'confirm', 'help', 'dry-run'].includes(key)) flags[key] = true;
    else flags[key] = argv[++index];
  }
  return { positional, flags };
}

function print(value, json = false) {
  if (json || typeof value !== 'string') console.log(JSON.stringify(value, null, 2));
  else console.log(value);
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function planLocation(slug) {
  for (const lifecycle of ['Active', 'Ready']) {
    const directory = path.join(ROOT, 'docs', 'plan', lifecycle, slug);
    const file = path.join(directory, `PLAN_${slug}.md`);
    if (fs.existsSync(file)) return { lifecycle, directory, file };
  }
  throw new Error(`Approved plan ${slug} was not found under Ready or Active`);
}

function dirtyFiles() {
  const output = git(['status', '--porcelain=v1', '-z']);
  if (!output) return [];
  return output.split('\0').filter(Boolean).map((entry) => entry.slice(3));
}

function latestRunFile(runId) {
  if (runId) {
    const file = path.join(LOOPS_DIR, `${runId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Loop run not found: ${runId}`);
    return file;
  }
  if (!fs.existsSync(LOOPS_DIR)) throw new Error('No loop runs exist');
  const files = fs.readdirSync(LOOPS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(LOOPS_DIR, file))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!files[0]) throw new Error('No loop runs exist');
  return files[0];
}

function runId(target) {
  return `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${target.replace(/[^a-z0-9_-]/gi, '-').slice(0, 40)}`;
}

function start(targetArg, flags) {
  if (!targetArg) throw new Error('start requires a plan slug or task:<slug>');
  const delivery = flags.delivery;
  const workflowState = loadState(STATE_FILE);
  if (!workflowState.focusedApp) throw new Error('Workflow v2 requires a focused application');
  const startCommit = git(['rev-parse', 'HEAD']);
  const preExistingDirty = dirtyFiles();
  let target;
  let profile = flags.profile || 'phase';
  let targetType = 'app';

  if (targetArg.startsWith('task:')) {
    if (profile === 'pilot') {
      throw new Error('The pilot profile accepts approved pilot plans only; use /dev loop for task contracts');
    }
    profile = 'task';
    const slug = targetArg.slice('task:'.length);
    const contractFile = path.join(TASKS_DIR, `${slug}.json`);
    if (!fs.existsSync(contractFile)) throw new Error(`Task contract not found: ${slug}`);
    const contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
    if (!verifyTaskApproval(contract)) throw new Error(`Task contract ${slug} is not approved or changed after approval`);
    if (contract.target.type === 'app' && contract.target.id !== workflowState.focusedApp) {
      throw new Error(`Task targets ${contract.target.id}, but ${workflowState.focusedApp} is focused`);
    }
    targetType = contract.target.type;
    target = { type: 'task', id: slug, hash: contract.approval.contractHash };
    flags.contractScope = contract.scope;
    flags.prohibitedActions = contract.prohibitedActions;
  } else {
    const plan = planLocation(targetArg);
    const stage = workflowState.apps[workflowState.focusedApp].stage;
    if (!['planned', 'developing', 'checking'].includes(stage)) {
      throw new Error(`Plan loops require focused app stage planned, developing, or checking; current stage is ${stage}`);
    }
    target = {
      type: 'plan',
      id: targetArg,
      hash: hashPlanContent(fs.readFileSync(plan.file, 'utf8')),
      lifecycle: plan.lifecycle,
    };
  }

  const id = flags.run || runId(target.id);
  const baseBranch = detectBaseBranch(ROOT);
  const worktree = worktreePlan({
    repoRoot: ROOT,
    runId: id,
    target: `${target.id}${flags.phase ? `-phase-${flags.phase}` : ''}`,
    baseBranch,
  });
  const loop = createLoop({
    runId: id,
    profile,
    delivery,
    target,
    focusedApp: workflowState.focusedApp,
    phase: flags.phase ? Number(flags.phase) : null,
    allPhases: Boolean(flags.all),
    startCommit,
    branch: worktree.branch,
    worktree: worktree.path,
    preExistingDirty,
  });
  loop.targetType = targetType;
  loop.contractScope = flags.contractScope || null;
  loop.prohibitedActions = flags.prohibitedActions || [];
  loop.worktreePlan = worktree;
  loop.nextAction = flags['dry-run'] ? 'create-worktree' : 'execute-task-batch';
  if (!flags['dry-run']) {
    const locked = acquireLock(workflowState, loop.phase ? `phase-${loop.phase}` : loop.target.id, loop.runId);
    saveState(STATE_FILE, locked);
    try {
      const result = createWorktree(worktree);
      loop.worktreeCreated = result.created || result.reused;
    } catch (error) {
      saveState(STATE_FILE, releaseLock(locked, loop.runId));
      throw error;
    }
  }
  if (!flags['dry-run']) saveLoop(path.join(LOOPS_DIR, `${id}.json`), loop);
  return loop;
}

function verifyTargetFresh(loop) {
  if (loop.target.type === 'plan') {
    const plan = planLocation(loop.target.id);
    const current = hashPlanContent(fs.readFileSync(plan.file, 'utf8'));
    if (current !== loop.target.hash) throw new Error('Plan changed after loop start; start a new approved run');
  } else {
    const file = path.join(TASKS_DIR, `${loop.target.id}.json`);
    const contract = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!verifyTaskApproval(contract) || contract.approval.contractHash !== loop.target.hash) {
      throw new Error('Task contract changed or approval is stale');
    }
  }
}

function taskCommand(action, slug, flags) {
  if (!slug) throw new Error(`task ${action} requires a slug`);
  const file = path.join(TASKS_DIR, `${slug}.json`);
  if (action === 'draft') {
    if (!flags.from) throw new Error('task draft requires --from <contract-input.json>');
    const input = JSON.parse(fs.readFileSync(path.resolve(flags.from), 'utf8'));
    const contract = createTaskContract({ ...input, slug });
    const errors = validateTaskContract(contract);
    if (errors.length) throw new Error(`Invalid task input:\n- ${errors.join('\n- ')}`);
    if (!flags['dry-run']) saveTaskContract(file, contract);
    return { task: slug, status: 'draft', file };
  }
  if (action === 'approve') {
    if (!fs.existsSync(file)) throw new Error(`Task contract not found: ${slug}`);
    const contract = JSON.parse(fs.readFileSync(file, 'utf8'));
    const approved = approveTaskContract(contract, flags['approved-by'] || 'user');
    if (!flags['dry-run']) saveTaskContract(file, approved);
    return { task: slug, status: 'approved', contractHash: approved.approval.contractHash, file };
  }
  throw new Error(`Unknown task action: ${action}`);
}

function checkpoint(loop, input) {
  const next = JSON.parse(JSON.stringify(loop));
  if (input.status) next.status = input.status;
  if (input.taskBatch !== undefined) {
    if (input.taskBatch < 1 || input.taskBatch > next.limits.taskBatch) {
      throw new Error(`taskBatch must be 1-${next.limits.taskBatch}`);
    }
    next.taskBatch = input.taskBatch;
  }
  if (input.ownedFiles) {
    const ownership = validateOwnedFiles({
      requested: input.ownedFiles,
      preExistingDirty: next.preExistingDirty,
    });
    if (ownership.conflicts.length) {
      throw new Error(`User/pre-existing changes overlap loop files: ${ownership.conflicts.join(', ')}`);
    }
    const scopeErrors = validateLoopScope({
      focusedApp: next.focusedApp,
      targetType: next.targetType,
      files: ownership.owned,
      sharedPackageJustifications: input.sharedPackageJustifications || {},
      contractScope: next.contractScope,
    });
    if (scopeErrors.length) throw new Error(`Scope validation failed:\n- ${scopeErrors.join('\n- ')}`);
    next.ownedFiles = ownership.owned;
    next.sharedPackageJustifications = input.sharedPackageJustifications || {};
  }
  if (input.evidence) next.evidence.push(...input.evidence);
  if (input.blockers) next.blockers.push(...input.blockers);
  if (input.nextAction) next.nextAction = input.nextAction;
  next.updatedAt = new Date().toISOString();
  return next;
}

function prepareRelease(loop, targetCommit, dryRun = false) {
  if (!targetCommit) throw new Error('--target-commit is required');
  const releasePlan = {
    version: 1,
    releasePlanId: `release-${loop.runId}-${targetCommit.slice(0, 12)}`,
    runId: loop.runId,
    targetCommit,
    targetHash: loop.target.hash,
    evidenceHash: hash(loop.evidence),
    deploymentAuthorized: false,
    migrationAuthorized: false,
    createdAt: new Date().toISOString(),
  };
  const directory = path.join(WORKFLOW_ROOT, 'release-plans');
  const file = path.join(directory, `${releasePlan.releasePlanId}.json`);
  if (!dryRun) {
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(releasePlan, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  }
  return { releasePlan, file };
}

function certifyPilot(loop, evidenceFile, confirmed, dryRun = false) {
  if (loop.profile !== 'pilot') throw new Error('Integrated certification requires the pilot profile');
  if (!confirmed) throw new Error('Integrated certification requires --confirm');
  const state = loadState(STATE_FILE);
  const uncertified = state.sequence.filter((app) => state.apps[app].stage !== 'certified');
  if (uncertified.length) throw new Error(`Uncertified applications: ${uncertified.join(', ')}`);
  const evidence = JSON.parse(fs.readFileSync(path.resolve(evidenceFile), 'utf8'));
  if (!evidence.valid || !evidence.id || !evidence.createdAt || !evidence.expiresAt) {
    throw new Error('Fresh valid integrated evidence is required');
  }
  const now = new Date().toISOString();
  if (Date.parse(evidence.createdAt) > Date.parse(now) || Date.parse(evidence.expiresAt) < Date.parse(now)) {
    throw new Error('Integrated pilot evidence is stale or not yet valid');
  }
  state.integratedPilot = {
    stage: 'certified',
    certificationReceipt: {
      id: evidence.id,
      evidenceHash: hash(evidence),
      certifiedAt: now,
      confirmedBy: 'user',
    },
  };
  state.updatedAt = now;
  if (!dryRun) saveState(STATE_FILE, state);
  return state.integratedPilot;
}

function main() {
  const { positional, flags } = parse(process.argv.slice(2));
  if (!positional.length || flags.help) return print(usage());
  const command = positional[0];
  if (command === 'start') return print(start(positional[1], flags), flags.json);
  if (command === 'task') return print(taskCommand(positional[1], positional[2], flags), flags.json);
  if (command === 'status') return print(loadLoop(latestRunFile(flags.run)), flags.json);

  const file = latestRunFile(flags.run);
  let loop = loadLoop(file);
  let workflowState = loadState(STATE_FILE);
  if (command === 'pause') {
    loop = pauseLoop(loop, flags.reason || 'user');
    if (workflowState.workdirLock?.owner === loop.runId) {
      workflowState = releaseLock(workflowState, loop.runId);
      if (!flags['dry-run']) saveState(STATE_FILE, workflowState);
    }
  } else if (command === 'resume') {
    verifyTargetFresh(loop);
    if (workflowState.focusedApp !== loop.focusedApp) throw new Error('Focused application changed while loop was paused');
    workflowState = acquireLock(
      workflowState,
      loop.phase ? `phase-${loop.phase}` : loop.target.id,
      loop.runId
    );
    if (!flags['dry-run']) saveState(STATE_FILE, workflowState);
    loop = resumeLoop(loop);
  } else if (command === 'stop') {
    loop = stopLoop(loop, flags.reason || 'user');
    if (workflowState.workdirLock?.owner === loop.runId) {
      workflowState = releaseLock(workflowState, loop.runId);
      if (!flags['dry-run']) saveState(STATE_FILE, workflowState);
    }
  }
  else if (command === 'checkpoint') {
    if (!flags.input) throw new Error('checkpoint requires --input');
    loop = checkpoint(loop, JSON.parse(fs.readFileSync(path.resolve(flags.input), 'utf8')));
  } else if (command === 'repair') {
    if (!flags.failure || !flags.evidence) throw new Error('repair requires --failure and --evidence');
    loop = recordRepairAttempt(
      loop,
      flags.failure,
      JSON.parse(fs.readFileSync(path.resolve(flags.evidence), 'utf8'))
    );
  } else if (command === 'ship-phase') loop = approveShipPhase(loop, flags['approved-by'] || 'user');
  else if (command === 'review-pr' || command === 'fix-pr') {
    if (loop.delivery !== 'draft-pr') throw new Error(`${command} requires draft-pr delivery`);
    if (!flags.receipt) throw new Error(`${command} requires --receipt`);
    const receipt = JSON.parse(fs.readFileSync(path.resolve(flags.receipt), 'utf8'));
    if (command === 'fix-pr') {
      if (!receipt.failureId) throw new Error('fix-pr receipt requires failureId');
      loop = recordRepairAttempt(loop, receipt.failureId, receipt);
    }
    loop.evidence.push({
      type: command,
      ...receipt,
      recordedAt: new Date().toISOString(),
    });
    loop.nextAction = command === 'review-pr' ? 'address-pr-verdict' : 'recheck-pr';
  } else if (command === 'approve-merge') {
    loop = approveMerge(loop, { prNumber: Number(flags.pr), headSha: flags.head });
  } else if (command === 'prepare-release') {
    return print(prepareRelease(loop, flags['target-commit'], Boolean(flags['dry-run'])), flags.json);
  } else if (command === 'approve-release') {
    if (!flags['release-plan']) throw new Error('--release-plan is required');
    const releaseFile = path.join(
      WORKFLOW_ROOT,
      'release-plans',
      `${flags['release-plan']}.json`
    );
    if (!fs.existsSync(releaseFile)) throw new Error(`Release plan not found: ${flags['release-plan']}`);
    const releasePlan = JSON.parse(fs.readFileSync(releaseFile, 'utf8'));
    if (
      releasePlan.runId !== loop.runId ||
      releasePlan.targetCommit !== flags['target-commit'] ||
      releasePlan.targetHash !== loop.target.hash ||
      releasePlan.evidenceHash !== hash(loop.evidence)
    ) {
      throw new Error('Release plan is stale or belongs to another run/target');
    }
    loop = approveRelease(loop, {
      releasePlanId: flags['release-plan'],
      targetCommit: flags['target-commit'],
    });
  } else if (command === 'next-app') {
    if (loop.profile !== 'pilot') throw new Error('next-app requires the pilot profile');
    const result = nextApp(loadState(STATE_FILE), Boolean(flags.confirm));
    if (result.requiresConfirmation) return print(result, flags.json);
    if (!flags['dry-run']) saveState(STATE_FILE, result);
    return print(result, flags.json);
  } else if (command === 'certify-app') {
    if (loop.profile !== 'pilot') throw new Error('certify-app requires the pilot profile');
    if (!flags.confirm) throw new Error('certify-app requires --confirm');
    if (!flags.evidence) throw new Error('certify-app requires --evidence');
    const evidence = JSON.parse(fs.readFileSync(path.resolve(flags.evidence), 'utf8'));
    const result = certifyApp(workflowState, evidence);
    if (!flags['dry-run']) saveState(STATE_FILE, result.state);
    return print(result, flags.json);
  } else if (command === 'certify-pilot') {
    return print(certifyPilot(
      loop,
      flags.evidence,
      Boolean(flags.confirm),
      Boolean(flags['dry-run'])
    ), flags.json);
  } else throw new Error(`Unknown command: ${command}`);

  if (!flags['dry-run']) saveLoop(file, loop);
  print(loop, flags.json);
}

try {
  main();
} catch (error) {
  console.error(`workflow-v2-loop: ${error.message}`);
  process.exitCode = 1;
}
