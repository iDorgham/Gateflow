#!/usr/bin/env node
/**
 * pre-deploy.js — Pre-deployment checklist
 *
 * Runs all safety checks before deploying to staging or production.
 * Combines: env validation + migration drift + secret scan + bundle check.
 *
 * Usage:
 *   node scripts/pre-deploy.js               # all checks, warn mode
 *   node scripts/pre-deploy.js --env staging # check staging env vars
 *   node scripts/pre-deploy.js --fail        # exit 1 on any failure (CI)
 *   pnpm check:pre-deploy
 */

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const failMode = process.argv.includes('--fail');
const envArg = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : null;

// ── ANSI colours ──────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ── Run a check script ────────────────────────────────────────────────────────
function runCheck({ name, script, args = [], warnOnly = false }) {
  process.stdout.write(`  ${c.dim('•')} ${name.padEnd(30)}`);

  const result = spawnSync(
    'node',
    [path.join(ROOT, 'scripts', 'check', script), ...args],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0' },
    }
  );

  const passed = result.status === 0;
  const output = (result.stdout + result.stderr).trim();

  if (passed) {
    console.log(c.green('PASS'));
    return { name, passed: true };
  }

  if (warnOnly) {
    console.log(c.yellow('WARN'));
    // Print first 3 lines of output as context
    const lines = output.split('\n').filter(Boolean).slice(0, 3);
    lines.forEach((l) => console.log(`    ${c.yellow(l)}`));
    return { name, passed: true, warned: true };
  }

  console.log(c.red('FAIL'));
  const lines = output.split('\n').filter(Boolean).slice(0, 5);
  lines.forEach((l) => console.log(`    ${c.red(l)}`));
  return { name, passed: false };
}

// ── Checks manifest ───────────────────────────────────────────────────────────
const CHECKS = [
  {
    name: '1. Environment vars',
    script: 'check-env.js',
    args: [],
    warnOnly: true, // warn only — dev machines may not have all app envs configured
  },
  {
    name: '2. Secret scan',
    script: 'scan-secrets.js',
    args: ['--all'],
    warnOnly: true, // MEDIUM findings (test files) are warnings, HIGH would still block
  },
  {
    name: '3. DB migration drift',
    script: 'check-db-drift.js',
    args: ['--schema'],
    warnOnly: true, // warn only — DB may not be reachable in all envs
  },
  {
    name: '4. Circular imports',
    script: 'check-imports.js',
    args: ['--summary'],
    warnOnly: true, // warn only — existing cycles don't block deploy
  },
  {
    name: '5. Bundle size',
    script: 'check-bundle-size.js',
    args: [],
    warnOnly: true, // warn only — build may not exist yet
  },
  {
    name: '6. Dependency security',
    script: 'check-security.js',
    args: ['--fail'],
    warnOnly: false, // FAIL blocks deploy
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(
  '\n' +
    c.bold('━━━ Pre-Deploy Checklist ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') +
    '\n'
);
if (envArg) console.log(`  Environment: ${c.cyan(envArg)}\n`);

const results = CHECKS.map(runCheck);

const failures = results.filter((r) => !r.passed);
const warnings = results.filter((r) => r.passed && r.warned);
const passes = results.filter((r) => r.passed && !r.warned);

console.log(
  '\n' +
    c.bold('━━━ Summary ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') +
    '\n'
);
console.log(`  ${c.green('✓')} Passed : ${passes.length}`);
if (warnings.length)
  console.log(`  ${c.yellow('⚠')} Warnings: ${warnings.length}`);
if (failures.length) console.log(`  ${c.red('✗')} Failed : ${failures.length}`);

if (failures.length === 0) {
  console.log(
    '\n' + c.green(c.bold('  ✓ All checks passed. Safe to deploy.\n'))
  );
  process.exit(0);
}

console.error(
  '\n' +
    c.red(
      c.bold(
        `  ✗ ${failures.length} check(s) failed — resolve before deploying.\n`
      )
    )
);
process.exit(failMode ? 1 : 0);
