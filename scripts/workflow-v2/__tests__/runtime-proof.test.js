const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const {
  changedFiles,
  classifyRuntimeProof,
  validateEvidence,
} = require('../runtime-proof');
const { parseExplicitFiles } = require('../runtime-proof-cli');

test('classifies browser, device, API, database and access runtime proof', () => {
  const result = classifyRuntimeProof([
    'apps/client-dashboard/app/api/gates/route.ts',
    'apps/scanner-app/src/lib/scanner.ts',
    'packages/db/prisma/schema.prisma',
  ]);
  assert.equal(result.requiresRuntimeProof, true);
  assert.deepEqual(
    result.requirements.map((item) => item.id),
    ['database-runtime', 'api-runtime', 'mobile-device', 'access-decision']
  );
});

test('documentation-only changes do not invent runtime requirements', () => {
  const result = classifyRuntimeProof(['docs/workspace/WORKFLOW_V2.md']);
  assert.equal(result.requiresRuntimeProof, false);
  assert.deepEqual(result.requirements, []);
});

test('evidence must be complete and bound to the current head', () => {
  const plan = classifyRuntimeProof(['apps/scanner-app/src/lib/scanner.ts']);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-proof-'));
  const artifact = path.join(root, 'device.json');
  fs.writeFileSync(artifact, '{"result":"passed"}\n');
  const artifactSha256 = crypto
    .createHash('sha256')
    .update(fs.readFileSync(artifact))
    .digest('hex');
  const valid = validateEvidence(
    plan,
    {
      entries: plan.requirements.map((item) => ({
        requirement: item.id,
        artifact: 'device.json',
        artifactSha256,
        owner: 'qa-session-1',
        environment: 'ios-simulator',
        assertions: ['grant passed', 'denial passed'],
        capturedAt: '2026-08-20T10:00:00Z',
        commit: 'abc123',
      })),
    },
    'abc123',
    { root, now: '2026-08-20T11:00:00Z' }
  );
  assert.equal(valid.valid, true);
  assert.equal(
    validateEvidence(plan, { entries: [] }, 'abc123', { root }).valid,
    false
  );
});

test('proof check finds a committed classified file in a clean worktree', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-proof-git-'));
  const git = (args) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git(['init', '-b', 'master']);
  git(['config', 'user.email', 'proof@example.com']);
  git(['config', 'user.name', 'Runtime Proof Test']);
  fs.writeFileSync(path.join(root, 'README.md'), 'base\n');
  git(['add', 'README.md']);
  git(['commit', '-m', 'base']);
  const base = git(['rev-parse', 'HEAD']);
  fs.mkdirSync(path.join(root, 'apps', 'scanner-app', 'src', 'lib'), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(root, 'apps', 'scanner-app', 'src', 'lib', 'scanner.ts'),
    'export const scanner = true;\n'
  );
  git(['add', '.']);
  git(['commit', '-m', 'scanner change']);

  const plan = classifyRuntimeProof(changedFiles(root, base));
  assert.equal(plan.requiresRuntimeProof, true);
  assert.equal(
    validateEvidence(plan, { entries: [] }, git(['rev-parse', 'HEAD']), {
      root,
    }).valid,
    false
  );
});

test('--files parsing stops at the next option', () => {
  assert.deepEqual(
    parseExplicitFiles([
      '--files',
      'apps/scanner-app/src/lib/scanner.ts',
      'docs/note.md',
      '--evidence',
      '.ai/runtime-proof.json',
      '--github-summary',
      'summary.md',
    ]),
    ['apps/scanner-app/src/lib/scanner.ts', 'docs/note.md']
  );
  assert.equal(parseExplicitFiles(['--evidence', 'receipt.json']), null);
});

test('evidence artifacts cannot be symbolic links', () => {
  const plan = classifyRuntimeProof(['apps/scanner-app/src/lib/scanner.ts']);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-proof-link-'));
  const outside = path.join(
    os.tmpdir(),
    `gateflow-proof-outside-${process.pid}.json`
  );
  fs.writeFileSync(outside, '{"result":"passed"}\n');
  const artifact = path.join(root, 'device.json');
  fs.symlinkSync(outside, artifact);
  const artifactSha256 = crypto
    .createHash('sha256')
    .update(fs.readFileSync(outside))
    .digest('hex');
  const evidence = {
    entries: plan.requirements.map((item) => ({
      requirement: item.id,
      artifact: 'device.json',
      artifactSha256,
      owner: 'qa-session-1',
      environment: 'ios-simulator',
      assertions: ['grant passed'],
      capturedAt: '2026-08-20T10:00:00Z',
      commit: 'abc123',
    })),
  };

  assert.equal(
    validateEvidence(plan, evidence, 'abc123', {
      root,
      now: '2026-08-20T11:00:00Z',
    }).valid,
    false
  );
  fs.unlinkSync(outside);
});
