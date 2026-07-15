/**
 * npm-advisories.js — Shared helpers for querying npm's bulk security
 * advisory endpoint against packages installed via pnpm.
 *
 * `pnpm audit` (and the underlying `/-/npm/v1/security/audits` endpoint)
 * was retired by the npm registry in favor of
 * `/-/npm/v1/security/advisories/bulk`. Shared by
 * scripts/check/check-security.js and scripts/dev/security-fix.js so the
 * lockfile-parsing and request logic can't drift between the two.
 */

const fs = require('fs');
const path = require('path');
const { parse: parseYaml } = require('yaml');

const BULK_ADVISORY_URL =
  'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk';
const DEFAULT_LOCKFILE_PATH = path.join(process.cwd(), 'pnpm-lock.yaml');
const DEFAULT_CHUNK_SIZE = 300;
const DEFAULT_TIMEOUT_MS = 30_000;

// Package keys look like "/name@version" or "/@scope/name@version", with an
// optional "(peerDep@version)(...)" suffix for peer-resolved variants — we
// only need the bare name + version, not the peer suffix.
function loadInstalledVersions(lockfilePath = DEFAULT_LOCKFILE_PATH) {
  if (!fs.existsSync(lockfilePath)) {
    console.error(`❌ Lockfile not found at ${lockfilePath}`);
    process.exit(1);
  }

  const lockfile = parseYaml(fs.readFileSync(lockfilePath, 'utf8'));
  const packages = lockfile.packages || {};
  const versionsByName = new Map();

  for (const key of Object.keys(packages)) {
    const withoutLeadingSlash = key.startsWith('/') ? key.slice(1) : key;
    const withoutPeerSuffix = withoutLeadingSlash.replace(/\(.+\)$/, '');
    const lastAt = withoutPeerSuffix.lastIndexOf('@');
    if (lastAt <= 0) continue; // malformed or scope-only entry, skip

    const name = withoutPeerSuffix.slice(0, lastAt);
    const version = withoutPeerSuffix.slice(lastAt + 1);
    if (!name || !version) continue;

    if (!versionsByName.has(name)) versionsByName.set(name, new Set());
    versionsByName.get(name).add(version);
  }

  return versionsByName;
}

function chunk(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

async function queryBulkAdvisories(
  versionsByName,
  { chunkSize = DEFAULT_CHUNK_SIZE, timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) {
  const entries = [...versionsByName.entries()];
  const chunks = chunk(entries, chunkSize);
  const advisoriesByPackage = {};

  for (const batch of chunks) {
    const body = Object.fromEntries(
      batch.map(([name, versions]) => [name, [...versions]])
    );

    const response = await fetch(BULK_ADVISORY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `Bulk advisory endpoint responded ${response.status}: ${text}`
      );
    }

    const result = await response.json();
    for (const [name, advisories] of Object.entries(result)) {
      if (!advisories || advisories.length === 0) continue;
      advisoriesByPackage[name] = (advisoriesByPackage[name] || []).concat(
        advisories
      );
    }
  }

  return advisoriesByPackage;
}

module.exports = {
  BULK_ADVISORY_URL,
  DEFAULT_LOCKFILE_PATH,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_TIMEOUT_MS,
  loadInstalledVersions,
  chunk,
  queryBulkAdvisories,
};
