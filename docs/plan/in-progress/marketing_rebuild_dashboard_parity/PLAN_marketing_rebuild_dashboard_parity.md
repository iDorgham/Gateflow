# PLAN: marketing_rebuild_dashboard_parity

**Slug:** `marketing_rebuild_dashboard_parity`  
**IDEA:** `docs/plan/context/IDEA_marketing_rebuild_dashboard_parity.md`  
**Branch (suggested):** `feat/marketing-dashboard-parity`  
**Status:** Planned — run `/dev marketing_rebuild_dashboard_parity 1` to start

---

## Summary

Align `apps/marketing` with the **canonical design system** used by the client dashboard (`packages/ui` — `globals.css`, Tailwind theme, shadcn-style primitives). Remove duplicated token maintenance, keep **Inter + Cairo** for marketing typography unless Phase 1 decides otherwise, and run execution with **explicit Cursor skills** per phase.

---

## Skills-by-phase (load before `/dev`)

| Phase | Skills to load (`.cursor/skills/…`)                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 01    | `architecture`, `tokens-design`, `tailwind`, `ads-core-tokens`, `ads-color-tokens`, `design-guide`                                 |
| 02    | `design-guide`, `shadcn-ads`, `ads-spacing`, `ads-typography`, `i18n`                                                              |
| 03    | `design-guide`, `responsive-design`, `ads-ui-styling`, `creative-animation` (or `uiux-animator` for motion-heavy sections), `i18n` |
| 04    | `seo-core`, `seo-content`, `ads-accessibility-rtl`, `nextjs-performance`, `verification-before-completion`                         |

---

## Phased roadmap

| Phase  | Title                            | Primary role  | Preferred tool | Depends on |
| ------ | -------------------------------- | ------------- | -------------- | ---------- |
| **01** | Token & Tailwind alignment       | ARCHITECTURE  | Cursor         | —          |
| **02** | Layout shell & shared primitives | FRONTEND      | Cursor         | 01         |
| **03** | Section refactors & RTL          | FRONTEND      | Cursor         | 02         |
| **04** | SEO, motion, a11y, verification  | FRONTEND + QA | Cursor         | 03         |

---

## Invariants

- **pnpm** only; extend `@gate-access/ui` — no second `cn()` implementation in marketing.
- **Locales** `en`, `ar-EG` — RTL must remain correct; no broken `hreflang` or `dir`.
- **No secrets** in client code; do not change contact/API contract unless a follow-up IDEA.
- **Preflight** is a hard gate for any phase that touches shared `packages/ui` or marketing together.

---

## Risks

| Risk                           | Mitigation                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| CSS bundle growth              | Prefer CSS variable imports over duplicating large blocks; measure `marketing` build size before/after Phase 01. |
| Theme flash / dark mode        | Verify `Providers` + `next-themes` after global CSS changes.                                                     |
| Scanner false positives on hex | Token definitions may use `rgb()`; align with existing `ralph-skill-discover` rules.                             |

---

## Prompt files

| Phase | Path                                             |
| ----- | ------------------------------------------------ |
| 01    | `phases/01_token_audit/PROMPT_phase_01.md`       |
| 02    | `phases/02_layout_shell/PROMPT_phase_02.md`      |
| 03    | `phases/03_sections_refactor/PROMPT_phase_03.md` |
| 04    | `phases/04_seo_motion_verify/PROMPT_phase_04.md` |

---

## Definition of done (plan level)

- [ ] All four phases committed with green `pnpm preflight` when shared UI or marketing is touched.
- [ ] Marketing globals do not duplicate the full dashboard token sheet without documented exception list.
- [ ] Spot check: EN + AR-EG homepage and pricing; no layout regressions.
- [ ] `TASKS_marketing_rebuild_dashboard_parity.md` shows all phases done; move folder to `planned/` or `in-progress/` per lifecycle.
