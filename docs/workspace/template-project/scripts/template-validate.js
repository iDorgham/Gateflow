#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// ─── Required paths (existence checks) ────────────────────────────────────────

const requiredPaths = [
  'docs/workspace/README.md',
  'docs/workspace/CHANGELOG.md',
  'docs/workspace/installation',
  'docs/workspace/catalog',
  'docs/workspace/automation',
  'docs/workspace/systems',
  'docs/workspace/bootstrap',
  'docs/workspace/templates',
  'docs/workspace/contracts',
  'docs/workspace/PRD.md',
  '.cursor',
  '.claude',
  '.antigravity',
  '.gemini',
  '.opencode',
];

// ─── Content checks ───────────────────────────────────────────────────────────

function fileSize(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return 0;
  return fs.statSync(abs).size;
}

function countFilesRecursive(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return 0;
  let count = 0;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else count++;
    }
  };
  walk(abs);
  return count;
}

// ─── Run checks ───────────────────────────────────────────────────────────────

let failed = false;

// Existence checks
const missing = requiredPaths.filter(
  (rel) => !fs.existsSync(path.join(ROOT, rel))
);
if (missing.length > 0) {
  console.error('Template validation failed. Missing required paths:');
  for (const item of missing) console.error(`  - ${item}`);
  failed = true;
}

// Content: docs/workspace/PRD.md must be >200 bytes (not a blank placeholder)
const prdSize = fileSize('docs/workspace/PRD.md');
if (prdSize > 0 && prdSize <= 200) {
  console.error(
    'Content check failed: docs/workspace/PRD.md is ≤200 bytes — fill in your product requirements.'
  );
  failed = true;
} else if (prdSize > 200) {
  console.log('  ✓ docs/workspace/PRD.md has content');
}

// Content: ops-core/ must contain at least 3 files total
const opsCoreFileCount = countFilesRecursive('ops-core');
if (opsCoreFileCount < 3) {
  console.error(
    `Content check failed: ops-core/ contains only ${opsCoreFileCount} file(s) — expected at least 3.`
  );
  failed = true;
} else {
  console.log(`  ✓ ops-core/ has ${opsCoreFileCount} file(s)`);
}

// Content: docs/workspace/catalog/RULES.md must be >100 bytes
const rulesSize = fileSize('docs/workspace/catalog/RULES.md');
if (fs.existsSync(path.join(ROOT, 'docs/workspace/catalog/RULES.md'))) {
  if (rulesSize <= 100) {
    console.error(
      'Content check failed: docs/workspace/catalog/RULES.md is ≤100 bytes — add your rules.'
    );
    failed = true;
  } else {
    console.log('  ✓ docs/workspace/catalog/RULES.md has content');
  }
}

// ─── Result ───────────────────────────────────────────────────────────────────

if (failed) {
  process.exit(1);
}

console.log('Template validation passed.');
