#!/usr/bin/env node
/**
 * Fail CI when deployable bootstrap/reset routes or known default credentials
 * reappear under apps/ (production build surface).
 */
const fs = require('fs');
const path = require('path');

const APPS_ROOT = path.join(process.cwd(), 'apps');
const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  '__tests__',
  '__mocks__',
]);

const FORBIDDEN_PATH_FRAGMENTS = [
  path.join('api', 'setup', 'reset-admin'),
  path.join('api', 'setup', 'reset_admin'),
];

const FORBIDDEN_PATTERNS = [
  { label: 'default setup secret', regex: /gateflow-setup-2026/g },
  {
    label: 'deployable reset-admin route reference',
    regex: /api\/setup\/reset-admin/g,
  },
];

const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) continue;

    const normalized = fullPath.split(path.sep).join(path.sep);
    for (const fragment of FORBIDDEN_PATH_FRAGMENTS) {
      if (normalized.includes(fragment)) {
        violations.push(`${fullPath}: forbidden bootstrap route path`);
      }
    }

    // Tests may mention forbidden paths when asserting containment; skip content scan.
    if (/\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    for (const { label, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(content)) {
        violations.push(`${fullPath}: ${label}`);
        regex.lastIndex = 0;
      }
    }
  }
}

walk(APPS_ROOT);

if (violations.length > 0) {
  console.error('\x1b[31mBootstrap route / credential guard failed:\x1b[0m');
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log('\x1b[32mBootstrap route guard: clean\x1b[0m');
process.exit(0);
