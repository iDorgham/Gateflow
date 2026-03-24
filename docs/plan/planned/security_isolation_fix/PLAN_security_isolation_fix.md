# PLAN — security_isolation_fix — High-Risk Security Hardening

This plan outlines the systematic remediation of all 15+ multi-tenant isolation
vulnerabilities discovered by the Ralph Skill Discovery engine.

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

### Phase 5 — Automated Enforcement & Certification (Initial)

**Goal:** Run initial enforcement to confirm all backend/API hardening from Phases 1–4 is successful.

- **Deliverables:**
  - [ ] Rerun `ralph-skill-discover.js` with zero violations across core APIs.
- **Acceptance criteria:**
  - [ ] 100% compliance on all Phase 1–4 API scopes.

### Phase 6 — Gate-Assignment Management UI

**Goal:** Implement the dashboard UI for managing user-to-gate assignments as defined in the design craft.

- **Scope:** `dashboard/team/gate-assignments/page.tsx`, `api/gates/assignments/route.ts`.
- **Deliverables:**
  - [ ] Assign Form: User select + Gates multi-select.
  - [ ] Assignments Table: List with unassign actions.
  - [ ] Scoped to current organization data only.
- **Depends on:** `gf-ads-core-tokens`, `client-dashboard` layouts.
- **Acceptance criteria:**
  - [ ] New page at `/dashboard/team/gate-assignments` with assigned roles protection.
  - [ ] UI correctly fetches org-specific users and gates.
  - [ ] Assign and Unassign actions function correctly and refresh the UI.

### Phase 7 — Final Certification & Audit

**Goal:** Certified 100% compliance via automated scanning across all code, including the new UI.

- **Deliverables:**
  - [ ] Rerun `ralph-skill-discover.js` with zero violations.
  - [ ] Document the security hardening in `docs/plan/learning/incidents.md`.
- **Primary role:** QA | SECURITY

---

## **Acceptance Criteria (Global)**

- All modified queries must include `organizationId: session.user.organizationId`
  and `deletedAt: null`.
- No regression in linting, typechecking, or existing functional tests.
- 100% compliance confirmed by automated discovery.
