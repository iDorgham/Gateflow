#!/usr/bin/env node
/**
 * repo-root.js — Monorepo Root Path Resolver
 *
 * Resolves the monorepo root reliably regardless of invocation directory,
 * caller directory depth (`apps/*`, `packages/*`, `scripts/*`), or current working directory.
 * Traverses parent directories until standard monorepo marker files are discovered.
 */
const path = require('path');
const fs = require('fs');

const MONOREPO_MARKERS = [
  'pnpm-workspace.yaml',
  'pnpm-lock.yaml',
  'turbo.json',
];

let cachedRepoRoot = null;

/**
 * Check if a given directory contains monorepo root markers.
 * @param {string} dir
 * @returns {boolean}
 */
function hasMonorepoMarkers(dir) {
  if (!dir || typeof dir !== 'string') return false;
  try {
    return MONOREPO_MARKERS.some((marker) =>
      fs.existsSync(path.join(dir, marker))
    );
  } catch {
    return false;
  }
}

/**
 * Traverse upward from startDir until a directory with monorepo markers is found.
 *
 * @param {string} [startDir] - Absolute or relative starting directory (defaults to process.cwd()).
 * @returns {string} Absolute repository root path.
 */
function getRepoRoot(startDir = process.cwd()) {
  const resolvedStart = path.resolve(startDir);

  // If cached and startDir resolves within the cached root, verify and return
  if (
    cachedRepoRoot &&
    resolvedStart.startsWith(cachedRepoRoot) &&
    hasMonorepoMarkers(cachedRepoRoot)
  ) {
    return cachedRepoRoot;
  }

  let current = resolvedStart;
  const rootDir = path.parse(current).root;

  while (current && current !== rootDir) {
    if (hasMonorepoMarkers(current)) {
      cachedRepoRoot = current;
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // Check filesystem root as final attempt
  if (hasMonorepoMarkers(rootDir)) {
    cachedRepoRoot = rootDir;
    return rootDir;
  }

  throw new Error(
    `repo-root: monorepo markers (${MONOREPO_MARKERS.join(', ')}) not found traversing upward from ${resolvedStart}`
  );
}

/**
 * Resolves one or more path segments relative to the repository root.
 *
 * @param {...string} pathSegments
 * @returns {string} Absolute path relative to repository root.
 */
function resolveFromRoot(...pathSegments) {
  return path.resolve(getRepoRoot(), ...pathSegments);
}

module.exports = {
  getRepoRoot,
  resolveFromRoot,
  MONOREPO_MARKERS,
  hasMonorepoMarkers,
};
