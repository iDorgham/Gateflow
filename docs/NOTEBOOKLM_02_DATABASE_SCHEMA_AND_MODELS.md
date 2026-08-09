# NOTEBOOKLM SOURCE 2: GateFlow Database Schema, Data Models & Security Invariants

## 1. Relational Database Overview & Technology Stack

GateFlow utilizes **PostgreSQL** managed through **Prisma ORM** (`packages/db/prisma/schema.prisma`).

### Dual-Connection Architecture

- **Accelerate Connection (`DATABASE_URL`):** Utilized by serverless edge application functions for pooled runtime queries (`prisma+postgres://...`).
- **Direct Connection (`DIRECT_DATABASE_URL`):** Direct TCP connection used for CLI migrations (`prisma migrate deploy`), schema synchronization, and administrative scripts.

---

## 2. Key Data Model Clusters (40+ Prisma Models)

### A. Identity, Organization & Tenancy Cluster

- `Organization`: The primary multi-tenant boundary representing a real-estate developer or property management firm.
- `Project`: Specific residential compound, gated community, or building complex owned by an Organization.
- `User` & `Account`: Platform users (Admins, Guards, Property Managers, Residents) with OAuth and credential linkings.
- `UserOrganizationRole`: RBAC mapping determining access levels (`SUPER_ADMIN`, `ORG_ADMIN`, `PROPERTY_MANAGER`, `SECURITY_GUARD`, `RESIDENT`).

### B. Access Control & Gate Operations Cluster

- `Gate`: Physical or logical entrance/exit point associated with a specific Project.
- `QrCode`: Issued digital access pass containing signed payload, expiry window, usage limits (`SINGLE_USE`, `RECURRING`, `PERMANENT`), and status (`ACTIVE`, `EXPIRED`, `REVOKED`).
- `ScanLog`: Append-only audit record of every scan attempt. Captures scan decision (`ALLOWED`, `DENIED`), reason code (`EXPIRED_PASS`, `INVALID_SIGNATURE`, `GATE_MISMATCH`), scanner device ID, and timestamp.
- `Incident`: Security exception logged by guards or system automation (e.g. forced entry attempt, blacklisted visitor).
- `Watchlist`: Blacklist/whitelist entries enforced at gate check-in.

### C. Resident CRM & Physical Structure Cluster

- `Unit`: Specific villa, apartment, or plot inside a Project.
- `Contact`: Resident or visitor master profile containing contact details, verification status, and unit relationships.
- `Invitation`: Secure token-driven onboarding invite for new residents.

### D. AI Engine & Governance Cluster

- `AiTask`: Asynchronous task execution tracking for AI workflows.
- `AiActionLog`: Audit logging for actions executed via GateAI assistant.
- `AiAutomation`: Automated triggers (e.g., auto-notify manager on 3 consecutive scan denials).

---

## 3. Data Integrity & Security Invariants

### 1. Multi-Tenant Query Scoping

All operational queries MUST enforce `organizationId`. At runtime, `packages/db` wraps Prisma with an `AsyncLocalStorage` tenant context guard that throws a fatal exception if an unscoped multi-tenant query is executed on a protected table.

### 2. Mandatory Soft-Delete Pattern

Data loss prevention is enforced via the `deletedAt` DateTime field. Standard queries include `deletedAt: null`. Hard deletion is strictly restricted to automated compliance retention scripts (`retention-executor.ts`) operating under strict legal holds.

### 3. Scan Log Immutability

`ScanLog` entries are append-only. Scans cannot be updated or deleted by application users under any role context to preserve forensic auditability.
