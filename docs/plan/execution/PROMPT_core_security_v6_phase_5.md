# PROMPT_core_security_v6_phase_5 — Watchlists, Incidents & Guard Accountability

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 5 of 6  

---

## Primary role

**SECURITY** — Use this role's context when implementing. Watchlist and incident data are tenant-scoped and permission-gated; match logic must not leak across orgs.

## Preferred tool

**Cursor** (default). **Multi-CLI** optional only if incident workflow design is complex and a second opinion is desired.

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth; secrets).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list.

Additional references:
- `docs/PRD_v6.0.md` (Section 13.5 Watchlists & Blocklists, 13.6 Guard Shifts & Incidents).
- `docs/guides/SECURITY_OVERVIEW.md` (Section 5).
- Phase 2 scan path (gate-aware); bulk-sync and single-scan endpoints.

---

## Goal

Implement tenant-managed **person watchlists** and **incidents**: add models and APIs for watchlist entries (name, optional ID number, phone, notes) and incidents (reason, status, gate, operator, scan reference). On every scan (and when processing bulk-sync), check visitor/scan payload against the org’s active watchlist; on match, reject the scan with a hard stop and create an incident linked to the scan. Expose watchlist CRUD and incident list/update in the dashboard for Security Managers; optionally add guard shifts and link scans/incidents to shifts if time permits.

---

## Scope (in)

- **Watchlist:** Prisma model (e.g. `WatchlistEntry`): org, name, optional idNumber, phone, notes, deletedAt, timestamps. APIs: list (org-scoped), add, remove (soft delete). Permission: Security Manager or Org Admin only. Audit log who added/removed and when (can be simple createdAt/updatedAt and user id).
- **Incident:** Prisma model: org, gate, operator (user), scan reference (optional), reason code or free text, status (e.g. under_review, resolved, escalated), timestamps. APIs: create (e.g. on watchlist match or manual), list with filter (gate, time, status, operator), update status. Permission-gated; org-scoped.
- **Scan integration:** In scan and bulk-sync handlers, after QR validation and gate checks: fetch org’s active watchlist entries; compare scan payload (visitor name, phone, ID if present) against entries (exact or defined matching rule). On match: reject scan with clear message (e.g. “Blocked person on security list”); create incident linked to this scan attempt (gate, operator, reason = watchlist match).
- **Dashboard:** Watchlist management (add/remove/list entries); incident queue (list, filter by gate/status/time, mark resolved/escalated). Use existing roles and permissions.
- **Guard shifts (optional):** If time permits, add Shift model (operator, gate/org, start/end time) and link scans/incidents to shift; otherwise document as follow-up.
- **Tests:** Watchlist CRUD; scan with matching identity → rejected and incident created; incident list filtered by org; no cross-org leak.

## Scope (out)

- Vehicle/plate watchlist (future); fuzzy matching algorithms (start with exact or simple match).
- Full guard shift scheduling UI; only minimal shift support if any.
- Resident-facing visibility of incidents (Phase 6 or later).

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **Schema**  
   Add `WatchlistEntry` (organizationId, name, idNumber?, phone?, notes?, deletedAt?, createdAt, updatedAt, createdBy?). Add `Incident` (organizationId, gateId, userId/operatorId, scanLogId?, reason, status, notes?, createdAt, updatedAt). Add indexes (organizationId, deletedAt for watchlist; organizationId, gateId, status for incident). Optional: `Shift` model. Run Prisma migrate.

3. **Watchlist API**  
   GET list (auth, org scope, deletedAt: null). POST add entry (Zod, auth, permission, org scope). DELETE or PATCH to soft-delete entry. Restrict to Security Manager / Org Admin.

4. **Incident API**  
   POST create (e.g. from scan handler or manual); GET list with query params (gate, status, from/to). PATCH update status. All org-scoped and permission-gated.

5. **Scan integration**  
   In scan and bulk-sync handler: load active watchlist for org; compare scan payload (name, phone, idNumber if present) to entries. Match logic: exact string match or simple normalized match (e.g. trim, lower case) for name/phone. On match: return 403 with message “Blocked person on security list” (or equivalent); create Incident with reason “watchlist_match”, link to gate and operator; do not create ScanLog for the scan (scan is rejected).

6. **Dashboard UI**  
   Watchlist: page or section to add/remove/list entries. Incidents: page or section to list incidents, filter by gate/status/date, and update status (under review, resolved, escalated). Use existing auth and permission checks.

7. **Tests**  
   Add tests: add watchlist entry; perform scan with matching name/phone → 403 and incident created; list incidents for org only; unassign/soft-delete watchlist entry and confirm no match. Ensure existing scan tests still pass when watchlist is empty.

8. **Quality gates**  
   Run `pnpm turbo build`, `pnpm turbo test` for client-dashboard and db (and scanner-app if scan path tests there); lint and typecheck.

---

## Acceptance criteria

- [ ] **Security context loaded** — gf-security, 00-gateflow-core.mdc, CONTRACTS.md read at start.
- [ ] **Org scoping** — Watchlist and incident APIs and queries use organizationId from auth; no cross-tenant data.
- [ ] **Soft deletes** — Watchlist entries use deletedAt; reads filter deletedAt: null.
- [ ] **Auth & permissions** — Watchlist and incident mutations require auth and Security Manager or Org Admin; scan rejection does not leak watchlist content.
- [ ] **Hard stop** — Scan with matching watchlist identity is rejected; incident is created and linked to gate/operator.
- [ ] **Dashboard** — Watchlist and incident list/update UI present and permission-gated.
- [ ] **Tests** — Watchlist CRUD, match rejection, incident creation, org-scoped list pass.
- [ ] **Lint & typecheck** — Pass for touched workspaces.
- [ ] **Build** — `pnpm turbo build` passes.
