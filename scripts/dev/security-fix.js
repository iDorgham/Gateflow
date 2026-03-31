#!/usr/bin/env node
/**
 * security-fix.js — Automated dependency security patcher
 *
 * Scans for vulnerabilities and attempts to auto-fix them by
 * updating the specific packages to the latest safe version.
 *
 * Usage:
 *   node scripts/security-fix.js
 *   pnpm check:security:fix
 */

const { execSync, spawnSync } = require('child_process');

console.log('🛡️  Starting automated security fix...');

// 1. Run audit and get JSON output
console.log('🔍 Auditing dependencies...');
let auditData;
try {
  const result = spawnSync(
    'pnpm',
    ['audit', '--json', '--registry', 'https://registry.npmjs.org/'],
    { cwd: process.cwd(), encoding: 'utf8' }
  );
  auditData = JSON.parse(result.stdout);
} catch (e) {
  console.error('❌ Failed to parse pnpm audit output.');
  process.exit(1);
}

const vulnerabilities = auditData.advisories || {};
const packageNames = new Set();

for (const id in vulnerabilities) {
  const advisory = vulnerabilities[id];
  if (advisory.severity === 'high' || advisory.severity === 'critical') {
    packageNames.add(advisory.module_name);
  }
}

if (packageNames.size === 0) {
  console.log('✅ No high/critical vulnerabilities found. Nothing to fix.');
  process.exit(0);
}

console.log(
  `📌 Found ${packageNames.size} vulnerable packages: ${Array.from(packageNames).join(', ')}`
);

// 2. Attempt to update those packages
for (const pkg of packageNames) {
  console.log(`🚀 Updating ${pkg}...`);
  try {
    execSync(`pnpm update ${pkg} --recursive`, { stdio: 'inherit' });
    console.log(`✅ ${pkg} updated.`);
  } catch (e) {
    console.error(
      `❌ Failed to update ${pkg}. Manual intervention may be required.`
    );
  }
}

// 3. Final check
console.log('\n🔍 Verifying fixes...');
const finalAudit = spawnSync(
  'pnpm',
  [
    'audit',
    '--audit-level',
    'high',
    '--registry',
    'https://registry.npmjs.org/',
  ],
  { cwd: process.cwd(), encoding: 'utf8' }
);

if (finalAudit.status === 0) {
  console.log('🎉 All high/critical vulnerabilities resolved!');
} else {
  console.warn(
    '⚠️  Some vulnerabilities remain. Please review the audit report.'
  );
  process.exit(1);
}
