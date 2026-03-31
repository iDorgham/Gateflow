#!/usr/bin/env node
/**
 * ralph-version.js — Semantic versioning for branches, commits, and git tags
 *
 * Commands:
 *   node scripts/ralph-version.js current              show current version
 *   node scripts/ralph-version.js bump [major|minor|patch]  bump + write to package.json
 *   node scripts/ralph-version.js tag [message]        create annotated git tag v{version}
 *   node scripts/ralph-version.js branch <slug>        print versioned branch name
 *   node scripts/ralph-version.js info                 full version info block
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PKG = path.join(ROOT, 'package.json');

// ── helpers ───────────────────────────────────────────────────────────────────
function readPkg() {
  return JSON.parse(fs.readFileSync(PKG, 'utf8'));
}
function writePkg(obj) {
  fs.writeFileSync(PKG, JSON.stringify(obj, null, 2) + '\n');
}
function current() {
  return readPkg().version || '0.1.0';
}

function bump(type = 'patch') {
  const parts = current().split('.').map(Number);
  if (type === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  }
  if (type === 'minor') {
    parts[1]++;
    parts[2] = 0;
  }
  if (type === 'patch') {
    parts[2]++;
  }
  return parts.join('.');
}

function git(cmd, opts = {}) {
  try {
    return execSync(cmd, {
      cwd: ROOT,
      stdio: opts.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
    }).trim();
  } catch (e) {
    if (opts.safe) return null;
    throw e;
  }
}

function currentBranch() {
  return git('git branch --show-current', { silent: true });
}
function latestTag() {
  return git('git describe --tags --abbrev=0 2>/dev/null', {
    safe: true,
    silent: true,
  });
}
function commitCount() {
  return (
    git('git rev-list --count HEAD 2>/dev/null', {
      safe: true,
      silent: true,
    }) || '0'
  );
}

// ── commands ──────────────────────────────────────────────────────────────────
const [, , cmd, arg1, ...rest] = process.argv;

switch (cmd) {
  case 'current':
    console.log(current());
    break;

  case 'bump': {
    const type = ['major', 'minor', 'patch'].includes(arg1) ? arg1 : 'patch';
    const prev = current();
    const next = bump(type);
    const pkg = readPkg();
    pkg.version = next;
    writePkg(pkg);
    console.log(`✓ Version bumped: ${prev} → ${next}  (${type})`);
    console.log(`  package.json updated.`);
    console.log(`\n  Next: pnpm version:tag`);
    break;
  }

  case 'tag': {
    const ver = current();
    const tagName = `v${ver}`;
    const msg = arg1 ? [arg1, ...rest].join(' ') : `Release ${tagName}`;
    try {
      git(`git tag -a ${tagName} -m "${msg}"`);
      console.log(`✓ Created annotated tag: ${tagName}`);
      console.log(`  Message: "${msg}"`);
      console.log(`\n  Push tag: git push origin ${tagName}`);
    } catch {
      // Tag may already exist
      console.log(`ℹ  Tag ${tagName} already exists — skipping.`);
    }
    break;
  }

  case 'branch': {
    const slug = arg1;
    if (!slug) {
      console.error('Usage: ralph-version branch <slug>');
      process.exit(1);
    }
    const ver = current().split('.').slice(0, 2).join('.'); // major.minor only
    const branch = `feat/v${ver}-${slug.replace(/_/g, '-')}`;
    console.log(branch);
    break;
  }

  case 'info': {
    const ver = current();
    const branch = currentBranch();
    const tag = latestTag() || 'none';
    const commits = commitCount();
    console.log(`\n📦 GateFlow Version Info`);
    console.log(`   Version : v${ver}`);
    console.log(`   Branch  : ${branch}`);
    console.log(`   Last tag: ${tag}`);
    console.log(`   Commits : ${commits}`);
    console.log();
    break;
  }

  default:
    console.log(`
ralph-version — Semantic versioning manager

Commands:
  current                   Show current version (from package.json)
  bump [major|minor|patch]  Bump version (default: patch)
  tag [message]             Create annotated git tag v{version}
  branch <slug>             Print versioned branch name (feat/v1.2-slug)
  info                      Full version info block

Aliases (package.json):
  pnpm version:bump [major|minor|patch]
  pnpm version:tag
  pnpm version:info
    `);
}
