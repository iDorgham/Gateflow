# Phase 4: Unit Hierarchy Seeding with Areas & Owner Linking

> **Checklist (mandatory):** `docs/plan/done/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND**

### Tool selection

|               | Tool            | Why                             |
| ------------- | --------------- | ------------------------------- |
| **Preferred** | **Cursor**      | Prisma createMany orchestration |
| **Fallback**  | Claude Code CLI | Complex relation debugging      |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md`
2. `.antigravity/skills/gf-ads/SKILL.md`
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
4. `docs/arch/ARCHITECTURE.md`, `docs/arch/PROJECT_STRUCTURE.md`

### Context

- **Depends on:** Phases 1–3.
- **Objective:** Seed **phases → buildings → floors → units** with `areaSqm`, `balconyArea`, `terraceArea`, and link **`ownerContactId`** (or equivalent field on `Unit`) to rich contacts.
- Use `generateUnitId` from Phase 2 from each project’s `unitIdFormat`.
- Batches of **~500** rows per `createMany` where possible.
- **Client-dashboard contract:** persist display identifier into `Unit.name` and area into `Unit.sizeSqm`; keep `Unit.type` values compatible with existing CRM filters and table badges.

### Goal

Deterministic hierarchy builder driven by range config: `min/max` buildings per project, floors per building, units per floor.

### Scope (in)

- `packages/db/src/lib/unit-hierarchy-seed.ts` (name flexible).
- Range config type shared with later CLI/UI.
- Validates FK chain before insert; uses `validateUniqueness` for generated unit display identifiers before mapping to `Unit.name`.
- Updates `Unit` owner relation to `Contact`.

### Scope (out)

- Rush hour timestamps, QR payloads, API routes.

### Steps (ordered)

1. Map Prisma models/fields for phases/buildings/units (use actual schema names).
2. Implement bottom-up or top-down creation with ordered IDs for reproducibility.
3. Assign owner contacts round-robin or random weighted from Phase 3 output.
4. Tests: single-org tree integrity; `organizationId` on every row.
5. `pnpm turbo lint typecheck test --filter=@gate-access/db`
6. Commit: `feat(seeding): phase 4 — unit hierarchy and owner linking`

### Security checklist

- [ ] Every `where` includes `organizationId` for updates
- [ ] `deletedAt: null` on parent lookups

### Acceptance criteria

- [ ] **Functional:** Full hierarchy created under a test org with configurable ranges.
- [ ] **Data integrity:** Every unit references valid project/building; owner contact same org.
- [ ] **Quality:** Lint, typecheck, tests pass for `@gate-access/db`.

### Files likely touched

- `packages/db/src/lib/unit-hierarchy-seed.ts`
- `packages/db/src/advanced-seed-service.ts` (orchestration)

### Handoff to Phase 5

Units and owners exist for traffic simulation.
