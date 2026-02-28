# Plan tasks — core_security_v6 (FINAL)

Checklist for **PLAN_core_security_v6**. Use with `/dev` and **PROGRESS_DASHBOARD.md**.

**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Prompts:** `docs/plan/execution/PROMPT_core_security_v6_phase_N.md`  
**Dashboard:** `docs/plan/execution/PROGRESS_DASHBOARD.md`

---

## Phase 1 — Core invariants & enforcement hardening

- [x] **1.1** Security context loaded (gf-security, CONTRACTS, 00-gateflow-core)
- [x] **1.2** Route-by-route audit of `apps/client-dashboard/src/app/api/`
- [x] **1.3** Audit doc: `AUDIT_core_security_v6_phase_1.md`
- [x] **1.4** Tests: org scope + soft delete (e.g. gates route)
- [x] **1.5** Lint, typecheck, tests pass
- [x] **1.6** Committed and pushed

**Status:** Done

---

## Phase 2 — Gate–account assignment (model + API + enforcement)

- [x] **2.1** `GateAssignment` model + migration
- [x] **2.2** `GET/POST/DELETE /api/gates/assignments` + `GET /api/gates/assigned`
- [x] **2.3** Helpers: `orgHasAssignments`, `getUserAssignedGateIds`, `checkGateAssignment`
- [x] **2.4** Enforcement in qrcodes/validate and scans/bulk
- [x] **2.5** Scanner: fetch from `/api/gates/assigned`
- [x] **2.6** Tests for assignments API and gate-assignment helpers
- [x] **2.7** Lint, typecheck, tests pass; committed and pushed

**Status:** Done

---

## Phase 3 — Gate–account assignment (dashboard UI + scanner UX)

- [x] **3.1** Design draft: `docs/design/draft-gate-assignment-screen.md`
- [x] **3.2** Dashboard page: `/dashboard/team/gate-assignments` (assign/unassign, table)
- [x] **3.3** Sidebar nav: Gate assignments (gates:manage)
- [x] **3.4** Scanner: clear message when no gates assigned
- [x] **3.5** i18n (en + ar) for gate-assignment copy
- [x] **3.6** Lint, typecheck; committed and pushed

**Status:** Done

---

## Phase 4 — Location rule (optional)

**Prompt:** `PROMPT_core_security_v6_phase_4.md`  
**Role:** SECURITY

- [x] **4.1** Load security context (gf-security, CONTRACTS, 00-gateflow-core)
- [x] **4.2** Schema: add to Gate (or org): `latitude`, `longitude` (Float?), `locationRadiusMeters` (Int?), `locationEnforced` (Boolean? default false); migration
- [x] **4.3** Dashboard config: gate (or org) settings for coordinates, radius, enable/disable; auth + org scope
- [x] **4.4** API: scan + bulk-sync accept optional `latitude`/`longitude`; Zod validate; when `locationEnforced` true: require location, reject if missing or beyond radius (Haversine); clear error messages
- [x] **4.5** Scanner: request location permission; send lat/long in scan payload; show clear error when API rejects due to location
- [x] **4.6** Tests: inside radius → success; outside radius → rejected; no location when rule on → rejected; rule off → no enforcement
- [x] **4.7** Docs: update SECURITY_OVERVIEW (and scanner ops) for location rule, opt-in, “location unavailable” behavior
- [x] **4.8** Org scoping: all config and enforcement remain org-scoped
- [x] **4.9** Quality: `pnpm turbo build`, `pnpm turbo test`, lint, typecheck; committed and pushed

**Status:** Done

---

## Phase 5 — Watchlists, incidents & guard accountability

**Prompt:** `PROMPT_core_security_v6_phase_5.md`  
**Role:** SECURITY

- [x] **5.1** Load security context (gf-security, CONTRACTS, 00-gateflow-core)
- [x] **5.2** Schema: WatchlistEntry (organizationId, name, idNumber?, phone?, notes?, deletedAt, createdBy?); Incident (organizationId, gateId, operatorId, scanLogId?, reason, status, notes?); indexes; optional Shift; migration
- [x] **5.3** Watchlist API: GET list, POST add, DELETE/PATCH soft-delete; auth, org scope, permission (Security Manager / Org Admin)
- [x] **5.4** Incident API: POST create, GET list (filter gate/status/from/to), PATCH update status; org-scoped, permission-gated
- [x] **5.5** Scan integration: load active watchlist; compare scan payload (name, phone, idNumber) to entries; on match: 403 “Blocked person on security list”, create Incident (watchlist_match), no ScanLog
- [x] **5.6** Dashboard: watchlist management (add/remove/list); incident queue (list, filter gate/status/date, mark resolved/escalated)
- [x] **5.7** Tests: watchlist CRUD; scan with matching identity → 403 + incident created; incident list org-only; no cross-org leak
- [x] **5.8** Soft deletes: watchlist entries use deletedAt; reads filter deletedAt: null
- [x] **5.9** Quality: `pnpm turbo build`, `pnpm turbo test`, lint, typecheck; committed and pushed

**Status:** Done

---

## Phase 6 — Visitor identity levels & privacy/retention

**Prompt:** `PROMPT_core_security_v6_phase_6.md`  
**Role:** SECURITY / MOBILE

- [x] **6.1** Load security context (gf-security, CONTRACTS, 00-gateflow-core)
- [x] **6.2** Identity level config: `requiredIdentityLevel` (0/1/2) on Organization or Gate; migration; default 0; dashboard/settings UI (auth, org scope)
- [x] **6.3** Artifact storage: table or storage keys for ID images (e.g. ScanAttachment/IncidentAttachment); POST attach, GET retrieve; org-scoped; no cross-org access
- [x] **6.4** Scanner Level 1 flow: when level 1 required, prompt ID capture; send image to backend; backend stores artifact, links to scan/incident; Level 2 stub if needed
- [x] **6.5** Retention settings: org-level (scanLogRetentionMonths, visitorHistoryRetentionMonths, idArtifactRetentionMonths, incidentRetentionMonths); dashboard form; document behavior + placeholder cleanup job/script
- [x] **6.6** Resident toggles (minimal): e.g. maskResidentNameOnLandingPage, showUnitOnLandingPage; expose in resident/org settings
- [x] **6.7** Tests: identity level 1 enforcement; artifact upload and org-scoped retrieval; cross-org GET fails; retention config read/write
- [x] **6.8** Docs: SECURITY_OVERVIEW (and PRD-aligned) for identity levels, artifact access, retention
- [x] **6.9** SuperDesign (optional): if scanner ID-capture adds new screens, run design draft first
- [x] **6.10** Quality: `pnpm turbo build`, `pnpm turbo test`, lint, typecheck; committed and pushed

**Status:** Done

---

## Summary

| Phase | Status      | Next action        |
|-------|-------------|--------------------|
| 1     | Done        | —                  |
| 2     | Done        | —                  |
| 3     | Done        | —                  |
| 4     | Done        | —                  |
| 5     | Done        | —                  |
| 6     | Done        | —                  |

---

## How to use this file

- **Before sleep:** See **PROGRESS_DASHBOARD.md** to choose “Start Phase 4” or “Start dev loop.”
- **During /dev:** Open the phase’s PROMPT file; use this TASKS file to tick off items as done.
- **When you wake:** Check this file to see which phase is next; open PROGRESS_DASHBOARD.md for “When you wake up” steps.
