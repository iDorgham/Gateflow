const assert = require('node:assert/strict');
const test = require('node:test');
const {
  validateLoopScope,
  validateOwnedFiles,
} = require('../loop-scope');

test('focused app, justified packages, workspace tooling, and docs are allowed', () => {
  const result = validateLoopScope({
    focusedApp: 'client-dashboard',
    files: [
      'apps/client-dashboard/src/page.tsx',
      'packages/types/src/access.ts',
      'scripts/workflow-v2/loop-lib.js',
      'docs/workspace/WORKFLOW_V2.md',
    ],
    sharedPackageJustifications: {
      'packages/types/': 'Client Dashboard requires the shared access contract',
    },
  });
  assert.deepEqual(result, []);
});

test('parked app code and unjustified shared packages are rejected', () => {
  const result = validateLoopScope({
    focusedApp: 'client-dashboard',
    files: [
      'apps/resident-portal/src/page.tsx',
      'packages/db/src/client.ts',
    ],
    sharedPackageJustifications: {},
  });
  assert.match(result.join('\n'), /parked application/);
  assert.match(result.join('\n'), /requires justification/);
});

test('workspace tasks may not touch app code', () => {
  const result = validateLoopScope({
    focusedApp: 'client-dashboard',
    targetType: 'workspace',
    files: ['apps/client-dashboard/src/page.tsx'],
    sharedPackageJustifications: {},
  });
  assert.match(result[0], /workspace task/);
});

test('owned file validation rejects overlapping user changes', () => {
  const result = validateOwnedFiles({
    requested: ['docs/workspace/WORKFLOW_V2.md', 'package.json'],
    preExistingDirty: ['package.json'],
  });
  assert.deepEqual(result.owned, ['docs/workspace/WORKFLOW_V2.md']);
  assert.deepEqual(result.conflicts, ['package.json']);
});

test('task contract include and exclude paths are enforced', () => {
  const result = validateLoopScope({
    focusedApp: 'client-dashboard',
    targetType: 'workspace',
    files: ['docs/workspace/WORKFLOW_V2.md', 'scripts/workflow-v2/loop-lib.js'],
    contractScope: {
      include: ['docs/workspace/'],
      exclude: ['docs/workspace/private/'],
    },
  });
  assert.match(result.join('\n'), /outside the approved task contract/);
});
