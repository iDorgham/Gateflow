#!/usr/bin/env node
/**
 * check-security.js — Security vulnerability auditor
 *
 * Reads every installed package@version pair from pnpm-lock.yaml and queries
 * npm's bulk advisory endpoint directly. `pnpm audit` (and the underlying
 * `/-/npm/v1/security/audits` endpoint) was retired by the npm registry in
 * July 2026 in favor of `/-/npm/v1/security/advisories/bulk`; this bypasses
 * `pnpm audit` entirely rather than depend on pnpm's own migration to it.
 * Exits with status 1 if any HIGH or CRITICAL issues are found.
 *
 * Usage:
 *   node scripts/check/check-security.js            # report all
 *   node scripts/check/check-security.js --fail     # fail on HIGH/CRITICAL
 *   node scripts/check/check-security.js --level moderate
 *   pnpm check:security
 */

const {
  loadInstalledVersions,
  queryBulkAdvisories,
} = require('../lib/npm-advisories');

const SEVERITY_RANK = { low: 0, moderate: 1, high: 2, critical: 3 };

const args = process.argv.slice(2);
const failMode = args.includes('--fail');
const auditLevel = args.includes('--level')
  ? args[args.indexOf('--level') + 1]
  : 'high';

if (!(auditLevel in SEVERITY_RANK)) {
  console.error(
    `\x1b[31m  ✗ Unknown --level "${auditLevel}". Use one of: low, moderate, high, critical.\x1b[0m\n`
  );
  process.exit(1);
}

console.log(`🔍 Checking vulnerabilities (level: ${auditLevel})...`);

async function main() {
  const versionsByName = loadInstalledVersions();

  let advisoriesByPackage;
  try {
    advisoriesByPackage = await queryBulkAdvisories(versionsByName);
  } catch (err) {
    console.error(
      `\x1b[31m  ✗ Failed to query the npm advisory API: ${err.message}\x1b[0m\n`
    );
    // A network/registry problem isn't the same as a real vulnerability —
    // surface it distinctly rather than silently reporting "clean".
    process.exit(failMode ? 1 : 0);
  }

  const relevant = [];
  for (const [name, advisories] of Object.entries(advisoriesByPackage)) {
    for (const advisory of advisories) {
      const rank = SEVERITY_RANK[advisory.severity] ?? -1;
      if (rank >= SEVERITY_RANK[auditLevel]) {
        relevant.push({ name, ...advisory });
      }
    }
  }

  if (relevant.length === 0) {
    console.log(
      `\x1b[32m  ✓ No ${auditLevel}+ vulnerabilities found (${versionsByName.size} packages checked).\x1b[0m\n`
    );
    process.exit(0);
  }

  console.warn('');
  for (const advisory of relevant) {
    console.warn(
      `  [${advisory.severity.toUpperCase()}] ${advisory.name}: ${advisory.title}`
    );
    console.warn(`    ${advisory.url}`);
  }
  console.warn('');

  const summary = `${relevant.length} ${auditLevel}+ ${
    relevant.length === 1 ? 'vulnerability' : 'vulnerabilities'
  } found`;

  if (failMode) {
    console.error(`\x1b[31m  ✗ ${summary} — fix before deploying.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.warn(
      `\x1b[33m  ⚠️  ${summary} — consider updating dependencies.\x1b[0m\n`
    );
    process.exit(0);
  }
}

main();
