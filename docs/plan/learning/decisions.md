# Docs & Planning Decisions (v2)

This file records important decisions made during planning and documentation work.

- For previous decisions, see `docs/archive/plan-legacy/learning/decisions.md`.
- Each entry should capture:
  - Date.
  - Initiative and phase.
  - Decision statement.
  - Alternatives considered.
  - Rationale and any trade-offs.

---

## Seed Decisions

### Decision 1 — Archive Old Plan Tree, Keep PRD v6.0 at Root

- **Date:** 2026‑02‑27  
- **Initiative:** `docs_v2_refresh` — Phase 1  
- **Decision:** Move all legacy `docs/plan/**` content to `docs/archive/plan-legacy/**` and keep `docs/PRD_v7.0.md` as the single canonical PRD at the root.
- **Alternatives considered:**
  - Keep `PRD_v7.0.md` under `docs/plan/phase-1-mvp/specs/`.
  - Keep multiple PRD versions side by side in `docs/`.
- **Rationale:**
  - Reduces confusion for new contributors.
  - Makes it clear which spec is current while still preserving history.

# GateFlow — Architecture & Process Decisions

**Purpose:** Central log of important decisions that affect how we design, implement, and operate GateFlow. Each entry should reference the plan and phase where the decision was made and link to the relevant code and docs.

Use this file to answer: *“Why do we do it this way?”* for future phases, CLIs, and IDEs.

## Decision entry template

Copy this block for each new decision:

```markdown
### [Decision title]

- **Date:** YYYY‑MM‑DD
- **Plan / Phase:** `PLAN_<slug>.md` — Phase N: [Title] (or `Global` for repo‑wide decisions)
- **Status:** [Accepted / Deprecated / Proposed]
- **Context:** [Short description of the problem and constraints]
- **Decision:** [What we chose to do]
- **Consequences:**
  - [Positive consequence 1]
  - [Negative or trade‑off 1]
- **References:**
  - [File or doc 1]
  - [File or doc 2]
```

## Seed decisions

### Use docs/plan/learning as shared knowledge base

- **Date:** 2026‑02‑27
- **Plan / Phase:** `cursor-god-mode-final` — Roadmap step “add learning docs and begin capturing outcomes from each phase”
- **Status:** Accepted
- **Context:** We needed a single, tool‑agnostic place for Cursor, CLIs, Kiro, and Antigravity to consume cross‑phase learnings without duplicating planning logic in every tool.
- **Decision:** Store reusable patterns, incidents, and decisions under `docs/plan/learning/` and treat these files as the canonical learning layer for all phase execution.
- **Consequences:**
  - Phases and prompts stay focused on *what* to do, while `learning/` captures *what we learned* across plans.
  - All tools can index a single directory to reuse prior work, making future planning and reviews faster.
  - Requires lightweight discipline to update learning docs when phases complete or incidents occur.
- **References:**
  - `.cursor/plans/cursor-god-mode-final_005f5566.plan.md`
  - `docs/plan/learning/patterns.md`
  - `docs/plan/learning/incidents.md`

---

## 2026-03-11 Decisions

### `PageHeader` Extracted as Shared Component (dashboard_polish phase 2)

- **Date:** 2026-03-11
- **Plan / Phase:** `dashboard_polish` — Phase 2: Unified PageHeader + Spacing
- **Status:** Accepted
- **Context:** Each dashboard page had its own h1 styling (`text-2xl font-bold text-slate-900` or `text-2xl font-bold tracking-tight`) that was inconsistent across pages.
- **Decision:** Create `components/dashboard/page-header.tsx` as a shared component with `title`, `subtitle`, `badge`, and `actions` props. Apply to QR Codes, Access Logs, Gates, and Analytics pages. Title style: `text-xl font-black uppercase tracking-tight`.
- **Consequences:**
  - Single style definition for all page titles — consistent visual hierarchy.
  - New pages must use `PageHeader` to stay consistent; old pages can be migrated incrementally.
- **References:**
  - `apps/client-dashboard/src/components/dashboard/page-header.tsx`

### `FilterBar` Composable Sub-components over Monolithic Filter (dashboard_polish phase 3)

- **Date:** 2026-03-11
- **Plan / Phase:** `dashboard_polish` — Phase 3: Unified FilterBar Component
- **Status:** Accepted
- **Context:** QR Codes and Scans pages each had hand-rolled filter UIs with inconsistent styling, heights, and icon patterns.
- **Decision:** Build `FilterBar` as a namespace with sub-components (`FilterBar.Search`, `FilterBar.Select`, `FilterBar.DatePresets`, `FilterBar.Divider`) rather than a single monolithic prop-driven component. Each sub-component is self-contained and composable.
- **Consequences:**
  - Filter areas can be built from primitives without negotiating a complex prop API.
  - Individual sub-components can be dropped into any layout without the full `FilterBar` container.
  - Slightly more boilerplate per page vs a single `<FilterBar filters={...} />` — accepted trade-off for flexibility.
- **References:**
  - `apps/client-dashboard/src/components/dashboard/filter-bar.tsx`

### `done/` / `planning/` Split for Plan Lifecycle (docs_v2_refresh phase 3)

- **Date:** 2026-03-11
- **Plan / Phase:** `docs_v2_refresh` — Phase 3: Plan Folder Cleanup
- **Status:** Accepted
- **Context:** Completed plan folders (`dashboard_polish`, `watchlist_ui`, etc.) were still sitting in `planning/` alongside the active plan, making it hard to see what was in-flight vs done.
- **Decision:** After all phases of a plan are complete, move the folder from `planning/<slug>/` to `done/<slug>/` via `git mv`. `planning/` should only contain active/upcoming plans.
- **Consequences:**
  - `/guide` and humans can see at a glance what's active (planning/) vs historical (done/).
  - Done plans remain searchable as a prompt and pattern archive.
  - Requires one manual `git mv` step per plan completion — low overhead.
- **References:**
  - `docs/plan/README.md`
  - `docs/plan/planning/docs_v2_refresh/TASKS_docs_v2_refresh.md`

