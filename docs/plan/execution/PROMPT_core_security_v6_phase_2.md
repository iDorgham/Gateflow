# PROMPT_core_security_v6_phase_2 — Gate–Account Assignment (Model + API + Enforcement)

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 2 of 6  

---

## Primary role

**SECURITY** — Use this role's context when implementing. All new models and APIs must be org-scoped, permission-gated, and soft-delete aware.

## Preferred tool

**Cursor** (default). Multi-CLI not required.

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth and token handling; secrets; no localStorage for tokens).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list (multi-tenancy, soft deletes, QR security, authentication, input validation, secrets, API route security).

Additional references:
- `docs/PRD_v7.0.md` (Section 13 — Scanner Rules and Gate–Account Assignment).
- `docs/guides/SECURITY_OVERVIEW.md`.
- `packages/db/prisma/schema.prisma`; `apps/client-dashboard/src/app/api/`; scanner scan/bulk-sync flows.

---

## Goal

Implement gate–account assignment: add a data model linking users (and optionally roles) to gates per organization, expose CRUD APIs with full auth and org scoping, and enforce assignment in scan and bulk-sync so that operators can only scan at gates they are assigned to (when assignments exist). Scanner app must restrict gate selection to assigned gates when assignments exist.

---

## Scope (in)

- Prisma model(s) for gate–account assignment (e.g. `GateAssignment`: userId, gateId, organizationId, timestamps; `deletedAt` if soft delete is used for assignments).
- Migration for new model(s); indexes for org and gate/user lookups.
- API routes (under client-dashboard): list assignments, assign user to gate(s), unassign; all require auth, org scope, and permission (e.g. Security Manager or Org Admin).
- Scan and bulk-sync logic: before accepting a scan, verify the authenticated operator is assigned to the selected gate (when the org has any assignments); otherwise return 403 or equivalent with clear error message.
- Scanner app: when fetching gates, filter to assigned gates only when assignments exist for the org (or API returns only assigned gates).
- Tests for assignment CRUD and for scan rejection when operator is not assigned to the gate.

## Scope (out)

- Dashboard UI for managing assignments (Phase 3).
- Location rule or gate hours (Phase 4).
- Changes to QR signing or scanUuid dedup contract.

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **Schema**  
   In `packages/db/prisma/schema.prisma`, add model(s) for gate–account assignment (e.g. `GateAssignment` with userId, gateId, organizationId, createdAt, updatedAt; optional deletedAt). Add relation from User to Gate (many-to-many via GateAssignment). Add indexes. Run `pnpm exec prisma generate` (from packages/db or root). Create migration: `pnpm exec prisma migrate dev --name add_gate_assignment` (or equivalent from db package).

3. **API: list assignments**  
   Add GET endpoint (e.g. `/api/gates/assignments` or under `/api/workspace/`) to list gate assignments for the org. Use `requireAuth`, scope by `organizationId`, filter `deletedAt: null`. Restrict to roles with permission to manage gates or team.

4. **API: assign / unassign**  
   Add POST/DELETE (or PATCH) to assign a user to one or more gates and to unassign. Validate input with Zod. Ensure the target user and gates belong to the same org. Check permission (e.g. Security Manager, Org Admin). Use soft delete for unassign if model has `deletedAt`.

5. **API: “my assigned gates”**  
   Add endpoint for the current user to list gates they are assigned to (for scanner app). Auth required; return only gates in the user’s org they are assigned to. If org has no assignments, document behavior (e.g. return all org gates for backward compatibility).

6. **Enforce in scan flow**  
   In the API that accepts a single scan or bulk sync (e.g. scans/bulk or validate endpoint), after auth and gate resolution: if the org has at least one assignment, check that the current user is assigned to the gate; if not, return 403 with clear message (e.g. “You are not allowed to scan at this gate”). Do not change QR or scanUuid logic.

7. **Scanner app**  
   Update scanner app to fetch “assigned gates” when available (from new endpoint or filtered list). Gate selector shows only assigned gates when the org uses assignments; show clear message when user has no gates assigned. Ensure offline/sync path still enforces on server when sync runs.

8. **Tests**  
   Add tests: create assignment, list assignments (org-scoped), assign/unassign; call scan with assigned gate (success) and with unassigned gate (rejected). Ensure existing scan tests still pass.

9. **Quality gates**  
   Run `pnpm turbo build`, `pnpm turbo test --filter=client-dashboard` and `--filter=scanner-app` (and `--filter=@gate-access/db` if tests exist). Run `pnpm turbo lint` and `pnpm turbo typecheck` for touched workspaces.

---

## Acceptance criteria

- [ ] **Security context loaded** — gf-security, 00-gateflow-core.mdc, CONTRACTS.md read at start.
- [ ] **Model & migration** — GateAssignment (or equivalent) exists with org scope and optional soft delete; migration applies cleanly.
- [ ] **Org scoping** — All assignment APIs filter by `organizationId` from auth; no cross-tenant data.
- [ ] **Soft deletes** — If model has deletedAt, reads filter `deletedAt: null`; unassign sets deletedAt (or hard delete only if product decision).
- [ ] **Auth & permissions** — All new routes use requireAuth and role/permission check; mutations use CSRF where cookie auth is used.
- [ ] **Scan enforcement** — When org has assignments, scan for unassigned gate returns 403 (or equivalent) with clear error.
- [ ] **Scanner gate list** — Scanner shows only assigned gates when assignments exist; no regression when no assignments.
- [ ] **Tests** — Assignment CRUD and scan rejection tests pass.
- [ ] **Lint & typecheck** — Pass for client-dashboard, scanner-app, db (if touched).
- [ ] **Build** — `pnpm turbo build` passes.
