#!/usr/bin/env node
/**
 * ralph-docs.js — Automated documentation updates
 *
 * Commands:
 *   changelog add <slug> "<description>" [--type feat|fix|perf|security|chore]
 *   changelog from-commit                  parse latest git commit + add entry
 *   changelog release <version>            close [Unreleased] → [version] header
 *   readme refresh                         update version badge + recent activity
 *   prd feature <slug> <status>            mark feature in PRD (planned/in-progress/done)
 *   release <version> [major|minor|patch]  full release: changelog + version + tag + readme
 *   feature-log                            print all completed features from CHANGELOG
 *
 * Integrated hooks (called by ralph-plan.js, ralph-run.js, husky):
 *   on-plan-done <slug>                    auto changelog + prd update + readme
 *   on-plan-start <slug>                   add "In Progress" entry to PRD
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const CHANGELOG = path.join(ROOT, 'CHANGELOG.md');
const README = path.join(ROOT, 'README.md');
const PRD = path.join(ROOT, 'docs', 'reference', 'product', 'PRD.md');
const FEATURE_LOG = path.join(
  ROOT,
  'docs',
  'reference',
  'product',
  'FEATURE_LOG.md'
);
const UPCOMING = path.join(ROOT, 'docs', 'reference', 'product', 'UPCOMING.md');
const TASKS = path.join(ROOT, 'docs', 'tasks.md');

// ── helpers ───────────────────────────────────────────────────────────────────
// Escape special regex characters to prevent regex injection from CLI args
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function today() {
  return new Date().toISOString().split('T')[0];
}
function version() {
  return (
    JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
      .version || '0.1.0'
  );
}

function git(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return '';
  }
}

function slugToTitle(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── CHANGELOG helpers ─────────────────────────────────────────────────────────
const TYPE_SECTION = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance',
  security: 'Security',
  chore: 'Maintenance',
  docs: 'Documentation',
  refactor: 'Refactoring',
};

/** Monorepo [Unreleased] uses ### Workspace / ### AI Tools / ### Apps (see docs:changelog:check). */
const CHANGELOG_AI_TOOLS_SCOPES = new Set(['ai', 'i18n', 'rtl', 'analytics']);
const CHANGELOG_APPS_SCOPES = new Set([
  'client',
  'admin',
  'scanner',
  'marketing',
  'crm',
  'residents',
  'contacts',
  'units',
  'gates',
  'projects',
  'settings',
]);

function pickTriTrackSubsection(scope) {
  const s = (scope || '').trim().toLowerCase();
  if (CHANGELOG_AI_TOOLS_SCOPES.has(s)) return 'AI Tools';
  if (CHANGELOG_APPS_SCOPES.has(s)) return 'Apps';
  return 'Workspace';
}

/** `- **[Tag]** description` — must match scripts/check/check-changelog.js */
function formatChangelogBullet(scope, description) {
  const label =
    scope && String(scope).trim()
      ? slugToTitle(String(scope).trim())
      : 'Change';
  return `- **[${label}]** ${description}`;
}

function ensureChangelog() {
  if (fs.existsSync(CHANGELOG)) return;
  const ver = version();
  fs.writeFileSync(
    CHANGELOG,
    `# Changelog

All notable changes to GateFlow are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) | [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

*(next release notes go here)*

---

## [${ver}] — ${today()}

### Features
- Initial production release of GateFlow v${ver}
- 6-app monorepo: client-dashboard, admin-dashboard, scanner-app, resident-mobile, resident-portal, marketing
- HMAC-SHA256 QR signing + offline-first scanner architecture
- Multi-tenant Prisma middleware with org-scoped isolation
- Atlassian Design System tokens + full AR/EN RTL support
- GateAI intelligent operations assistant
- Projects CRM: contacts, units, live logs, team management
- Marketing Suite: UTM attribution, Meta Pixel, CRM webhooks
`
  );
  console.log(`✓ Created CHANGELOG.md`);
}

function addChangelogEntry(type, description, slug) {
  ensureChangelog();
  let content = fs.readFileSync(CHANGELOG, 'utf8');
  const startMarker = '## [Unreleased]';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.log('ℹ  No [Unreleased] section — skip changelog');
    return;
  }
  const bodyStart = content.indexOf('\n', startIdx) + 1;
  let bodyEnd = content.length;
  const dashSep = content.indexOf('\n---\n', bodyStart);
  const nextVer = content.indexOf('\n## [', bodyStart);
  if (dashSep !== -1) bodyEnd = Math.min(bodyEnd, dashSep);
  if (nextVer !== -1) bodyEnd = Math.min(bodyEnd, nextVer);

  let unreleasedBody = content.slice(bodyStart, bodyEnd);
  const triTrack =
    /^### Workspace\s*$/m.test(unreleasedBody) &&
    /^### AI Tools\s*$/m.test(unreleasedBody) &&
    /^### Apps\s*$/m.test(unreleasedBody);

  const legacySection = TYPE_SECTION[type] || 'Changes';
  const entry = triTrack
    ? formatChangelogBullet(slug, description)
    : formatChangelogBullet(slug || legacySection, description);

  if (unreleasedBody.includes(entry)) {
    console.log('ℹ  Changelog entry already present — skip');
    return;
  }

  let newBody;
  if (triTrack) {
    const subsection = pickTriTrackSubsection(slug);
    const header = `### ${subsection}\n`;
    const pos = unreleasedBody.indexOf(header);
    if (pos === -1) {
      console.log(
        `ℹ  Changelog: missing ${header.trim()} under [Unreleased] — skip`
      );
      return;
    }
    const insertAt = pos + header.length;
    newBody =
      unreleasedBody.slice(0, insertAt) +
      entry +
      '\n' +
      unreleasedBody.slice(insertAt);
  } else {
    const sectionHeader = `### ${legacySection}\n`;
    if (unreleasedBody.includes(`### ${legacySection}\n`)) {
      const pos = unreleasedBody.indexOf(sectionHeader) + sectionHeader.length;
      newBody =
        unreleasedBody.slice(0, pos) + entry + '\n' + unreleasedBody.slice(pos);
    } else {
      newBody =
        unreleasedBody.trimEnd() + `\n\n### ${legacySection}\n` + entry + '\n';
    }
  }

  content = content.slice(0, bodyStart) + newBody + content.slice(bodyEnd);
  fs.writeFileSync(CHANGELOG, content);
  console.log(`✓ Changelog updated [${type}]: ${description}`);
}

function closeUnreleased(newVersion, releaseName) {
  ensureChangelog();
  let content = fs.readFileSync(CHANGELOG, 'utf8');
  const hasUnreleased = content.includes('## [Unreleased]');
  const emptyUnreleased = [
    '## [Unreleased]',
    '',
    '### Workspace',
    '',
    '- **[Workspace]** tracking next changes',
    '',
    '### AI Tools',
    '',
    '### Apps',
    '',
  ].join('\n');

  const headerTitle =
    releaseName && releaseName.trim()
      ? `[${newVersion}] ${releaseName.trim()}`
      : `[${newVersion}]`;

  if (!hasUnreleased) {
    content = content.replace(
      /^(# Changelog[\s\S]*?---\n)/,
      `$1\n${emptyUnreleased}\n---\n\n## ${headerTitle} — ${today()}\n\n*(See commits for full details)*\n\n---\n`
    );
  } else {
    // Close current Unreleased body under the new version header, keep required stubs.
    content = content.replace(
      '## [Unreleased]',
      `${emptyUnreleased}\n---\n\n## ${headerTitle} — ${today()}`
    );
  }
  fs.writeFileSync(CHANGELOG, content);
  console.log(`✓ CHANGELOG.md: closed [Unreleased] → ${headerTitle}`);
}

// ── README helpers ────────────────────────────────────────────────────────────
function refreshReadme(slug, description) {
  if (!fs.existsSync(README)) {
    console.log('ℹ  README.md not found — skip');
    return;
  }
  let content = fs.readFileSync(README, 'utf8');
  const ver = version();

  // Update / add version badge (supports both version-* and Release-v* styles)
  const versionBadge = `<img src="https://img.shields.io/badge/version-${ver}-blue?style=for-the-badge" alt="version">`;
  const releaseBadge = `<img src="https://img.shields.io/badge/Release-v${ver}-0ea5e9?style=for-the-badge&logo=github" alt="Release v${ver}">`;
  if (content.includes('img.shields.io/badge/Release-v')) {
    content = content.replace(
      /<img src="https:\/\/img\.shields\.io\/badge\/Release-v[^"]*"[^>]*>/,
      releaseBadge
    );
  } else if (content.includes('img.shields.io/badge/version-')) {
    content = content.replace(
      /<img src="https:\/\/img\.shields\.io\/badge\/version-[^"]*"[^>]*>/,
      versionBadge
    );
  } else {
    // Insert version badge near other badges
    content = content.replace(
      /(<a href="#"><img src="https:\/\/img\.shields\.io\/badge\/i18n)/,
      `<a href="#"><img src="https://img.shields.io/badge/version-${ver}-blue?style=for-the-badge" alt="version"></a>\n    $1`
    );
  }

  // Update Recent Engineering Activity section
  if (
    slug &&
    description &&
    content.includes('## 📅 Recent Engineering Activity')
  ) {
    const newEntry = `- **[${slugToTitle(slug)}]:** ${description}`;
    content = content.replace(
      /(## 📅 Recent Engineering Activity\n\n)/,
      `$1${newEntry}\n`
    );

    // Keep only latest 8 bullet entries (trim oldest)
    content = content.replace(
      /(## 📅 Recent Engineering Activity\n\n)((?:- \*\*.*\n){9,})/,
      (_, header, bullets) => {
        const lines = bullets.trim().split('\n');
        return header + lines.slice(0, 8).join('\n') + '\n';
      }
    );
  }

  fs.writeFileSync(README, content);
  console.log(`✓ README.md refreshed (version badge: v${ver})`);
}

// ── FEATURE LOG ───────────────────────────────────────────────────────────────
function updateFeatureLog(slug, status, description) {
  const title = slugToTitle(slug);
  const date = today();

  if (!fs.existsSync(FEATURE_LOG)) {
    fs.writeFileSync(
      FEATURE_LOG,
      `# GateFlow — Feature Log

Chronological record of shipped features.

---

| Date | Feature | Status | Notes |
|------|---------|--------|-------|
`
    );
  }

  let content = fs.readFileSync(FEATURE_LOG, 'utf8');
  const row = `| ${date} | **${title}** | ${status} | ${description || ''} |`;
  content = content.replace(
    /(\| Date \| Feature \| Status \| Notes \|\n\|[-|]+\|\n)/,
    `$1${row}\n`
  );
  fs.writeFileSync(FEATURE_LOG, content);
  console.log(`✓ Feature log updated: [${title}] → ${status}`);
}

// ── UPCOMING ──────────────────────────────────────────────────────────────────
function addUpcoming(slug, description) {
  if (!fs.existsSync(UPCOMING)) {
    fs.writeFileSync(
      UPCOMING,
      `# GateFlow — Upcoming Features

Features in planning or development.

---

## In Planning

## In Development

## Recently Shipped
`
    );
  }

  let content = fs.readFileSync(UPCOMING, 'utf8');
  const title = slugToTitle(slug);
  const entry = `- **${title}:** ${description || 'Details TBD'}`;

  content = content.replace('## In Planning\n', `## In Planning\n${entry}\n`);
  fs.writeFileSync(UPCOMING, content);
  console.log(`✓ Upcoming features updated: ${title}`);
}

function moveUpcomingToShipped(slug) {
  if (!fs.existsSync(UPCOMING)) return;
  const title = slugToTitle(slug);
  let content = fs.readFileSync(UPCOMING, 'utf8');
  const pattern = new RegExp(`- \\*\\*${escapeRegExp(title)}[^\\n]*\\n`);
  const match = content.match(pattern);
  if (!match) return;

  // Remove from In Planning / In Development
  content = content.replace(pattern, '');
  // Add to Recently Shipped
  content = content.replace(
    '## Recently Shipped\n',
    `## Recently Shipped\n- **${title}** — shipped ${today()}\n`
  );
  fs.writeFileSync(UPCOMING, content);
  console.log(`✓ Moved "${title}" to Recently Shipped`);
}

// ── PRD helper ────────────────────────────────────────────────────────────────
function updatePrd(slug, status) {
  if (!fs.existsSync(PRD)) {
    console.log('ℹ  PRD not found — skip');
    return;
  }
  let content = fs.readFileSync(PRD, 'utf8');
  const title = slugToTitle(slug);
  const statusLine = `**Status:** ${status} | Last updated: ${today()}`;

  if (content.includes(title)) {
    // Replace existing status line near the slug mention
    content = content.replace(
      new RegExp(
        `(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]{0,200}?)\\*\\*Status:\\*\\*[^\\n]*`
      ),
      `$1${statusLine}`
    );
  } else {
    // Append new entry to Phase 3 In Progress section or a changelog section
    const entry = `\n### ${title}\n${statusLine}\n`;
    content = content + entry;
  }

  fs.writeFileSync(PRD, content);
  console.log(`✓ PRD updated: [${title}] → ${status}`);
}

// ── TASKS helpers ─────────────────────────────────────────────────────────────
const APP_HEADERS = [
  { key: 'admin', header: '### 🛡️ Admin Dashboard' },
  { key: 'client', header: '### 🏢 Client Dashboard' },
  { key: 'scanner', header: '### 🤳 Scanner App' },
  { key: 'resident-mobile', header: '### 📱 Resident Mobile' },
  { key: 'resident-portal', header: '### 🌐 Resident Portal' },
  { key: 'marketing', header: '### 📣 Marketing Website' },
];

function updateTasksSync(slug, notes) {
  if (!fs.existsSync(TASKS)) return;
  const title = slugToTitle(slug);
  let content = fs.readFileSync(TASKS, 'utf8');

  // If the task exists as a bullet [ ], mark it [x] and add notes
  const pattern = new RegExp(
    `- \\[ \\] ([^\\n]*${escapeRegExp(title)}[^\\n]*)`,
    'i'
  );
  if (pattern.test(content)) {
    content = content.replace(pattern, `- [x] $1 — *completed ${today()}*`);
    console.log(`✓ TASKS.md: marked "${title}" as complete`);
  } else {
    // Attempt to find the specific app section
    const s = (slug || '').toLowerCase();
    const appInfo = APP_HEADERS.find((h) => s.includes(h.key));
    const header = appInfo ? appInfo.header : '## 🛠️ Unfinished Tasks';

    const pos = content.indexOf(header);
    if (pos !== -1) {
      let end = content.indexOf('\n---', pos);
      if (end === -1) end = content.indexOf('\n## ', pos + 1);
      if (end === -1) end = content.length;

      const section = content.slice(pos, end);
      if (!section.includes(title)) {
        content =
          content.slice(0, end) +
          `\n- [x] **${title}** — ${notes || '✅ Shipped'}\n` +
          content.slice(end);
        console.log(`✓ TASKS.md: added "${title}" to ${header.slice(4)}`);
      }
    }
  }

  fs.writeFileSync(TASKS, content);
}

// ── from-commit: parse latest commit msg ─────────────────────────────────────
function fromCommit() {
  const msg = git('git log -1 --pretty=%s');
  if (!msg) {
    console.log('ℹ  No commit found');
    return;
  }

  // Conventional commit: feat(slug): description
  const m = msg.match(
    /^(feat|fix|perf|security|chore|docs|refactor)\(([^)]+)\):\s*(.+)/
  );
  if (!m) {
    console.log(`ℹ  Commit "${msg}" is not conventional — skip changelog`);
    return;
  }

  const [, type, scope, desc] = m;
  if (!['feat', 'fix', 'perf', 'security'].includes(type)) {
    console.log(
      `ℹ  Type "${type}" — skip auto-changelog (feat/fix/perf/security only)`
    );
    return;
  }
  addChangelogEntry(type, desc, scope);
  if (type === 'feat') refreshReadme(scope, desc);
}

// ── COMMANDS ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const cmd = args[0];
const sub = args[1];

switch (cmd) {
  case 'changelog': {
    if (sub === 'add') {
      const slug = args[2];
      const descIdx = args.findIndex(
        (a) => !a.startsWith('--') && args.indexOf(a) > 2
      );
      const desc =
        args.slice(2).find((a) => !a.startsWith('--') && a !== slug) || slug;
      const typeIdx = args.indexOf('--type');
      const type = typeIdx !== -1 ? args[typeIdx + 1] : 'feat';
      addChangelogEntry(type, desc, slug);
    } else if (sub === 'from-commit') {
      fromCommit();
    } else if (sub === 'release') {
      const ver = args[2] || version();
      const name = args
        .slice(3)
        .filter((a) => !a.startsWith('--'))
        .join(' ');
      closeUnreleased(ver, name);
    } else {
      console.log(
        'Usage: ralph-docs changelog [add <slug> "<desc>" | from-commit | release <version> [name]]'
      );
    }
    break;
  }

  case 'readme': {
    if (sub === 'refresh') {
      refreshReadme(args[2], args[3]);
    } else {
      refreshReadme();
    }
    break;
  }

  case 'prd': {
    if (sub === 'feature') {
      updatePrd(args[2], args[3] || 'In Progress');
    } else {
      console.log('Usage: ralph-docs prd feature <slug> <status>');
    }
    break;
  }

  case 'feature-log': {
    updateFeatureLog(args[1], args[2] || '✅ Shipped', args[3]);
    break;
  }

  case 'upcoming': {
    if (sub === 'add') addUpcoming(args[2], args.slice(3).join(' '));
    if (sub === 'shipped') moveUpcomingToShipped(args[2]);
    break;
  }
  case 'tasks': {
    updateTasksSync(args[2], args.slice(3).join(' '));
    break;
  }

  // ── Lifecycle hooks (called by ralph-plan.js) ─────────────────────────────
  case 'on-plan-start': {
    const slug = args[1];
    if (!slug) break;
    addChangelogEntry(
      'chore',
      `Started development of ${slugToTitle(slug)}`,
      slug
    );
    updatePrd(slug, 'In Progress');
    addUpcoming(slug, `Active development — see docs/plan/Active/${slug}/`);
    break;
  }

  case 'on-plan-done': {
    const slug = args[1];
    if (!slug) break;
    const desc =
      args.slice(2).join(' ') || `Completed all phases of ${slugToTitle(slug)}`;
    addChangelogEntry('feat', desc, slug);
    updateFeatureLog(slug, '✅ Shipped', desc);
    moveUpcomingToShipped(slug);
    updatePrd(slug, '✅ Complete');
    updateTasksSync(slug, desc);
    refreshReadme(slug, desc);
    console.log(`\n✅ Docs updated for: ${slug}`);
    break;
  }

  // ── Full release flow ─────────────────────────────────────────────────────
  case 'release': {
    const dryRun = args.includes('--dry-run') || args.includes('--dry');
    const positional = args.slice(1).filter((a) => !a.startsWith('--'));
    const newVer = positional[0];
    const releaseName = positional.slice(1).join(' ').trim();
    if (!newVer) {
      console.error('Usage: ralph-docs release <version> [name] [--dry-run]');
      process.exit(1);
    }

    const currentVer = version();
    const displayName = releaseName
      ? `v${newVer} (${releaseName})`
      : `v${newVer}`;
    const headerTitle = releaseName
      ? `[${newVer}] ${releaseName}`
      : `[${newVer}]`;
    const commitMsg = releaseName
      ? `chore(release): v${newVer} (${releaseName})`
      : `chore(release): v${newVer}`;
    const tagMsg = releaseName
      ? `Release v${newVer} — ${releaseName}`
      : `Release v${newVer}`;

    // ── DRY RUN: show exactly what would happen, write nothing ───────────────
    if (dryRun) {
      console.log(`\n🔍 Release dry-run: v${currentVer} → ${displayName}\n`);
      console.log('The following changes would be made:\n');
      console.log(
        `  1. package.json     version: "${currentVer}" → "${newVer}"`
      );

      if (fs.existsSync(CHANGELOG)) {
        const cl = fs.readFileSync(CHANGELOG, 'utf8');
        const match = cl.match(/## \[Unreleased\]([\s\S]*?)(?=\n---|\n## \[)/);
        const unreleased = match ? match[1].trim() : '';
        if (unreleased && unreleased !== '*(next release notes go here)*') {
          console.log(
            `\n  2. CHANGELOG.md     [Unreleased] → ## ${headerTitle} — ${today()}`
          );
          console.log(`\n     ┌─ Release notes preview ──────────────────────`);
          unreleased.split('\n').forEach((l) => console.log(`     │ ${l}`));
          console.log(`     └──────────────────────────────────────────────`);
        } else {
          console.log(
            `  2. CHANGELOG.md     [Unreleased] is empty — header close only (${headerTitle})`
          );
        }
      } else {
        console.log(`  2. CHANGELOG.md     would be created`);
      }

      console.log(
        `\n  3. README.md        version badge updated to v${newVer}`
      );
      console.log(`  4. git commit       "${commitMsg}"`);
      console.log(`  5. git tag          v${newVer} ("${tagMsg}")`);
      console.log(`\n  After release:`);
      console.log(`    git push origin HEAD && git push origin v${newVer}`);
      console.log(
        `    → GitHub Actions (release.yml) publishes GitHub Release\n`
      );
      console.log(
        'ℹ  Dry run complete — nothing was written. Remove --dry-run to execute.\n'
      );
      process.exit(0);
    }

    // Show changelog preview before doing anything
    if (fs.existsSync(CHANGELOG)) {
      const cl = fs.readFileSync(CHANGELOG, 'utf8');
      const match = cl.match(/## \[Unreleased\]([\s\S]*?)(?=\n---|\n## \[)/);
      const unreleased = match ? match[1].trim() : '';
      if (unreleased && unreleased !== '*(next release notes go here)*') {
        console.log(
          `\n📋 Changelog preview — what will close as ## ${headerTitle}:\n`
        );
        console.log(unreleased);
        console.log('\n────────────────────────────────────────');
      } else {
        console.log(
          `\nℹ  [Unreleased] section is empty — version bump only.\n`
        );
      }
    }

    console.log(`\n🚀 Releasing ${displayName}...\n`);

    // 1. Bump version in package.json
    execSync(
      `node scripts/version/ralph-version.js bump ${newVer.split('.').length > 2 ? 'patch' : 'minor'}`,
      {
        cwd: ROOT,
        stdio: 'inherit',
      }
    );
    // Override to exact version
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
    );
    pkg.version = newVer;
    fs.writeFileSync(
      path.join(ROOT, 'package.json'),
      JSON.stringify(pkg, null, 2) + '\n'
    );
    console.log(`✓ package.json → v${newVer}`);

    // 2. Close CHANGELOG unreleased section
    closeUnreleased(newVer, releaseName);

    // 3. Refresh README
    refreshReadme();

    // 4. Commit
    execSync(`git add CHANGELOG.md README.md package.json`, {
      cwd: ROOT,
      stdio: 'inherit',
    });
    execSync(`git commit -m "${commitMsg}"`, {
      cwd: ROOT,
      stdio: 'inherit',
    });

    // 5. Tag
    execSync(`node scripts/version/ralph-version.js tag "${tagMsg}"`, {
      cwd: ROOT,
      stdio: 'inherit',
    });

    console.log(`\n🎉 Released ${displayName}`);
    console.log(`   Push: git push origin HEAD && git push origin v${newVer}`);
    break;
  }

  default:
    console.log(`
ralph-docs — Automated documentation system

Commands:
  changelog add <slug> "<desc>" [--type feat|fix|perf|security]
  changelog from-commit            Auto-parse latest commit → add entry
  changelog release <version> [name]  Close [Unreleased] → [version] [name]
  readme refresh                   Update version badge + recent activity
  prd feature <slug> <status>      Update PRD feature status
  feature-log <slug> <status>      Add entry to FEATURE_LOG.md
  upcoming add <slug> "<desc>"     Add to UPCOMING.md
  upcoming shipped <slug>          Move from upcoming → shipped
  tasks update <slug> "<notes>"    Update or add entries in docs/tasks.md
  release <version> [name]         Full release: bump + changelog + tag + readme

Lifecycle hooks (called automatically):
  on-plan-start <slug>             Called when plan moves to in-progress
  on-plan-done  <slug> "<desc>"    Called when plan:done — updates all docs

Aliases (package.json):
  pnpm docs:release <version> [name]
  pnpm docs:changelog
  pnpm docs:readme
    `);
}
