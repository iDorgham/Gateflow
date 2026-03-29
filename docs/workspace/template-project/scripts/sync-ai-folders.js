#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TEMPLATE_ROOT = path.resolve(__dirname, '..');
const OPS_CORE_ROOT = path.join(TEMPLATE_ROOT, 'ops-core');

const MAPPINGS = [
  { source: 'cursor', target: '.cursor' },
  { source: 'claude', target: '.claude' },
  { source: 'antigravity', target: '.antigravity' },
  { source: 'gemini', target: '.gemini' },
  { source: 'opencode', target: '.opencode' },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Merge strategy: copy files from source into target without deleting files
// that exist in target but not in source. This preserves project-specific
// customisations and IDE-generated files (e.g. .cursor/chat/) that live
// alongside the managed files but are not tracked in ops-core.
function mergeRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcChild = path.join(src, entry.name);
      const destChild = path.join(dest, entry.name);
      mergeRecursive(srcChild, destChild);
    }
    return;
  }

  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function validateCoreFolders() {
  const missing = MAPPINGS.filter(({ source }) => {
    return !fs.existsSync(path.join(OPS_CORE_ROOT, source));
  }).map(({ source }) => source);

  if (missing.length > 0) {
    console.error('Missing required ops-core sources:');
    for (const name of missing) console.error(`- ops-core/${name}`);
    process.exit(1);
  }
}

function syncOne(mapping) {
  const sourceRoot = path.join(OPS_CORE_ROOT, mapping.source);
  const targetRoot = path.join(TEMPLATE_ROOT, mapping.target);

  mergeRecursive(sourceRoot, targetRoot);
  console.log(
    `Synced ${path.relative(TEMPLATE_ROOT, sourceRoot)} -> ${mapping.target}`
  );
}

function main() {
  validateCoreFolders();
  for (const mapping of MAPPINGS) syncOne(mapping);
  console.log('AI folder sync complete.');
}

main();
