#!/usr/bin/env node
/**
 * ralph-hotfix.js — Hotfix workflow
 *
 * Structured path for production emergency fixes:
 *   start  → branches off master, creates hotfix/v{version}-{slug}
 *   done   → runs preflight, bumps patch, tags, creates PR back to master
 *   status → show active hotfix branches
 *
 * Usage:
 *   node scripts/ralph-hotfix.js start <slug>   # begin hotfix
 *   node scripts/ralph-hotfix.js done  <slug>   # finish + PR
 *   node scripts/ralph-hotfix.js status         # list active hotfixes
 *   pnpm hotfix:start <slug>
 *   pnpm hotfix:done  <slug>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');

// ── Colours ───────────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: opts.silent ? 'pipe' : 'inherit',
  }).trim();
}

function safe(cmd) {
  try {
    return run(cmd, { silent: true });
  } catch {
    return null;
  }
}

function currentVersion() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
    .version;
}

function hotfixBranch(slug) {
  const ver = currentVersion().split('.').slice(0, 2).join('.');
  return `hotfix/v${ver}-${slug.replace(/_/g, '-')}`;
}

function currentBranch() {
  return safe('git branch --show-current') || '';
}

// ── START ─────────────────────────────────────────────────────────────────────
function start(slug) {
  if (!slug) {
    console.error('Usage: ralph-hotfix start <slug>');
    process.exit(1);
  }

  const branch = hotfixBranch(slug);
  const existing = safe(`git branch --list ${branch}`);
  if (existing) {
    console.log(`ℹ  Branch ${branch} already exists. Switching to it...`);
    run(`git checkout ${branch}`);
    return;
  }

  // Ensure we're up to date
  const mainBranch =
    safe('git symbolic-ref refs/remotes/origin/HEAD')?.replace(
      'refs/remotes/origin/',
      ''
    ) || 'master';
  console.log(`\n🔥 Starting hotfix: ${c.bold(slug)}\n`);

  console.log(`  Fetching latest ${mainBranch}...`);
  run(`git fetch origin ${mainBranch}`);

  // Create branch off master
  run(`git checkout -b ${branch} origin/${mainBranch}`);
  console.log(c.green(`\n✓ Hotfix branch created: ${branch}`));
  console.log(`\n  Now fix the issue, then run:`);
  console.log(c.cyan(`  pnpm hotfix:done ${slug}\n`));
}

// ── DONE ──────────────────────────────────────────────────────────────────────
function done(slug) {
  if (!slug) {
    console.error('Usage: ralph-hotfix done <slug>');
    process.exit(1);
  }

  const branch = hotfixBranch(slug);
  const cur = currentBranch();

  if (cur !== branch) {
    // Try to switch to hotfix branch
    if (safe(`git branch --list ${branch}`)) {
      run(`git checkout ${branch}`);
    } else {
      console.error(
        `✗ Hotfix branch "${branch}" not found. Run: pnpm hotfix:start ${slug}`
      );
      process.exit(1);
    }
  }

  console.log(`\n🔥 Finishing hotfix: ${c.bold(slug)}\n`);

  // 1. Run preflight
  console.log('  1. Running preflight checks...');
  try {
    run('pnpm preflight');
    console.log(c.green('  ✓ Preflight passed'));
  } catch {
    console.error(
      c.red('  ✗ Preflight failed — fix errors before finishing hotfix')
    );
    process.exit(1);
  }

  // 2. Bump patch version
  console.log('\n  2. Bumping patch version...');
  run('node scripts/version/ralph-version.js bump patch');
  const newVer = currentVersion();
  console.log(c.green(`  ✓ Version → ${newVer}`));

  // 3. Update CHANGELOG
  console.log('\n  3. Updating CHANGELOG...');
  try {
    run(
      `node scripts/docs/ralph-docs.js changelog add ${slug} "Hotfix: ${slug.replace(/-/g, ' ')}" --type fix`
    );
    run(`node scripts/docs/ralph-docs.js readme refresh`);
  } catch {
    /* non-fatal */
  }

  // 4. Commit version bump
  console.log('\n  4. Committing version bump...');
  run(`git add package.json CHANGELOG.md README.md`);
  try {
    run(`git commit -m "chore(release): hotfix v${newVer} — ${slug}"`);
  } catch {
    console.log(c.yellow('  ℹ  Nothing to commit (already clean)'));
  }

  // 5. Create annotated tag
  console.log('\n  5. Tagging release...');
  run(`node scripts/version/ralph-version.js tag "Hotfix v${newVer}: ${slug}"`);
  console.log(c.green(`  ✓ Tagged v${newVer}`));

  // 6. Auto-create PR
  console.log('\n  6. Creating pull request...');
  const mainBranch =
    safe('git symbolic-ref refs/remotes/origin/HEAD')?.replace(
      'refs/remotes/origin/',
      ''
    ) || 'master';
  const prTitle = `fix: hotfix v${newVer} — ${slug.replace(/-/g, ' ')}`;
  const prBody = [
    `## 🔥 Hotfix v${newVer}`,
    '',
    `**Slug:** \`${slug}\``,
    `**Branch:** \`${branch}\``,
    '',
    '## Changes',
    '',
    '- ' + slug.replace(/-/g, ' '),
    '',
    '## Checklist',
    '- [ ] Tested on staging',
    '- [ ] No breaking changes',
    '- [ ] CHANGELOG updated',
    '',
    '> 🤖 Generated by ralph-hotfix.js',
  ].join('\n');

  try {
    const url = run(
      `gh pr create --title ${JSON.stringify(prTitle)} --body ${JSON.stringify(prBody)} --base ${mainBranch}`,
      { silent: true }
    );
    console.log(c.green(`  ✓ PR created: ${url.trim()}`));
  } catch (e) {
    const msg = e.message || '';
    if (msg.includes('already exists')) {
      console.log('  ℹ  PR already exists for this branch.');
    } else {
      console.log(
        c.yellow(
          '  ℹ  Could not auto-create PR — push manually and open via GitHub.'
        )
      );
    }
  }

  // 7. Push
  console.log('\n  7. Pushing branch + tag...');
  console.log(c.yellow(`\n  Run to push:`));
  console.log(
    c.cyan(`    git push origin ${branch} && git push origin v${newVer}\n`)
  );
  console.log(c.green(`✓ Hotfix ${slug} complete → v${newVer}\n`));
}

// ── STATUS ────────────────────────────────────────────────────────────────────
function status() {
  const branches = safe('git branch --list "hotfix/*"') || '';
  const remote = safe('git branch -r --list "origin/hotfix/*"') || '';
  const all = [...new Set([...branches.split('\n'), ...remote.split('\n')])]
    .map((b) => b.trim().replace('* ', '').replace('origin/', ''))
    .filter(Boolean)
    .filter((b) => b.startsWith('hotfix/'));

  if (all.length === 0) {
    console.log('\nℹ  No active hotfix branches.\n');
    return;
  }

  console.log('\n🔥 Active hotfix branches:\n');
  for (const b of all) {
    const lastCommit =
      safe(`git log -1 --pretty="%s" ${b} 2>/dev/null`) || '(no commits)';
    const lastDate = safe(`git log -1 --pretty="%cr" ${b} 2>/dev/null`) || '';
    console.log(`  ${c.bold(b)}`);
    console.log(`    ${lastCommit}  ${c.yellow(lastDate)}`);
  }
  console.log('');
}

// ── Entry ─────────────────────────────────────────────────────────────────────
const [, , cmd, slug] = process.argv;

switch (cmd) {
  case 'start':
    start(slug);
    break;
  case 'done':
    done(slug);
    break;
  case 'status':
    status();
    break;
  default:
    console.log(`
ralph-hotfix — Hotfix workflow manager

Commands:
  start <slug>   Branch off master → hotfix/v{ver}-{slug}
  done  <slug>   Preflight → bump patch → tag → PR
  status         List active hotfix branches

Examples:
  pnpm hotfix:start qr-validation-crash
  pnpm hotfix:done  qr-validation-crash
    `);
}
