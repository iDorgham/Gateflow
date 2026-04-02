# PLAN: Advanced Data Seeding & Emulation Panel (v3)

**Slug:** `advanced_seeding_emulation_v3`  
**IDEA:** `docs/plan/context/IDEA_advanced_seeding_emulation_v3.md`  
**Created:** 2026-03-31  
**Planning workflow:** `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`  
**Subagent roles:** `docs/archive/legacy-plans/guidelines/SUBAGENT_HIERARCHY.md` (canonical copy if `docs/plan/guidelines/` is synced from ops-core)

---

## Executive summary

Nine phases build a **security-first** advanced seeding and **live emulation** capability: Prisma/schema integrity foundations, Red Sea data + unit ID formats, rich contacts, unit hierarchy, rush-hour traffic, signed QR relational chain, Vercel serverless emulation API (Super Admin + rate limit), ADS multi-step admin UI, then CLI/tests/docs.

---

## Skill & document loading (all executors)

| Resource                  | Path (canonical)                                  | In-repo fallback                                                              |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Security                  | `.antigravity/skills/gf-security/SKILL.md`        | `.cursor/skills/security/SKILL.md`                                            |
| Design (ADS)              | `.antigravity/skills/gf-design/SKILL.md`          | `.cursor/skills/design-guide/SKILL.md`, `.cursor/skills/ads-*`                |
| UI/UX                     | `.antigravity/skills/gf-uiux/SKILL.md`            | `.cursor/skills/responsive-design/SKILL.md`, `.cursor/skills/i18n/SKILL.md`   |
| Planner                   | `.antigravity/skills/gf-planner/SKILL.md`         | `.cursor/skills/planner/SKILL.md`                                             |
| ADS seeding               | `.antigravity/skills/gf-ads/SKILL.md`             | _(materialize from ops-core or follow PHASED_DEVELOPMENT_WORKFLOW enforcers)_ |
| Core rules                | `.antigravity/rules/00-gateflow-core.mdc`         | _(repo root)_                                                                 |
| Contracts                 | `.antigravity/contracts/CONTRACTS.md`             | _(repo root)_                                                                 |
| Architecture              | `docs/arch/ARCHITECTURE.md`                       |                                                                               |
| Project structure         | `docs/arch/PROJECT_STRUCTURE.md`                  |                                                                               |
| PRD                       | `docs/archive/old-prds/PRD_v8.0.md`               |                                                                               |
| Prompt standards          | `docs/guides/PROMPTS_REFERENCE.md`                |                                                                               |
| Phase template            | `.antigravity/templates/TEMPLATE_PROMPT_phase.md` |                                                                               |
| Seeding paste (canonical) | `docs/Pasted_Text_1774974939864.txt`              | _(loaded and reflected in this plan)_                                         |

---

## Phase overview

| #   | Title                                              | Primary role               | Depends on          | Preferred tool | Key deliverables                                                                        | Status |
| --- | -------------------------------------------------- | -------------------------- | ------------------- | -------------- | --------------------------------------------------------------------------------------- | ------ |
| 1   | Core Schema & Data Integrity Foundation            | **BACKEND** (DB)           | —                   | Cursor         | Migrations as needed; `validateUniqueness()` / pre-insert registry; tests               | [x]    |
| 2   | Red Sea Data Library & Unit ID Format System       | **BACKEND**                | 1                   | Cursor         | `red-sea-data.ts`; 6 format encoders; per-project `unitIdFormat` config                 | [x]    |
| 3   | Rich Contact Generation with Nationality Weighting | **BACKEND**                | 1, 2                | Cursor         | Weighted nationalities (14+); profile fields; duplicate-safe generation                 | [x]    |
| 4   | Unit Hierarchy Seeding with Areas & Owner Linking  | **BACKEND**                | 1–3                 | Cursor         | Phases/buildings/floors; `areaSqm`, balcony/terrace; `ownerContactId` links             | [x]    |
| 5   | Rush Hour Algorithm & Traffic Simulation           | **BACKEND**                | 1–4                 | Cursor         | Temporal clustering for scan density; scenario hooks                                    | [x]    |
| 6   | QR Generation, Access Logs & Relational Chain      | **BACKEND** + **SECURITY** | 1–5                 | Cursor         | HMAC-SHA256 QRs; VisitorQR; ScanLog; chain integrity tests                              | [x]    |
| 7   | Live Emulation API (Vercel Serverless)             | **BACKEND** + **SECURITY** | 1–6                 | Cursor         | `POST /api/admin/emulate-traffic`; Super Admin guard; Upstash rate limit; `AiActionLog` | [ ]    |
| 8   | Admin Dashboard Multi-Step UI Wizard (ADS)         | **FRONTEND**               | 7 (contract stable) | Cursor         | `/admin/emulation`; 6-step wizard; a11y; tokens                                         | [ ]    |
| 9   | CLI Integration, Testing & Documentation           | **BACKEND** + **QA**       | 1–8                 | Cursor         | `seed` flags; integrity/dry-run; docs; acceptance tests                                 | [ ]    |

---

## Per-phase: scope, deliverables, tests

## Concrete scenario profile (from pasted reference)

- **Scenarios:** `luxury-compound` (Hurghada default), `nightclub`, `private-school`, `wedding-venue`.
- **Rush model:** Weighted rush periods per scenario, Gaussian clustering around peak hour, and baseline non-rush traffic for valleys.
- **CLI knobs:** `scenario`, `scans`, `pastDays`, `incidentRate`, `seed`.
- **Operational defaults seen in reference:** scans up to 15k, contacts up to ~12k, units up to ~6k, batching around 500 rows.

### Phase 1 — Core Schema & Data Integrity Foundation

- **Scope:** Unique indexes/constraints on tenant-scoped `phone`, `email`, `unitId` where required by product; optional `Project.unitIdFormat` enum/string; shared **validation module** that collects generated keys before `createMany` batches.
- **Deliverables:** `packages/db` migration(s); `packages/db/src/lib/seed-integrity.ts` (or similar) with `validateUniqueness(candidates, existingKeys)`; unit tests.
- **Test criteria:** `pnpm turbo lint typecheck test --filter=@gate-access/db`; no duplicate insert in synthetic batch test.

### Phase 2 — Red Sea Data Library & Unit ID Format System

- **Scope:** Static library for compound names, locales, format weights; `generateUnitId(projectFormat, indices, meta)`.
- **Deliverables:** `packages/db/src/lib/red-sea-data.ts`; format enum + six strategies; tests per format.
- **Test criteria:** Golden snapshots for each format; property tests for uniqueness within a generated batch.

### Phase 3 — Rich Contact Generation

- **Scope:** Weighted sampler (Egyptian ~45%, German ~17%, Russian ~15%, remainder distribution); names/phones/emails consistent with nationality; integration with Phase 1 registry.
- **Deliverables:** `generateRichContact()` in advanced seed service; distribution integration test.
- **Test criteria:** Monte Carlo or fixed-seed run: margins ±2% vs targets on large N.

### Phase 4 — Unit Hierarchy Seeding

- **Scope:** Phases → buildings → floors → units with `areaSqm`, `balconyArea`, `terraceArea`; link owner contact.
- **Deliverables:** Hierarchy builders in `@gate-access/db`; foreign keys validated before insert.
- **Test criteria:** Graph walk: every unit has org + project; owner contact same org.

### Phase 5 — Rush Hour & Traffic Simulation

- **Scope:** Time-series generator for `ScanLog` timestamps (Gaussian peaks + baseline); scenario parameterization with per-scenario rush windows.
- **Deliverables:** `rushHourDistribution.ts` (name flexible); seed integration flag `--rush-scenario=...`.
- **Test criteria:** Histogram or moment checks show peak; no timestamp inversions for a single gate stream.

### Phase 6 — QR, VisitorQR, Relational Chain

- **Scope:** Org → Project → Gate → Unit → Contact → QRCode → VisitorQR → ScanLog; **all signed** with `QR_SIGNING_SECRET`; `scanUuid` dedup respected.
- **Deliverables:** Chain builder; SECURITY checklist in tests (no unsigned payload paths).
- **Test criteria:** Verify HMAC on sample payloads; org isolation queries.

### Phase 7 — Live Emulation API

- **Scope:** Serverless route under `apps/client-dashboard/src/app/api/admin/...`; Zod body; Super Admin RBAC; **5 req/hour/admin** (Upstash); append `AiActionLog` per run.
- **Deliverables:** `emulate-traffic` route + rate limit helper reuse; 403/429 tests.
- **Test criteria:** Jest/route tests; curl manual doc in phase prompt.

### Phase 8 — Client Dashboard UI Wizard

- **Scope:** Six-step wizard: ranges → formats → contacts → hierarchy → traffic → review; ADS tokens; keyboard + screen reader; light/dark.
- **Deliverables:** `apps/client-dashboard/src/components/dashboard/emulation/*`; page under dashboard (for super-admin only).
- **Test criteria:** `pnpm turbo lint typecheck test --filter=client-dashboard`; optional axe on page.

### Phase 9 — CLI, Testing & Documentation

- **Scope:** `prisma/seed` or seed entry accepts `--dry-run`, `--test-integrity`, range flags, and scenario/time flags from reference (`--scenario`, `--scans`, `--pastDays`, `--incidentRate`, `--seed`); console summary; update `docs/` for ops.
- **Deliverables:** Extended seed CLI; README section; end-to-end dry-run in CI or documented manual gate.
- **Test criteria:** Full `pnpm preflight` at repo root where feasible; affected workspaces green.

---

## Success metrics (execution)

| Metric          | Target                           | How                              |
| --------------- | -------------------------------- | -------------------------------- |
| Data integrity  | 0 dupes on id/phone/email/unitId | Pre-insert + SQL audit           |
| Nationality mix | ±2% of targets                   | `GROUP BY nationality`           |
| Unit ID formats | 100% match config                | Sample vs `Project.unitIdFormat` |
| Rush hour       | Visible peaks                    | Analytics / histogram tests      |
| A11y            | WCAG 2.1 AA                      | axe on `/admin/emulation`        |
| API             | 403 non-admin; 429 over limit    | Automated tests                  |
| Quality         | Lint + typecheck + tests         | Turbo on affected packages       |

---

## Prisma-to-client dashboard contract (hard requirement)

Seeder output must match current schema and client-dashboard table/data contracts exactly:

- **`Contact` model / CRM table**
  - Prisma: `firstName`, `lastName`, `email`, `phone`, `jobTitle`, `company`, `organizationId`, `deletedAt`.
  - Client table: `ContactTable` expects contact identity from `firstName` + `lastName`, plus `email`, `phone`, `jobTitle`, `company`, and linked units.
- **`Unit` model / CRM table**
  - Prisma: `name`, `type`, `building`, `sizeSqm`, `organizationId`, `projectId`, `deletedAt`.
  - Client table: `UnitTable` expects `name`, `type`, `building`, `sizeSqm`, and linked contacts.
  - Note: use `Unit.name` as the visible unit identifier; do not seed non-existent `unitNumber`/`unitType` fields.
- **`QRCode` model / QR table**
  - Prisma: `code`, `type`, `isActive`, `currentUses`, `maxUses`, `expiresAt`, `createdAt`, `projectId`, `gateId`, `guestName`, `guestEmail`, `guestPhone`, `contactId`, `organizationId`, `deletedAt`.
  - Client QR table (`useQRCodes` / `QRCodesTable`) derives status and usage from these fields and latest `scanLogs`.
- **`VisitorQR` model**
  - Prisma: `qrCodeId`, `unitId`, `visitorName`, `visitorPhone`, `visitorEmail`, `isOpenQR`, `accessRuleId`, `createdBy`.
  - Note: no direct `organizationId` column; tenant safety is enforced through `QRCode.organizationId` and `Unit.organizationId`.
- **`ScanLog` model / scans table**
  - Prisma: `status`, `scannedAt`, `gateId`, `qrCodeId`, `scanUuid`, `deviceId`, optional `userId`.
  - Client scans page scopes by nested relation `qrCode.organizationId`; `ScanLog` itself has no `organizationId` column.

## Execution order

1. Preflight: clean branch, `pnpm preflight` (or fix unrelated failures before starting Phase 1).
2. For each phase N: run `/dev` with `docs/plan/planned/advanced_seeding_emulation_v3/PROMPT_advanced_seeding_emulation_v3_phase_N.md`.
3. Commit: `feat(seeding): phase N — <short title>`
4. Final: `feat(seeding): advanced emulation panel v3 — data integrity, ADS UI, Red Sea realism`

## Security hard gates (every phase, non-negotiable)

- `organizationId` scope on all tenant data queries (direct or relation-scoped where the model lacks org column, e.g. `ScanLog -> qrCode.organizationId`).
- `deletedAt: null` filtering on soft-delete models for reads and joins.
- HMAC-SHA256 QR signing with `QR_SIGNING_SECRET` for all generated QR payloads.
- Emulation API restricted to **Super Admin** with rate limiting (target: 5/hour/admin) and auditable execution logs.

---

## Phase prompt index

| Phase | File                                              |
| ----- | ------------------------------------------------- |
| 1     | `PROMPT_advanced_seeding_emulation_v3_phase_1.md` |
| 2     | `PROMPT_advanced_seeding_emulation_v3_phase_2.md` |
| 3     | `PROMPT_advanced_seeding_emulation_v3_phase_3.md` |
| 4     | `PROMPT_advanced_seeding_emulation_v3_phase_4.md` |
| 5     | `PROMPT_advanced_seeding_emulation_v3_phase_5.md` |
| 6     | `PROMPT_advanced_seeding_emulation_v3_phase_6.md` |
| 7     | `PROMPT_advanced_seeding_emulation_v3_phase_7.md` |
| 8     | `PROMPT_advanced_seeding_emulation_v3_phase_8.md` |
| 9     | `PROMPT_advanced_seeding_emulation_v3_phase_9.md` |

All prompts live in **`docs/plan/planned/advanced_seeding_emulation_v3/`** alongside this file.
