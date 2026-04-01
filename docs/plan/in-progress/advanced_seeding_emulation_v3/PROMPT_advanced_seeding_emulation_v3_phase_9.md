# Phase 9: CLI Integration, Testing & Documentation

> **Checklist (mandatory):** `docs/plan/planned/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/planned/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND** + **QA**

### Tool selection

|               | Tool              | Why                  |
| ------------- | ----------------- | -------------------- |
| **Preferred** | **Cursor**        | Script wiring + docs |
| **Fallback**  | Gemini CLI (free) | Test case expansion  |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md`
2. `.antigravity/skills/gf-ads/SKILL.md`
3. `.antigravity/skills/gf-planner/SKILL.md` — completion checklist
4. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
5. `.cursor/skills/testing/SKILL.md` — Jest patterns

### Context

- **Depends on:** Phases 1–8.
- **Objective:** Expose **`pnpm prisma db seed`** (or package script) flags: `--dry-run`, `--test-integrity`, `--organizations.min/max`, etc.; print **console summary** (counts per model, duration); document ops in `docs/` (minimal: one section under `docs/arch/` or `docs/guides/` — only if no suitable file; prefer updating existing seed/guide doc).
- **Reference parity:** Keep CLI args aligned with `docs/Pasted_Text_1774974939864.txt`: `--scenario`, `--scans|--totalScans`, `--pastDays`, `--incidentRate`, `--seed|--randomSeed`.
- **Dashboard parity:** add verification script/tests that compare seeded data shape against current client-dashboard readers:
  - `/api/crm/contacts` (`firstName`, `lastName`, `email`, `phone`, `jobTitle`, `company`)
  - `/api/crm/units` (`name`, `type`, `building`, `sizeSqm`)
  - `/api/qrcodes` (`code`, `type`, `status`, `createdAt`, `expiresAt`, `scansCount`, `guest*`, `projectName`, `gateName`)
  - scans page relation scope via `scanLog -> qrCode.organizationId`

### Goal

Operators and CI can verify integrity and ranges without the UI; documentation lists commands and security notes.

### Scope (in)

- `packages/db/prisma/seed.ts` or entry used by `package.json` seed — parse argv (consider `cac` or minimal manual `process.argv`).
- Hook `validateUniqueness` + optional post-seed SQL checks for nationality distribution (read-only).
- Integration test or script: `pnpm prisma db seed -- --dry-run` exits 0.
- Update `docs/guides/` or seed README with examples from user request:

```bash
pnpm prisma db seed -- --test-integrity=true
pnpm prisma db seed -- --organizations.min=2 --organizations.max=5 --dry-run
pnpm prisma db seed -- --scenario=nightclub --scans=15000 --pastDays=30 --incidentRate=0.25 --seed=12345
```

### Scope (out)

- New product features unrelated to seeding.

### Steps (ordered)

1. Inventory current seed entrypoint (`seed.ts`, `seed_dev.ts`).
2. Unify or bridge to `advanced-seed-service`; avoid duplicate logic.
3. Implement flag parsing + help text (`--help`).
4. Add tests for argv parsing and dry-run branch (unit).
5. Add one contract test (or script) that seeds a small org and asserts client-dashboard API response fields above exist and are non-breaking.
6. Run `pnpm preflight` at repo root; fix regressions in touched workspaces.
7. Commit: `feat(seeding): phase 9 — CLI flags, integrity checks, and documentation`
8. Optional final merge commit message per plan: `feat(seeding): advanced emulation panel v3 with data integrity, Atlassian UI & Red Sea realism`

### Security checklist

- [ ] CLI does not log secrets; `QR_SIGNING_SECRET` only read server-side / seed runtime
- [ ] Seed destructive modes gated by env e.g. `NODE_ENV=development` or explicit `--i-know-what-im-doing` (follow repo convention)

### Acceptance criteria

- [ ] **Functional:** Documented flags work; `--help` lists options.
- [ ] **Data integrity:** `--test-integrity` runs validation pass or exits non-zero on violation.
- [ ] **Quality:** `pnpm turbo lint`, `pnpm turbo typecheck`, relevant `pnpm turbo test` pass for touched packages
- [ ] **Docs:** At least one markdown file updated with seeding/emulation section (keep concise).

### Files likely touched

- `packages/db/prisma/seed.ts` (or main seed)
- `packages/db/package.json` scripts
- `docs/guides/*.md` or `packages/db/README.md`

### Plan completion

- Mark all phases in `PLAN_advanced_seeding_emulation_v3.md` as executed in your task tracker.
- Move plan folder per `docs/plan/PLAN_LIFECYCLE.md` when all phases merged.
- Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` if your workflow requires slug visibility.
