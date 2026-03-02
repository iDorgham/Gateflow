## Phase 1: CRM data model & API extensions

### Primary role

BACKEND-Database / BACKEND-API

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [ ] gf-database — Prisma, migrations, queries  
- [ ] gf-api — API routes, validation, rate limiting  
- [ ] gf-architecture — monorepo, conventions  
- [ ] gf-testing — Jest, test patterns

### MCP to use

| MCP           | When                                  |
|---------------|---------------------------------------|
| Prisma-Local  | Inspect schema, run migrations        |
| Context7      | Look up Prisma / Next.js patterns     |

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- Project: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm).
- Apps: `apps/client-dashboard` (Next.js 14) for dashboard; scanner-app and others unchanged in this phase.
- Packages: `@gate-access/db`, `@gate-access/types`, `@gate-access/api-client`.
- Rules: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256; no secrets in git.
- Reference:
  - `packages/db/prisma/schema.prisma`
  - Existing residents/contacts/units APIs under `apps/client-dashboard/src/app/api/`.
  - `docs/SECURITY_OVERVIEW.md`, `.cursor/contracts/CONTRACTS.md`.

### Goal

Introduce backend fields and API support needed for richer **Project**, **Contact**, **Unit**, and **Gate** data to enable CRM-style UIs, without yet changing user-facing behavior.

### Scope (in)

- Extend `Contact`-related schema and types with:
  - `jobTitle`, `source` (how contact entered the system), `companyWebsite` (or reuse existing company fields), `avatarUrl` (photo/link), `notes`/`comment`.
  - If not already present, ensure it’s easy to relate contacts to QR codes or scan activity via counts or an explicit relation (keep within current PRD).
- Confirm or adjust `Unit` schema so unit type + quotas are clearly represented and easily surfaced in analytics/CRM views.
- Confirm `Project` has `location`, `website`, `logoUrl`, `coverUrl`; add:
  - Optional `gallery` (e.g. JSON string or dedicated table for image URLs).
  - Optional `externalUrl` for marketing/landing pages if not covered by `website`.
- Add a boolean/enum on `Project` (or equivalent) to mark **single-gate** vs **multi-gate** projects; no behavior change yet, only data.
- If needed, extend `GateAssignment` or related models so that per-gate team assignment inside a project edit panel has all data required (no new rules yet).
- Update `/api/contacts`, `/api/units`, `/api/projects`, `/api/gates` handlers to:
  - Accept and validate the new fields via Zod.
  - Preserve org scoping (`organizationId`) and soft deletes.

### Scope (out)

- No UI components or layout changes (beyond TypeScript fixes) — those come in later phases.
- No change to scanner-app behavior, QR signing, or auth.

### Steps (ordered)

1. Load `gf-database` and `gf-api` skills; skim `docs/SECURITY_OVERVIEW.md` and `.cursor/contracts/CONTRACTS.md` for any constraints on storing additional PII and notes.
2. In `packages/db/prisma/schema.prisma`, update models for:
   - `Contact`-like model: add `jobTitle`, `source`, `companyWebsite`, `avatarUrl`, `notes` (nullable where appropriate).
   - `Project`: confirm `location`, `website`, `logoUrl`, `coverUrl`; add `galleryJson` (or similar) and `externalUrl` if needed.
   - Add a `gateMode`/`isSingleGate` flag on `Project` to support single vs multi gate UX later.
   - Extend `GateAssignment` only if the project edit UX will need additional metadata that isn’t already in the v6 PRD.
3. Run `cd packages/db && pnpm prisma migrate dev --name projects_crm_ui_phase_1` (or equivalent) and ensure migration applies cleanly.
4. Update `@gate-access/types` if it mirrors any of the updated models (contact/project types used client-side).
5. Update API route handlers:
   - `/api/contacts` (POST/PATCH) to read/write the new contact fields with Zod validation.
   - `/api/projects` routes to include new fields in GET/POST/PATCH responses.
   - `/api/units` and `/api/gates` only as needed to expose fields used by later phases.
6. Add or extend minimal backend tests (or targeted integration checks) for the updated routes to exercise the new fields.
7. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`
8. If everything passes, update or create a short note in `docs/plan/learning/patterns.md` about CRM-style entity extensions for future reference.

### SuperDesign (optional — for UI phases)

Not required in this backend-focused phase.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **shell** | To run migrations and preflight | "From repo root, run pnpm turbo lint --filter=client-dashboard && pnpm turbo typecheck --filter=client-dashboard && pnpm turbo test --filter=client-dashboard. Report any failures with file:line." |

### Commands (when to run)

- Before migration: consider `/ready` if the branch is messy.
- After passing tests: `/github` — add, commit, pull --rebase, push.

### Acceptance criteria

- [ ] Prisma schema compiles; migration applies with no data-loss regressions.
- [ ] New contact fields (`jobTitle`, `source`, `companyWebsite`, `avatarUrl`, `notes`) are persisted and returned by APIs.
- [ ] Project-level fields (`gallery` representation, `externalUrl`, `isSingleGate`/`gateMode`) are available via project APIs.
- [ ] All updated routes still enforce `organizationId` scoping and soft deletes.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regressions where tests exist).

