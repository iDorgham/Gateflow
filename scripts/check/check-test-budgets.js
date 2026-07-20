#!/usr/bin/env node
/**
 * check-test-budgets.js — Enforce decreasing budgets for skipped tests and Jest --forceExit.
 *
 * Budgets live in scripts/check/test-budgets.json. Counts must be <= budget;
 * to raise a budget, update the JSON with owner + reason + expiry in the same PR.
 *
 * Usage:
 *   node scripts/check/check-test-budgets.js
 *   pnpm check:test-budgets
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { getRepoRoot } = require('./repo-root');

const ROOT = getRepoRoot(__dirname);
const BUDGET_PATH = path.join(__dirname, 'test-budgets.json');

function loadBudget() {
  if (!fs.existsSync(BUDGET_PATH)) {
    console.error(`✗ Missing budget file: ${path.relative(ROOT, BUDGET_PATH)}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(BUDGET_PATH, 'utf8'));
}

function countSkippedTests() {
  // Count describe.skip / it.skip / test.skip / xdescribe / xit across apps+packages.
  try {
    const out = execFileSync(
      'rg',
      [
        '--no-heading',
        '-c',
        String.raw`\b(describe|it|test)\.skip\b|\bxdescribe\b|\bxit\b`,
        'apps',
        'packages',
        '--glob',
        '*.{ts,tsx,js,jsx}',
      ],
      { cwd: ROOT, encoding: 'utf8' }
    );
    return out
      .trim()
      .split('\n')
      .filter(Boolean)
      .reduce((sum, line) => {
        const n = Number(line.split(':').pop());
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0);
  } catch (err) {
    // rg exits 1 when no matches
    if (err.status === 1) return 0;
    // Fallback without ripgrep
    let count = 0;
    const re = /\b(describe|it|test)\.skip\b|\bxdescribe\b|\bxit\b/g;
    function walk(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
          entry.name === 'node_modules' ||
          entry.name === '.next' ||
          entry.name === 'dist'
        ) {
          continue;
        }
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          const text = fs.readFileSync(full, 'utf8');
          const matches = text.match(re);
          if (matches) count += matches.length;
        }
      }
    }
    walk(path.join(ROOT, 'apps'));
    walk(path.join(ROOT, 'packages'));
    return count;
  }
}

function countForceExitScripts() {
  let count = 0;
  const roots = [path.join(ROOT, 'apps'), path.join(ROOT, 'packages')];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(root, entry.name, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const scripts = pkg.scripts || {};
      for (const value of Object.values(scripts)) {
        if (typeof value === 'string' && value.includes('--forceExit')) {
          count += 1;
        }
      }
    }
  }
  return count;
}

const budget = loadBudget();
const skipped = countSkippedTests();
const forceExit = countForceExitScripts();

console.log(
  `Test budgets: skipped_tests=${skipped}/${budget.skippedTests.max} forceExit_scripts=${forceExit}/${budget.forceExitScripts.max}`
);

let failed = false;
if (skipped > budget.skippedTests.max) {
  console.error(
    `✗ skipped test count ${skipped} exceeds budget ${budget.skippedTests.max} ` +
      `(owner=${budget.skippedTests.owner} expiry=${budget.skippedTests.expiry})`
  );
  failed = true;
}
if (forceExit > budget.forceExitScripts.max) {
  console.error(
    `✗ --forceExit script count ${forceExit} exceeds budget ${budget.forceExitScripts.max} ` +
      `(owner=${budget.forceExitScripts.owner} expiry=${budget.forceExitScripts.expiry})`
  );
  failed = true;
}

if (failed) process.exit(1);

console.log('✓ Test budgets within approved limits.');
process.exit(0);
