#!/usr/bin/env node
/**
 * ralph-organize.js — Docs folder cleanup and organization
 *
 * Commands:
 *   pnpm docs:organize              scan + regenerate INDEX (default)
 *   pnpm docs:index                 regenerate docs/INDEX.md only
 *   pnpm docs:clean                 remove empty dirs + dead symlinks under docs/
 *   node scripts/docs/ralph-organize.js archive <path>  move file to docs/archive/
 */

const fs = require('fs');
const path = require('path');

/** Repository root (parent of `scripts/`) */
const ROOT = path.resolve(__dirname, '../..');
const DOCS = path.join(ROOT, 'docs');
const INDEX = path.join(DOCS, 'INDEX.md');
const ARCHIVE = path.join(DOCS, 'archive');

// ── helpers ───────────────────────────────────────────────────────────────────
function walk(dir, depth = 0, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === '.gitkeep' || name === '.DS_Store') continue;
    const full = path.join(dir, name);
    const stat = fs.lstatSync(full);
    results.push({
      full,
      rel: path.relative(ROOT, full),
      name,
      depth,
      isDir: stat.isDirectory(),
      isSymlink: stat.isSymbolicLink(),
    });
    if (stat.isDirectory() && depth < 3) walk(full, depth + 1, results);
  }
  return results;
}

function isEmptyDir(dir) {
  // Only consider truly empty (not even .gitkeep — those are intentional)
  const entries = fs.readdirSync(dir).filter((f) => f !== '.DS_Store');
  return entries.length === 0;
}

function isDeadSymlink(p) {
  try {
    fs.statSync(p); // follows symlink
    return false;
  } catch {
    return true;
  }
}

// ── INDEX helpers ─────────────────────────────────────────────────────────────
function mdDisplayTitle(filename) {
  return filename.replace(/\.md$/, '').replace(/_/g, ' ');
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
    .sort();
}

function markdownLinkLines(relDir, files, max = 10) {
  const out = [];
  const slice = files.slice(0, max);
  for (const f of slice) {
    out.push(`- [${mdDisplayTitle(f)}](./${relDir}/${f})`);
  }
  if (files.length > max) {
    out.push(`- *(${files.length - max} more files)*`);
  }
  return out;
}

/** Top-level .md only (not subfolders). */
function listTopLevelGuidesMd() {
  const dir = path.join(DOCS, 'guides');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      if (!f.endsWith('.md') || f === '.gitkeep') return false;
      return fs.statSync(path.join(dir, f)).isFile();
    })
    .sort();
}

function countMdRecursive(dir) {
  let n = 0;
  function walk(d) {
    let entries;
    try {
      entries = fs.readdirSync(d);
    } catch {
      return;
    }
    for (const name of entries) {
      if (name === '.DS_Store') continue;
      const full = path.join(d, name);
      let st;
      try {
        st = fs.lstatSync(full);
      } catch {
        continue;
      }
      if (st.isSymbolicLink()) continue;
      if (st.isDirectory()) walk(full);
      else if (name.endsWith('.md')) n++;
    }
  }
  walk(dir);
  return n;
}

function firstReadmeUnderPlanComplete() {
  const complete = path.join(DOCS, 'plan', 'Complete');
  if (!fs.existsSync(complete)) return null;
  const dirs = fs
    .readdirSync(complete)
    .filter((d) => {
      if (d.startsWith('.')) return false;
      return fs.statSync(path.join(complete, d)).isDirectory();
    })
    .sort();
  for (const d of dirs) {
    const readme = path.join(complete, d, 'README.md');
    if (fs.existsSync(readme)) {
      return { slug: d, href: `./plan/Complete/${d}/README.md` };
    }
  }
  return null;
}

// ── SCAN ──────────────────────────────────────────────────────────────────────
function scan() {
  console.log('\n📁 Docs Structure Scan\n');
  const entries = walk(DOCS);
  let emptyDirs = 0,
    deadLinks = 0,
    totalFiles = 0;

  for (const e of entries) {
    const prefix = '  '.repeat(e.depth);
    if (e.isSymlink) {
      const dead = isDeadSymlink(e.full);
      const tag = dead ? ' ⚠ DEAD SYMLINK' : ' → symlink';
      console.log(`${prefix}${e.isDir ? '📂' : '🔗'} ${e.name}${tag}`);
      if (dead) deadLinks++;
    } else if (e.isDir) {
      const empty = isEmptyDir(e.full);
      const tag = empty ? ' (empty)' : '';
      console.log(`${prefix}📂 ${e.name}${tag}`);
      if (empty) emptyDirs++;
    } else {
      console.log(`${prefix}📄 ${e.name}`);
      totalFiles++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files       : ${totalFiles}`);
  console.log(
    `   Empty dirs  : ${emptyDirs}  ${emptyDirs > 0 ? '← run: pnpm docs:organize clean' : '✓'}`
  );
  console.log(
    `   Dead symlinks: ${deadLinks}  ${deadLinks > 0 ? '← run: pnpm docs:organize clean' : '✓'}`
  );
  console.log();
}

// ── CLEAN ─────────────────────────────────────────────────────────────────────
function clean() {
  console.log('\n🧹 Cleaning docs/...\n');
  const entries = walk(DOCS);
  let cleaned = 0;

  // Remove dead symlinks
  for (const e of entries) {
    if (e.isSymlink && isDeadSymlink(e.full)) {
      fs.unlinkSync(e.full);
      console.log(`✓ Removed dead symlink: ${e.rel}`);
      cleaned++;
    }
  }

  // Remove empty dirs (deepest first)
  const dirs = entries.filter((e) => e.isDir && !e.isSymlink).reverse();
  for (const e of dirs) {
    if (fs.existsSync(e.full) && isEmptyDir(e.full)) {
      fs.rmdirSync(e.full);
      console.log(`✓ Removed empty dir:   ${e.rel}`);
      cleaned++;
    }
  }

  if (cleaned === 0) console.log('✓ Nothing to clean — docs/ is already tidy.');
  else console.log(`\n✓ Cleaned ${cleaned} items.`);
}

// ── INDEX ─────────────────────────────────────────────────────────────────────
/**
 * Regenerates docs/INDEX.md. Paths are relative to docs/INDEX.md (under docs/).
 * Layout matches docs/: reference/, guides/, development/, plan/, archive/, tools/.
 */
function buildIndex() {
  console.log('\n📑 Building docs/INDEX.md...\n');
  const today = new Date().toISOString().split('T')[0];

  const lines = [
    '# GateFlow — Documentation Index',
    '',
    `> Auto-generated by \`ralph-organize.js\` — ${today}`,
    '',
    '---',
    '',
  ];

  const arch = listMarkdownFiles(path.join(DOCS, 'reference', 'architecture'));
  lines.push('## 🏗️ [Architecture](./reference/architecture/)');
  lines.push('');
  lines.push('_System design, project structure, code quality audits_');
  lines.push('');
  lines.push(...markdownLinkLines('reference/architecture', arch, 20));
  lines.push('');

  const archiveFiles = listMarkdownFiles(path.join(DOCS, 'archive'));
  lines.push('## 📁 [Archive](./archive/)');
  lines.push('');
  lines.push('_Legacy docs, old PRDs, historical plans_');
  lines.push('');
  lines.push(...markdownLinkLines('archive', archiveFiles, 15));
  lines.push('');

  const workspace = listMarkdownFiles(
    path.join(DOCS, 'reference', 'workspace')
  );
  lines.push('## 🧠 [Core References](./reference/workspace/)');
  lines.push('');
  lines.push('_CLAUDE.md, project config, progress dashboard_');
  lines.push('');
  lines.push(...markdownLinkLines('reference/workspace', workspace, 20));
  lines.push('');

  lines.push('## 🚀 [Deployment](./guides/DEPLOYMENT_GUIDE.md)');
  lines.push('');
  lines.push('_Vercel and release checklists_');
  lines.push('');
  if (fs.existsSync(path.join(DOCS, 'guides', 'DEPLOYMENT_GUIDE.md'))) {
    lines.push('- [DEPLOYMENT GUIDE](./guides/DEPLOYMENT_GUIDE.md)');
  }
  lines.push('');

  const design = listMarkdownFiles(path.join(DOCS, 'guides', 'design'));
  lines.push('## 🎨 [Design & UI](./guides/design/)');
  lines.push('');
  lines.push('_UI specs, screen drafts, design system notes_');
  lines.push('');
  lines.push(...markdownLinkLines('guides/design', design, 15));
  lines.push('');

  lines.push('## 📚 [Reference hub](./reference/README.md)');
  lines.push('');
  lines.push('_Product, workspace, architecture, cache snapshots_');
  lines.push('');
  if (fs.existsSync(path.join(DOCS, 'reference', 'README.md'))) {
    lines.push('- [Reference README](./reference/README.md)');
  }
  lines.push('');

  const topGuides = listTopLevelGuidesMd();
  lines.push('## 📖 [Developer Guides](./guides/)');
  lines.push('');
  lines.push(
    '_Dev workflow, security, analytics, component guides (top-level files)_'
  );
  lines.push('');
  lines.push(...markdownLinkLines('guides', topGuides, 12));
  lines.push('');

  lines.push('## 📋 [Plan & Roadmap](./plan/)');
  lines.push('');
  lines.push('_Plan lifecycle folders, phase prompts, backlog_');
  lines.push('');
  if (fs.existsSync(path.join(DOCS, 'plan', 'README.md'))) {
    lines.push(
      '- [Plan folder README](./plan/README.md) — **Draft/**, **Ready/**, **Active/**, **Complete/**, **backlog/**'
    );
  }
  if (fs.existsSync(path.join(DOCS, 'development', 'README.md'))) {
    lines.push(
      '- [Development & workflow hub](./development/README.md) — guidelines, templates, learning'
    );
  }
  const initReadme = path.join(DOCS, 'development', 'initiatives', 'README.md');
  if (fs.existsSync(initReadme)) {
    lines.push(
      '- [Initiatives (IDEA files)](./development/initiatives/README.md)'
    );
  }
  if (fs.existsSync(path.join(DOCS, 'development', 'PLAN_LIFECYCLE.md'))) {
    lines.push(
      '- Lifecycle: [PLAN_LIFECYCLE.md](./development/PLAN_LIFECYCLE.md)'
    );
  }
  const exampleComplete = firstReadmeUnderPlanComplete();
  if (exampleComplete) {
    lines.push(
      `- Example archive plan: [Complete/${exampleComplete.slug}](${exampleComplete.href})`
    );
  }
  const planRoot = path.join(DOCS, 'plan');
  if (fs.existsSync(planRoot)) {
    const subs = fs
      .readdirSync(planRoot)
      .filter((d) => !d.startsWith('.') && d !== 'README.md')
      .filter((d) => fs.statSync(path.join(planRoot, d)).isDirectory())
      .sort();
    for (const pd of subs) {
      const n = countMdRecursive(path.join(planRoot, pd));
      if (n > 0) {
        lines.push(`- \`${pd}/\` — ${n} markdown files`);
      }
    }
  }
  lines.push('');

  const product = listMarkdownFiles(path.join(DOCS, 'reference', 'product'));
  lines.push('## 📦 [Product](./reference/product/)');
  lines.push('');
  lines.push('_PRD, feature log, upcoming features, marketing notes_');
  lines.push('');
  lines.push(...markdownLinkLines('reference/product', product, 20));
  lines.push('');

  const toolFiles = listMarkdownFiles(path.join(DOCS, 'tools'));
  lines.push('## 🔧 [Tools & Automation](./tools/)');
  lines.push('');
  lines.push('_AI tool configs, automation notes_');
  lines.push('');
  if (toolFiles.length) {
    lines.push(...markdownLinkLines('tools', toolFiles, 15));
  } else {
    lines.push('- _(No top-level markdown in `docs/tools/` yet.)_');
  }
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(
    '_Edit docs using the guides in `docs/guides/DEVELOPMENT_GUIDE.md`_'
  );
  lines.push('');

  fs.writeFileSync(INDEX, lines.join('\n'));
  console.log('✓ Generated docs/INDEX.md');
}

// ── ARCHIVE ───────────────────────────────────────────────────────────────────
function archive(relPath) {
  if (!relPath) {
    console.error('Usage: ralph-organize archive <path>');
    process.exit(1);
  }
  const src = path.resolve(ROOT, relPath);
  if (!fs.existsSync(src)) {
    console.error(`✗ Not found: ${relPath}`);
    process.exit(1);
  }

  fs.mkdirSync(ARCHIVE, { recursive: true });
  const dest = path.join(ARCHIVE, path.basename(src));
  fs.renameSync(src, dest);
  console.log(`✓ Archived: ${relPath} → docs/archive/${path.basename(src)}`);
}

// ── entry ─────────────────────────────────────────────────────────────────────
const [, , cmd, arg1] = process.argv;

switch (cmd) {
  case 'scan':
    scan();
    break;
  case 'clean':
    clean();
    break;
  case 'index':
    buildIndex();
    break;
  case 'archive':
    archive(arg1);
    break;
  default:
    // Default: scan + index
    scan();
    buildIndex();
}
