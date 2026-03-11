## Phase 1: Schema & RBAC foundations for Resident models

### Primary role

BACKEND-Database  
Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

Load these skills when implementing (from `.cursor/skills/`):

- [x] gf-database — Prisma, migrations, queries
- [x] gf-api — API routes, validation, rate limiting (for future phases touching these models)
- [ ] gf-security — auth, RBAC, QR, multi-tenant
- [ ] gf-architecture — monorepo, conventions
- [ ] gf-testing — Jest, test patterns

### MCP to use

| MCP           | When                                      |
|---------------|-------------------------------------------|
| Prisma-Local  | Schema change, migration, Prisma Studio   |
| Context7      | Prisma/TypeScript API lookup (if needed)  |

### Preferred tool

- [x] Cursor (default)
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Multi-CLI — high-risk phases only (not needed here)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Packages**: `@gate-access/db`, `@gate-access/types`
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null` where applicable); QR HMAC-SHA256; no secrets in git
- **Refs**: `CLAUDE.md`, `docs/PRD_v6.0.md` section 4 (Resident Portal), `packages/db/prisma/schema.prisma`

### Goal

Introduce resident-focused data models (`Unit`, `VisitorQR`, `AccessRule`, `ResidentLimit`) and enum updates in Prisma, fully aligned with PRD v6.0 and existing multi-tenant/soft-delete conventions.

### Scope (in)

- Add `Unit`, `VisitorQR`, `AccessRule`, and `ResidentLimit` models to `schema.prisma`, following the PRD v6.0 shapes and existing schema patterns.
- Update relevant enums (`UserRole`, `QRCodeType`) and any seed data to support the `RESIDENT` role and new visitor/open QR types.
- Ensure new models are correctly wired to `Organization`, `User`, `Gate`, and `QRCode` where needed, with proper `organizationId` scoping.
- Regenerate Prisma Client and ensure `@gate-access/db` exports remain correct.

### Scope (out)

- No API routes or UI for resident flows yet (handled in later phases).
- No changes to scanner app behavior or scan logging beyond what is strictly required by the new models.

### Steps (ordered)

1. Open `packages/db/prisma/schema.prisma` and review existing models (`Organization`, `User`, `QRCode`, `ScanLog`, etc.) to mirror conventions (IDs, timestamps, soft deletes).
2. Add `Unit`, `VisitorQR`, `AccessRule`, and `ResidentLimit` models based on PRD v6.0 section 4.5, ensuring:
   - `organizationId` is present and required for all tenant-scoped models.
   - Soft-delete (`deletedAt: DateTime?`) is added where the entity is mutable (e.g., `Unit`, `VisitorQR`).
   - Indexes mirror existing patterns (`@@index([organizationId])`, `@@index([deletedAt])` where applicable).
3. Update relevant enums (`UserRole`, `QRCodeType`) to include `RESIDENT`, `VISITOR`, and `OPEN` variants while checking for usages that rely on previous enum values.
4. Update any seeding code in `packages/db/src` to:
   - Ensure a `Resident` built-in role or permission map exists if required.
   - Optionally create baseline `ResidentLimit` entries per `UnitType` for testing.
5. From `packages/db`, run:
   - `pnpm exec prisma migrate dev --name resident_portal_models`
   - `pnpm exec prisma generate`
6. From repo root, run:
   - `pnpm turbo lint --filter=@gate-access/db`
   - `pnpm turbo typecheck --filter=@gate-access/db`
7. Optionally open Prisma Studio (`pnpm exec prisma studio` from `packages/db`) to verify the new models and relations are present.

### SuperDesign (optional — for UI phases)

Not applicable for this schema-focused phase.

### Subagents (optional)

Invoke these if helpful:

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Need to confirm existing QR/scan model patterns | "Trace how `QRCode` and `ScanLog` are modeled and related in `schema.prisma`, and summarize multi-tenant/soft-delete conventions." |
| **shell** | Running migrations and typechecks | "From `packages/db`, run `pnpm exec prisma migrate dev` and then from root `pnpm turbo typecheck --filter=@gate-access/db`, reporting any failures." |

### Commands (when to run)

- Before/after phase: `/ready` (optional) to ensure clean git and preflight checks.
- After phase: `/github` — add changes under `packages/db`, commit with a conventional message like `feat(db): add resident portal models`, pull --rebase, and push.

### Acceptance criteria

**Checklist:**

- [ ] New models (`Unit`, `VisitorQR`, `AccessRule`, `ResidentLimit`) exist in `schema.prisma` and follow existing conventions (IDs, timestamps, org scoping, soft deletes where appropriate).
- [ ] Enums (`UserRole`, `QRCodeType`) are updated and no compile errors arise from these changes.
- [ ] `pnpm turbo lint --filter=@gate-access/db` passes.
- [ ] `pnpm turbo typecheck --filter=@gate-access/db` passes.
- [ ] Prisma migration applies cleanly and Prisma Studio shows the new models.

**Given/When/Then (optional):**

- **Given** an organization and a user linked to a `Unit`, **When** a `VisitorQR` is created for that unit, **Then** the new record must reference the correct `organizationId` and `unitId` and be queryable via `organizationId`-scoped queries.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/db/src/index.ts`
- `packages/db/src/seed-*.ts` or similar seed files

### Multi-CLI (optional — only for complex/high-risk phases)

Not required for this phase; use Cursor and Prisma tooling directly.

