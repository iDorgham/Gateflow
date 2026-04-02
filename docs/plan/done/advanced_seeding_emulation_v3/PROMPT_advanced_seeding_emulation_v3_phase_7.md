# Phase 7: Live Emulation API (Vercel Serverless)

> **Checklist (mandatory):** `docs/plan/done/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND** + **SECURITY**

### Tool selection

|               | Tool            | Why                                 |
| ------------- | --------------- | ----------------------------------- |
| **Preferred** | **Cursor**      | Route handler + existing admin auth |
| **Fallback**  | Claude Code CLI | RBAC edge cases                     |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md`
2. `.antigravity/skills/gf-api/SKILL.md` or `.cursor/skills/api/SKILL.md` — Next.js route patterns, Zod, rate limit
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
4. `docs/arch/ARCHITECTURE.md`
5. `docs/Pasted_Text_1774974939864.txt` for API payload and operator UX expectations

### Context

- **Depends on:** Phase 6 chain callable programmatically.
- **Objective:** `POST` route under client-dashboard app, e.g. `apps/client-dashboard/src/app/api/admin/emulate-traffic/route.ts` (exact path follow existing `/api/admin/*` conventions).
- **RBAC:** **Super Admin only** — reuse existing session/claims pattern from `apps/client-dashboard`.
- **Rate limit:** **5 emulations per hour per admin** via Upstash Redis (reuse existing client-dashboard helper if present).
- **Audit:** Create `AiActionLog` row per emulation with `actionType`, `metadata` (scenario, org id, counts), `status`.

### Goal

Authenticated Super Admin can trigger a bounded emulation job with Zod-validated body; 403 for non-super; 429 when rate limited.

### Scope (in)

- New route + Zod schema for payload (ranges, scenario, `organizationId` target, dry-run flag).
- Super Admin guard.
- Upstash limiter keyed by `userId` or admin email.
- `prisma.aiActionLog.create` with org context (use platform org or target org per product rule — **document choice**; must remain multi-tenant safe).
- Jest tests mocking Redis + prisma where needed.

### Scope (out)

- Wizard UI (Phase 8).
- Changes to scanner app.

### Steps (ordered)

1. Read existing protected routes in `apps/client-dashboard/src/app/api/**` for auth pattern.
2. Implement `requireSuperAdmin(request)` helper if missing.
3. Implement Zod body schema + dry-run path (no DB writes except audit or no-op).
4. Include payload keys matching seeding reference and CLI parity: `scenario`, `pastDays`, `totalScans`, `incidentRate`, `randomSeed`, `organizationId`.
5. Wire `advanced-seed-service` emulation entrypoint.
6. Add rate limit: reject with 429 and `Retry-After` if possible.
7. Tests: 403, 429, 200 happy path with mocks.
8. `pnpm turbo lint typecheck test --filter=client-dashboard` (and `@gate-access/db` if touched)
9. Commit: `feat(seeding): phase 7 — client emulate-traffic API with rate limit and audit`

### Security checklist

- [ ] Auth before any work; **Super Admin** only
- [ ] `organizationId` validated against allowed targets (no cross-tenant trigger unless platform rule explicitly allows)
- [ ] Zod validation on body
- [ ] Rate limiting on this endpoint
- [ ] `AiActionLog` does not store secrets; redact if errors include stack traces
- [ ] CSRF: follow client-dashboard cookie POST patterns (same as other protected mutations)

### Acceptance criteria

- [ ] **Functional:** POST runs emulation or dry-run per flag.
- [ ] **Security:** Non-admin → 429/403 as designed; limit enforced.
- [ ] **Quality:** `pnpm turbo lint --filter=client-dashboard` passes
- [ ] **Quality:** `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] **Quality:** `pnpm turbo test --filter=client-dashboard` passes

### Files likely touched

- `apps/client-dashboard/src/app/api/admin/emulate-traffic/route.ts`
- `apps/client-dashboard/src/lib/*` (auth, rate-limit)
- `packages/db/src/advanced-seed-service.ts` (export `runEmulation`)

### Handoff to Phase 8

Stable API contract documented in TSDoc/OpenAPI comment for wizard to consume.
