#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getRepoRoot } = require('./repo-root');
const { assertNonZeroScan } = require('./non-zero-scan');

const ROOT = getRepoRoot(__dirname);

const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  'ios',
  'android',
  'Pods',
  '.git',
  '.ai',
  '.agents',
  '.antigravity',
  'artifacts',
  'reference',
  '__tests__',
  '__mocks__',
]);

const IGNORE_PATHS = [
  'packages/db/prisma/',
  'packages/db/scripts/',
  'packages/db/src/legacy-dev-seed.ts',
  'packages/db/src/seed',
  'scripts/',
];

// Specific tenant models that require organizationId scoping
const TENANT_MODELS = [
  'gate',
  'visitor',
  'pass',
  'unit',
  'contact',
  'incident',
  'shiftLog',
  'workOrder',
  'eventLog',
  'project',
  'device',
];

const TENANT_MODEL_REGEX = new RegExp(
  `prisma\\.(${TENANT_MODELS.join('|')})\\.(find|update|delete|create|upsert)`,
  'i'
);

let filesScanned = 0;

function shouldSkipPath(relPath) {
  return (
    IGNORE_PATHS.some((p) => relPath.startsWith(p)) ||
    /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(relPath) ||
    relPath.includes('/scripts/')
  );
}

function scanDir(dir, violations = []) {
  if (!fs.existsSync(dir)) return violations;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const relPath = path.relative(ROOT, fullPath);

    if (file.isDirectory()) {
      if (!IGNORE_DIRS.has(file.name) && !shouldSkipPath(relPath)) {
        scanDir(fullPath, violations);
      }
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      if (shouldSkipPath(relPath)) continue;

      filesScanned++;
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for tenant prisma queries missing organizationId
      if (TENANT_MODEL_REGEX.test(content)) {
        if (
          !content.includes('organizationId') &&
          !content.includes('// skip-organization-check')
        ) {
          violations.push({
            file: relPath,
            type: 'Multi-tenancy violation (tenant model missing organizationId)',
          });
        }
      }

      // Check for console.log of raw sensitive credentials
      if (
        content.match(
          /console\.log\([^)]*,\s*(passwordHash|privateKey|secretKey|serviceRoleKey|jwtSecret)\s*\)/i
        )
      ) {
        violations.push({
          file: relPath,
          type: 'Potential raw secret variable exposure in console.log',
        });
      }
    }
  }
  return violations;
}

const TARGET_DIRS = ['apps', 'packages'];
const violations = [];
for (const target of TARGET_DIRS) {
  scanDir(path.join(ROOT, target), violations);
}

assertNonZeroScan(filesScanned, {
  scannerName: 'enforce-security-invariants',
  context: { roots: TARGET_DIRS },
});

if (violations.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Security Invariant Violations Found:');
  violations.forEach((v) => {
    console.log(`\x1b[33m${v.file}\x1b[0m: ${v.type}`);
  });
  process.exit(1);
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `✅ Security Invariants: Green (scanned ${filesScanned} files)`
  );
  process.exit(0);
}
