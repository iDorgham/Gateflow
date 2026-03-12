# GateFlow Docs v2 Overview

This `docs/` folder is the **v2 documentation set**, aligned with the canonical product spec in `PRD_v7.0.md`.

## What to read first

- **Product requirements:** [`PRD_v7.0.md`](PRD_v7.0.md)
  The single source of truth for GateFlow v7 — all 6 apps, complete feature set, security, resident portal/mobile, scanner rules, real-time updates, and marketing suite.

- **Progress dashboard:** [`PROJECT_PROGRESS_DASHBOARD.md`](PROJECT_PROGRESS_DASHBOARD.md)
  Current status (95% MVP complete), phase roadmap, app status, and recent activity.

- **Plans & initiatives:** [`docs/plan/`](plan/)
  - `plan/context/` — initiative ideas (`IDEA_*.md`)
  - `plan/execution/` — active and completed plans (`PLAN_*.md`, `PROMPT_*_phase_*.md`, `TASKS_*.md`)
  - `plan/done/` — completed plans (all phases passed)
  - `plan/learning/` — cross-phase patterns, incidents, decisions, CLI tracking

## Guides

| Guide | Purpose |
|---|---|
| [`guides/ARCHITECTURE.md`](guides/ARCHITECTURE.md) | System architecture — apps, packages, data flows, QR lifecycle |
| [`guides/SECURITY_OVERVIEW.md`](guides/SECURITY_OVERVIEW.md) | Security model — JWT, RBAC, multi-tenancy, QR signing, scanner invariants |
| [`guides/DEVELOPMENT_GUIDE.md`](guides/DEVELOPMENT_GUIDE.md) | Local setup, pnpm/Turborepo commands, slash command workflows |
| [`guides/ENVIRONMENT_VARIABLES.md`](guides/ENVIRONMENT_VARIABLES.md) | All env vars per app with descriptions |
| [`guides/SCANNER_OPERATIONS.md`](guides/SCANNER_OPERATIONS.md) | Guard flows, gate assignment, offline mode, watchlist, supervisor override |
| [`guides/RESIDENT_EXPERIENCE.md`](guides/RESIDENT_EXPERIENCE.md) | Resident portal + mobile flows (Phase 2, Q3–Q4 2026) |
| [`guides/UI_DESIGN_GUIDE.md`](guides/UI_DESIGN_GUIDE.md) | Design tokens, component conventions, Tailwind patterns |
| [`guides/MOTION_AND_ANIMATION.md`](guides/MOTION_AND_ANIMATION.md) | Animation principles and motion patterns for the dashboard |
| [`guides/TOOL_AND_CLI_REFERENCE.md`](guides/TOOL_AND_CLI_REFERENCE.md) | CLI tool matrix (Cursor, Claude, Gemini, Opencode, Kiro, Kilo, Qwen) |
| [`guides/PROMPT_ENGINEERING.md`](guides/PROMPT_ENGINEERING.md) | Prompt writing patterns for AI-assisted development |

## Legacy docs

All legacy planning and spec documents are archived under:

- `docs/archive/plan-legacy/**` — old `docs/plan/**` tree (v1/v5 era plans, specs, and guides).
- `docs/archive/root-legacy/**` — old root-level docs.

Treat these as **historical reference only**.

## Contributing to docs

- **Product changes** → update `PRD_v7.0.md` (use the `pro-prd-writer` skill for large sections).
- **New initiatives** → `/idea` to capture → `/plan` to phase → `/dev` to execute. Outputs land in `docs/plan/`.
- **Guide updates** → edit the relevant file in `docs/guides/`. Keep guides concise; link to PRD rather than duplicate it.
- **Learning captures** → append to `docs/plan/learning/{patterns,incidents,decisions}.md` after significant phases.

---

**Version:** 7.0  
**Last Updated:** March 12, 2026  
**Status:** Living Documentation
