#!/usr/bin/env node
/**
 * Resolve the monorepo root from any file under scripts/check/.
 *
 * scripts/check/*.js → ../.. = repository root
 * (A single `..` wrongly resolves to scripts/ and yields false-green zero-file scans.)
 */
const path = require('path');
const fs = require('fs');

/**
 * @param {string} [fromDir] - Absolute directory of the calling script (__dirname).
 * @returns {string} Absolute repository root path.
 */
function getRepoRoot(fromDir = __dirname) {
  const candidate = path.resolve(fromDir, '..', '..');
  const markers = ['pnpm-workspace.yaml', 'pnpm-lock.yaml', 'turbo.json'];
  const ok = markers.some((m) => fs.existsSync(path.join(candidate, m)));
  if (!ok) {
    throw new Error(
      `repo-root: expected monorepo markers under ${candidate} (from ${fromDir})`
    );
  }
  return candidate;
}

module.exports = { getRepoRoot };
