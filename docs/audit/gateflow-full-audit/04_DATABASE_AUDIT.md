# 04. DATABASE & DATA MODEL AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Prisma Schema, Migration Safety, Indexing Strategy, Relation Constraints, and Database Connection Management

---

## 1. Database Architecture Overview

GateFlow uses PostgreSQL managed via Prisma ORM (`packages/db`). The database schema defines 67 models covering organizational hierarchies, visitor passes, physical security gates, access rules, CRM contacts, AI automations, and operational logs.

```
+-----------------------------------------------------------------------------------+
|                                  PostgreSQL                                       |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |      Organization      |  |        Project         |  |        Gate         |  |
|  | (Tenant Root, 52 FKs)  |  |  (Sub-Property Scope)  |  |  (Hardware Entity)  |  |
|  +-----------+------------+  +-----------+------------+  +----------+----------+  |
|              |                           |                          |             |
|              v                           v                          v             |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |        Contact         |  |          Unit          |  |       ScanLog       |  |
|  |   (Residents & Guests) |  |   (Physical Property)  |  |  (Scan Ledger Entry)|  |
|  +------------------------+  +------------------------+  +---------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Key Database Models Audit

| Model          | Tenant Scoped | Soft Delete | Primary Indexes               | Audit Notes                                             |
| :------------- | :-----------: | :---------: | :---------------------------- | :------------------------------------------------------ |
| `Organization` |   Self (ID)   |     Yes     | `id`, `slug`                  | Root tenant entity; enforces unique slug indexing.      |
| `Project`      |      Yes      |     Yes     | `organizationId`, `id`        | Property project boundary; indexed by org.              |
| `User`         |      Yes      |     Yes     | `organizationId`, `email`     | Dashboard users & guards; email indexed uniquely.       |
| `Gate`         |      Yes      |     Yes     | `organizationId`, `id`        | Physical entry point entity; linked to shift logs.      |
| `QRCode`       |      Yes      |     Yes     | `organizationId`, `code`      | Pass representation; signed HMAC hash embedded.         |
| `ScanLog`      |   Via Gate    |     Yes     | `gateId`, `scannedAt`         | High-volume scan ledger; needs direct `organizationId`. |
| `Unit`         |      Yes      |     Yes     | `organizationId`, `id`        | Physical property unit; indexed for search.             |
| `Contact`      |      Yes      |     Yes     | `organizationId`, `email`     | Visitor & resident identity master record.              |
| `Incident`     |      Yes      |     Yes     | `organizationId`, `createdAt` | Denied scan or security escalation record.              |
| `AuditLog`     |      Yes      |  Immutable  | `organizationId`, `createdAt` | Forensic event append-only ledger.                      |

---

## 3. Migration & Connection Management

- **Direct vs Pooled Connection Strategy**:
  - `schema.prisma` configures `directUrl = env("DIRECT_DATABASE_URL")` for Prisma CLI migrations (`migrate deploy`, `migrate resolve`).
  - Application runtime environments use Accelerate / connection pooling (`prisma+postgres://`).
- **Migration Drift Safety**: Migration history under `packages/db/prisma/migrations/` is synchronized with `schema.prisma`. No unapplied drift was identified.
- **Cascading Soft Delete Behavior**: High-volume tenant resets (`apps/admin-dashboard/src/app/api/admin/reset-tenant/route.ts`) execute batched `updateMany` operations to set `deletedAt = new Date()`, avoiding hard cascade deletes of historical audit data.

---

## 4. Findings & Recommendations

### Pros

- Clean schema modeling with comprehensive relational integrity across 67 Prisma entities.
- Direct URL configuration properly separated from pooled connection strings.
- Preserved append-only audit tables (`AuditLog`, `AiActionLog`) for regulatory compliance.

### Cons

- Missing direct `organizationId` column on `ScanLog` (P0-002 recommendation).
- Need composite index `@@index([organizationId, deletedAt])` on high-frequency search tables (`Contact`, `Unit`).

### Database Verification Commands

```bash
# Validate Prisma schema syntax
pnpm --filter=@gate-access/db exec prisma validate

# Check index coverage across schema models
rg -n "@@index" packages/db/prisma/schema.prisma
```
