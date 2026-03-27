---
description: Strategic brainstorming to refine apps, suggest enhancements, and plan future releases.
---

# /brainstorm — Strategic App Engineering & Market Research

Use `/brainstorm` to take GateFlow to the next level by identifying market needs, refining feature options, and planning strategic roadmap releases.

## Roles & Agents

- **Primary**: `business-strategist.md` (Domain Strategy Expert)
- **Secondary**: `planning.md` + `explore.md` (Implementation Architecture)
- **Subagents**: `browser-use.md` (Market Research), `explore.md` (Codebase Audit / API Map Audit)

## Subcommands

| Subcommand | Purpose | Primary Skill |
| :--- | :--- | :--- |
| `/brainstorm` (Default) | General strategic session on a topic. | `strategist` |
| `/brainstorm research` | Deep dive into competitors and market trends. | `browser-use` |
| `/brainstorm gaps` | Audit GateFlow for missing features/standards. | `strategist` |
| `/brainstorm release` | Plan and spec the next semantic version (vX.X). | `pro-prd-writer` |
| `/brainstorm merge` | Analyze consolidation of apps/packages. | `architecture` |
| `/brainstorm roadmap` | Generate long-term strategic visualization. | `planner` |

## What `/brainstorm` does

1.  **Context Loading**: Reads `CLAUDE.md`, `docs/PRD_v7.0.md`, `docs/plan/backlog/ALL_TASKS_BACKLOG.md`, and `docs/cache/API_ROUTES_MAP.md`.
2.  **Strategic Research**: Use `browser-use` to find top 5 features in global property management SaaS.
3.  **App Level-up**: Think like a senior app engineer to suggest optimizations (e.g., ADS density, AI assistance, offline logic).
4.  **Edit/Merge/Prune**: Identify redundant options or opportunities to combine apps (e.g., merging Resident Portal into Mobile).
5.  **Release Mapping**: Helps select next implementations based on ROI and effort.

## Workflow

1.  **Skills Check**: Load `strategist`, `pro-prd-writer`, and `gf-man`.
2.  **Audit Pulse**: Quickly scan the monorepo apps to understand the current "baseline".
3.  **Ideation Loop**: Propose **3 levels of development**:
    - **Level 1 (Polish)**: Small UX/Performance wins.
    - **Level 2 (Evolution)**: Feature additions (e.g., facial recognition extension).
    - **Level 3 (Revolution)**: New apps or major pivot/merge.
4.  **Capture structured results**:
    - Save to `docs/plan/brainstorming/STRATEGY_<topic>_<slug>.md`.
    - Create/update a section in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
5.  **Formalization**: Use `/idea <topic>` on the most promising result to start the `/plan` cycle.
6.  **Auto-Sync**: `git add .`, `git commit -m "brainstorm(<topic>): update strategic roadmap"`, `git push origin master`.
