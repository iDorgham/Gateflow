#!/usr/bin/env node
/**
 * check-security.js — Security vulnerability auditor
 *
 * Runs 'pnpm audit' and reports vulnerabilities.
 * Exits with status 1 if any HIGH or CRITICAL issues are found.
 * Audit always uses registry.npmjs.org so private/mirror defaults without a security API still get results.
 *
 * Usage:
 *   node scripts/check-security.js            # report all
 *   node scripts/check-security.js --fail    # fail on HIGH/CRITICAL
 *   pnpm check:security
 */

const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const failMode = args.includes('--fail');
const auditLevel = args.includes('--level')
  ? args[args.indexOf('--level') + 1]
  : 'high';

console.log(`🔍 Checking vulnerabilities (level: ${auditLevel})...`);

const result = spawnSync(
  'pnpm',
  [
    'audit',
    '--audit-level',
    auditLevel,
    '--registry',
    'https://registry.npmjs.org/',
  ],
  {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe',
  }
);

const output = result.stdout + result.stderr;

// 1. Success case: no vulnerabilities found at the requested level
if (result.status === 0 || output.includes('No vulnerabilities found')) {
  console.log('\x1b[32m  ✓ No high/critical vulnerabilities found.\x1b[0m\n');
  process.exit(0);
}

// 2. Vulnerabilities found
console.warn(output);

// Report counts
const match = output.match(/(\d+) vulnerabilities found/);
const summary = match ? match[0] : 'Vulnerabilities detected';

if (failMode) {
  console.error(`\x1b[31m  ✗ ${summary} — fix before deploying.\x1b[0m\n`);
  process.exit(1);
} else {
  console.warn(
    `\x1b[33m  ⚠️  ${summary} — consider updating dependencies.\x1b[0m\n`
  );
  process.exit(0);
}
