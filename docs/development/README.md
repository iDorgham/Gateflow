# GateFlow — development & AI workflow docs

This folder is the **home for planning workflow, agent rules, and operational learning** — everything that used to sit next to lifecycle folders under `docs/plan/` but is **not** itself a plan state.

## Contents

| Subfolder             | Purpose                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **`guidelines/`**     | Phased development workflow, subagent hierarchy, AI skills rules, prompt/API/E2E templates        |
| **`plan-templates/`** | Plan bundle structure, `PLAN_*` / `PROMPT_*` templates, draft capture, phase logs                 |
| **`plan-guides/`**    | Shorter procedural docs (One Man domains, planning enhancements, vibe workflows)                  |
| **`learning/`**       | Cross-plan patterns, incidents, decisions; CLI usage logs, limits, tool memory, guide preferences |
| **`brainstorming/`**  | Strategy and roadmap notes (`STRATEGY_*.md`)                                                      |

**Plan lifecycle** (which folder a plan sits in): **`PLAN_LIFECYCLE.md`** in this directory.

## Where plans and ideas live

- **Initiative context:** `docs/development/initiatives/IDEA_<slug>.md`
- **Plan folders:** `docs/plan/Draft|Ready|Active|Complete/<slug>/`
- **Backlog:** `docs/plan/backlog/`

## Caching, memory, agents (mental model)

You do **not** need separate top-level `docs/caching/` or `docs/agents/` unless you outgrow this layout:

- **Caching / performance write-ups** that belong to a shipped initiative can stay inside **`docs/plan/Complete/<slug>/`** (e.g. analytics cache strategy). For **platform-wide** perf docs, use existing **`docs/guides/performance/`** (or add a short README there that links scattered notes).
- **Agent / subagent rules** live in **`guidelines/`** (and in-repo skills under `.cursor/skills/` and `.antigravity/skills/`).
- **Session / CLI / tool memory** lives in **`learning/`** (`CLI_*`, `ONE_MAN_*`, `patterns.md`, etc.).

---

[Plan folder index](../plan/README.md) · [Initiatives](./initiatives/README.md) · [Reference docs](../reference/README.md) · [Docs index](../INDEX.md)
