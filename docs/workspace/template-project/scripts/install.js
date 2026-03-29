#!/usr/bin/env node
/**
 * install.js — Workspace Template Scaffolder
 *
 * Programmatically creates the workspace operating system structure
 * in the target project. Run from the target project root:
 *
 *   node path/to/template-project/scripts/install.js
 *
 * Or via package.json script:
 *
 *   pnpm workspace:install
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Config ───────────────────────────────────────────────────────────────────

const TARGET_ROOT = process.cwd();
const TEMPLATE_ROOT = path.resolve(__dirname, '..');

// ─── I/O Helpers ──────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (q) => new Promise((res) => rl.question(q, res));

function log(msg) {
  console.log(`  ${msg}`);
}
function ok(msg) {
  console.log(`  ✓ ${msg}`);
}
function warn(msg) {
  console.log(`  ⚠ ${msg}`);
}

// ─── FS Helpers ───────────────────────────────────────────────────────────────

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeIfAbsent(filePath, content) {
  if (fs.existsSync(filePath)) {
    warn(`Skipped (exists): ${path.relative(TARGET_ROOT, filePath)}`);
    return;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  ok(`Created: ${path.relative(TARGET_ROOT, filePath)}`);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      copyRecursive(path.join(src, entry.name), path.join(dest, entry.name));
    }
  } else {
    ensureDir(path.dirname(dest));
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      ok(`Copied: ${path.relative(TARGET_ROOT, dest)}`);
    } else {
      warn(`Skipped (exists): ${path.relative(TARGET_ROOT, dest)}`);
    }
  }
}

// ─── Scaffold Steps ───────────────────────────────────────────────────────────

function scaffoldPlanFolders() {
  const planFolders = [
    'docs/plan/context',
    'docs/plan/planning',
    'docs/plan/planned',
    'docs/plan/in-progress',
    'docs/plan/done',
    'docs/plan/execution',
    'docs/plan/learning',
  ];
  for (const rel of planFolders) {
    const dir = path.join(TARGET_ROOT, rel);
    ensureDir(dir);
    const keep = path.join(dir, '.gitkeep');
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
  }
  ok('Plan lifecycle folders created');
}

function scaffoldWorkspaceDocs(projectName, slug) {
  const base = path.join(TARGET_ROOT, 'docs/workspace');
  const dirs = [
    'installation',
    'catalog',
    'automation',
    'systems',
    'bootstrap',
    'templates',
    'contracts',
  ];
  for (const d of dirs) ensureDir(path.join(base, d));

  writeIfAbsent(
    path.join(base, 'README.md'),
    `# ${projectName} Workspace\n\nWorkspace operating system for ${projectName}.\n\nSee [installation](installation/README.md) · [catalog](catalog/README.md) · [systems](systems/README.md)\n`
  );
  writeIfAbsent(
    path.join(base, 'CHANGELOG.md'),
    `# Workspace Changelog\n\n## [0.1.0] — Initial workspace setup\n`
  );
  writeIfAbsent(
    path.join(base, 'PRD.md'),
    `# ${projectName} — Product Requirements Document\n\n## Product Overview\n\n> Describe the product here.\n\n## Problem Statement\n\n> What problem does this solve?\n\n## Target Users\n\n> Who is this for?\n\n## Core Features\n\n- Feature 1\n- Feature 2\n\n## MVP Scope\n\n### Phase 1 — Foundation\n\n### Phase 2 — Core Features\n\n### Phase 3 — Polish & Launch\n\n## Non-Goals\n\n- Out of scope item 1\n`
  );

  ok('Workspace docs scaffold created');
}

function scaffoldAiFolders() {
  const opsCore = path.join(TEMPLATE_ROOT, 'ops-core');
  const mappings = [
    { source: 'cursor', target: '.cursor' },
    { source: 'claude', target: '.claude' },
    { source: 'antigravity', target: '.antigravity' },
    { source: 'gemini', target: '.gemini' },
    { source: 'opencode', target: '.opencode' },
  ];
  for (const { source, target } of mappings) {
    const src = path.join(opsCore, source);
    const dest = path.join(TARGET_ROOT, target);
    if (fs.existsSync(src)) {
      copyRecursive(src, dest);
    } else {
      ensureDir(dest);
      warn(`ops-core/${source} not found — created empty ${target}/`);
    }
  }
}

function scaffoldBaselineFiles(projectName) {
  const gitignore = `# Dependencies\nnode_modules/\n.pnpm-store/\n\n# Build\ndist/\n.next/\nout/\nbuild/\n.turbo/\n\n# Env\n.env\n.env.local\n.env.*.local\n\n# OS\n.DS_Store\nThumbs.db\n\n# Logs\n*.log\n\n# Testing\ncoverage/\n`;
  const envExample = `# Database\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n\n# Auth\nNEXTAUTH_SECRET="change-me"\nNEXTAUTH_URL="http://localhost:3000"\n\n# AI\nGEMINI_API_KEY=""\n\n# Redis (optional)\nUPSTASH_REDIS_REST_URL=""\nUPSTASH_REDIS_REST_TOKEN=""\n`;

  writeIfAbsent(path.join(TARGET_ROOT, '.gitignore'), gitignore);
  writeIfAbsent(path.join(TARGET_ROOT, '.env.example'), envExample);

  const ciDir = path.join(TARGET_ROOT, '.github/workflows');
  ensureDir(ciDir);
  writeIfAbsent(
    path.join(ciDir, 'ci.yml'),
    `name: CI\n\non:\n  push:\n    branches: [main, master]\n  pull_request:\n    branches: [main, master]\n\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v4\n        with:\n          version: 8\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: pnpm\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm turbo lint\n      - run: pnpm turbo typecheck\n      - run: pnpm turbo test\n`
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    '\n── Workspace Template Installer ──────────────────────────────\n'
  );
  console.log(`  Target: ${TARGET_ROOT}\n`);

  const projectName =
    (await ask('  Project name (e.g. "MyApp"): ')).trim() || 'MyProject';
  const slug =
    (await ask('  Project slug (e.g. "myapp"): ')).trim() || 'myproject';
  const branch = (await ask('  Default branch [main]: ')).trim() || 'main';

  rl.close();

  console.log(
    '\n── Installing ────────────────────────────────────────────────\n'
  );

  log('Creating plan lifecycle folders...');
  scaffoldPlanFolders();

  log('Creating workspace docs...');
  scaffoldWorkspaceDocs(projectName, slug);

  log('Installing AI operating folders from ops-core...');
  scaffoldAiFolders();

  log('Scaffolding baseline project files...');
  scaffoldBaselineFiles(projectName);

  console.log(`
── Done ──────────────────────────────────────────────────────

  Project : ${projectName}
  Slug    : ${slug}
  Branch  : ${branch}

  Next steps:
  1. Edit docs/workspace/PRD.md with your product requirements
  2. Run: pnpm ai:sync  (after editing ops-core/)
  3. Run: node scripts/template-validate.js  (verify structure)
  4. Complete docs/workspace/POST_INSTALL_CHECKLIST.md
  5. Create your first plan: /plan <slug>

──────────────────────────────────────────────────────────────
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
