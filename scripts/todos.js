#!/usr/bin/env node
/**
 * todos.js — TODO/FIXME/HACK/HACK technical debt report
 *
 * Scans the entire codebase for technical debt markers,
 * enriches each with git blame (author + age), and outputs
 * a sorted report grouped by severity.
 *
 * Usage:
 *   node scripts/todos.js                  # full report
 *   node scripts/todos.js --type TODO      # filter by type
 *   node scripts/todos.js --app client     # filter by app/package
 *   node scripts/todos.js --old 30         # only items older than N days
 *   node scripts/todos.js --json           # JSON output
 *   pnpm check:todos
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = [
  'apps/client-dashboard/src',
  'apps/admin-dashboard/src',
  'apps/marketing/src',
  'apps/scanner-app/src',
  'packages/ui/src',
  'packages/types/src',
  'packages/db/src',
  'scripts',
];

const APP_FILTER_MAP = {
  client: 'apps/client-dashboard',
  admin: 'apps/admin-dashboard',
  marketing: 'apps/marketing',
  scanner: 'apps/scanner-app',
  ui: 'packages/ui',
  types: 'packages/types',
  db: 'packages/db',
};

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.turbo',
  'coverage',
]);

// Markers in priority order
const MARKERS = [
  { tag: 'FIXME', priority: 1, icon: '🔴', label: 'Must Fix' },
  { tag: 'HACK', priority: 2, icon: '🟠', label: 'Hack/Workaround' },
  { tag: 'TODO', priority: 3, icon: '🟡', label: 'To Do' },
  { tag: 'NOTE', priority: 4, icon: '🔵', label: 'Note' },
  { tag: 'XXX', priority: 1, icon: '🔴', label: 'Must Fix' },
];

const MARKER_RE = new RegExp(
  `//\\s*(${MARKERS.map((m) => m.tag).join('|')})[:\\s]?(.*)`,
  'i'
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function collectFiles(dir, results = []) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return results;
  for (const entry of fs.readdirSync(full)) {
    if (SKIP_DIRS.has(entry)) continue;
    const entryPath = path.join(full, entry);
    const stat = fs.statSync(entryPath);
    if (stat.isDirectory()) {
      collectFiles(path.join(dir, entry), results);
    } else if (EXTENSIONS.has(path.extname(entry))) {
      results.push(path.join(dir, entry)); // relative to ROOT
    }
  }
  return results;
}

function gitBlame(relFile, lineNum) {
  try {
    const out = execSync(
      `git blame -L ${lineNum},${lineNum} --porcelain "${relFile}"`,
      { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }
    );
    const authorLine = out.match(/^author (.+)/m);
    const timestampLine = out.match(/^author-time (\d+)/m);
    const author = authorLine ? authorLine[1].trim() : 'unknown';
    const ts = timestampLine ? parseInt(timestampLine[1], 10) : null;
    const date = ts ? new Date(ts * 1000).toISOString().split('T')[0] : null;
    const ageDays = ts ? Math.floor((Date.now() - ts * 1000) / 86400000) : null;
    return { author, date, ageDays };
  } catch {
    return { author: 'unknown', date: null, ageDays: null };
  }
}

// ── Scan ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const typeFilter = args.includes('--type')
  ? args[args.indexOf('--type') + 1]?.toUpperCase()
  : null;
const appFilter = args.includes('--app')
  ? args[args.indexOf('--app') + 1]
  : null;
const oldDays = args.includes('--old')
  ? parseInt(args[args.indexOf('--old') + 1], 10)
  : null;
const jsonMode = args.includes('--json');

let scanDirs = SCAN_DIRS;
if (appFilter) {
  const prefix = APP_FILTER_MAP[appFilter];
  if (!prefix) {
    console.error(
      `Unknown app "${appFilter}". Valid: ${Object.keys(APP_FILTER_MAP).join(', ')}`
    );
    process.exit(1);
  }
  scanDirs = SCAN_DIRS.filter((d) => d.startsWith(prefix));
}

const files = scanDirs.flatMap((d) => collectFiles(d));
const results = [];

for (const relFile of files) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(ROOT, relFile), 'utf8').split('\n');
  } catch {
    continue;
  }

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(MARKER_RE);
    if (!match) continue;

    const tag = match[1].toUpperCase();
    const text = match[2].trim();
    const marker =
      MARKERS.find((m) => m.tag === tag) ||
      MARKERS.find((m) => m.tag === 'TODO');

    if (typeFilter && tag !== typeFilter) continue;

    const blame = gitBlame(relFile, i + 1);
    if (oldDays && (blame.ageDays === null || blame.ageDays < oldDays))
      continue;

    results.push({
      tag,
      priority: marker.priority,
      icon: marker.icon,
      label: marker.label,
      text,
      file: relFile,
      line: i + 1,
      ...blame,
    });
  }
}

// Sort by priority then age (oldest first)
results.sort((a, b) =>
  a.priority !== b.priority
    ? a.priority - b.priority
    : (b.ageDays ?? 0) - (a.ageDays ?? 0)
);

if (jsonMode) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

if (results.length === 0) {
  console.log(
    `✓ No TODO/FIXME/HACK markers found (scanned ${files.length} files).`
  );
  process.exit(0);
}

// ── Print report ──────────────────────────────────────────────────────────────
console.log(
  `\n📋 Technical Debt Report — ${results.length} item(s) in ${files.length} files\n`
);

let currentLabel = null;
for (const r of results) {
  if (r.label !== currentLabel) {
    currentLabel = r.label;
    console.log(`\n${r.icon}  ${r.label.toUpperCase()}\n${'─'.repeat(60)}`);
  }
  const age = r.ageDays !== null ? `${r.ageDays}d ago` : 'unknown age';
  const who = r.author !== 'Not Committed Yet' ? r.author : 'uncommitted';
  console.log(`  ${r.file}:${r.line}`);
  console.log(`  ${r.tag}: ${r.text || '(no description)'}`);
  console.log(`  └─ ${who} · ${r.date ?? '?'} (${age})\n`);
}

// Summary by tag
const tagCounts = {};
for (const r of results) tagCounts[r.tag] = (tagCounts[r.tag] || 0) + 1;
console.log('─'.repeat(60));
console.log(
  'Summary: ' +
    Object.entries(tagCounts)
      .map(([k, v]) => `${k}: ${v}`)
      .join('  │  ')
);
console.log('');
