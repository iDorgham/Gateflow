#!/usr/bin/env node
/**
 * check-imports.js — Circular import detector
 *
 * Uses static analysis (no madge dependency) to find import cycles
 * across the monorepo. Walks TS/JS files, builds a dependency graph,
 * and runs DFS cycle detection.
 *
 * Usage:
 *   node scripts/check-imports.js              # scan all apps + packages
 *   node scripts/check-imports.js --app client # scan one app
 *   node scripts/check-imports.js --fail       # exit 1 if cycles found (CI mode)
 *   node scripts/check-imports.js --summary    # print count only
 *
 * pnpm check:imports
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SCAN_ROOTS = [
  path.join(ROOT, 'apps', 'client-dashboard', 'src'),
  path.join(ROOT, 'apps', 'admin-dashboard', 'src'),
  path.join(ROOT, 'apps', 'marketing', 'src'),
  path.join(ROOT, 'packages', 'ui', 'src'),
  path.join(ROOT, 'packages', 'types', 'src'),
];

const APP_MAP = {
  client: [path.join(ROOT, 'apps', 'client-dashboard', 'src')],
  admin: [path.join(ROOT, 'apps', 'admin-dashboard', 'src')],
  marketing: [path.join(ROOT, 'apps', 'marketing', 'src')],
  ui: [path.join(ROOT, 'packages', 'ui', 'src')],
  types: [path.join(ROOT, 'packages', 'types', 'src')],
};

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.turbo',
  'coverage',
  '__tests__',
  '__mocks__',
]);

// ── File walker ───────────────────────────────────────────────────────────────
function collectFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, results);
    } else if (EXTENSIONS.includes(path.extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

// ── Import extractor ──────────────────────────────────────────────────────────
const IMPORT_RE =
  /(?:import|export)\s+(?:[\w*{},\s]+\s+from\s+)?['"]([^'"]+)['"]/g;
const REQUIRE_RE = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function extractImports(content) {
  const imports = new Set();
  let m;
  while ((m = IMPORT_RE.exec(content)) !== null) imports.add(m[1]);
  IMPORT_RE.lastIndex = 0;
  while ((m = REQUIRE_RE.exec(content)) !== null) imports.add(m[1]);
  REQUIRE_RE.lastIndex = 0;
  return [...imports];
}

function resolveImport(fromFile, importPath, allFiles) {
  if (!importPath.startsWith('.')) return null; // external package

  const fromDir = path.dirname(fromFile);
  const base = path.resolve(fromDir, importPath);

  // Try exact match then extensions then index files
  const candidates = [
    base,
    ...EXTENSIONS.map((e) => base + e),
    ...EXTENSIONS.map((e) => path.join(base, 'index' + e)),
  ];

  for (const c of candidates) {
    if (allFiles.has(c)) return c;
  }
  return null;
}

// ── Cycle detection (DFS) ─────────────────────────────────────────────────────
function findCycles(graph) {
  const visited = new Set();
  const inStack = new Set();
  const cycles = [];

  function dfs(node, stack) {
    visited.add(node);
    inStack.add(node);
    stack.push(node);

    for (const dep of graph.get(node) || []) {
      if (!visited.has(dep)) {
        dfs(dep, stack);
      } else if (inStack.has(dep)) {
        // Found a cycle — extract the cycle portion of the stack
        const cycleStart = stack.indexOf(dep);
        const cycle = [...stack.slice(cycleStart), dep];
        cycles.push(cycle);
      }
    }

    stack.pop();
    inStack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) dfs(node, []);
  }

  // Deduplicate cycles (same set of nodes, different starting point)
  const seen = new Set();
  return cycles.filter((cycle) => {
    const key = [...cycle].sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const appArg = args.includes('--app') ? args[args.indexOf('--app') + 1] : null;
const failMode = args.includes('--fail');
const summary = args.includes('--summary');

const roots = appArg
  ? APP_MAP[appArg] ||
    (() => {
      console.error(
        `Unknown app "${appArg}". Valid: ${Object.keys(APP_MAP).join(', ')}`
      );
      process.exit(1);
    })()
  : SCAN_ROOTS;

const allFilesArr = roots.flatMap((r) => collectFiles(r));
const allFiles = new Set(allFilesArr);

// Build dependency graph
const graph = new Map();
for (const file of allFilesArr) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  const imports = extractImports(content);
  const deps = [];

  for (const imp of imports) {
    const resolved = resolveImport(file, imp, allFiles);
    if (resolved) deps.push(resolved);
  }

  graph.set(file, deps);
}

const cycles = findCycles(graph);

if (cycles.length === 0) {
  console.log(
    `✓ No circular imports detected (scanned ${allFilesArr.length} files).`
  );
  process.exit(0);
}

if (summary) {
  console.log(
    `⚠️  ${cycles.length} circular import cycle(s) detected across ${allFilesArr.length} files.`
  );
  process.exit(failMode ? 1 : 0);
}

console.log(`\n🔄 Circular Import Cycles (${cycles.length} found)\n`);

for (let i = 0; i < cycles.length; i++) {
  const cycle = cycles[i];
  console.log(
    `── Cycle ${i + 1} (${cycle.length - 1} files) ──────────────────`
  );
  for (let j = 0; j < cycle.length; j++) {
    const rel = path.relative(ROOT, cycle[j]);
    const arrow = j < cycle.length - 1 ? '  →' : '  ↩  (back to start)';
    console.log(`${arrow}  ${rel}`);
  }
  console.log('');
}

console.log(
  `Total: ${cycles.length} cycle(s) in ${allFilesArr.length} files scanned.`
);
console.log(
  `\nFix: break cycles by extracting shared types/constants to a separate file`
);
console.log(
  `     or by using dependency injection instead of direct imports.\n`
);

process.exit(failMode ? 1 : 0);
