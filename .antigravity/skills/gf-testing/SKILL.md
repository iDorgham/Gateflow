---
name: gateflow-testing
description: Jest configuration and testing patterns for GateFlow. Use when writing unit/integration tests, debugging test failures, or mocking dependencies.
---

# GateFlow Testing

## Stack

- **Framework**: Jest 29/30 + ts-jest
- **Files**: `*.test.ts` or `*.test.tsx`
- **Command**: `pnpm turbo test`

## Commands

```bash
pnpm turbo test
pnpm turbo test --filter=client-dashboard
pnpm turbo test --filter=scanner-app
cd apps/client-dashboard && pnpm test --watch
pnpm turbo test -- --coverage
```

## Unit Test Template

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('MyFunction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should handle valid input', () => {
    expect(myFunction('valid')).toBe('expected');
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction('')).toThrow('Invalid input');
  });
});
```

## API Route Test

```typescript
jest.mock('@/lib/require-auth');
jest.mock('@gate-access/db', () => ({
  prisma: { gate: { findMany: jest.fn() } },
}));

describe('GET /api/gates', () => {
  it('returns gates for auth user', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ orgId: 'org1', role: 'TENANT_ADMIN' });
    (prisma.gate.findMany as jest.Mock).mockResolvedValue([{ id: 'g1', name: 'Gate' }]);

    const res = await GET(new Request('http://localhost/api/gates'));
    const data = await res.json();

    expect(data).toHaveLength(1);
    expect(prisma.gate.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org1', deletedAt: null },
    });
  });

  it('returns 401 when unauthenticated', async () => {
    (requireAuth as jest.Mock).mockResolvedValue(NextResponse.json({}, { status: 401 }));
    const res = await GET(new Request('http://localhost/api/gates'));
    expect(res.status).toBe(401);
  });
});
```

## Multi-Tenant Isolation Test

```typescript
it('only returns data for user org', async () => {
  await prisma.gate.createMany({
    data: [
      { name: 'Org1 Gate', organizationId: 'org1' },
      { name: 'Org2 Gate', organizationId: 'org2' },
    ],
  });

  const org1Gates = await getGatesForOrg('org1');
  expect(org1Gates).toHaveLength(1);
  expect(org1Gates[0].name).toBe('Org1 Gate');
});
```

## Mocking

```typescript
// Prisma
jest.mock('@gate-access/db', () => ({
  prisma: { model: { findMany: jest.fn(), create: jest.fn() } },
}));

// Auth
jest.mock('@/lib/require-auth', () => ({ requireAuth: jest.fn() }));

// Fetch
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
) as jest.Mock;
```

## Coverage Goals

- Unit: 80%+
- Critical paths: 100%
- Security functions: 100%
- API routes: 80%+

## MCP: E2E Verification

When **cursor-ide-browser** MCP is enabled, use for:

- Login flow verification
- Navigation, filters, exports
- i18n checks (AR/EN, RTL)
- Screenshot capture for broken states

**Alternative:** browser-use subagent for complex multi-step flows.

**Templates:** `.cursor/templates/TEMPLATE_API_test.md` (API tests), `TEMPLATE_E2E_flow.md` (E2E flow spec), `TEMPLATE_E2E_playwright.md` (Playwright).

**Reference:** `apps/client-dashboard/src/lib/*.test.ts`, `apps/scanner-app/src/lib/*.test.ts`
