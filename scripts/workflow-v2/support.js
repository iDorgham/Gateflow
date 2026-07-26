const fs = require('node:fs');
const path = require('node:path');
const registry = require('./registry.json');

const CATEGORY_MAX = {
  purpose: 15,
  task: 20,
  hierarchy: 10,
  states: 15,
  design: 10,
  accessibility: 10,
  responsiveRtl: 10,
  performance: 5,
  security: 5,
};

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function resolveApp(id) {
  const value = registry.apps[id];
  if (!value) throw new Error(`Unknown app: ${id}`);
  return { id, ...value };
}

function routeFrom(relative) {
  const segments = relative
    .split(path.sep)
    .filter((segment) => !segment.startsWith('(') && !segment.startsWith('_'))
    .map((segment) => segment.replace(/\.(tsx|ts|jsx|js)$/, ''));
  const last = segments.at(-1);
  if (last === 'page' || last === 'index') segments.pop();
  return `/${segments.join('/')}`.replace(/\/+/g, '/');
}

function inventoryRoutes(root, appPath, type) {
  const base =
    type === 'expo'
      ? path.join(root, appPath, 'app')
      : path.join(root, appPath, 'src', 'app');
  return walk(base)
    .filter((file) =>
      type === 'expo'
        ? /\.(tsx|jsx)$/.test(file) && !path.basename(file).startsWith('_')
        : /^page\.(tsx|ts|jsx|js)$/.test(path.basename(file))
    )
    .filter((file) => !file.includes(`${path.sep}api${path.sep}`))
    .map((file) => ({
      route: routeFrom(path.relative(base, file)),
      file: path.relative(root, file),
      kind: type === 'expo' ? 'screen' : 'page',
    }))
    .sort((a, b) => a.route.localeCompare(b.route));
}

function classify(score) {
  if (score >= 90) return 'pilot-ready';
  if (score >= 80) return 'minor fixes';
  if (score >= 65) return 'needs improvement';
  if (score >= 40) return 'major gaps';
  return 'unusable, missing, or blocked';
}

function validatePageScore(input) {
  const errors = [];
  for (const key of [
    'route',
    'date',
    'commit',
    'locale',
    'viewport',
    'environment',
    'reviewMode',
  ]) {
    if (input?.[key] === undefined || input[key] === '')
      errors.push(`missing ${key}`);
  }
  if (!Array.isArray(input?.evidence) || input.evidence.length === 0)
    errors.push('evidence is required');
  let score = 0;
  for (const [key, max] of Object.entries(CATEGORY_MAX)) {
    const value = input?.categories?.[key];
    if (!Number.isFinite(value) || value < 0 || value > max)
      errors.push(`${key} must be 0-${max}`);
    else score += value;
  }
  if (
    input?.reviewMode !== 'browser-verified' &&
    input?.reviewMode !== 'static-review-only'
  ) {
    errors.push('reviewMode must be browser-verified or static-review-only');
  }
  if (input?.securityBoundaryProven === false) score = Math.min(score, 49);
  return {
    valid: errors.length === 0,
    errors,
    score,
    classification: classify(score),
  };
}

function aggregatePageScores(scores) {
  const pages = scores.map((score) => {
    const result = validatePageScore(score);
    if (!result.valid)
      throw new Error(
        `Invalid page score for ${score.route || 'unknown'}: ${result.errors.join(', ')}`
      );
    return {
      route: score.route,
      score: result.score,
      classification: result.classification,
      reviewMode: score.reviewMode,
    };
  });
  const average = pages.length
    ? pages.reduce((sum, page) => sum + page.score, 0) / pages.length
    : 0;
  return {
    pages,
    average: Number(average.toFixed(2)),
    generatedAt: new Date().toISOString(),
  };
}

function validateScopeDiff(focusedApp, files) {
  const app = resolveApp(focusedApp);
  const allowed = [
    app.path,
    'CHANGELOG.md',
    'package.json',
    'pnpm-lock.yaml',
    'packages/',
    'docs/',
    '.agents/',
    '.antigravity/',
    '.ai/workflow-v2/',
    'scripts/',
  ];
  return files
    .filter(
      (file) => file.startsWith('apps/') && !file.startsWith(`${app.path}/`)
    )
    .map((file) => `${file} is outside focused app ${focusedApp}`)
    .concat(
      files
        .filter(
          (file) =>
            !allowed.some(
              (prefix) => file === prefix || file.startsWith(prefix)
            )
        )
        .map((file) => `${file} is outside Workflow v2 scope`)
    );
}

function aggregateEvidence(items) {
  const blockers = items
    .filter((item) => item.priority === 'P0' && item.status !== 'passed')
    .map((item) => item.step);
  return {
    ready: items.length > 0 && blockers.length === 0,
    blockers,
    steps: items.map(({ step, priority, status, createdAt }) => ({
      step,
      priority,
      status,
      createdAt,
    })),
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  CATEGORY_MAX,
  aggregatePageScores,
  inventoryRoutes,
  resolveApp,
  validatePageScore,
  validateScopeDiff,
  aggregateEvidence,
};
