const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { inventoryRoutes, resolveApp } = require('./support');

const NEXT_COMMAND = {
  focused: '/audit all',
  audited: '/page-map',
  planned: '/dev',
  developing: '/check all',
  checking: '/pilot',
  'pilot-ready': '/certify',
};

const PILOT_ORDER =
  'Client Dashboard → Resident Portal → Scanner App → integrated pilot';

const GUIDE_SUBCOMMANDS = new Set(['status', 'next', 'prompt', 'delivery']);

function resolveGuideSubcommand(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--state') {
      index += 1; // skip the state-file path so it cannot be read as a subcommand
      continue;
    }
    if (GUIDE_SUBCOMMANDS.has(arg)) return arg;
  }
  return 'status';
}

const KNOWN_COMMANDS = new Set([
  '/audit all',
  '/page-map',
  '/dev',
  '/check all',
  '/pilot',
  '/certify',
  '/certify integrated-pilot',
  '/next-app',
  '/progress',
  '/focus',
  '/plan',
]);

const KNOWN_AGENTS = new Set([
  'gateflow-guide',
  'gateflow-build',
  'gateflow-conductor',
  'evidence-verifier',
  'ci-fixer',
  'schema-architect',
  'security-reviewer',
  'visual-qa',
  'dashboard-ux',
  'test-writer',
]);

const KNOWN_SKILLS = new Set([
  'gf-guide',
  'gateflow',
  'cli-limits',
  'security',
  'testing',
  'visual-qa',
]);

const KNOWN_CLIS = new Set([
  'cursor',
  'claude',
  'codex',
  'opencode',
  'antigravity',
  'kiro',
  'kilo',
  'gemini',
  'qwen',
]);

const GIT_TIMEOUT_MS = 5_000;

function formatGuideUsage() {
  return `GateFlow workspace-aware guide

Usage:
  workflow-v2-guide [--json] [--state <file>]
  workflow-v2-guide status|next|prompt|delivery [--json] [--state <file>]

Reads local workspace evidence and prints one safe next command. No mutations.
Subcommands:
  status    Full guide snapshot (default)
  next      First-incomplete-gate selector (nextCommand only)
  prompt    Registry-validated tagged prompt for the next agent/CLI
  delivery  Local Git + optional GitHub PR/check evidence for current HEAD`;
}

function readJson(file, fallback = null) {
  if (!file || !fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ageInHours(value, now) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return Number(((Date.parse(now) - timestamp) / 3_600_000).toFixed(1));
}

function summarizeEvidence(
  items = [],
  now = new Date().toISOString(),
  maxAgeHours = 24
) {
  const normalized = items.map((item) => {
    const createdAt = item.createdAt || item.generatedAt || item.date || null;
    const ageHours = ageInHours(createdAt, now);
    return {
      id: item.id || item.type || item.step || 'evidence',
      createdAt,
      ageHours,
      fresh: ageHours !== null && ageHours >= 0 && ageHours <= maxAgeHours,
      status: item.status || (item.valid === true ? 'passed' : 'unknown'),
    };
  });
  return {
    count: normalized.length,
    fresh: normalized.filter((item) => item.fresh).length,
    stale: normalized.filter((item) => !item.fresh).length,
    items: normalized,
  };
}

function nextCommandFor(state, evidence) {
  const app = state.focusedApp;
  if (!app) {
    const certified = state.sequence.filter(
      (id) => state.apps[id].stage === 'certified'
    );
    return certified.length === state.sequence.length
      ? '/certify integrated-pilot'
      : '/next-app';
  }
  const stage = state.apps[app].stage;
  if (
    ['audited', 'planned', 'developing', 'checking', 'pilot-ready'].includes(
      stage
    ) &&
    evidence.count === 0
  ) {
    return '/audit all';
  }
  return NEXT_COMMAND[stage] || '/progress';
}

function gitSnapshot(root) {
  try {
    const gitOpts = { cwd: root, encoding: 'utf8', timeout: GIT_TIMEOUT_MS };
    const branch = execFileSync(
      'git',
      ['branch', '--show-current'],
      gitOpts
    ).trim();
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], gitOpts).trim();
    const lines = execFileSync('git', ['status', '--short'], gitOpts)
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);
    let upstream = null;
    let aheadBehind = null;
    try {
      upstream = execFileSync(
        'git',
        ['rev-parse', '--abbrev-ref', '@{upstream}'],
        gitOpts
      ).trim();
      try {
        aheadBehind = execFileSync(
          'git',
          ['rev-list', '--left-right', '--count', `${upstream}...HEAD`],
          gitOpts
        ).trim();
      } catch {
        aheadBehind = null;
      }
    } catch {
      upstream = null;
      aheadBehind = null;
    }
    return {
      branch: branch || 'detached',
      commit,
      dirty: lines.length > 0,
      changedFiles: lines.length,
      upstream,
      aheadBehind,
    };
  } catch {
    return {
      branch: 'unknown',
      commit: null,
      dirty: null,
      changedFiles: null,
      upstream: null,
      aheadBehind: null,
    };
  }
}

function pageScoreSummary(root, appState) {
  const file = appState.pageScoresFile
    ? path.resolve(root, appState.pageScoresFile)
    : null;
  const report = readJson(file);
  if (!report) return { status: 'not-recorded', average: null, pages: 0 };
  const pages = Array.isArray(report) ? report : report.pages || [];
  const values = pages.map((page) => page.score).filter(Number.isFinite);
  const average = Number.isFinite(report.average)
    ? report.average
    : values.length
      ? Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(2)
        )
      : null;
  return { status: 'recorded', average, pages: pages.length };
}

function pilotCoverage(appState) {
  const value = appState.pilotFlowCoverage;
  if (!value) return { status: 'not-recorded', covered: 0, total: 0 };
  if (Array.isArray(value)) {
    return {
      status: 'recorded',
      covered: value.filter((item) => item.status === 'passed').length,
      total: value.length,
    };
  }
  return {
    status: 'recorded',
    covered: Number(value.covered || 0),
    total: Number(value.total || 0),
  };
}

function selectionFrom(appState) {
  const selection = appState?.selection || null;
  if (!selection || typeof selection !== 'object') {
    return {
      command: null,
      agent: 'gateflow-guide',
      skills: ['gf-guide'],
      cli: null,
    };
  }
  return {
    command: selection.command || null,
    agent: selection.agent || 'gateflow-guide',
    skills: Array.isArray(selection.skills) ? selection.skills : ['gf-guide'],
    cli: selection.cli || null,
  };
}

function validateSelection(selection) {
  const errors = [];
  if (selection.command && !KNOWN_COMMANDS.has(selection.command)) {
    errors.push(
      `unknown command: ${selection.command} — must be one of the known workflow commands`
    );
  }
  if (selection.agent && !KNOWN_AGENTS.has(selection.agent)) {
    errors.push(`unknown agent: ${selection.agent}`);
  }
  for (const skill of selection.skills || []) {
    if (!KNOWN_SKILLS.has(skill)) errors.push(`unknown skill: ${skill}`);
  }
  if (selection.cli && !KNOWN_CLIS.has(selection.cli)) {
    errors.push(`unknown cli: ${selection.cli}`);
  }
  return errors;
}

function buildGuideSnapshot({ root, state, now = new Date().toISOString() }) {
  const focusedApp = state.focusedApp;
  const appState = focusedApp ? state.apps[focusedApp] : null;
  const evidence = summarizeEvidence(appState?.evidence, now);
  const routes = focusedApp
    ? inventoryRoutes(
        root,
        resolveApp(focusedApp).path,
        resolveApp(focusedApp).type
      )
    : [];
  const selection = selectionFrom(appState);
  const blockers = [];
  if (state.workdirLock)
    blockers.push(`Workdir is locked by ${state.workdirLock.owner}`);
  if (evidence.stale > 0)
    blockers.push(`${evidence.stale} evidence item(s) are stale or undated`);
  const selectionErrors = validateSelection(selection);
  if (selectionErrors.length)
    blockers.push(...selectionErrors.map((error) => `Selection: ${error}`));
  const deliveryCache =
    appState?.delivery && typeof appState.delivery === 'object'
      ? appState.delivery
      : null;
  return {
    generatedAt: now,
    workspaceRoot: root,
    activeApplication: focusedApp,
    currentStage: appState?.stage || 'between-apps',
    currentPlan: appState?.currentPlan || null,
    pilotFlowCoverage: pilotCoverage(appState || {}),
    pageScoreSummary: pageScoreSummary(root, appState || {}),
    selection,
    deliveryCache,
    routeInventory: { count: routes.length },
    evidence,
    blockers,
    git: gitSnapshot(root),
    nextCommand: nextCommandFor(state, evidence),
  };
}

function statusLabel(snapshot) {
  if (snapshot.blockers.length) return 'BLOCKED';
  if (snapshot.nextCommand === '/certify') return 'GATE';
  return 'READY';
}

function copyPrompt(snapshot) {
  const app = snapshot.activeApplication || 'integrated pilot';
  return [
    `Continue GateFlow Workflow v2 for ${app}.`,
    `Current stage: ${snapshot.currentStage}.`,
    `Run ${snapshot.nextCommand} as the only next workflow command.`,
    `Read live workspace state first. Preserve the fixed pilot order: ${PILOT_ORDER}.`,
    'Use dated evidence, report blockers honestly, do not claim browser/device verification from static review, and do not perform remote mutations without explicit authorization.',
    'Return artifacts, verification, risks/blockers, and exactly one next command.',
  ].join('\n');
}

function renderGuidePrompt(snapshot) {
  const agent = snapshot.selection?.agent || 'gateflow-guide';
  const skills = (snapshot.selection?.skills || ['gf-guide']).join(', ');
  const cli = snapshot.selection?.cli || 'cursor';
  const workdir = snapshot.workspaceRoot || process.cwd();
  const text = [
    `[COMMAND] ${snapshot.nextCommand}`,
    `[CLI] ${cli}`,
    `[AGENT] ${agent}`,
    `[SKILLS] ${skills}`,
    `[APP] ${snapshot.activeApplication || 'none'}`,
    `[PLAN] ${snapshot.currentPlan || 'none'}`,
    `[STAGE] ${snapshot.currentStage}`,
    `[WORKDIR] ${workdir}`,
    `[PILOT_ORDER] ${PILOT_ORDER}`,
    '[MUTATION] Local evidence and docs only unless separately authorized. No deploy/migrate/merge.',
    '[EVIDENCE] Prefer dated source-linked findings. Mark static-review-only when browser evidence is absent.',
    '[SCOPE]',
    copyPrompt(snapshot),
  ].join('\n');
  return {
    generatedAt: snapshot.generatedAt,
    command: snapshot.nextCommand,
    agent,
    skills: snapshot.selection?.skills || ['gf-guide'],
    cli,
    app: snapshot.activeApplication,
    plan: snapshot.currentPlan,
    stage: snapshot.currentStage,
    workdir,
    validated: validateSelection(snapshot.selection || {}).length === 0,
    text,
  };
}

function safeGhJson(root, args) {
  try {
    const stdout = execFileSync('gh', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: GIT_TIMEOUT_MS,
    });
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function collectDeliveryEvidence({ root, snapshot }) {
  const git = snapshot.git || gitSnapshot(root);
  const pr =
    git.branch && git.branch !== 'unknown'
      ? safeGhJson(root, [
          'pr',
          'view',
          '--json',
          'number,url,state,isDraft,headRefOid,statusCheckRollup,reviews',
        ])
      : null;
  const checks = Array.isArray(pr?.statusCheckRollup)
    ? pr.statusCheckRollup.map((item) => ({
        name: item.name || item.context || 'check',
        status: item.status || item.state || 'UNKNOWN',
        conclusion: item.conclusion || null,
      }))
    : [];
  const reviews = Array.isArray(pr?.reviews)
    ? pr.reviews.map((item) => ({
        author: item.author?.login || item.author || null,
        state: item.state || null,
      }))
    : [];
  return {
    generatedAt: snapshot.generatedAt || new Date().toISOString(),
    activeApplication: snapshot.activeApplication,
    currentStage: snapshot.currentStage,
    git: {
      branch: git.branch,
      commit: git.commit,
      dirty: git.dirty,
      changedFiles: git.changedFiles,
      upstream: git.upstream,
      aheadBehind: git.aheadBehind,
    },
    pr: pr
      ? {
          number: pr.number,
          url: pr.url,
          state: pr.state,
          isDraft: pr.isDraft,
          headRefOid: pr.headRefOid,
          headMatchesLocal: Boolean(
            pr.headRefOid && git.commit && pr.headRefOid === git.commit
          ),
        }
      : null,
    checks,
    reviews,
    preview: snapshot.deliveryCache?.previewSha
      ? { sourceSha: snapshot.deliveryCache.previewSha }
      : null,
    cachedDelivery: snapshot.deliveryCache || null,
    nextCommand: snapshot.nextCommand,
  };
}

function renderGuide(snapshot) {
  const blockers = snapshot.blockers.length
    ? snapshot.blockers.join('; ')
    : 'None';
  const score =
    snapshot.pageScoreSummary.average === null
      ? 'Not recorded'
      : `${snapshot.pageScoreSummary.average}/100 across ${snapshot.pageScoreSummary.pages} page(s)`;
  const coverage = snapshot.pilotFlowCoverage.total
    ? `${snapshot.pilotFlowCoverage.covered}/${snapshot.pilotFlowCoverage.total}`
    : 'Not recorded';
  const git =
    snapshot.git.dirty === null
      ? 'Unknown'
      : `${snapshot.git.branch}; ${snapshot.git.dirty ? `${snapshot.git.changedFiles} changed file(s)` : 'clean'}`;
  return `# GateFlow Guide

Status: [${statusLabel(snapshot)}]

## Situation

| Signal | Live workspace evidence |
| --- | --- |
| Active application | ${snapshot.activeApplication || 'None'} |
| Current stage | ${snapshot.currentStage} |
| Current plan | ${snapshot.currentPlan || 'None'} |
| Pilot-flow coverage | ${coverage} |
| Page-score summary | ${score} |
| Route inventory | ${snapshot.routeInventory.count} route(s) |
| Evidence freshness | ${snapshot.evidence.fresh} fresh / ${snapshot.evidence.stale} stale or undated |
| Git | ${git} |
| Blockers | ${blockers} |

## Why this is next

The stage and available evidence select one safe transition. Missing or stale evidence routes back to audit instead of allowing an unsupported readiness claim.

## Action

Must do: ${snapshot.blockers.length ? blockers : `Run ${snapshot.nextCommand}.`}

Recommended: Keep work scoped to ${snapshot.activeApplication || 'the integrated pilot'} and attach dated verification.

Critical: Do not bypass focus, certification, tenant/security, merge, release, deployment, or migration gates.

## Copy-ready prompt

\`\`\`text
${copyPrompt(snapshot)}
\`\`\`

## Next command

\`\`\`text
${snapshot.nextCommand}
\`\`\``;
}

function renderGuideNext(payload) {
  const blockers = payload.blockers?.length
    ? payload.blockers.join('; ')
    : 'None';
  return `# GateFlow Guide — next

Active application: ${payload.activeApplication || 'None'}
Current stage: ${payload.currentStage}
Blockers: ${blockers}

## Next command

\`\`\`text
${payload.nextCommand}
\`\`\``;
}

function renderGuideDelivery(delivery) {
  const prLine = delivery.pr
    ? `#${delivery.pr.number} ${delivery.pr.state}${delivery.pr.isDraft ? ' (draft)' : ''} headMatch=${delivery.pr.headMatchesLocal}`
    : 'None (no PR for this branch, or gh unavailable)';
  const checks = delivery.checks.length
    ? delivery.checks
        .map((item) => `${item.name}:${item.conclusion || item.status}`)
        .join(', ')
    : 'None';
  return `# GateFlow Guide — delivery

| Signal | Evidence |
| --- | --- |
| Branch | ${delivery.git.branch} |
| Commit | ${delivery.git.commit || 'unknown'} |
| Dirty | ${delivery.git.dirty} |
| Upstream | ${delivery.git.upstream || 'none'} |
| PR | ${prLine} |
| Checks | ${checks} |
| Preview SHA | ${delivery.preview?.sourceSha || 'not recorded'} |

## Next command

\`\`\`text
${delivery.nextCommand}
\`\`\``;
}

module.exports = {
  buildGuideSnapshot,
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
  GUIDE_SUBCOMMANDS,
  KNOWN_AGENTS,
  KNOWN_CLIS,
  KNOWN_COMMANDS,
  KNOWN_SKILLS,
};
