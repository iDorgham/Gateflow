#!/usr/bin/env node
/**
 * security-fix.js — Automated dependency security patcher
 *
 * Reads every installed package@version pair from pnpm-lock.yaml and queries
 * npm's bulk advisory endpoint directly (see scripts/check/check-security.js
 * for why `pnpm audit` / the old `/-/npm/v1/security/audits` endpoint is no
 * longer used — it was retired by the npm registry). Any package with a
 * HIGH or CRITICAL advisory gets updated via `pnpm update --recursive`, then
 * the advisory query re-runs to confirm the fix landed.
 *
 * Usage:
 *   node scripts/dev/security-fix.js
 *   pnpm check:security:fix
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { parse: parseYaml } = require('yaml');

const BULK_ADVISORY_URL =
  'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk';
const LOCKFILE_PATH = path.join(process.cwd(), 'pnpm-lock.yaml');
const CHUNK_SIZE = 300;

// Package keys look like "/name@version" or "/@scope/name@version", with an
// optional "(peerDep@version)(...)" suffix for peer-resolved variants — we
// only need the bare name + version, not the peer suffix.
function loadInstalledVersions() {
  if (!fs.existsSync(LOCKFILE_PATH)) {
    console.error(`❌ Lockfile not found at ${LOCKFILE_PATH}`);
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

// The bulk endpoint has no auto-fix suggestion field, so we ask the registry
// for the package's current "latest" dist-tag ourselves — informational only,
// the actual upgrade is left to `pnpm update` respecting package.json ranges.
function getLatestVersion(pkg) {
  const result = spawnSync('pnpm', ['view', pkg, 'version'], {
    encoding: 'utf8',
  });
  if (result.status !== 0) return null;
  return result.stdout.trim() || null;
}

function highOrCriticalPackages(advisoriesByPackage) {
  const packages = new Map();
  for (const [name, advisories] of Object.entries(advisoriesByPackage)) {
    const severe = advisories.filter(
      (a) => a.severity === 'high' || a.severity === 'critical'
    );
    if (severe.length > 0) packages.set(name, severe);
  }
  return packages;
}

async function main() {
  console.log('🛡️  Starting automated security fix...');
  console.log('🔍 Auditing dependencies...');

  const versionsByName = loadInstalledVersions();

  let advisoriesByPackage;
  try {
    advisoriesByPackage = await queryBulkAdvisories(versionsByName);
  } catch (err) {
    console.error(`❌ Failed to query the npm advisory API: ${err.message}`);
    process.exit(1);
  }

  const vulnerable = highOrCriticalPackages(advisoriesByPackage);

  if (vulnerable.size === 0) {
    console.log('✅ No high/critical vulnerabilities found. Nothing to fix.');
    process.exit(0);
  }

  console.log(
    `📌 Found ${vulnerable.size} vulnerable packages: ${[...vulnerable.keys()].join(', ')}`
  );
  for (const [name, advisories] of vulnerable) {
    for (const advisory of advisories) {
      console.log(
        `   [${advisory.severity.toUpperCase()}] ${name}: ${advisory.title} (vulnerable: ${advisory.vulnerable_versions})`
      );
    }
  }

  // Attempt to update those packages
  for (const pkg of vulnerable.keys()) {
    const latest = getLatestVersion(pkg);
    console.log(
      latest
        ? `🚀 Updating ${pkg} (latest available: ${latest})...`
        : `🚀 Updating ${pkg}...`
    );
    try {
      execSync(`pnpm update ${pkg} --recursive`, { stdio: 'inherit' });
      console.log(`✅ ${pkg} updated.`);
    } catch (e) {
      console.error(
        `❌ Failed to update ${pkg}. Manual intervention may be required.`
      );
    }
  }

  // Final check — re-query the bulk advisory endpoint against the
  // now-updated lockfile rather than shelling out to `pnpm audit`.
  console.log('\n🔍 Verifying fixes...');
  const finalVersionsByName = loadInstalledVersions();
  let finalAdvisoriesByPackage;
  try {
    finalAdvisoriesByPackage = await queryBulkAdvisories(finalVersionsByName);
  } catch (err) {
    console.error(`❌ Failed to verify fixes: ${err.message}`);
    process.exit(1);
  }

  const stillVulnerable = highOrCriticalPackages(finalAdvisoriesByPackage);

  if (stillVulnerable.size === 0) {
    console.log('🎉 All high/critical vulnerabilities resolved!');
  } else {
    console.warn(
      `⚠️  ${stillVulnerable.size} package(s) still have high/critical vulnerabilities: ${[...stillVulnerable.keys()].join(', ')}. Please review manually.`
    );
    process.exit(1);
  }
}

main();
