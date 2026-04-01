# IDEA: advanced_seeding_emulation_v3 — Advanced Data Seeding & Emulation Panel

**Status:** Planning  
**Supersedes / extends:** `IDEA_advanced_seeding_v2.md`  
**Product line:** Platform super-admin tooling + `@gate-access/db` seeding engine

## Why

Super Admins need a **security-first**, **production-grade** way to simulate realistic multi-tenant onboarding and gate traffic for **Hurghada / Red Sea** compounds: correct `organizationId` isolation, soft deletes, signed QRs, duplicate-safe identities, and Atlassian Design System (ADS) UX for configuring ranges and scenarios.

## Goal

Deliver:

1. **Seeding engine** — Range-based generation, nationality mix (14+ with Red Sea weighting), six unit-ID formats, unit hierarchy (phases, buildings, floors, areas), rush-hour traffic simulation, full relational chain to signed QRs and scan logs.
2. **Integrity layer** — Zero-tolerance pre-insert validation for `id`, `phone`, `email`, `unitId` (and related unique constraints).
3. **Security** — Super Admin only for live emulation; rate limits (e.g. 5 emulations/hour/admin via Upstash); audit via `AiActionLog`; all tenant queries scoped and soft-delete aware.
4. **UI** — Admin dashboard multi-step wizard (`/admin/emulation`), ADS tokens, light/dark, WCAG 2.1 AA.

## Canonical reference extracted

Source conversation is now available at `docs/Pasted_Text_1774974939864.txt` and is the canonical v3 detail source for:

- Scenario set: `luxury-compound` (default Hurghada), `nightclub`, `private-school`, `wedding-venue`.
- Temporal realism: weighted rush windows + Gaussian clustering + baseline non-rush traffic (about 30%).
- CLI surface: `pnpm prisma db seed -- --scenario=<...> --scans=<...> --pastDays=<...> --incidentRate=<...> --seed=<...>`.
- Security and quality intent: super-admin API trigger, reproducible seeded randomness, batch inserts around 500 rows.

## Non-goals (for v3 plan)

- Replacing production onboarding flows for real customers.
- Non-super-admin access to emulation APIs.
- Hard deletes or cross-tenant data reads.

## Success metrics

See `docs/plan/execution/PLAN_advanced_seeding_emulation_v3.md` — Success Metrics table.

## Seeding logic reference

Nationality targets (v3 baseline): Egyptian ~45%, German ~17%, Russian ~15%, plus 11+ others to reach 100%.  
Unit ID formats: **compact**, **building-first**, **simple**, **location**, **descriptive**, **global** — configurable per project.  
Rush hour: scenario-specific temporal clustering (Gaussian peaks + baseline) for `ScanLog` density.

## Related docs

- `docs/plan/execution/PLAN_advanced_seeding_emulation_v3.md`
- `docs/Pasted_Text_1774974939864.txt`
- `docs/arch/ARCHITECTURE.md`, `docs/arch/PROJECT_STRUCTURE.md`
- `docs/archive/old-prds/PRD_v8.0.md`
- `.antigravity/contracts/CONTRACTS.md`, `.antigravity/rules/00-gateflow-core.mdc`
