---
inclusion: fileMatch
fileMatchPattern: '**/*.ts'
---

# Prisma Query Guidelines

## Always Include These Filters

### Multi-Tenant Scoping
```typescript
// ✅ CORRECT
const data = await prisma.model.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});

// ❌ WRONG - Missing orgId
const data = await prisma.model.findMany({
  where: { deletedAt: null }
});
```

### Soft Delete Filter
```typescript
// ✅ CORRECT - Always filter deletedAt
where: {
  organizationId: user.orgId,
  deletedAt: null
}

// ❌ WRONG - Missing deletedAt filter
where: {
  organizationId: user.orgId
}
```

## Project Scoping
When working with projects:
```typescript
import { getValidatedProjectId } from '@/lib/project-cookie';

const projectId = await getValidatedProjectId(request, user.orgId);

const data = await prisma.model.findMany({
  where: {
    organizationId: user.orgId,
    projectId: projectId,
    deletedAt: null
  }
});
```

## Soft Delete Operations
```typescript
// ✅ CORRECT - Soft delete
await prisma.model.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// ❌ WRONG - Hard delete
await prisma.model.delete({ where: { id } });
```

## Audit Trail Pattern
For ScanLog and audit-critical operations:
```typescript
await prisma.scanLog.create({
  data: {
    scanUuid: crypto.randomUUID(),
    qrCodeId,
    gateId,
    organizationId: user.orgId,
    status: 'ALLOWED',
    auditTrail: [
      {
        timestamp: new Date().toISOString(),
        action: 'SCAN_INITIATED',
        actor: 'GATE_OPERATOR',
        details: { operatorId: user.id }
      }
    ]
  }
});

// Append to audit trail
await prisma.scanLog.update({
  where: { id },
  data: {
    auditTrail: {
      push: {
        timestamp: new Date().toISOString(),
        action: 'SUPERVISOR_OVERRIDE',
        actor: 'SUPERVISOR',
        details: { supervisorId, reason }
      }
    }
  }
});
```

## Performance Optimization
```typescript
// Use select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true
  },
  where: { organizationId: user.orgId, deletedAt: null }
});

// Use include for relations
const gates = await prisma.gate.findMany({
  where: { organizationId: user.orgId, deletedAt: null },
  include: {
    project: true,
    scanLogs: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```
