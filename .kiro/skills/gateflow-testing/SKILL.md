# GateFlow Testing Expert

## Purpose
Expert knowledge of testing patterns, Jest configuration, and quality assurance for GateFlow.

## When to Use
- Writing unit tests
- Writing integration tests
- Debugging test failures
- Setting up test infrastructure
- Mocking dependencies

## Testing Stack
- **Framework**: Jest 29/30
- **TypeScript**: ts-jest
- **Location**: `*.test.ts` or `*.test.tsx` files
- **Command**: `pnpm turbo test`

## Test Structure

### Unit Test Template
```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('MyFunction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle valid input', () => {
    const result = myFunction('valid');
    expect(result).toBe('expected');
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction('')).toThrow('Invalid input');
  });
});
```

### API Route Testing
```typescript
import { validateAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { prisma } from '@gate-access/db';

jest.mock('@/lib/auth');
jest.mock('@/lib/rate-limit');
jest.mock('@gate-access/db', () => ({
  prisma: {
    model: {
      findMany: jest.fn(),
      create: jest.fn()
    }
  }
}));

describe('GET /api/gates', () => {
  it('should return gates for authenticated user', async () => {
    (validateAuth as jest.Mock).mockResolvedValue({
      id: 'user1',
      orgId: 'org1',
      role: 'TENANT_ADMIN'
    });

    (prisma.gate.findMany as jest.Mock).mockResolvedValue([
      { id: 'gate1', name: 'Main Gate' }
    ]);

    const request = new Request('http://localhost/api/gates');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveLength(1);
    expect(prisma.gate.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org1',
        deletedAt: null
      }
    });
  });

  it('should return 401 for unauthenticated user', async () => {
    (validateAuth as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/gates');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

### Multi-Tenant Isolation Tests
```typescript
describe('Multi-tenant isolation', () => {
  it('should only return data for user org', async () => {
    const org1User = { id: 'u1', orgId: 'org1', role: 'TENANT_ADMIN' };
    const org2User = { id: 'u2', orgId: 'org2', role: 'TENANT_ADMIN' };

    // Create data for both orgs
    await prisma.gate.create({
      data: { name: 'Org1 Gate', organizationId: 'org1' }
    });
    await prisma.gate.create({
      data: { name: 'Org2 Gate', organizationId: 'org2' }
    });

    // Query as org1 user
    const org1Gates = await getGates(org1User);
    expect(org1Gates).toHaveLength(1);
    expect(org1Gates[0].name).toBe('Org1 Gate');

    // Query as org2 user
    const org2Gates = await getGates(org2User);
    expect(org2Gates).toHaveLength(1);
    expect(org2Gates[0].name).toBe('Org2 Gate');
  });
});
```

### Soft Delete Tests
```typescript
describe('Soft delete behavior', () => {
  it('should not return deleted records', async () => {
    const gate = await prisma.gate.create({
      data: { name: 'Test Gate', organizationId: 'org1' }
    });

    // Soft delete
    await prisma.gate.update({
      where: { id: gate.id },
      data: { deletedAt: new Date() }
    });

    // Should not be returned
    const gates = await prisma.gate.findMany({
      where: { organizationId: 'org1', deletedAt: null }
    });

    expect(gates).toHaveLength(0);
  });
});
```

## Mocking Patterns

### Mock Prisma
```typescript
jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));
```

### Mock Auth
```typescript
jest.mock('@/lib/auth', () => ({
  validateAuth: jest.fn(),
  generateToken: jest.fn()
}));
```

### Mock External APIs
```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked' })
  })
) as jest.Mock;
```

## Test Coverage Goals
- Unit tests: 80%+ coverage
- Critical paths: 100% coverage
- Security functions: 100% coverage
- API routes: 80%+ coverage

## Running Tests
```bash
# All tests
pnpm turbo test

# Single app
pnpm turbo test --filter=client-dashboard

# Watch mode (local only)
cd apps/client-dashboard && pnpm test --watch

# Coverage report
pnpm turbo test -- --coverage
```

## References
- Existing tests: `apps/client-dashboard/src/lib/*.test.ts`
- Jest config: `apps/*/jest.config.js`
