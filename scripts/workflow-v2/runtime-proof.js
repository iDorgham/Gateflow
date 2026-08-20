const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const RULES = [
  {
    id: 'database-runtime',
    kind: 'database',
    test: (file) => /(^|\/)(prisma\/|migrations\/)|schema\.prisma$/.test(file),
    reason:
      'Database behavior changed; prove the migration/query against the intended environment.',
    suggestedEvidence:
      'Migration output plus a tenant-scoped read/write verification receipt.',
  },
  {
    id: 'api-runtime',
    kind: 'api',
    test: (file) => /(^|\/)(api\/|route\.[jt]s$|server\/|actions\/)/.test(file),
    reason:
      'A server/API boundary changed; prove the real request, response, authorization, and failure path.',
    suggestedEvidence:
      'Integration or E2E receipt containing endpoint, status, actor, environment, and head SHA.',
  },
  {
    id: 'dependency-runtime',
    kind: 'cross-app',
    test: (file) => file === 'pnpm-lock.yaml',
    reason:
      'Root dependency resolution changed; prove representative runtime consumers against the resolved graph.',
    suggestedEvidence:
      'Head-bound smoke receipts for representative browser and device consumers affected by the dependency change.',
  },
  {
    id: 'mobile-device',
    kind: 'device',
    test: (file) =>
      /^apps\/(scanner-app|resident-mobile)\//.test(file) &&
      !/(__tests__|\.test\.|\.spec\.|\/docs?\/|\.md$)/.test(file) &&
      (/\.(tsx?|jsx?)$/.test(file) ||
        /(^|\/)(app\.json|app\.config\.[cm]?[jt]s|eas\.json|package\.json|metro\.config\.[cm]?js|babel\.config\.[cm]?js|AndroidManifest\.xml|Info\.plist|Podfile|build\.gradle)$/.test(
          file
        ) ||
        /\/(assets|ios|android)\//.test(file)),
    reason:
      'Native/mobile runtime code changed; unit tests cannot prove device behavior.',
    suggestedEvidence:
      'Owned physical-device or simulator run with app build, OS/device, flow result, time, and head SHA.',
  },
  {
    id: 'browser-flow',
    kind: 'browser',
    test: (file) =>
      /^apps\/(client-dashboard|resident-portal|admin-dashboard|marketing)\//.test(
        file
      ) &&
      (/\.(tsx?|jsx?|css)$/.test(file) ||
        /(^|\/)(package\.json|next\.config\.[cm]?[jt]s|vercel\.json|middleware\.[cm]?[jt]s)$/.test(
          file
        ) ||
        /\/(public|assets)\//.test(file)) &&
      !/(\/api\/|route\.[jt]s$|__tests__|\.test\.|\.spec\.)/.test(file),
    reason:
      'User-facing web runtime changed; static checks cannot prove browser behavior.',
    suggestedEvidence:
      'Owned browser/E2E receipt with URL, locale, viewport, scenario result, time, and head SHA.',
  },
  {
    id: 'shared-ui-runtime',
    kind: 'cross-app',
    test: (file) =>
      /^packages\/(ui|components|theme|tokens)\//.test(file) &&
      !/(__tests__|\.test\.|\.spec\.|\.md$)/.test(file),
    reason:
      'Shared runtime UI changed; prove representative affected consumers instead of assuming package checks cover integration.',
    suggestedEvidence:
      'Head-bound browser/device smoke receipts for the affected consuming applications.',
  },
  {
    id: 'access-decision',
    kind: 'pilot-flow',
    test: (file) =>
      /(scanner|scan-history|qr|credential|permission|access)/i.test(file) &&
      /\.(tsx?|jsx?|prisma)$/.test(file) &&
      !/(__tests__|\.test\.|\.spec\.)/.test(file),
    reason:
      'An access-decision path changed; prove grant and denial outcomes end to end.',
    suggestedEvidence:
      'Fresh QR/access flow receipt with DB id/payload match and decision reason codes; never infer grant from replay denial.',
  },
];

function unique(items) {
  return [...new Set(items)].sort();
}

function classifyRuntimeProof(files) {
  const normalized = unique(
    files.map((file) => file.replace(/^\.\//, '')).filter(Boolean)
  );
  const requirements = RULES.map((rule) => {
    const matchedFiles = normalized.filter(rule.test);
    return matchedFiles.length
      ? {
          id: rule.id,
          kind: rule.kind,
          reason: rule.reason,
          suggestedEvidence: rule.suggestedEvidence,
          files: matchedFiles,
        }
      : null;
  }).filter(Boolean);
  return {
    files: normalized,
    requiresRuntimeProof: requirements.length > 0,
    requirements,
  };
}

function git(repoRoot, args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function diffChangedPaths(repoRoot, range) {
  const tokens = execFileSync(
    'git',
    ['diff', '--name-status', '-z', '-M', '-C', range],
    { cwd: repoRoot, encoding: 'utf8' }
  ).split('\0');
  const files = [];
  for (let index = 0; index < tokens.length;) {
    const status = tokens[index++];
    if (!status) continue;
    const first = tokens[index++];
    if (first) files.push(first);
    if (/^[RC]/.test(status)) {
      const second = tokens[index++];
      if (second) files.push(second);
    }
  }
  return files;
}

function changedFiles(repoRoot, base) {
  const committed = diffChangedPaths(
    repoRoot,
    base ? `${base}...HEAD` : 'HEAD'
  );
  const working = base ? diffChangedPaths(repoRoot, 'HEAD') : [];
  const untracked = git(repoRoot, [
    'ls-files',
    '--others',
    '--exclude-standard',
  ]);
  return unique(
    [...committed, ...working, ...untracked.split(/\r?\n/)].filter(Boolean)
  );
}

function validateEvidence(plan, evidence, head, options = {}) {
  const root = fs.realpathSync(path.resolve(options.root || process.cwd()));
  const now = Date.parse(options.now || new Date().toISOString());
  const maxAgeMs = (options.maxAgeHours || 24) * 60 * 60 * 1000;
  const entries = Array.isArray(evidence?.entries) ? evidence.entries : [];
  const results = plan.requirements.map((requirement) => {
    const matchingEntries = entries.filter(
      (item) => item.requirement === requirement.id
    );
    const entry = matchingEntries.length === 1 ? matchingEntries[0] : null;
    const artifact = entry?.artifact
      ? path.resolve(root, entry.artifact)
      : null;
    let artifactExists = false;
    if (
      artifact &&
      (artifact === root || artifact.startsWith(`${root}${path.sep}`))
    ) {
      try {
        const realArtifact = fs.realpathSync(artifact);
        artifactExists =
          !fs.lstatSync(artifact).isSymbolicLink() &&
          fs.statSync(realArtifact).isFile() &&
          realArtifact.startsWith(`${root}${path.sep}`);
      } catch {
        artifactExists = false;
      }
    }
    const actualHash = artifactExists
      ? crypto
          .createHash('sha256')
          .update(fs.readFileSync(artifact))
          .digest('hex')
      : null;
    const captured = Date.parse(entry?.capturedAt || '');
    const fresh =
      Number.isFinite(captured) &&
      captured <= now &&
      now - captured <= maxAgeMs;
    const assertions =
      Array.isArray(entry?.assertions) &&
      entry.assertions.length > 0 &&
      entry.assertions.every(
        (assertion) => typeof assertion === 'string' && assertion.trim() !== ''
      );
    const owner = typeof entry?.owner === 'string' && entry.owner.trim() !== '';
    const environment =
      typeof entry?.environment === 'string' && entry.environment.trim() !== '';
    const declaredHash =
      typeof entry?.artifactSha256 === 'string' &&
      /^[a-f0-9]{64}$/.test(entry.artifactSha256);
    const complete = Boolean(
      artifactExists &&
      declaredHash &&
      entry?.artifactSha256 === actualHash &&
      fresh &&
      entry?.commit === head &&
      owner &&
      environment &&
      assertions
    );
    return {
      requirement: requirement.id,
      complete,
      message: complete
        ? 'fresh, hashed, head-bound evidence supplied'
        : `needs an in-repo artifact + SHA-256, owner, environment, assertions, capturedAt within 24h, and commit=${head}`,
    };
  });
  return { valid: results.every((item) => item.complete), head, results };
}

module.exports = {
  RULES,
  changedFiles,
  classifyRuntimeProof,
  validateEvidence,
};
