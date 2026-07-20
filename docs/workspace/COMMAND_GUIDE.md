# GateFlow — Command Guide

Compact inventory of **GateFlow slash commands**. Canonical workflows live in **`.agents/workflows/`** and sync to Cursor, Claude, Antigravity, Gemini, and Kiro via **`pnpm sync`**.

For lifecycle context see [WORKSPACE_GUIDE.md](./WORKSPACE_GUIDE.md). For skills see [SKILLS_GUIDE.md](./SKILLS_GUIDE.md).

**Not GateFlow:** [`.ai/commands/`](../.ai/commands/) is the Sovereign / AIWF content-factory surface (brand, scrape, etc.) — separate from the phased dev loop below.

---

## Sync model

| Item            | Location                                  |
| --------------- | ----------------------------------------- |
| Source of truth | `.agents/` (same tree as `.antigravity/`) |
| Sync script     | `scripts/ai-sync/sync-ai-tools.sh`        |
| Run sync        | `pnpm sync`                               |
| Watch sync      | `pnpm sync:watch`                         |

After editing workflows, skills, agents, or rules under `.agents/`, run **`pnpm sync`** so all tools match.

---

## Discovery → execution

| Stage          | Command              | Output / effect                               |
| -------------- | -------------------- | --------------------------------------------- |
| Initiative     | `/idea <slug>`       | `docs/development/initiatives/IDEA_<slug>.md` |
| Draft          | `/draft <slug>`      | `docs/plan/Draft/<slug>/DRAFT_<slug>.md`      |
| Handoff prompt | `/prompt <slug>`     | `FOR_PLAN_PROMPT.md`                          |
| Plan           | `/plan <slug>`       | `PLAN_*.md`, `TASKS_*.md`, phase prompts      |
| Ready          | `/plan ready <slug>` | Move Draft → Ready                            |
| Execute phase  | `/dev` or `/dev <n>` | One phase (code, tests, git)                  |
| Execute all    | `/ship <slug>`       | All remaining phases                          |
| Autopilot      | `/ralph`             | Recursive phase loop                          |

Plan folders: `docs/plan/{Draft,Ready,Active,Complete}/`. Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` when moving plans.

---

## Command reference

| Command           | When to use                                                   |
| ----------------- | ------------------------------------------------------------- |
| **`/guide`**      | Router + coach — what to do next; **does not execute phases** |
| **`/dev`**        | Implement exactly one plan phase                              |
| **`/ship`**       | Run full plan via repeated `/dev`-style execution             |
| **`/ralph`**      | Autopilot all remaining phases of active plan                 |
| **`/idea`**       | Capture new initiative                                        |
| **`/draft`**      | Raw planning notes before `/plan`                             |
| **`/prompt`**     | Build `FOR_PLAN_PROMPT.md` for `/plan`                        |
| **`/plan`**       | Generate phased plan + phase prompts                          |
| **`/man`**        | One Man orchestrator (tasks, settings, seven domains)         |
| **`/brainstorm`** | Strategic roadmap / gaps / release ideation                   |
| **`/creative`**   | Creative direction for brand/content                          |
| **`/deploy`**     | Deploy target app(s)                                          |
| **`/docs`**       | Changelog, README, doc sync                                   |
| **`/version`**    | Semver bump and git tags                                      |
| **`/organize`**   | Docs folder cleanup and index                                 |
| **`/clis-team`**  | Multi-CLI team run (seo, refactor, audit)                     |

### `/guide` shorthand

| You type          | Routes to                |
| ----------------- | ------------------------ |
| `/guide ready`    | `/ready`                 |
| `/guide plan X`   | `/plan X`                |
| `/guide phase 2`  | `/prompt phase 2`        |
| `/guide develop`  | develop workflow         |
| `/guide test`     | `pnpm preflight`         |
| `/guide github`   | git add/commit/push flow |
| `/guide security` | security review          |
| `/guide all`      | `/run all`               |

Bare **`/guide`** or **“what should I do now”** loads **`gf-guide`** skill: Situation → Teach → Ask → Action → Motivate, plus Must do / Recommended / Critical.

---

## Subcommand refs

Detailed sub-steps (ready, develop, test, github, …): `.agents/commands-ref/`.

---

## Rules always in effect

- **pnpm only**
- **`organizationId`** on tenant queries; **`deletedAt: null`**
- **QR** payloads HMAC-SHA256 signed
- **CLI 80% rule** — load `cli-limits` before suggesting paid CLIs
- **Cursor is master** — CLIs propose; Cursor applies and verifies (`pnpm preflight`)

---

## Related docs

- [WORKSPACE_GUIDE.md](./WORKSPACE_GUIDE.md) — lifecycle and agents overview
- [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) — skill index
- [GUIDE_PREFERENCES.md](../development/learning/GUIDE_PREFERENCES.md) — how `/guide` adapts to you
- [docs/CLAUDE.md](../CLAUDE.md) — repo mandates for AI assistants
