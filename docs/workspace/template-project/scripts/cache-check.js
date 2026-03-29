#!/usr/bin/env node
/**
 * cache-check.js — Cache Staleness Detector
 *
 * Reads frontmatter from docs/system/cache/ files and reports stale entries
 * based on TTL (ttl_days) and update triggers.
 *
 * Usage:
 *   node scripts/cache-check.js
 *   pnpm cache:check
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const CACHE_DIR = path.join(PROJECT_ROOT, 'docs/system/cache');

// ─── Frontmatter parser ───────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length)
      result[key.trim()] = rest
        .join(':')
        .trim()
        .replace(/^['"]|['"]$/g, '');
  }
  return result;
}

function daysBetween(dateStr) {
  if (!dateStr) return null;
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

// ─── Checkers ─────────────────────────────────────────────────────────────────

function checkWorkspaceCache() {
  const issues = [];
  const critical = [
    'WORKSPACE_INDEX.md',
    'API_ROUTES_MAP.md',
    'SCHEMA_SNAPSHOT.md',
  ];

  for (const file of critical) {
    const filePath = path.join(CACHE_DIR, file);
    if (!fs.existsSync(filePath)) {
      issues.push({ file, type: 'missing', severity: 'warn' });
      continue;
    }
    const fm = parseFrontmatter(fs.readFileSync(filePath, 'utf8'));
    if (fm.generated && fm.generated.includes('YYYY')) {
      issues.push({
        file,
        type: 'not-populated',
        severity: 'warn',
        detail: 'Run cache-build.js to populate',
      });
    }
  }

  return issues;
}

function checkContext7Cache() {
  const ctx7Dir = path.join(CACHE_DIR, 'context7');
  if (!fs.existsSync(ctx7Dir)) return [];

  const issues = [];
  const files = fs
    .readdirSync(ctx7Dir)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep');

  for (const file of files) {
    const filePath = path.join(ctx7Dir, file);
    const fm = parseFrontmatter(fs.readFileSync(filePath, 'utf8'));
    const ttl = parseInt(fm.ttl_days ?? '14', 10);
    const age = daysBetween(fm.fetched_at);

    if (age === null) {
      issues.push({
        file: `context7/${file}`,
        type: 'no-date',
        severity: 'warn',
      });
    } else if (age > ttl) {
      issues.push({
        file: `context7/${file}`,
        type: 'stale',
        severity: 'warn',
        detail: `${age} days old (TTL: ${ttl})`,
      });
    }
  }

  return issues;
}

// ─── Report ───────────────────────────────────────────────────────────────────

function main() {
  console.log(
    '\n── Cache Freshness Check ────────────────────────────────────\n'
  );

  if (!fs.existsSync(CACHE_DIR)) {
    console.log(
      '  ⚠ docs/system/cache/ not found. Run scripts/cache-build.js first.\n'
    );
    return;
  }

  const issues = [...checkWorkspaceCache(), ...checkContext7Cache()];

  if (issues.length === 0) {
    console.log('  ✓ All cache files are current.\n');
    return;
  }

  let errors = 0;
  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '✗' : '⚠';
    const detail = issue.detail ? ` — ${issue.detail}` : '';
    console.log(`  ${icon} ${issue.file}: ${issue.type}${detail}`);
    if (issue.severity === 'error') errors++;
  }

  console.log(`\n  ${issues.length} issue(s) found.`);
  console.log('  Run: node scripts/cache-build.js  to rebuild workspace cache');
  console.log('  Run: pnpm ai:sync                 to refresh AI folders\n');

  // Only hard-fail if there are actual errors (not just warnings)
  if (errors > 0) process.exit(1);
}

main();
