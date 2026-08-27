---
name: test-suite-accelerator
description: High-speed test authoring with pre-built mock factories for Prisma, NextAuth, Next.js 14 App Router, and Expo hardware sensors.
---

# SKILL: Test Suite Accelerator

## Purpose

Rapidly scaffold deterministic, high-coverage unit and integration tests across Next.js and Expo React Native apps without boilerplate friction.

---

## Mock Factories Matrix

### 1. NextAuth / JWT Session Mock

```typescript
export function mockAuthSession(overrides = {}) {
  return {
    user: {
      id: 'usr_test_123',
      email: 'admin@gateflow.site',
      role: 'ADMIN',
      organizationId: 'org_test_compound',
      ...overrides,
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}
```

### 2. Prisma Model Mocking Pattern

```typescript
import { prisma } from '@gate-access/db';

jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorPass: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));
```

### 3. Next.js 14 App Router Request Mock

```typescript
import { NextRequest } from 'next/server';

export function createMockRequest(url: string, method = 'GET', body?: unknown) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}
```

---

## Fast Verification Commands

```bash
# Run tests for a single package or file
pnpm turbo test --filter=client-dashboard
pnpm --filter=scanner-app test -- src/lib/scanner.test.ts
```
