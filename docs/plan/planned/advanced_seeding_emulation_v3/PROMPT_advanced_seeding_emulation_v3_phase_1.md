# Phase 1: Core Schema & Data Integrity Foundation

> **Checklist (mandatory):** `docs/plan/planned/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/planned/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`  
> **IDEA:** `docs/plan/context/IDEA_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND** (Database) — with **SECURITY** review for uniqueness and tenant boundaries.

### Tool selection

|               | Tool            | Why                                           |
| ------------- | --------------- | --------------------------------------------- |
| **Preferred** | **Cursor**      | Prisma migrations + typed helpers in monorepo |
| **Fallback**  | Claude Code CLI | Large migration diffs / Multi-CLI review      |

### Skills to load (start of implementation)

**Mandatory (all phases):**

1. `.antigravity/skills/gf-security/SKILL.md` — if missing: `.cursor/skills/security/SKILL.md`
2. `.antigravity/rules/00-gateflow-core.mdc`
3. `.antigravity/contracts/CONTRACTS.md`

**This phase (ADS / seeding patterns):**

4. `.antigravity/skills/gf-ads/SKILL.md` — batching (~500 rows), pre-insert validation, reproducible seeds

**Reference:** `docs/arch/ARCHITECTURE.md`, `docs/arch/PROJECT_STRUCTURE.md`, `docs/archive/old-prds/PRD_v8.0.md`, `docs/guides/PROMPTS_REFERENCE.md`

**Seeding detail:** `docs/plan/context/IDEA_advanced_seeding_emulation_v3.md` (and `Pasted_Text_1774974939864.txt` if present in repo root or `docs/`).

### Context

- **Project:** GateFlow — pnpm monorepo; DB in `packages/db`.
- **Objective:** Establish **schema + code** guarantees so bulk seeding cannot insert duplicate business keys (`phone`, `email`, `Unit.name` strings, and DB `id` collisions) within tenant scope. Introduce a **central validation module** used by later phases.
- **Client-dashboard alignment:** This phase defines source-of-truth key semantics used by `ContactTable`, `UnitTable`, `QRCodesTable`, and scans filters.
- **Multi-tenancy:** Unique constraints must be **composite with `organizationId`** where natural keys are only unique per org.
- **Soft deletes:** All seed lookups for “existing” rows use `deletedAt: null`.

### Goal

Ship Prisma changes (if needed) and a reusable **`validateUniqueness` / pre-insert registry** API in `@gate-access/db` with unit tests — no full Red Sea library yet.

### Scope (in)

- `packages/db/prisma/schema.prisma` — indexes/`@@unique` for org-scoped identity fields as required by product (align with existing models: `Contact`, `Unit`, etc.).
- `packages/db/prisma/migrations/*` — new migration(s).
- `packages/db/src/lib/seed-integrity.ts` (or `seed/uniqueness.ts`) — e.g.:

```ts
export type UniquenessBucket = {
  emails: Set<string>;
  phones: Set<string>;
  unitIds: Set<string>;
  ids: Set<string>;
};

export function validateUniqueness(
  bucket: UniquenessBucket,
  row: {
    id?: string;
    email?: string | null;
    phone?: string | null;
    unitId?: string | null;
  }
): void {
  // Throw typed error with field name if duplicate in bucket or violate normalized form
}
```

- Unit tests under `packages/db/**/__tests__/` or existing test layout.
- Export from `@gate-access/db` if needed for apps.

### Scope (out)

- Red Sea datasets, nationality weighting, rush hour, QR signing, admin UI, HTTP APIs.

### Steps (ordered)

1. Load skills and read current `schema.prisma` for `Contact`, `Unit`, `User`, `Organization`.
2. Design composite uniques: keep existing `@@unique([organizationId, name])` semantics on `Unit` unless schema migration intentionally changes it; apply org-scoped uniqueness policy for contact identity fields where product requires it.
3. `pnpm --filter @gate-access/db exec prisma migrate dev --name seeding_integrity_foundation` (or `migrate dev` from package root per repo convention).
4. Implement `seed-integrity.ts` + normalization helpers (trim, lower-case email).
5. Add tests: duplicate detection; “happy path” batch registration.
6. `pnpm turbo lint --filter=@gate-access/db` && `pnpm turbo typecheck --filter=@gate-access/db` && `pnpm turbo test --filter=@gate-access/db`
7. Commit: `feat(seeding): phase 1 — core schema and uniqueness validation`

### Security checklist

- [ ] No query bypasses `organizationId` when reusing existing seed lookups
- [ ] `deletedAt: null` on all “exists?” checks for soft-deleted models
- [ ] No secrets in migrations or seed code paths

### Acceptance criteria

- [ ] **Functional:** `validateUniqueness` prevents duplicate keys in a synthetic batch before DB insert.
- [ ] **Data integrity:** Schema enforced for org-scoped unique business keys where defined.
- [ ] **Quality:** `pnpm turbo lint --filter=@gate-access/db` passes
- [ ] **Quality:** `pnpm turbo typecheck --filter=@gate-access/db` passes
- [ ] **Quality:** `pnpm turbo test --filter=@gate-access/db` passes

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/*`
- `packages/db/src/lib/seed-integrity.ts`
- `packages/db/src/index.ts` (exports)

### Handoff to Phase 2

Schema and uniqueness registry ready; downstream code can import validation before `createMany`.
