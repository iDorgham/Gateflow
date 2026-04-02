# Phase 2: Red Sea Data Library & Unit ID Format System

> **Checklist (mandatory):** `docs/plan/done/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND**

### Tool selection

|               | Tool              | Why                             |
| ------------- | ----------------- | ------------------------------- |
| **Preferred** | **Cursor**        | Pure TypeScript library + tests |
| **Fallback**  | Gemini CLI (free) | Large table generation review   |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md` (or `.cursor/skills/security/SKILL.md`)
2. `.antigravity/skills/gf-ads/SKILL.md` — range-based generation, integrity
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
4. `docs/arch/ARCHITECTURE.md`, `docs/arch/PROJECT_STRUCTURE.md`, `docs/archive/old-prds/PRD_v8.0.md`

**Seeding detail:** IDEA v3 + optional `Pasted_Text_1774974939864.txt`.

### Context

- **Depends on:** Phase 1 complete (`validateUniqueness`, schema).
- **Objective:** Static **Red Sea / Hurghada** flavor data (compound names, neighborhoods, optional weights for labels) and **six** `generateUnitId` strategies: **compact**, **building-first**, **simple**, **location**, **descriptive**, **global**.
- **Client-dashboard contract:** generated unit identifier maps to persisted `Unit.name` (the field rendered in CRM `UnitTable`).
- Store per-project **format** on `Project` (add field in this phase or Phase 1 if deferred — align with migration in 1).

### Goal

`packages/db/src/lib/red-sea-data.ts` + `unit-id-formats.ts` with tested `generateUnitId(format, ctx)` and config types.

### Scope (in)

- `packages/db/src/lib/red-sea-data.ts` — names, regions, optional weighted pick helpers.
- `packages/db/src/lib/unit-id-formats.ts` — enum + `generateUnitId`.
- Wire `Project.unitIdFormat` if not already in schema (migration if needed).
- Tests: snapshot per format; collision rate ~0 in large in-memory batch per org.

### Scope (out)

- Contacts, QR, HTTP API, admin UI.

### Steps (ordered)

1. Define `UnitIdFormat` enum / union type matching product naming.
2. Implement six format functions taking `{ buildingCode, floor, unitIndex, phase?, locale? }`.
3. Integrate Phase 1 `validateUniqueness` in tests simulating 10k IDs for one org.
4. Document format strings with examples in module TSDoc.
5. `pnpm turbo lint typecheck test --filter=@gate-access/db`
6. Commit: `feat(seeding): phase 2 — Red Sea data library and unit ID formats`

### Security checklist

- [ ] Generated IDs never encode secrets; no PII in format strings beyond public unit labels

### Acceptance criteria

- [ ] **Functional:** All six formats produce stable, deterministic output for same inputs + seed.
- [ ] **Data integrity:** Generated identifiers (persisted as `Unit.name`) unique per org in simulation tests.
- [ ] **Quality:** Lint, typecheck, tests for `@gate-access/db` pass.

### Files likely touched

- `packages/db/src/lib/red-sea-data.ts`
- `packages/db/src/lib/unit-id-formats.ts`
- `packages/db/prisma/schema.prisma` / migrations (if `unitIdFormat` added here)

### Handoff to Phase 3

`generateUnitId` + Red Sea pickers available for contact/unit seeding.
