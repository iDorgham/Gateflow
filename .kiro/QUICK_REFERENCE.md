# Kiro Quick Reference for GateFlow

## Critical Rules (Never Forget)

### 1. Multi-Tenancy
```typescript
// ✅ ALWAYS
where: { organizationId: user.orgId, deletedAt: null }

// ❌ NEVER
where: { deletedAt: null }
```

### 2. Soft Deletes
```typescript
// ✅ ALWAYS
update({ data: { deletedAt: new Date() } })

// ❌ NEVER
delete({ where: { id } })
```

### 3. Package Manager
```bash
# ✅ ALWAYS
pnpm install
pnpm turbo dev

# ❌ NEVER
npm install
yarn dev
```

## Quick Commands

```bash
# Development
pnpm turbo dev                              # All apps
pnpm turbo dev --filter=client-dashboard    # Single app

# Database
cd packages/db
npx prisma generate                         # After schema changes
npx prisma migrate dev --name change_name   # Create migration
npx prisma studio                           # GUI

# Quality
pnpm turbo lint                             # Lint all
pnpm turbo test                             # Test all
pnpm turbo typecheck                        # Type check all
```

## API Route Template

```typescript
import { validateAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { prisma } from '@gate-access/db';
import { z } from 'zod';

export async function POST(request: Request) {
  // 1. Rate limit
  await rateLimit(request, { max: 10, window: '1m' });
  
  // 2. Auth
  const user = await validateAuth(request);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // 3. Validate
  const schema = z.object({ name: z.string() });
  const input = schema.parse(await request.json());
  
  // 4. Query with org scope
  const data = await prisma.model.create({
    data: { ...input, organizationId: user.orgId }
  });
  
  return Response.json(data, { status: 201 });
}
```

## Component Template

```typescript
'use client';

import { Button, Input } from '@gate-access/ui';
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
}

export function MyComponent({ title }: Props) {
  const t = useTranslations('namespace');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}
```

## Skills Available

- `gateflow-architecture` - Monorepo, tech stack, patterns
- `gateflow-security` - Auth, encryption, RBAC
- `gateflow-database` - Prisma, queries, schema
- `gateflow-testing` - Jest, mocking, coverage
- `gateflow-mobile` - React Native, Expo, offline

## Hooks Active

- `lint-on-save` - Auto-lint on file save
- `prisma-generate` - Auto-generate on schema change
- `multi-tenant-check` - Verify org scoping
- `security-review` - Review API changes
- `test-after-feature` - Run tests after tasks

## Common Patterns

### Query with Filters
```typescript
const data = await prisma.model.findMany({
  where: {
    organizationId: user.orgId,
    projectId: currentProjectId,
    deletedAt: null
  },
  include: { relation: true },
  orderBy: { createdAt: 'desc' }
});
```

### Audit Trail
```typescript
await prisma.scanLog.update({
  where: { id },
  data: {
    auditTrail: {
      push: {
        timestamp: new Date().toISOString(),
        action: 'ACTION_NAME',
        actor: 'ACTOR_TYPE',
        details: { key: 'value' }
      }
    }
  }
});
```

## Port Reference

- Marketing: 3000
- Client Dashboard: 3001
- Admin Dashboard: 3002
- Resident Portal: 3004
- Scanner App: 8081
- Resident Mobile: 8082

## File Locations

- Schema: `packages/db/prisma/schema.prisma`
- Types: `packages/types/src/`
- UI: `packages/ui/src/`
- Docs: `docs/`
- Skills: `.kiro/skills/`
- Steering: `.kiro/steering/`
- Hooks: `.kiro/hooks/`
