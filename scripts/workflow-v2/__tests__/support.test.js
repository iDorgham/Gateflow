const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  aggregatePageScores,
  inventoryRoutes,
  resolveApp,
  validatePageScore,
  validateScopeDiff,
  aggregateEvidence,
} = require('../support');

function root() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-workflow-support-'));
}

test('app registry resolves package filters and app types', () => {
  assert.deepEqual(resolveApp('client-dashboard'), {
    id: 'client-dashboard',
    path: 'apps/client-dashboard',
    package: 'client-dashboard',
    type: 'nextjs',
    order: 1,
  });
});

test('route inventory finds Next.js pages and excludes private segments', () => {
  const repo = root();
  fs.mkdirSync(path.join(repo, 'apps/demo/src/app/(auth)/contacts/[id]'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(repo, 'apps/demo/src/app/api/health'), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(repo, 'apps/demo/src/app/(auth)/contacts/[id]/page.tsx'),
    ''
  );
  fs.writeFileSync(
    path.join(repo, 'apps/demo/src/app/api/health/route.ts'),
    ''
  );
  assert.deepEqual(inventoryRoutes(repo, 'apps/demo', 'nextjs'), [
    {
      route: '/contacts/[id]',
      file: 'apps/demo/src/app/(auth)/contacts/[id]/page.tsx',
      kind: 'page',
    },
  ]);
});

test('route inventory finds Expo screens', () => {
  const repo = root();
  fs.mkdirSync(path.join(repo, 'apps/mobile/app/(tabs)'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'apps/mobile/app/(tabs)/scan.tsx'), '');
  fs.writeFileSync(path.join(repo, 'apps/mobile/app/_layout.tsx'), '');
  assert.deepEqual(
    inventoryRoutes(repo, 'apps/mobile', 'expo')[0].route,
    '/scan'
  );
});

test('page scores require evidence and cap unproven security', () => {
  const score = {
    route: '/contacts',
    date: '2026-07-24',
    commit: 'abc',
    locale: 'en',
    viewport: 1280,
    environment: 'local',
    reviewMode: 'static-review-only',
    evidence: ['src/app/contacts/page.tsx'],
    categories: {
      purpose: 15,
      task: 20,
      hierarchy: 10,
      states: 15,
      design: 10,
      accessibility: 10,
      responsiveRtl: 10,
      performance: 5,
      security: 5,
    },
    securityBoundaryProven: false,
  };
  const result = validatePageScore(score);
  assert.equal(result.score, 49);
  assert.equal(result.classification, 'major gaps');
});

test('aggregate report rejects invalid scores', () => {
  assert.throws(
    () => aggregatePageScores([{ route: '/' }]),
    /Invalid page score/
  );
});

test('scope diff allows focused app, shared packages, docs, and workflow files', () => {
  assert.deepEqual(
    validateScopeDiff('client-dashboard', [
      'apps/client-dashboard/src/a.ts',
      'CHANGELOG.md',
      'package.json',
      'pnpm-lock.yaml',
      'packages/types/src/a.ts',
      'docs/product/a.md',
      '.agents/workflows/dev.md',
    ]),
    []
  );
  assert.match(
    validateScopeDiff('client-dashboard', ['turbo.json'])[0],
    /outside Workflow v2 scope/
  );
  assert.match(
    validateScopeDiff('client-dashboard', ['apps/resident-portal/src/a.ts'])[0],
    /outside focused app/
  );
});

test('pilot evidence aggregation requires fresh passing P0 steps', () => {
  const result = aggregateEvidence([
    {
      step: 'invite',
      priority: 'P0',
      status: 'passed',
      createdAt: '2026-07-24T00:00:00.000Z',
    },
    {
      step: 'scan',
      priority: 'P0',
      status: 'failed',
      createdAt: '2026-07-24T00:00:00.000Z',
    },
  ]);
  assert.equal(result.ready, false);
  assert.deepEqual(result.blockers, ['scan']);
});
