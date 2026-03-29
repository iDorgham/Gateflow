#!/usr/bin/env node
/**
 * docs-index.js — Auto-generates docs/README.md
 *
 * Scans all subfolders in docs/, reads their README.md first heading
 * and description, and rebuilds the docs index automatically.
 *
 * Usage:
 *   node scripts/docs-index.js
 *   pnpm docs:index
 *
 * Add to CI or a git hook to keep the index always current.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const OUTPUT = path.join(DOCS_DIR, 'README.md');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0];
}

function readFirstHeading(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^#{1,2}\s+(.+)/);
    if (m) return m[1].trim();
  }
  return null;
}

function readDescription(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let pastHeading = false;
  for (const line of lines) {
    if (!pastHeading && line.match(/^#/)) {
      pastHeading = true;
      continue;
    }
    if (
      pastHeading &&
      line.trim() &&
      !line.startsWith('#') &&
      !line.startsWith('```')
    ) {
      // Strip markdown links and bold for clean description
      return line
        .trim()
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*/g, '')
        .slice(0, 100);
    }
  }
  return '';
}

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORIES = {
  system: {
    icon: '⚙️',
    label: 'System',
    desc: 'AI context layer — cache, memory, learning, ideas',
  },
  workspace: {
    icon: '🧠',
    label: 'Workspace',
    desc: 'AI operating system — rules, agents, skills, commands',
  },
  product: {
    icon: '📋',
    label: 'Product',
    desc: 'PRD, specs, roadmap, requirements',
  },
  arch: {
    icon: '🏗️',
    label: 'Arch',
    desc: 'Architecture decisions and system design',
  },
  api: { icon: '🔌', label: 'API', desc: 'API reference and integration docs' },
  guides: { icon: '📖', label: 'Guides', desc: 'How-to guides and runbooks' },
  decisions: {
    icon: '⚖️',
    label: 'Decisions',
    desc: 'Architecture Decision Records (ADRs)',
  },
};

// ─── Scanner ──────────────────────────────────────────────────────────────────

function scanFolder(folderName) {
  const folderPath = path.join(DOCS_DIR, folderName);
  if (!fs.existsSync(folderPath)) return null;

  const readmePath = path.join(folderPath, 'README.md');
  const heading = readFirstHeading(readmePath) ?? folderName;
  const desc = readDescription(readmePath);

  // Count sub-items (non-README markdown files, direct children only)
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  const mdFiles = files.filter(
    (f) => f.isFile() && f.name.endsWith('.md') && f.name !== 'README.md'
  );
  const subDirs = files.filter((f) => f.isDirectory());

  return {
    folderName,
    heading,
    desc,
    mdFiles: mdFiles.length,
    subDirs: subDirs.length,
  };
}

// ─── Generator ────────────────────────────────────────────────────────────────

function buildIndex() {
  const rows = [];

  for (const [folder, meta] of Object.entries(CATEGORIES)) {
    const info = scanFolder(folder);
    if (!info) continue;

    const count =
      info.mdFiles > 0
        ? `${info.mdFiles} file${info.mdFiles > 1 ? 's' : ''}`
        : info.subDirs > 0
          ? `${info.subDirs} subfolder${info.subDirs > 1 ? 's' : ''}`
          : 'empty';

    rows.push(
      `| ${meta.icon} [**${meta.label}**](./${folder}/) | ${meta.desc} | ${count} |`
    );
  }

  // Also pick up any unknown folders not in CATEGORIES
  const allFolders = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !Object.keys(CATEGORIES).includes(e.name))
    .map((e) => e.name);

  for (const folder of allFolders) {
    const readmePath = path.join(DOCS_DIR, folder, 'README.md');
    const heading = readFirstHeading(readmePath) ?? folder;
    rows.push(`| 📁 [**${heading}**](./${folder}/) | — | — |`);
  }

  return `# Docs

> Auto-generated index. Run \`pnpm docs:index\` to refresh.
> Last updated: ${today()}

---

## Index

| Category | Purpose | Contents |
|----------|---------|---------|
${rows.join('\n')}

---

## Folder Guide

\`\`\`
docs/
├── system/      # ⚙️  AI context — cache, memory, learning, ideas
├── workspace/   # 🧠  Workspace OS — rules, agents, skills, commands
├── product/     # 📋  PRD, specs, roadmap
├── arch/        # 🏗️  Architecture and system design
├── api/         # 🔌  API reference
├── guides/      # 📖  How-to guides and runbooks
└── decisions/   # ⚖️  Architecture Decision Records
\`\`\`

## Conventions

- Every folder has a \`README.md\` — first heading = folder title
- Run \`pnpm docs:index\` after adding a new doc folder to update this index
- Files in \`system/\` are AI context — don't edit manually, use scripts:
  - \`pnpm cache:build\`   — rebuild workspace cache
  - \`pnpm memory:init\`   — initialize memory files
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const content = buildIndex();
  fs.writeFileSync(OUTPUT, content, 'utf8');
  console.log(`✓ docs/README.md rebuilt (${today()})`);

  // Report what was indexed
  for (const folder of Object.keys(CATEGORIES)) {
    const exists = fs.existsSync(path.join(DOCS_DIR, folder));
    console.log(`  ${exists ? '✓' : '—'} ${folder}/`);
  }
}

main();
