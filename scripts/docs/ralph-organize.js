#!/usr/bin/env node
/**
 * ralph-organize.js — Docs folder cleanup and organization
 *
 * Commands:
 *   node scripts/ralph-organize.js scan      show structure, flag issues
 *   node scripts/ralph-organize.js clean     remove empty dirs + dead symlinks
 *   node scripts/ralph-organize.js index     regenerate docs/INDEX.md
 *   node scripts/ralph-organize.js archive <file>  move file to docs/archive/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
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

const SECTION_META = {
  arch: {
    emoji: '🏗️',
    title: 'Architecture',
    desc: 'System design, project structure, code quality audits',
  },
  core: {
    emoji: '🧠',
    title: 'Core References',
    desc: 'CLAUDE.md, project config, progress dashboard',
  },
  deployment: {
    emoji: '🚀',
    title: 'Deployment Guides',
    desc: 'Per-app deployment and environment setup',
  },
  design: {
    emoji: '🎨',
    title: 'Design & UI',
    desc: 'UI specs, screen drafts, design system notes',
  },
  errors: {
    emoji: '🐛',
    title: 'Error Log',
    desc: 'Documented bugs and resolutions',
  },
  guides: {
    emoji: '📖',
    title: 'Developer Guides',
    desc: 'Dev workflow, security, analytics, component guides',
  },
  plan: {
    emoji: '📋',
    title: 'Plan & Roadmap',
    desc: 'Feature plans, phase prompts, learning log, backlog',
  },
  product: {
    emoji: '📦',
    title: 'Product',
    desc: 'PRD, feature log, upcoming features, marketing notes',
  },
  tools: {
    emoji: '🔧',
    title: 'Tools & Automation',
    desc: 'AI tool configs, antigravity skills reference',
  },
  archive: {
    emoji: '📁',
    title: 'Archive',
    desc: 'Legacy docs, old PRDs, historical plans',
  },
};

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
function buildIndex() {
  console.log('\n📑 Building docs/INDEX.md...\n');
  const topDirs = fs
    .readdirSync(DOCS)
    .filter((n) => {
      if (n.startsWith('.') || n === 'INDEX.md') return false;
      const p = path.join(DOCS, n);
      return fs.statSync(p).isDirectory();
    })
    .sort();

  let lines = [
    '# GateFlow — Documentation Index\n',
    `> Auto-generated by \`ralph-organize.js\` — ${new Date().toISOString().split('T')[0]}\n`,
    '---\n',
  ];

  for (const dir of topDirs) {
    const meta = SECTION_META[dir] || { emoji: '📂', title: dir, desc: '' };
    const files = fs
      .readdirSync(path.join(DOCS, dir))
      .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
      .sort();

    lines.push(`## ${meta.emoji} [${meta.title}](./docs/${dir}/)`);
    if (meta.desc) lines.push(`*${meta.desc}*\n`);

    if (files.length > 0) {
      for (const f of files.slice(0, 10)) {
        // max 10 per section
        const title = f.replace(/\.md$/, '').replace(/_/g, ' ');
        lines.push(`- [${title}](./docs/${dir}/${f})`);
      }
      if (files.length > 10)
        lines.push(`- *(${files.length - 10} more files)*`);
    }

    // Recurse one level for plan subfolders
    if (dir === 'plan') {
      const planDirs = fs
        .readdirSync(path.join(DOCS, 'plan'))
        .filter(
          (d) =>
            !d.startsWith('.') &&
            fs.statSync(path.join(DOCS, 'plan', d)).isDirectory()
        )
        .sort();
      for (const pd of planDirs) {
        const count = fs
          .readdirSync(path.join(DOCS, 'plan', pd))
          .filter((f) => f.endsWith('.md')).length;
        if (count > 0) lines.push(`  - \`${pd}/\` — ${count} files`);
      }
    }

    lines.push('');
  }

  lines.push('---');
  lines.push(
    '*Edit docs using the guides in `docs/guides/DEVELOPMENT_GUIDE.md`*'
  );

  fs.writeFileSync(INDEX, lines.join('\n'));
  console.log(`✓ Generated docs/INDEX.md (${topDirs.length} sections)`);
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
