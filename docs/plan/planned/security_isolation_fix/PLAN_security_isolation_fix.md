# PLAN — security_isolation_fix — High-Risk Security Hardening

This plan outlines the systematic remediation of all 15+ multi-tenant isolation vulnerabilities discovered by the Ralph Skill Discovery engine.

---

## **Phases**

### Phase 1 — Core Operations Audit & Fix (Gates & Scans)
**Goal:** Harden the primary dashboard and API routes for Gates and Scan logs.
- **Scope:** `api/gates/route.ts`, `api/scans/export/route.ts`, `dashboard/gates/page.tsx`, `dashboard/scans/page.tsx`.
- **Deliverables:** Secured Prisma queries with `where: { organizationId }` filter.
- **Depends on:** `gf-security` skill, valid session retrieval.
- **Acceptance criteria:**
  - [ ] `api/gates` returns only current organization's gates.
  - [ ] `api/scans/export` filters by current user's organization.

### Phase 2 — CRM & Management Hardening (Contacts & Units)
**Goal:** Fix global `findMany` calls in the Real Estate CRM modules.
- **Scope:** `api/contacts/*`, `api/crm/*`, `api/units/*`, and bulk tag operations.
- **Deliverables:** Multi-tenant scoping for all CRUD operations in the CRM.
- **Acceptance criteria:**
  - [ ] Contacts and Units belong strictly to the correct organization.
  - [ ] Bulk tag operations do not leak tags between tenants.

### Phase 3 — QR Codes & Workspace Exports
**Goal:** Secure the high-sensitivity QR generation and whole-workspace export routes.
- **Scope:** `api/qrcodes/*`, `api/workspace/export/*`, `api/resident/visitors/*`.
- **Deliverables:** Protected export streams and QR lookups.
- **Acceptance criteria:**
  - [ ] Large workspace exports are capped to the current organization's data only.

### Phase 4 — Analytics, Incidents & Edge Routes
**Goal:** Finalize the hardening pass for analytics exports and incidents.
- **Scope:** `api/analytics/export/route.ts`, `api/incidents/route.ts`.
- **Deliverables:** Secured read operations for analytics and incidents.
- **Acceptance criteria:**
  - [ ] Analytics reports are strictly scoped to the requesting organization.

### Phase 5 — Automated Enforcement & Certification
**Goal:** Certified 100% compliance via automated scanning.
- **Deliverables:**
  - [ ] Rerun `ralph-skill-discover.js` with zero violations.
  - [ ] Document the security hardening in `docs/plan/learning/incidents.md`.
- **Primary role:** QA | SECURITY

---

## **Acceptance Criteria (Global)**
- All modified queries must include `organizationId: session.user.organizationId` and `deletedAt: null`.
- No regression in linting, typechecking, or existing functional tests.
- 100% compliance confirmed by automated discovery.
