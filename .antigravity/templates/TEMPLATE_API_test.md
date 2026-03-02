# API Route Test Template

Use when adding tests for API routes. Ensures auth mocking, org scope verification, and multi-tenant isolation.

**Output:** `apps/client-dashboard/src/app/api/<resource>/route.test.ts` (or next to route)

---

## GET route test

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GET } from './route';

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    <model>: {
      findMany: jest.fn(),
    },
  },
}));

const { getSessionClaims } = require('@/lib/auth-cookies');
const { prisma } = require('@gate-access/db');

describe('GET /api/<resource>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data for authenticated org', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({ orgId: 'org1' });
    (prisma.<model>.findMany as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Item', organizationId: 'org1' },
    ]);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(prisma.<model>.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org1', deletedAt: null },
      orderBy: expect.any(Object),
      select: expect.any(Object),
    });
  });

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);

    const res = await GET();

    expect(res.status).toBe(401);
    expect(prisma.<model>.findMany).not.toHaveBeenCalled();
  });
});
```

---

## POST route test

```typescript
it('creates item with org scope', async () => {
  (getSessionClaims as jest.Mock).mockResolvedValue({ orgId: 'org1' });
  (prisma.<model>.create as jest.Mock).mockResolvedValue({
    id: 'new-1',
    name: 'New',
    organizationId: 'org1',
    createdAt: new Date(),
  });

  const res = await POST(
    new Request('http://localhost/api/<resource>', {
      method: 'POST',
      body: JSON.stringify({ name: 'New' }),
      headers: { 'Content-Type': 'application/json' },
    })
  );

  expect(res.status).toBe(201);
  expect(prisma.<model>.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      name: 'New',
      organizationId: 'org1',
    }),
  });
});

it('returns 400 for invalid body', async () => {
  (getSessionClaims as jest.Mock).mockResolvedValue({ orgId: 'org1' });

  const res = await POST(
    new Request('http://localhost/api/<resource>', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
  );

  expect(res.status).toBe(400);
  expect(prisma.<model>.create).not.toHaveBeenCalled();
});
```

---

## Replace

- `<model>` — Prisma model (e.g. `gate`, `project`, `qRCode`)
- `<resource>` — API path segment (e.g. `gates`, `projects`)
