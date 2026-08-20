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
    id: 'mobile-device',
    kind: 'device',
    test: (file) =>
      /^apps\/(scanner-app|resident-mobile)\//.test(file) &&
      /\.(tsx?|jsx?)$/.test(file) &&
      !/(__tests__|\.test\.|\.spec\.)/.test(file),
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
      /\.(tsx?|jsx?|css)$/.test(file) &&
      !/(\/api\/|route\.[jt]s$|__tests__|\.test\.|\.spec\.)/.test(file),
    reason:
      'User-facing web runtime changed; static checks cannot prove browser behavior.',
    suggestedEvidence:
      'Owned browser/E2E receipt with URL, locale, viewport, scenario result, time, and head SHA.',
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

function changedFiles(repoRoot, base) {
  const committed = git(
    repoRoot,
    base
      ? ['diff', '--name-only', `${base}...HEAD`]
      : ['diff', '--name-only', 'HEAD']
  );
  const working = base ? git(repoRoot, ['diff', '--name-only', 'HEAD']) : '';
  const untracked = git(repoRoot, [
    'ls-files',
    '--others',
    '--exclude-standard',
  ]);
  return unique(
    `${committed}\n${working}\n${untracked}`.split(/\r?\n/).filter(Boolean)
  );
}

function validateEvidence(plan, evidence, head, options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const now = Date.parse(options.now || new Date().toISOString());
  const maxAgeMs = (options.maxAgeHours || 24) * 60 * 60 * 1000;
  const entries = Array.isArray(evidence?.entries) ? evidence.entries : [];
  const results = plan.requirements.map((requirement) => {
    const entry = entries.find((item) => item.requirement === requirement.id);
    const artifact = entry?.artifact
      ? path.resolve(root, entry.artifact)
      : null;
    const artifactInRoot = Boolean(
      artifact &&
      (artifact === root || artifact.startsWith(`${root}${path.sep}`))
    );
    const artifactExists =
      artifactInRoot &&
      fs.existsSync(artifact) &&
      !fs.lstatSync(artifact).isSymbolicLink() &&
      fs.lstatSync(artifact).isFile();
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
      Array.isArray(entry?.assertions) && entry.assertions.length > 0;
    const complete = Boolean(
      artifactExists &&
      entry?.artifactSha256 === actualHash &&
      fresh &&
      entry?.commit === head &&
      entry?.owner &&
      entry?.environment &&
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
