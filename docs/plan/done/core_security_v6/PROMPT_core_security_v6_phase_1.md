# PROMPT_core_security_v6_phase_1 — Core Invariants & Enforcement Hardening

**Initiative:** core_security_v6  
**Plan:** `docs/plan/execution/PLAN_core_security_v6.md`  
**Phase:** 1 of 6  

---

## Primary role

**SECURITY** — Use this role's context when implementing or when invoking CLIs. Ensure all tenant-scoped routes and queries satisfy multi-tenancy, soft deletes, auth, and API checklist.

## Preferred tool

- **Cursor** (default) for audit and test implementation.
- **Multi-CLI** optional: only if a second opinion on route compliance is desired (security-critical audit).

---

## Context

Before and during implementation you **must**:

1. **Load** `.cursor/skills/gf-security/SKILL.md` at the start of implementation.
2. **Respect** `.cursor/rules/00-gateflow-core.mdc` (pnpm only; multi-tenancy; soft deletes; QR HMAC-SHA256; auth and token handling; secrets; no localStorage for tokens).
3. **Respect** `.cursor/contracts/CONTRACTS.md` as the authoritative invariant list (multi-tenancy, soft deletes, QR security, authentication, input validation, secrets, API route security, SECURITY specialist phases).

Additional references:
- `docs/PRD_v6.0.md` (Section 8 — Security & Compliance).
- `docs/guides/SECURITY_OVERVIEW.md`.
- `apps/client-dashboard/src/lib/require-auth.ts`, `apps/client-dashboard/src/app/api/`.

---

## Goal

Harden and verify core security invariants across tenant-scoped API routes and scanner-facing flows: ensure every route satisfies auth-first, role check, `organizationId` scoping, `deletedAt: null` filtering, input validation (Zod), and rate limiting/CSRF where applicable; add or extend tests so these guarantees are covered by automated tests.

---

## Scope (in)

- Audit (checklist or doc) of API routes under `apps/client-dashboard/src/app/api/` (and any scanner-facing routes) against CONTRACTS and gf-security API checklist.
- New or updated tests that assert:
  - Multi-tenant isolation (queries include `organizationId`; no cross-org data leak).
  - Soft-delete behavior (`deletedAt: null` on reads; deletes set `deletedAt`).
  - Auth and input validation on critical mutation routes.
  - QR signing and `scanUuid` dedup where relevant (e.g. bulk-sync, scan validation).
- No new features or schema changes; verification and test coverage only.

## Scope (out)

- Changing behavior of existing routes (only add tests or document gaps).
- Scanner app feature changes (only tests and compliance checks).
- New API endpoints or Prisma models.

---

## Steps (ordered)

1. **Load security context**  
   Read `.cursor/skills/gf-security/SKILL.md`, `.cursor/contracts/CONTRACTS.md`, and `.cursor/rules/00-gateflow-core.mdc`.

2. **List and audit routes**  
   Enumerate API routes under `apps/client-dashboard/src/app/api/` that touch tenant data (gates, QR codes, scans, users, etc.). For each, verify:
   - Auth is checked first (`requireAuth` or equivalent).
   - Role/permission is enforced before tenant data access.
   - Queries use `organizationId` from auth and `deletedAt: null` where applicable.
   - Inputs are validated with Zod (or equivalent).
   - Rate limiting and CSRF are applied where required (login, mutations with cookie auth).
   Document findings in a short checklist or inline comments (e.g. in a README or AUDIT.md in plan/execution or in repo docs).

3. **Add or extend tests**  
   - Add tests that assert org scoping for at least one critical path (e.g. gates list, scans list, or QR create) so that a request with a different or missing `orgId` cannot access another tenant’s data.
   - Add or extend tests for soft-delete behavior (e.g. “deleted” gate is excluded from list).
   - If bulk-sync or scan validation is in scope, add or extend tests that verify QR signature and `scanUuid` dedup behavior.
   - Place tests in existing test files or new `*.test.ts` files next to the code or under a dedicated test directory per workspace.

4. **Fix any violations**  
   If the audit finds routes that skip auth, org scope, or `deletedAt`, fix them in this phase (minimal change set). Do not add new features.

5. **Run quality gates**  
   Run `pnpm turbo test --filter=client-dashboard` and `--filter=scanner-app` (and any other affected workspace). Run `pnpm turbo lint` and `pnpm turbo typecheck` for touched workspaces. Fix failures until all pass.

---

## Acceptance criteria

- [ ] **Security context loaded** — Implementer has read gf-security SKILL, 00-gateflow-core.mdc, and CONTRACTS.md at start.
- [ ] **Audit done** — There is a written checklist or doc listing routes and their compliance with auth, org scope, soft deletes, validation, rate limit, CSRF (where applicable).
- [ ] **Org scoping** — At least one test demonstrates that tenant-scoped data is not returned for another org (e.g. wrong or missing orgId).
- [ ] **Soft deletes** — At least one test demonstrates that soft-deleted entities are excluded from reads.
- [ ] **QR / scanUuid** — If bulk-sync or scan validation routes exist, tests cover QR signing and/or scanUuid dedup where relevant.
- [ ] **No regressions** — Existing tests in affected workspaces still pass.
- [ ] **Lint** — `pnpm turbo lint` passes for `client-dashboard` and any other touched workspace.
- [ ] **Typecheck** — `pnpm turbo typecheck` passes for touched workspaces.
- [ ] **No new secrets** — No `.env` or secrets committed; no tokens in localStorage.
