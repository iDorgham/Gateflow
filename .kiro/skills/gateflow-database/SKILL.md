# GateFlow Database Expert

## Purpose
Expert knowledge of GateFlow's database schema, Prisma patterns, and data modeling.

## When to Use
- Creating or modifying database models
- Writing database queries
- Creating migrations
- Debugging data issues
- Understanding relationships

## Database Stack
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Schema Location**: `packages/db/prisma/schema.prisma`
- **Migrations**: `packages/db/prisma/migrations/`

## Core Models (14 Total)

### 1. Organization (Multi-tenant Root)
```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  plan      Plan     @default(FREE)
  deletedAt DateTime?
  
  users     User[]
  gates     Gate[]
  qrCodes   QRCode[]
  projects  Project[]
}
```

### 2. Project (Sub-grouping)
```prisma
model Project {
  id             String       @id @default(cuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  deletedAt      DateTime?
  
  gates   Gate[]
  qrCodes QRCode[]
  units   Unit[]
}
```

### 3. User (Authentication)
```prisma
model User {
  id             String        @id @default(cuid())
  email          String        @unique
  passwordHash   String
  role           UserRole
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  deletedAt      DateTime?
  
  scanLogs      ScanLog[]
  refreshTokens RefreshToken[]
}
```

### 4. Gate (Access Points)
```prisma
model Gate {
  id             String       @id @default(cuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  projectId      String?
  project        Project?     @relation(fields: [projectId], references: [id])
  isActive       Boolean      @default(true)
  deletedAt      DateTime?
  
  scanLogs ScanLog[]
  qrCodes  QRCode[]
}
```

### 5. QRCode (Access Codes)
```prisma
model QRCode {
  id             String       @id @default(cuid())
  code           String       @unique
  type           QRCodeType
  signature      String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  projectId      String?
  project        Project?     @relation(fields: [projectId], references: [id])
  gateId         String?
  gate           Gate?        @relation(fields: [gateId], references: [id])
  validFrom      DateTime
  validUntil     DateTime?
  maxScans       Int?
  scanCount      Int          @default(0)
  deletedAt      DateTime?
  
  scanLogs ScanLog[]
}
```

### 6. ScanLog (Immutable Audit Trail)
```prisma
model ScanLog {
  id             String       @id @default(cuid())
  scanUuid       String       @unique
  qrCodeId       String
  qrCode         QRCode       @relation(fields: [qrCodeId], references: [id])
  gateId         String
  gate           Gate         @relation(fields: [gateId], references: [id])
  scannedById    String?
  scannedBy      User?        @relation(fields: [scannedById], references: [id])
  organizationId String
  status         ScanStatus
  auditTrail     Json         // Array of audit events
  location       Json?
  deviceInfo     Json?
  createdAt      DateTime     @default(now())
}
```

### 7. Unit (Residential Units)
```prisma
model Unit {
  id             String       @id @default(cuid())
  unitNumber     String
  type           UnitType
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  projectId      String?
  project        Project?     @relation(fields: [projectId], references: [id])
  deletedAt      DateTime?
  
  contactUnits ContactUnit[]
}
```

## Enums

```prisma
enum UserRole {
  ADMIN
  TENANT_ADMIN
  TENANT_USER
  VISITOR
  RESIDENT
}

enum Plan {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum QRCodeType {
  SINGLE
  RECURRING
  PERMANENT
  OPEN
}

enum ScanStatus {
  ALLOWED
  DENIED
  EXPIRED
  INVALID
}

enum UnitType {
  STUDIO
  ONE_BR
  TWO_BR
  THREE_BR
  FOUR_BR
  VILLA
  PENTHOUSE
  COMMERCIAL
}

enum ApiScope {
  READ_QRCODES
  WRITE_QRCODES
  READ_SCANS
  WRITE_SCANS
  READ_GATES
  WRITE_GATES
  ADMIN
}
```

## Critical Patterns

### 1. Multi-Tenant Queries
ALWAYS scope by organizationId:
```typescript
// ✅ CORRECT
const gates = await prisma.gate.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});

// ❌ WRONG
const gates = await prisma.gate.findMany();
```

### 2. Soft Deletes
ALWAYS filter deletedAt and use soft delete:
```typescript
// ✅ CORRECT - Query
const active = await prisma.gate.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});

// ✅ CORRECT - Delete
await prisma.gate.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// ❌ WRONG
await prisma.gate.delete({ where: { id } });
```

### 3. Audit Trail Pattern
ScanLog uses JSON array for audit events:
```typescript
const scanLog = await prisma.scanLog.create({
  data: {
    scanUuid: uuid(),
    qrCodeId,
    gateId,
    organizationId,
    status: 'ALLOWED',
    auditTrail: [
      {
        timestamp: new Date().toISOString(),
        action: 'SCAN_INITIATED',
        actor: 'GATE_OPERATOR',
        details: { gateId, operatorId }
      }
    ]
  }
});

// Append to audit trail
await prisma.scanLog.update({
  where: { id: scanLog.id },
  data: {
    auditTrail: {
      push: {
        timestamp: new Date().toISOString(),
        action: 'SUPERVISOR_OVERRIDE',
        actor: 'SUPERVISOR',
        details: { supervisorId, reason, pin: '[REDACTED]' }
      }
    }
  }
});
```

### 4. Cascade Deletes
Use Prisma cascade for cleanup:
```prisma
model Gate {
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}
```

### 5. Indexes for Performance
```prisma
model ScanLog {
  @@index([organizationId])
  @@index([gateId])
  @@index([qrCodeId])
  @@index([createdAt])
}
```

## Common Operations

### Create Migration
```bash
cd packages/db
npx prisma migrate dev --name add_new_field
```

### Push Schema (Dev Only)
```bash
cd packages/db
npx prisma db push
```

### Generate Client
```bash
cd packages/db
npx prisma generate
```

### Seed Database
```bash
cd packages/db
npx prisma db seed
```

### Open Prisma Studio
```bash
cd packages/db
npx prisma studio
```

## Query Patterns

### Complex Filtering
```typescript
const qrCodes = await prisma.qRCode.findMany({
  where: {
    organizationId: user.orgId,
    projectId: currentProjectId,
    deletedAt: null,
    OR: [
      { validUntil: null },
      { validUntil: { gte: new Date() } }
    ],
    scanCount: { lt: prisma.qRCode.fields.maxScans }
  },
  include: {
    gate: true,
    scanLogs: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Aggregations
```typescript
const stats = await prisma.scanLog.groupBy({
  by: ['status'],
  where: {
    organizationId: user.orgId,
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  },
  _count: true
});
```

### Transactions
```typescript
await prisma.$transaction(async (tx) => {
  const qrCode = await tx.qRCode.update({
    where: { id: qrCodeId },
    data: { scanCount: { increment: 1 } }
  });
  
  await tx.scanLog.create({
    data: {
      scanUuid: uuid(),
      qrCodeId,
      gateId,
      organizationId,
      status: 'ALLOWED'
    }
  });
});
```

## Data Validation

### Use Zod for Input Validation
```typescript
import { z } from 'zod';

const createGateSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().optional(),
  projectId: z.string().cuid().optional(),
  isActive: z.boolean().default(true)
});

const input = createGateSchema.parse(body);
```

## Performance Tips

1. **Use Select**: Only fetch needed fields
```typescript
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true }
});
```

2. **Batch Operations**: Use createMany for bulk inserts
```typescript
await prisma.qRCode.createMany({
  data: qrCodesArray,
  skipDuplicates: true
});
```

3. **Connection Pooling**: Configure in DATABASE_URL
```
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"
```

4. **Indexes**: Add indexes for frequently queried fields
```prisma
@@index([organizationId, projectId, deletedAt])
```

## References
- `packages/db/prisma/schema.prisma` - Full schema
- `packages/db/prisma/seed.ts` - Seed data examples
- Prisma Docs: https://www.prisma.io/docs
