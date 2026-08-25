/**
 * Smoke tests for repository-root resolution and scanner coverage signals.
 * Run: node --test scripts/check/__tests__/repo-root.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

const CHECK_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(CHECK_DIR, '..', '..');

describe('getRepoRoot', () => {
  const {
    getRepoRoot,
    resolveFromRoot,
    hasMonorepoMarkers,
  } = require('../repo-root');

  it('resolves to the monorepo root, not scripts/', () => {
    const root = getRepoRoot(CHECK_DIR);
    assert.equal(root, REPO_ROOT);
    assert.ok(fs.existsSync(path.join(root, 'pnpm-lock.yaml')));
    assert.ok(fs.existsSync(path.join(root, 'apps')));
    assert.notEqual(path.basename(root), 'scripts');
  });

  it('resolves from nested app directory depths', () => {
    const nestedAppDir = path.join(
      REPO_ROOT,
      'apps',
      'client-dashboard',
      'src'
    );
    const root = getRepoRoot(nestedAppDir);
    assert.equal(root, REPO_ROOT);
  });

  it('resolves from deeply nested package directory depths', () => {
    const nestedPkgDir = path.join(REPO_ROOT, 'packages', 'ui', 'src');
    const root = getRepoRoot(nestedPkgDir);
    assert.equal(root, REPO_ROOT);
  });

  it('resolves using default cwd', () => {
    const root = getRepoRoot();
    assert.equal(root, REPO_ROOT);
  });

  it('resolveFromRoot returns correct joined paths from repository root', () => {
    const appsPath = resolveFromRoot('apps', 'client-dashboard');
    assert.equal(appsPath, path.join(REPO_ROOT, 'apps', 'client-dashboard'));
  });

  it('hasMonorepoMarkers returns true for root and false for temp directory', () => {
    assert.equal(hasMonorepoMarkers(REPO_ROOT), true);
    assert.equal(hasMonorepoMarkers(os.tmpdir()), false);
  });

  it('throws when markers are missing', () => {
    assert.throws(() => getRepoRoot(os.tmpdir()), /monorepo markers/);
  });
});

describe('scanner root regressions', () => {
  function runCheck(script, args = []) {
    return spawnSync(
      process.execPath,
      [path.join(CHECK_DIR, script), ...args],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: process.env,
      }
    );
  }

  it('check-imports scans a nonzero file count from repo root', () => {
    const result = runCheck('check-imports.js', ['--summary']);
    const combined = result.stdout + result.stderr;
    assert.match(
      combined,
      /files=(\d+)|across (\d+) files|scanned (\d+) files/
    );
    const match =
      combined.match(/files=(\d+)/) ||
      combined.match(/across (\d+) files/) ||
      combined.match(/scanned (\d+) files/);
    const count = Number(match[1]);
    assert.ok(count > 0, `expected nonzero scan, got ${count}`);
    // Wrong ROOT (scripts/) historically produced 0 — keep that regression locked.
    assert.ok(count >= 50, `suspiciously low file count: ${count}`);
  });

  it('todos scans a nonzero file count from repo root', () => {
    const result = runCheck('todos.js');
    assert.match(
      result.stdout + result.stderr,
      /scanned (\d+) files|item\(s\) in (\d+) files/
    );
    const combined = result.stdout + result.stderr;
    const match =
      combined.match(/scanned (\d+) files/) ||
      combined.match(/item\(s\) in (\d+) files/);
    const count = Number(match[1]);
    assert.ok(count > 0, `expected nonzero scan, got ${count}`);
  });

  it('scan-secrets --all reports mode, scope, and nonzero coverage', () => {
    const result = runCheck('scan-secrets.js', ['--all']);
    const combined = result.stdout + result.stderr;
    assert.match(combined, /mode=all/);
    assert.match(combined, /files_considered=\d+/);
    assert.match(combined, /files_scanned=\d+/);
    const scanned = Number(combined.match(/files_scanned=(\d+)/)[1]);
    assert.ok(scanned > 0, `expected files_scanned > 0, got ${scanned}`);
    // Must not claim "staged files" when running --all
    assert.doesNotMatch(combined, /no secrets detected in staged files/);
  });
});
