const assert = require('node:assert/strict');
const test = require('node:test');
const { createInitialState } = require('../lib');
const {
  collectDeliveryEvidence,
  copyPrompt,
  formatGuideUsage,
  nextCommandFor,
  renderGuide,
  renderGuideDelivery,
  renderGuideNext,
  renderGuidePrompt,
  resolveGuideSubcommand,
  summarizeEvidence,
  validateSelection,
} = require('../guide');

test('fresh focused workspace routes to audit', () => {
  const state = createInitialState();
  assert.equal(nextCommandFor(state, summarizeEvidence([])), '/audit all');
});

test('missing evidence prevents a later-stage readiness claim', () => {
  const state = createInitialState();
  state.apps['client-dashboard'].stage = 'checking';
  assert.equal(nextCommandFor(state, summarizeEvidence([])), '/audit all');
});

test('checking with evidence routes to the pilot gate', () => {
  const state = createInitialState();
  state.apps['client-dashboard'].stage = 'checking';
  const evidence = summarizeEvidence(
    [
      {
        id: 'check-1',
        createdAt: '2026-07-24T00:00:00.000Z',
        status: 'passed',
      },
    ],
    '2026-07-24T01:00:00.000Z'
  );
  assert.equal(nextCommandFor(state, evidence), '/pilot');
});

test('renderer includes required fields and exactly one next-command block', () => {
  const snapshot = {
    activeApplication: 'client-dashboard',
    currentStage: 'focused',
    currentPlan: null,
    pilotFlowCoverage: { covered: 0, total: 0 },
    pageScoreSummary: { average: null, pages: 0 },
    routeInventory: { count: 12 },
    evidence: { fresh: 0, stale: 0 },
    blockers: [],
    git: { branch: 'codex/guide', dirty: false, changedFiles: 0 },
    nextCommand: '/audit all',
  };
  const output = renderGuide(snapshot);
  for (const label of [
    'Active application',
    'Current stage',
    'Current plan',
    'Pilot-flow coverage',
    'Page-score summary',
    'Blockers',
    'Copy-ready prompt',
    'Next command',
  ])
    assert.match(output, new RegExp(label));
  assert.equal((output.match(/## Next command/g) || []).length, 1);
  assert.match(
    copyPrompt(snapshot),
    /Client Dashboard → Resident Portal → Scanner App/
  );
});

test('guide next renderer prints exactly one next command', () => {
  const output = renderGuideNext({
    activeApplication: 'client-dashboard',
    currentStage: 'focused',
    blockers: [],
    nextCommand: '/audit all',
  });
  assert.match(output, /\/audit all/);
  assert.equal((output.match(/## Next command/g) || []).length, 1);
});

test('guide prompt validates known agent and skills', () => {
  const prompt = renderGuidePrompt({
    generatedAt: '2026-07-24T00:00:00.000Z',
    workspaceRoot: '/Users/Dorgham/Documents/Work/Devleopment/Gate-Access',
    activeApplication: 'client-dashboard',
    currentStage: 'focused',
    currentPlan: 'gateflow_workflow_bootstrap',
    nextCommand: '/audit all',
    selection: {
      agent: 'gateflow-guide',
      skills: ['gf-guide'],
      cli: 'cursor',
      command: '/audit all',
    },
  });
  assert.equal(prompt.validated, true);
  assert.equal(
    prompt.workdir,
    '/Users/Dorgham/Documents/Work/Devleopment/Gate-Access'
  );
  assert.match(prompt.text, /\[AGENT\] gateflow-guide/);
  assert.match(prompt.text, /\[COMMAND\] \/audit all/);
  assert.match(
    prompt.text,
    /\[WORKDIR\] \/Users\/Dorgham\/Documents\/Work\/Devleopment\/Gate-Access/
  );
  assert.deepEqual(
    validateSelection({
      command: prompt.command,
      agent: prompt.agent,
      skills: prompt.skills,
      cli: prompt.cli,
    }),
    []
  );
});

test('guide subcommand parser skips --state file values', () => {
  assert.equal(resolveGuideSubcommand(['--state', 'next', 'status']), 'status');
  assert.equal(resolveGuideSubcommand(['--state', 'prompt']), 'status');
  assert.equal(
    resolveGuideSubcommand(['delivery', '--state', 'next']),
    'delivery'
  );
});

test('guide subcommand parser resolves each subcommand and defaults to status', () => {
  assert.equal(resolveGuideSubcommand(['status']), 'status');
  assert.equal(resolveGuideSubcommand(['next', '--json']), 'next');
  assert.equal(resolveGuideSubcommand(['prompt']), 'prompt');
  assert.equal(resolveGuideSubcommand(['delivery']), 'delivery');
  assert.equal(resolveGuideSubcommand([]), 'status');
  assert.equal(resolveGuideSubcommand(['--json']), 'status');
  assert.equal(resolveGuideSubcommand(['unknown']), 'status');
});

test('guide usage documents invocation and subcommands', () => {
  const text = formatGuideUsage();
  assert.match(text, /workflow-v2-guide/);
  assert.match(text, /--state <file>/);
  for (const name of ['status', 'next', 'prompt', 'delivery']) {
    assert.match(text, new RegExp(`\\b${name}\\b`));
  }
  assert.match(text, /Full guide snapshot/);
  assert.match(text, /First-incomplete-gate/);
  assert.match(text, /Registry-validated tagged prompt/);
  assert.match(text, /Local Git \+ optional GitHub/);
});

test('validateSelection rejects unknown slash commands and CLIs', () => {
  assert.deepEqual(
    validateSelection({
      command: '/audit al',
      agent: 'gateflow-guide',
      skills: ['gf-guide'],
      cli: 'cursor',
    }),
    ['unknown command: /audit al']
  );
  assert.deepEqual(
    validateSelection({
      command: '/audit all',
      agent: 'gateflow-guide',
      skills: ['gf-guide'],
      cli: 'not-a-cli',
    }),
    ['unknown cli: not-a-cli']
  );
});

test('guide delivery includes git commit and next command', () => {
  const delivery = collectDeliveryEvidence({
    root: process.cwd(),
    snapshot: {
      generatedAt: '2026-07-24T00:00:00.000Z',
      activeApplication: 'client-dashboard',
      currentStage: 'focused',
      nextCommand: '/audit all',
      git: {
        branch: 'codex/gateflow-workflow-bootstrap',
        commit: 'abc123',
        dirty: false,
        changedFiles: 0,
        upstream: 'origin/master',
        aheadBehind: '0\t1',
      },
      deliveryCache: null,
    },
  });
  assert.equal(delivery.git.commit, 'abc123');
  assert.equal(delivery.nextCommand, '/audit all');
  assert.match(renderGuideDelivery(delivery), /abc123/);
});
