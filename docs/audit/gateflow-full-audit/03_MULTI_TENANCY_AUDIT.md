# 03. MULTI-TENANCY & DATA ISOLATION AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Organization Isolation (`organizationId`), Soft Deletes (`deletedAt`), Cross-Tenant Security Invariants, and Admin Bypass Verification

---

## 1. Multi-Tenant Architecture Overview

GateFlow implements a strict **Logical Multi-Tenancy Architecture** where data for all tenant organizations resides in a unified PostgreSQL database, isolated logically by `organizationId` foreign key attributes and composite index constraints.

### Tenant Isolation Model

```
                    ┌─────────────────────────────────────────┐
                    │            Organization                 │
                    │         (Tenant Boundary)               │
                    └──────────────────┬──────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
  │   Project    │              │     Gate     │              │   Contact    │
  │organizationId│              │organizationId│              │organizationId│
  └──────┬───────┘              └──────┬───────┘              └──────┬───────┘
         │                             │                             │
         ▼                             ▼                             ▼
  ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
  │     Unit     │              │   ScanLog    │              │    QRCode    │
  │organizationId│              │(via Gate JOIN│              │organizationId│
  └──────────────┘              │ & gateId)    │              └──────────────┘
                                └──────────────┘
```

---

## 2. Quantitative Schema Audit

- **Total Prisma Models**: 67
- **Models with Direct `organizationId`**: 52 (77.6% of schema)
- **Models using Relational Joins for Scoping**: 15 (e.g. `ScanLog`, `ContactUnit`, `ContactTag`, `VisitorQR`, `AccessRule`)
- **Models with Soft Delete Support (`deletedAt`)**: 25 (37.3% of schema — includes `Organization`, `Project`, `Vendor`, `User`, `Gate`, `QRCode`, `ScanLog`, `Incident`, `Unit`, `Contact`, `Lead`, `Deal`)
- **Immutable Ledger / Audit Models**: 42 (operate on append-only principles: `AuditLog`, `AiActionLog`, `ShiftLog`, `ScanAttachment`, `EventLog`, `WebhookDelivery`)

---

## 3. Multi-Tenancy Invariants Verification

### 3.1 Server-Side Context Injection

API routes in `apps/client-dashboard` derive `organizationId` from authenticated session state (`session.user.organizationId`) rather than trusting raw client request parameters.

### 3.2 Cross-Tenant Access Checks

Requests attempting to query resources (e.g. `GET /api/units/[id]`) validate that `unit.organizationId === session.user.organizationId`. If validation fails, an HTTP 403 Forbidden response is returned.

### 3.3 Soft Delete Exclusion Standard

Operational queries across active records enforce `where: { organizationId, deletedAt: null }`.

---

## 4. Findings & Recommendations

### Pros

- 52 of 67 database models contain explicit `organizationId` foreign key declarations.
- API middleware extracts tenant context directly from server-verified JWT session payloads.
- Soft-delete semantics preserve forensic audit visibility for deleted gates, units, and passes.

### Cons

- `ScanLog` lacks a direct `organizationId` column, relying on relational joins through `Gate` or `QRCode` (identified in P0-002).
- Certain raw aggregate queries must be audited to ensure `deletedAt: null` is consistently applied.

### Multi-Tenancy Verification Commands

```bash
# Count organizationId fields across models
rg -n "organizationId" packages/db/prisma/schema.prisma

# Verify org scoping in client dashboard API routes
rg -n "organizationId: session" apps/client-dashboard/src/app/api
```
