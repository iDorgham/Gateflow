# PLAN_core_security_v6 — GateFlow v6 Security, Scanner Rules, Identity & Watchlists

**Initiative:** core_security_v6  
**Source idea:** `docs/plan/context/IDEA_core_security_v6.md`  
**Primary product spec:** `docs/PRD_v6.0.md` (Sections 8, 11–14)  
**Security context:** `.cursor/skills/gf-security/SKILL.md`, `docs/guides/SECURITY_OVERVIEW.md`, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/contracts/CONTRACTS.md`  
**Owner:** Security + Product + Engineering  
**Status:** In progress (Phases 1–3 done; 4–6 remaining)  
**Progress dashboard:** `docs/plan/execution/PROGRESS_DASHBOARD.md`  
**Task checklist:** `docs/plan/execution/TASKS_core_security_v6.md`

---

## 1. Objectives

- Harden and verify **core security invariants** (multi-tenancy, soft deletes, QR signing, auth, API checklist) with tests and light audit.
- Implement **scanner policy engine**: gate–account assignment and optional location rule, enforced in API and scanner app.
- Introduce **visitor identity levels** (config + scanner flows + artifact storage) and **watchlists & incidents** with hard-stop behavior and guard accountability.
- Add **privacy & retention** controls (tenant-level retention, resident-facing options) and keep docs/contracts aligned with implementation.

---

## 2. High-Level Phases

| # | Phase | Primary role | Summary |
|---|--------|--------------|---------|
| 1 | Core invariants & enforcement hardening | SECURITY | Audit + tests for org scope, soft deletes, QR, auth |
| 2 | Gate–account assignment (model + API + enforcement) | SECURITY | Data model, APIs, scan enforcement |
| 3 | Gate–account assignment (dashboard + scanner UX) | FRONTEND / MOBILE | UI to assign gates; scanner shows only assigned gates |
| 4 | Location rule (optional) | SECURITY | Gate coords + radius; scanner location; API enforcement |
| 5 | Watchlists, incidents & guard accountability | SECURITY | Person watchlist, match on scan, incidents, dashboard |
| 6 | Visitor identity levels & privacy/retention | SECURITY / MOBILE | Identity config, ID capture flow, retention settings |

---

## 3. Phase 1 — Core Invariants & Enforcement Hardening

**Primary role:** SECURITY  

**Scope:**
- Reconfirm that all tenant-scoped API routes under `apps/client-dashboard/src/app/api/` (and any scanner-facing routes) satisfy: auth first, role/permission check, `organizationId` scoping, `deletedAt: null` filtering, input validation (Zod), and rate limiting/CSRF where applicable.
- Add or extend tests that assert multi-tenant isolation, soft-delete behavior, and (where relevant) QR signing and `scanUuid` dedup.
- No new features; verification and test coverage only.

**Deliverables:**
- Brief audit checklist or doc (or inline comments) listing routes and their compliance with `.cursor/contracts/CONTRACTS.md` and gf-security API checklist.
- New or updated tests (e.g. in `client-dashboard`, `scanner-app`, or `api-client`) that cover org scoping, soft deletes, and auth/validation for critical paths.
- No regression in existing tests; lint and typecheck pass.

**Depends on:** None.

**Test criteria:**
- `pnpm turbo test --filter=client-dashboard` and `--filter=scanner-app` (and any other affected workspaces) pass.
- `pnpm turbo lint` and `pnpm turbo typecheck` pass for touched workspaces.
- Acceptance criteria in `PROMPT_core_security_v6_phase_1.md` are satisfied (including security checks).

**Multi-CLI:** Optional for this phase (security-critical audit); add only if a second opinion on route compliance is desired.

---

## 4. Phase 2 — Gate–Account Assignment (Model + API + Enforcement)

**Primary role:** SECURITY  

**Scope:**
- Add Prisma model(s) for gate–account assignment (e.g. `GateAssignment` or equivalent: user/gate/org, timestamps; soft delete if applicable).
- Implement API endpoints (under client-dashboard or shared API) to list/assign/unassign users (or roles) to gates, with full auth, org scoping, and permission checks.
- Enforce assignment in scan and bulk-sync flows: reject or restrict scans for gates the operator is not assigned to (when assignments exist for the org).
- Scanner app: when assignments exist, only allow selection of gates the logged-in user is assigned to (API or client filter).

**Deliverables:**
- Migration for new model(s); Prisma schema updated.
- API routes for gate-assignment CRUD, scoped by `organizationId`, with role/permission checks (e.g. Security Manager or Org Admin).
- Scan/bulk-sync logic updated to validate operator–gate assignment; clear error responses when not allowed.
- Scanner app gate list filtered by assignment when available.
- Tests for assignment API and enforcement behavior.

**Depends on:** Phase 1.

**Test criteria:**
- Migration applies cleanly; `pnpm turbo build` passes.
- New tests cover assignment CRUD and scan rejection for unauthorized gates.
- Lint/typecheck pass; security acceptance criteria (org scope, soft deletes, auth) met.

**Multi-CLI:** Not required (focused backend + scanner change).

---

## 5. Phase 3 — Gate–Account Assignment (Dashboard UI + Scanner UX)

**Primary role:** FRONTEND (dashboard), MOBILE (scanner)  

**Scope:**
- Dashboard UI for assigning users (and optionally roles) to gates: list gates, list users, assign/unassign with clear feedback.
- Scanner app: ensure gate selector shows only assigned gates when assignments exist; clear messaging when no gates are assigned.
- No changes to assignment model or API contract from Phase 2.

**Deliverables:**
- New or updated dashboard page/section for gate–account management (e.g. under Team or Gates).
- Scanner app UX updated to reflect assigned gates only when applicable.
- Accessibility and i18n considered; RTL if applicable.

**Depends on:** Phase 2.

**Test criteria:**
- Manual or automated UI verification: assign a user to a gate, log in as that user in scanner, confirm only that gate is available; confirm unassigned user cannot select that gate (or sees appropriate message).
- Lint/typecheck pass for client-dashboard and scanner-app.

**SuperDesign:** Use for dashboard UI (gate-assignment screen) before implementation: create or iterate design draft so layout and flows align with existing dashboard patterns.

---

## 6. Phase 4 — Location Rule (Optional)

**Primary role:** SECURITY  

**Scope:**
- Add gate-level (or org-level) configuration for optional location enforcement: coordinates (latitude/longitude) and radius (e.g. meters).
- Scanner app: send device location with scan context when available (permissions and UX considered).
- Scan and bulk-sync APIs: when location rule is enabled for the gate, reject scans when device location is missing or outside the configured radius; return clear error codes/messages.
- Docs: update `SECURITY_OVERVIEW.md` and any scanner docs to describe location rule behavior.

**Deliverables:**
- Schema/config for gate (or org) location + radius; migration if needed.
- API changes to accept location in scan payload and enforce distance check when rule is on.
- Scanner app: capture and send location; show clear error when scan rejected due to location.
- Tests for “allowed” vs “rejected” based on distance and “rule off” vs “rule on”.

**Depends on:** Phase 2 (gate–account in place so scanner is already gate-aware).

**Test criteria:**
- Unit/integration tests for location enforcement logic; scanner build and lint pass.
- Acceptance criteria include org scoping and no bypass of location when enabled.

**Multi-CLI:** Not required.

---

## 7. Phase 5 — Watchlists, Incidents & Guard Accountability

**Primary role:** SECURITY  

**Scope:**
- Person watchlist: model (e.g. `WatchlistEntry` or equivalent) with name, optional ID number, phone, notes, org scope, soft delete; APIs to add/remove/list with auth and permission checks.
- On scan (and on bulk-sync when processing scans): check visitor/scan payload against active watchlist; on match, reject scan with hard stop and create an incident record linked to scan/gate/operator.
- Incident model and minimal workflow: create incident on watchlist match or manual report; fields for reason, status (e.g. under review, resolved), gate, operator, timestamp; list/filter in dashboard.
- Guard shifts: optional in this phase—if time permits, add shift start/end and link scans/incidents to shift; otherwise document as follow-up.
- Dashboard: Security Managers can manage watchlist entries and view/resolve incidents.

**Deliverables:**
- Prisma models and migrations for watchlist and incident (and shift if in scope).
- APIs for watchlist CRUD and incident list/update, all org-scoped and permission-gated.
- Scan/bulk-sync integration: watchlist check and incident creation on match.
- Dashboard UI for watchlist management and incident queue (list, filter, status update).
- Tests for watchlist match behavior and incident creation; no regression on scan flow when watchlist empty.

**Depends on:** Phase 2 (scan path is stable and gate-aware).

**Test criteria:**
- Tests cover: adding watchlist entry, scan with matching identity rejected and incident created, incident list filtered by org.
- Lint/typecheck pass; security criteria (org scope, soft deletes, auth) met.

**Multi-CLI:** Optional for incident workflow design (complex); otherwise Cursor-only.

---

## 8. Phase 6 — Visitor Identity Levels & Privacy/Retention

**Primary role:** SECURITY (backend/config), MOBILE (scanner flows)  

**Scope:**
- **Identity levels:** Configuration (org/gate default) for required visitor identity level (0 = name/phone only; 1 = ID photo capture; 2 = ID OCR + matching). Store in org or gate settings.
- **Scanner:** When level 1 or 2 is required, scanner flow prompts for ID capture (e.g. front/back); optionally store artifact references in scan/incident (e.g. attachment or blob reference). Level 2 OCR can be stub or follow-up.
- **Artifacts:** Define where ID images/OCR are stored (e.g. encrypted field or object storage reference); ensure access is org-scoped and permission-gated.
- **Privacy & retention:** Tenant-level settings for retention of scan logs, visitor history, ID artifacts, and incidents (e.g. 6/12/24 months); document behavior; optional scheduled job or placeholder for cleanup.
- **Resident-facing:** Optional toggles for what residents see (e.g. masking, unit visibility on landing page); can be minimal in this phase (config keys and one or two UI toggles).

**Deliverables:**
- Schema/config for identity level and retention settings; migration if needed.
- Scanner UX for Level 1 (and stub for Level 2) with artifact upload/store.
- API support for artifact attachment to scan/incident and retrieval with auth/org checks.
- Retention configuration in dashboard; docs updated.
- Tests for identity-level enforcement and artifact access control.

**Depends on:** Phase 5 (incidents exist for attaching artifacts).

**Test criteria:**
- Scanner flow for Level 1 captures and attaches artifact; API denies cross-org access to artifacts.
- Retention settings visible and persisted; lint/typecheck pass.

**SuperDesign:** Use for scanner ID-capture flow if it introduces new screens or significant UX change.

---

## 9. Dependencies & References

**Docs & contracts:**
- `docs/plan/context/IDEA_core_security_v6.md`
- `docs/PRD_v6.0.md` (Sections 8, 11–14)
- `docs/guides/SECURITY_OVERVIEW.md`
- `.cursor/rules/00-gateflow-core.mdc`
- `.cursor/rules/gateflow-security.mdc`
- `.cursor/contracts/CONTRACTS.md`
- `.cursor/skills/gf-security/SKILL.md`

**Skills:**
- **gf-security** — loaded at start of every phase implementation (required in each phase prompt Context).
- **gf-planner** — used to create this plan and phase prompts.
- **gf-api** / **gf-mobile** — for API and scanner work.
- **SuperDesign** — for Phase 3 (dashboard) and optionally Phase 6 (scanner ID flow).

---

## 10. Risks & Notes

- **Phase 5–6 scope:** Watchlist matching (fuzzy vs exact) and ID artifact storage (DB vs object storage, encryption) may need product/legal input; phase prompts assume minimal viable design and document open questions.
- **Location rule:** Behavior when location is unavailable (e.g. user denies permission) must be explicit in scanner UX and API (reject vs allow with warning).
- **Multi-CLI:** Used only for Phase 1 (optional) and Phase 5 (optional); all other phases are Cursor-first to respect Claude Pro usage limits.
