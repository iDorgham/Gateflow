# PROMPT: Phase 2 — Tamper-Evident Audit Ledger & Compliance Export

**Slug:** `gateflow_security_readiness_mena`  
**Phase:** 2 of 5  
**Primary Role:** `backend-api`  
**Preferred Tool:** `opencode` / `claude`  
**Application Scope:** `packages/db`, `apps/client-dashboard`

---

## Objective

Deliver an append-only, tamper-evident cryptographic `AuditLog` structure using SHA-256 hash chaining, build an automated ledger integrity verification service, and provide exportable compliance report generation (PDF/JSON) aligned with Egyptian Law No. 151 and Saudi PDPL standards.

---

## Concrete Steps

1. **Cryptographic Hash-Chaining Engine**:
   - Implement `calculateEntryHash(prevHash: string, data: object, timestamp: string): string` using SHA-256.
   - Attach `previousHash` and `hash` fields to `AuditLog` entries on insertion.
2. **Ledger Integrity Verifier (`src/lib/security/audit-integrity-verifier.ts`)**:
   - Build a validation routine that iterates through an organization's audit log chain and flags any modified or deleted record.
3. **Compliance Export API (`apps/client-dashboard/src/app/api/security/audit-export/route.ts`)**:
   - Create authenticated, tenant-scoped export route returning JSON/CSV/PDF audit packages with cryptographic integrity seals.
4. **Client Dashboard UI Integration**:
   - Add an Audit Ledger Integrity Badge and Export Compliance Report action in `apps/client-dashboard/src/app/[locale]/dashboard/security/page.tsx`.
5. **Unit Tests**:
   - Test chain calculation, single-row tamper detection, missing link detection, and export authorization guards.

---

## Acceptance Criteria

- [ ] All new audit events are hash-chained with deterministic SHA-256 verification.
- [ ] Modified audit records are detected and reported with exact row ID by the integrity checker.
- [ ] `/api/security/audit-export` requires admin authentication and enforces strict `organizationId` scoping.
- [ ] `pnpm turbo test --filter=client-dashboard --filter=@gate-access/db` passes with 0 failures.
