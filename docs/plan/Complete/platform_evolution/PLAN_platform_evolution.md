# PLAN: GateFlow Platform Evolution — The Operating System Hub (v3.0)

**Slug:** `platform_evolution`  
**Status:** ✅ Complete (Certified 2026-04-30)  
**Primary apps:** `apps/admin-dashboard`, `apps/marketing`  
**Supporting:** `packages/db`, `packages/ui`, `packages/types`, `packages/api`

---

## 🏛️ Executive Summary — Seven Strategic Phases

| Phase | Title                           | Primary Role  | Outcome                                                                                                                                                                     |
| :---- | :------------------------------ | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Nested Hierarchy & Routing**  | **BACKEND**   | [Prompt](phases/01_nesting_hierarchy/PROMPT_phase_01.md); **Depends: `org_types_dashboard` P1**; Strategic refactor of global Users/Projects/Gates into Org context.        |
| **2** | **AI CRM & Lead Intelligence**  | **FULLSTACK** | [Prompt](phases/02_ai_crm_intelligence/PROMPT_phase_02.md); Predictive lead scoring, automated nurturing, and AI deal forecasting.                                          |
| **3** | **AI Task Manager & Bots**      | **FULLSTACK** | [Prompt](phases/03_ai_task_manager/PROMPT_phase_03.md); Kanban + Calendar views with rule-based AI automation bots.                                                         |
| **4** | **Style Hub & Live Theming**    | **FRONTEND**  | [Prompt](phases/04_style_editing_hub/PROMPT_phase_04.md); **Depends: `design_system` P1-2**; Token-safe white-labeling engine with real-time previews.                      |
| **5** | **AI Landing Page Builder**     | **FULLSTACK** | [Prompt](phases/05_ai_landing_page_builder/PROMPT_phase_05.md); **Depends: `design_system` P3-4**; Block-based composer with AI text + image generation (Vercel AI SDK v6). |
| **6** | **AI Blog Content Engine**      | **FULLSTACK** | [Prompt](phases/06_ai_blog_content_engine/PROMPT_phase_06.md); Automated topic suggestion and full draft generation (EN/AR).                                                |
| **7** | **Ops Hub & Resilience Polish** | **QA/OPS**    | [Prompt](phases/07_ai_support_resilience/PROMPT_phase_07.md); Unified help desk, predictive analytics, and performance hardening.                                           |

---

## 🏛️ Context & Planning Sources

| Resource                                                                              | Description                                                                             |
| :------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| **[CONTEXT_platform_evolution.md](CONTEXT_platform_evolution.md)**                    | Strategic mission, market audit, mandates, constraints, and DoD.                        |
| **[TASKS_platform_evolution.md](TASKS_platform_evolution.md)**                        | High-level global checklist for the entire initiative.                                  |
| **[PLAN_org_types_dashboard.md](../org_types_dashboard/PLAN_org_types_dashboard.md)** | Critical dependency for Phase 1 (Nesting & Terminology).                                |
| **[PLAN_design_system.md](../gateflow_design_system/PLAN_gateflow_design_system.md)** | Critical dependency for Phase 4 (Tokens) & Phase 5 (UI Blocks).                         |
| **PRD v7.0**                                                                          | `docs/product/PRD_v7.0.md` — Admin Dashboard, Marketing Suite, Analytics, CRM sections. |
| **Security Overview**                                                                 | `docs/guides/SECURITY_OVERVIEW.md` — Scoping and auth invariants.                       |
| **UI Design Guide**                                                                   | `docs/guides/UI_DESIGN_GUIDE.md` — ADS v7 token compliance standards.                   |

---

## 🧪 Definition of Done (Global)

1. **Code Quality**: Passes `pnpm preflight` (lint, typecheck, tests).
2. **ADS Compliance**: Verified via `enforce-ads-design.js`.
3. **Security Invariants**: 100% org-scoping and soft-delete compliance.
4. **MENA Parity**: EN/AR RTL layouts indistinguishable in quality.
5. **Human-in-the-Loop**: All AI workflows include HiTL review/confirmation gates.
6. **Documentation**: Plan transitioned from Ready → Active → Done.

---

## 🚀 Recommended Start

Proceed to **Phase 1: Nested Hierarchy & Routing**.

```bash
/dev platform_evolution 1
```
