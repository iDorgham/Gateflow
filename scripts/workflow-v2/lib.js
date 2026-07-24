const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PILOT_SEQUENCE = ['client-dashboard', 'resident-portal', 'scanner-app'];
const ACTIVE_STAGES = new Set([
  'focused',
  'audited',
  'planned',
  'developing',
  'checking',
  'pilot-ready',
]);
const STAGES = new Set(['parked', ...ACTIVE_STAGES, 'certified']);
const NEXT_STAGE = {
  focused: 'audited',
  audited: 'planned',
  planned: 'developing',
  developing: 'checking',
  checking: 'pilot-ready',
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialState(now = new Date().toISOString()) {
  return {
    version: 2,
    sequence: [...PILOT_SEQUENCE],
    focusedApp: 'client-dashboard',
    integratedPilot: { stage: 'parked', certificationReceipt: null },
    apps: Object.fromEntries(
      PILOT_SEQUENCE.map((app, index) => [
        app,
        {
          stage: index === 0 ? 'focused' : 'parked',
          currentPlan: null,
          baseline: null,
          evidence: [],
          certificationReceipt: null,
          updatedAt: now,
        },
      ])
    ),
    workdirLock: null,
    createdAt: now,
    updatedAt: now,
  };
}

function validateState(state) {
  const errors = [];
  if (!state || state.version !== 2) errors.push('version must equal 2');
  if (JSON.stringify(state?.sequence) !== JSON.stringify(PILOT_SEQUENCE)) {
    errors.push('pilot sequence must be client-dashboard → resident-portal → scanner-app');
  }
  for (const app of PILOT_SEQUENCE) {
    if (!state?.apps?.[app]) errors.push(`missing app state: ${app}`);
    else if (!STAGES.has(state.apps[app].stage)) errors.push(`invalid stage for ${app}`);
  }
  const active = PILOT_SEQUENCE.filter((app) => ACTIVE_STAGES.has(state?.apps?.[app]?.stage));
  if (active.length > 1) errors.push('exactly one active application is allowed');
  if (state?.focusedApp && !active.includes(state.focusedApp)) {
    errors.push('focusedApp must identify the active application');
  }
  if (!state?.focusedApp && active.length) errors.push('active application requires focusedApp');
  if (state?.workdirLock && state.workdirLock.app !== state.focusedApp) {
    errors.push('workdir lock must belong to the focused application');
  }
  return errors;
}

function assertValid(state) {
  const errors = validateState(state);
  if (errors.length) throw new Error(`Invalid Workflow v2 state:\n- ${errors.join('\n- ')}`);
  return state;
}

function loadState(file) {
  if (!fs.existsSync(file)) return createInitialState();
  const state = JSON.parse(fs.readFileSync(file, 'utf8'));
  return assertValid(state);
}

function saveState(file, state) {
  assertValid(state);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
}

function transition(input, target, now = new Date().toISOString()) {
  const state = clone(assertValid(input));
  const app = state.focusedApp;
  if (!app) throw new Error('No focused application. Run workflow-v2 focus first.');
  const current = state.apps[app].stage;
  if (NEXT_STAGE[current] !== target) {
    throw new Error(`Invalid transition for ${app}: ${current} → ${target}`);
  }
  state.apps[app].stage = target;
  state.apps[app].updatedAt = now;
  state.updatedAt = now;
  return assertValid(state);
}

function focusApp(input, app, now = new Date().toISOString()) {
  if (!PILOT_SEQUENCE.includes(app)) throw new Error(`Unknown pilot app: ${app}`);
  const state = clone(assertValid(input));
  if (state.focusedApp === app) return state;
  if (state.focusedApp && state.apps[state.focusedApp].stage !== 'certified') {
    throw new Error(`${state.focusedApp} is not certified; focus switching is locked`);
  }
  if (state.apps[app].stage !== 'parked') throw new Error(`${app} is not parked`);
  state.focusedApp = app;
  state.apps[app].stage = 'focused';
  state.apps[app].updatedAt = now;
  state.updatedAt = now;
  return assertValid(state);
}

function certifyApp(input, evidence, now = new Date().toISOString()) {
  const state = clone(assertValid(input));
  const app = state.focusedApp;
  if (!app || state.apps[app].stage !== 'pilot-ready') {
    throw new Error('Focused application must be pilot-ready before certification');
  }
  if (!evidence?.valid || !evidence.id || !evidence.createdAt || !evidence.expiresAt) {
    throw new Error('Certification requires valid dated evidence');
  }
  if (Date.parse(evidence.createdAt) > Date.parse(now) || Date.parse(evidence.expiresAt) < Date.parse(now)) {
    throw new Error('Certification evidence is stale or not yet valid');
  }
  const receiptBody = {
    version: 1,
    app,
    certifiedAt: now,
    evidenceId: evidence.id,
    evidenceCommit: evidence.commit || null,
  };
  const receipt = {
    ...receiptBody,
    sha256: crypto.createHash('sha256').update(JSON.stringify(receiptBody)).digest('hex'),
  };
  state.apps[app].stage = 'certified';
  state.apps[app].certificationReceipt = receipt;
  state.apps[app].updatedAt = now;
  state.focusedApp = null;
  state.workdirLock = null;
  state.updatedAt = now;
  return { state: assertValid(state), receipt };
}

function nextApp(input, confirmed = false, now = new Date().toISOString()) {
  const state = clone(assertValid(input));
  const lastCertified = [...PILOT_SEQUENCE].reverse().find((app) => state.apps[app].stage === 'certified');
  if (!lastCertified) throw new Error('Current application must be certified before /next-app');
  const next = PILOT_SEQUENCE[PILOT_SEQUENCE.indexOf(lastCertified) + 1];
  if (!next) throw new Error('All pilot applications are certified; run integrated /certify');
  if (!confirmed) return { recommendation: next, requiresConfirmation: true };
  return focusApp(state, next, now);
}

function acquireLock(input, phase, owner, now = new Date().toISOString()) {
  const state = clone(assertValid(input));
  if (!state.focusedApp) throw new Error('No focused application');
  if (!phase || !owner) throw new Error('Workdir lock requires phase and owner');
  if (state.workdirLock) throw new Error(`Workdir lock already held by ${state.workdirLock.owner}`);
  state.workdirLock = { app: state.focusedApp, phase, owner, acquiredAt: now };
  state.updatedAt = now;
  return assertValid(state);
}

function releaseLock(input, owner, now = new Date().toISOString()) {
  const state = clone(assertValid(input));
  if (!state.workdirLock) return state;
  if (state.workdirLock.owner !== owner) throw new Error(`${owner} does not own the workdir lock`);
  state.workdirLock = null;
  state.updatedAt = now;
  return assertValid(state);
}

module.exports = {
  ACTIVE_STAGES,
  PILOT_SEQUENCE,
  assertValid,
  certifyApp,
  createInitialState,
  focusApp,
  loadState,
  nextApp,
  saveState,
  transition,
  validateState,
  acquireLock,
  releaseLock,
};
