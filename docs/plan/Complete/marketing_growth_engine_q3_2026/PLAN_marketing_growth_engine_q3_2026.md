# PLAN: marketing_growth_engine_q3_2026

**Slug:** `marketing_growth_engine_q3_2026`  
**IDEA:** `docs/development/initiatives/IDEA_marketing_growth_engine_q3_2026.md`  
**Branch (suggested):** `feat/marketing-growth-engine-q3-2026`  
**Status:** Done — all phases complete and verified

---

## Summary

Turn marketing into a measurable growth engine by adding intent-aware CTA flows, vertical conversion assets, and closed-loop attribution from campaign to first scan. The plan emphasizes incremental delivery with KPI instrumentation from the first phase, while preserving SEO, performance, and AR/EN parity.

---

## Skills-by-phase (load before `/dev`)

| Phase | Skills to load (`.cursor/skills/…`)                                            |
| ----- | ------------------------------------------------------------------------------ |
| 01    | `planner`, `seo-planning`, `seo-core`, `i18n`, `architecture`                  |
| 02    | `tailwind`, `design-guide`, `api`, `testing`, `i18n`                           |
| 03    | `content-creation`, `seo-content`, `seo-research`, `responsive-design`, `i18n` |
| 04    | `analytics-animation`, `data-viz`, `api`, `testing`, `security`                |

---

## Phased roadmap

| Phase  | Title                                        | Primary role            | Preferred tool | Depends on |
| ------ | -------------------------------------------- | ----------------------- | -------------- | ---------- |
| **01** | Intent taxonomy & KPI contract               | PLANNING + ARCHITECTURE | Cursor         | —          |
| **02** | Adaptive CTA routing & instrumentation       | FRONTEND + BACKEND-API  | Cursor         | 01         |
| **03** | Vertical playbooks & resource lead gates     | FRONTEND + CONTENT      | Cursor         | 02         |
| **04** | Closed-loop campaign-to-first-scan analytics | BACKEND-API + QA        | Cursor         | 02, 03     |

---

## Invariants

- pnpm-only workflows; keep monorepo conventions and shared package usage.
- Preserve locale parity (`en`, `ar-EG`) and RTL behavior in every funnel path.
- Do not weaken SEO foundations (metadata, canonicals, sitemap assumptions).
- No auth or tenant-scoping regressions on any dashboard/API touchpoints.
- Track intent events using stable taxonomy keys to avoid analytics drift.

---

## Risks

| Risk                                    | Mitigation                                                    |
| --------------------------------------- | ------------------------------------------------------------- |
| Funnel friction from over-qualification | Use progressive profiling; keep low-friction path to demo     |
| Incomplete campaign->scan linkage       | Define event contract in Phase 01 before implementation       |
| SEO regression from CTA experiments     | Add phase acceptance checks for metadata/canonical integrity  |
| AR/EN divergence in conversion pages    | Require locale verification in each phase acceptance criteria |

---

## KPI targets (to lock in Phase 01)

| KPI                            | Baseline source                      | Target by end of Phase 04 |
| ------------------------------ | ------------------------------------ | ------------------------- |
| Demo CTA conversion rate       | Current marketing analytics snapshot | +20% relative uplift      |
| Qualified lead rate            | CRM lead qualification baseline      | +15% relative uplift      |
| Campaign -> first scan linkage | Attribution join coverage baseline   | >= 70% join coverage      |
| EN vs AR conversion parity gap | Locale-split funnel report           | <= 10% relative gap       |

---

## Prompt files

| Phase | Path                                                 |
| ----- | ---------------------------------------------------- |
| 01    | `phases/01_intent_taxonomy/PROMPT_phase_01.md`       |
| 02    | `phases/02_adaptive_routing/PROMPT_phase_02.md`      |
| 03    | `phases/03_vertical_playbooks/PROMPT_phase_03.md`    |
| 04    | `phases/04_closed_loop_analytics/PROMPT_phase_04.md` |

---

## Definition of done (plan level)

- [ ] All phases complete with green lint/typecheck/tests for touched workspaces.
- [ ] Intent taxonomy documented and implemented consistently across CTAs/events.
- [ ] At least one validated report path exists for `campaign -> qualified lead -> first scan`.
- [ ] `TASKS_marketing_growth_engine_q3_2026.md` is fully checked and moved through lifecycle.
