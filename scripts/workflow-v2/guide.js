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

function readJson(file, fallback = null) {
  if (!file || !fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ageInHours(value, now) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return Number(((Date.parse(now) - timestamp) / 3_600_000).toFixed(1));
}

function summarizeEvidence(items = [], now = new Date().toISOString(), maxAgeHours = 24) {
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
    const certified = state.sequence.filter((id) => state.apps[id].stage === 'certified');
    return certified.length === state.sequence.length ? '/certify integrated-pilot' : '/next-app';
  }
  const stage = state.apps[app].stage;
  if (['audited', 'planned', 'developing', 'checking', 'pilot-ready'].includes(stage)
    && evidence.count === 0) {
    return '/audit all';
  }
  return NEXT_COMMAND[stage] || '/progress';
}

function gitSnapshot(root) {
  try {
    const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
    const lines = execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' })
      .trim().split(/\r?\n/).filter(Boolean);
    return { branch: branch || 'detached', dirty: lines.length > 0, changedFiles: lines.length };
  } catch {
    return { branch: 'unknown', dirty: null, changedFiles: null };
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
    : values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : null;
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

function buildGuideSnapshot({ root, state, now = new Date().toISOString() }) {
  const focusedApp = state.focusedApp;
  const appState = focusedApp ? state.apps[focusedApp] : null;
  const evidence = summarizeEvidence(appState?.evidence, now);
  const routes = focusedApp
    ? inventoryRoutes(root, resolveApp(focusedApp).path, resolveApp(focusedApp).type)
    : [];
  const blockers = [];
  if (state.workdirLock) blockers.push(`Workdir is locked by ${state.workdirLock.owner}`);
  if (evidence.stale > 0) blockers.push(`${evidence.stale} evidence item(s) are stale or undated`);
  return {
    generatedAt: now,
    activeApplication: focusedApp,
    currentStage: appState?.stage || 'between-apps',
    currentPlan: appState?.currentPlan || null,
    pilotFlowCoverage: pilotCoverage(appState || {}),
    pageScoreSummary: pageScoreSummary(root, appState || {}),
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
    'Read live workspace state first. Preserve the fixed pilot order: Client Dashboard → Resident Portal → Scanner App → integrated pilot.',
    'Use dated evidence, report blockers honestly, do not claim browser/device verification from static review, and do not perform remote mutations without explicit authorization.',
    'Return artifacts, verification, risks/blockers, and exactly one next command.',
  ].join('\n');
}

function renderGuide(snapshot) {
  const blockers = snapshot.blockers.length ? snapshot.blockers.join('; ') : 'None';
  const score = snapshot.pageScoreSummary.average === null
    ? 'Not recorded'
    : `${snapshot.pageScoreSummary.average}/100 across ${snapshot.pageScoreSummary.pages} page(s)`;
  const coverage = snapshot.pilotFlowCoverage.total
    ? `${snapshot.pilotFlowCoverage.covered}/${snapshot.pilotFlowCoverage.total}`
    : 'Not recorded';
  const git = snapshot.git.dirty === null
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

module.exports = {
  buildGuideSnapshot,
  copyPrompt,
  nextCommandFor,
  renderGuide,
  summarizeEvidence,
};
