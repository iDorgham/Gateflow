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

const fs = require('fs');
const path = require('path');
const { parse: parseYaml } = require('yaml');

const BULK_ADVISORY_URL =
  'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk';
const LOCKFILE_PATH = path.join(process.cwd(), 'pnpm-lock.yaml');
const CHUNK_SIZE = 300;
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

// Parse pnpm-lock.yaml into a flat { packageName: Set<version> } map.
// Package keys look like "/name@version" or "/@scope/name@version", with an
// optional "(peerDep@version)(...)" suffix for peer-resolved variants — we
// only need the bare name + version, not the peer suffix.
function loadInstalledVersions() {
  if (!fs.existsSync(LOCKFILE_PATH)) {
    console.error(
      `\x1b[31m  ✗ Lockfile not found at ${LOCKFILE_PATH}\x1b[0m\n`
    );
    process.exit(1);
  }

  const lockfile = parseYaml(fs.readFileSync(LOCKFILE_PATH, 'utf8'));
  const packages = lockfile.packages || {};
  const versionsByName = new Map();

  for (const key of Object.keys(packages)) {
    const withoutLeadingSlash = key.startsWith('/') ? key.slice(1) : key;
    const withoutPeerSuffix = withoutLeadingSlash.replace(/\(.+\)$/, '');
    const lastAt = withoutPeerSuffix.lastIndexOf('@');
    if (lastAt <= 0) continue; // malformed or scope-only entry, skip

    const name = withoutPeerSuffix.slice(0, lastAt);
    const version = withoutPeerSuffix.slice(lastAt + 1);
    if (!name || !version) continue;

    if (!versionsByName.has(name)) versionsByName.set(name, new Set());
    versionsByName.get(name).add(version);
  }

  return versionsByName;
}

function chunk(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

async function queryBulkAdvisories(versionsByName) {
  const entries = [...versionsByName.entries()];
  const chunks = chunk(entries, CHUNK_SIZE);
  const advisoriesByPackage = {};

  for (const batch of chunks) {
    const body = Object.fromEntries(
      batch.map(([name, versions]) => [name, [...versions]])
    );

    const response = await fetch(BULK_ADVISORY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `Bulk advisory endpoint responded ${response.status}: ${text}`
      );
    }

    const result = await response.json();
    for (const [name, advisories] of Object.entries(result)) {
      if (!advisories || advisories.length === 0) continue;
      advisoriesByPackage[name] = (advisoriesByPackage[name] || []).concat(
        advisories
      );
    }
  }

  return advisoriesByPackage;
}

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
