#!/usr/bin/env node
/**
 * Smoke test: dependency scan must distinguish UNAVAILABLE from CLEAN.
 * Run: node --test scripts/check/__tests__/check-security.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { spawnSync } = require('child_process');

const CHECK_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(CHECK_DIR, '..', '..');

describe('check-security unavailable vs clean', () => {
  it('exits 2 with status=unavailable when advisory endpoint is unreachable', () => {
    const result = spawnSync(
      process.execPath,
      [path.join(CHECK_DIR, 'check-security.js')],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          GATEFLOW_ADVISORY_URL: 'http://127.0.0.1:1/advisories/bulk',
        },
      }
    );

    const combined = result.stdout + result.stderr;
    assert.equal(result.status, 2, combined);
    assert.match(combined, /UNAVAILABLE|status=unavailable/);
    assert.doesNotMatch(combined, /status=clean/);
  });

  it('live advisory path never silently succeeds without a status line', () => {
    const result = spawnSync(
      process.execPath,
      [path.join(CHECK_DIR, 'check-security.js')],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: process.env,
      }
    );

    const combined = result.stdout + result.stderr;
    if (result.status === 0) {
      assert.match(combined, /status=clean|status=vulnerabilities/);
    } else if (result.status === 2) {
      assert.match(combined, /status=unavailable|UNAVAILABLE/);
    } else if (result.status === 1) {
      assert.match(
        combined,
        /vulnerability|vulnerabilities|status=vulnerabilities/
      );
    } else {
      assert.fail(`unexpected exit ${result.status}: ${combined}`);
    }
  });
});
