#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {
  aggregatePageScores,
  inventoryRoutes,
  resolveApp,
  validatePageScore,
  validateScopeDiff,
  aggregateEvidence,
} = require('./support');

const root = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const command = args[0];
const json = args.includes('--json');
const value = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};
const print = (result) => console.log(json ? JSON.stringify(result, null, 2) : result);

function help() {
  return `Workflow v2 deterministic support

Usage:
  support-cli registry <app> [--json]
  support-cli routes <app> [--json]
  support-cli page-score <file> [--json]
  support-cli score-report <file> [--json]
  support-cli scope-diff <app> [--files <newline-file>] [--json]
  support-cli freshness <file> --max-age-hours <n> [--json]
  support-cli pilot-evidence <file> [--json]

No command performs remote mutations or prints environment values.`;
}

try {
  if (!command || args.includes('--help')) return print(help());
  if (command === 'registry') return print(resolveApp(args[1]));
  if (command === 'routes') {
    const app = resolveApp(args[1]);
    return print(inventoryRoutes(root, app.path, app.type));
  }
  if (command === 'page-score') {
    const score = JSON.parse(fs.readFileSync(path.resolve(args[1]), 'utf8'));
    const result = validatePageScore(score);
    if (!result.valid) process.exitCode = 1;
    return print(result);
  }
  if (command === 'score-report') {
    return print(aggregatePageScores(JSON.parse(fs.readFileSync(path.resolve(args[1]), 'utf8'))));
  }
  if (command === 'scope-diff') {
    const files = value('--files')
      ? fs.readFileSync(path.resolve(value('--files')), 'utf8').split(/\r?\n/).filter(Boolean)
      : require('node:child_process').execFileSync('git', ['diff', '--name-only'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
    const errors = validateScopeDiff(args[1], files);
    if (errors.length) process.exitCode = 1;
    return print({ valid: errors.length === 0, errors });
  }
  if (command === 'freshness') {
    const artifact = JSON.parse(fs.readFileSync(path.resolve(args[1]), 'utf8'));
    const maxAge = Number(value('--max-age-hours') || 24) * 60 * 60 * 1000;
    const ageMs = Date.now() - Date.parse(artifact.createdAt || artifact.generatedAt || artifact.date);
    const result = { fresh: Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= maxAge, ageMs, maxAgeMs: maxAge };
    if (!result.fresh) process.exitCode = 1;
    return print(result);
  }
  if (command === 'pilot-evidence') {
    const result = aggregateEvidence(JSON.parse(fs.readFileSync(path.resolve(args[1]), 'utf8')));
    if (!result.ready) process.exitCode = 1;
    return print(result);
  }
  throw new Error(`Unknown command: ${command}`);
} catch (error) {
  console.error(`workflow-v2-support: ${error.message}`);
  process.exitCode = 1;
}
