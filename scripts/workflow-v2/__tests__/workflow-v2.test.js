const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  createInitialState,
  loadState,
  saveState,
  transition,
  focusApp,
  certifyApp,
  nextApp,
  validateState,
  acquireLock,
  releaseLock,
} = require('../lib');

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-workflow-v2-'));
}

test('initial state focuses client-dashboard and parks later pilot apps', () => {
  const state = createInitialState('2026-07-24T00:00:00.000Z');
  assert.equal(state.version, 2);
  assert.equal(state.focusedApp, 'client-dashboard');
  assert.equal(state.apps['client-dashboard'].stage, 'focused');
  assert.equal(state.apps['resident-portal'].stage, 'parked');
  assert.equal(state.apps['scanner-app'].stage, 'parked');
  assert.deepEqual(validateState(state), []);
});

test('only one app may be active', () => {
  const state = createInitialState();
  state.apps['resident-portal'].stage = 'planned';
  assert.match(validateState(state).join('\n'), /exactly one active application/i);
});

test('transition follows the state graph and rejects skips', () => {
  const state = createInitialState();
  assert.equal(transition(state, 'audited').apps['client-dashboard'].stage, 'audited');
  assert.throws(() => transition(state, 'developing'), /Invalid transition/);
});

test('focus cannot switch away from an uncertified application', () => {
  const state = createInitialState();
  assert.throws(() => focusApp(state, 'resident-portal'), /not certified/);
});

test('certification requires fresh valid evidence and emits a receipt', () => {
  let state = createInitialState('2026-07-24T00:00:00.000Z');
  state = transition(state, 'audited');
  state = transition(state, 'planned');
  state = transition(state, 'developing');
  state = transition(state, 'checking');
  state = transition(state, 'pilot-ready');
  const result = certifyApp(state, {
    id: 'evidence-1',
    valid: true,
    createdAt: '2026-07-24T01:00:00.000Z',
    expiresAt: '2026-07-25T01:00:00.000Z',
    commit: 'abc123',
  }, '2026-07-24T02:00:00.000Z');
  assert.equal(result.state.apps['client-dashboard'].stage, 'certified');
  assert.equal(result.receipt.app, 'client-dashboard');
  assert.equal(result.receipt.evidenceId, 'evidence-1');
  assert.ok(result.receipt.sha256);
});

test('next app remains locked until certification', () => {
  assert.throws(() => nextApp(createInitialState()), /must be certified/);
});

test('next app advances in the fixed sequence after certification', () => {
  const state = createInitialState();
  state.apps['client-dashboard'].stage = 'certified';
  state.focusedApp = null;
  const advanced = nextApp(state, true);
  assert.equal(advanced.focusedApp, 'resident-portal');
  assert.equal(advanced.apps['resident-portal'].stage, 'focused');
});

test('state writes are readable and leave no temporary file', () => {
  const root = fixture();
  const file = path.join(root, '.ai', 'workflow-v2', 'state.json');
  const state = createInitialState();
  saveState(file, state);
  assert.deepEqual(loadState(file), state);
  assert.equal(fs.existsSync(`${file}.tmp`), false);
});

test('only one focused-app writer may hold the workdir lock', () => {
  const state = acquireLock(createInitialState(), 'phase-1', 'writer-a');
  assert.equal(state.workdirLock.owner, 'writer-a');
  assert.throws(() => acquireLock(state, 'phase-1', 'writer-b'), /already held/);
  assert.equal(releaseLock(state, 'writer-a').workdirLock, null);
  assert.throws(() => releaseLock(state, 'writer-b'), /does not own/);
});
