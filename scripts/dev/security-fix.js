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

const { execSync, spawnSync } = require('child_process');
const {
  loadInstalledVersions,
  queryBulkAdvisories,
} = require('../lib/npm-advisories');

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
