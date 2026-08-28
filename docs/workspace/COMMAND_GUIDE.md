# GateFlow — Command Guide

Compact inventory of **GateFlow slash commands**. Canonical workflows live in **`.agents/workflows/`** and sync to Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, and Kilo CLI via **`pnpm sync`**.

For lifecycle context see [WORKSPACE_GUIDE.md](./WORKSPACE_GUIDE.md). For skills see [SKILLS_GUIDE.md](./SKILLS_GUIDE.md).

**Not GateFlow:** [`.ai/commands/`](../../.ai/commands/) is the Sovereign / AIWF content-factory surface (brand, scrape, etc.) — separate from the phased dev loop below.

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

Workflow v2 adds a single-app pilot gate before this lifecycle. Start with
`/focus status`; use `/audit`, `/progress`, and `/page-map` before `/plan`.
All Workflow v2 responses share the status → evidence → action → copy-ready
prompt → one-next-command contract.

| Stage          | Command               | Output / effect                               |
| -------------- | --------------------- | --------------------------------------------- |
| Initiative     | `/idea <slug>`        | `docs/development/initiatives/IDEA_<slug>.md` |
| Draft          | `/draft <slug>`       | `docs/plan/Draft/<slug>/DRAFT_<slug>.md`      |
| Handoff prompt | `/prompt <slug>`      | `FOR_PLAN_PROMPT.md`                          |
| Plan           | `/plan <slug>`        | `PLAN_*.md`, `TASKS_*.md`, phase prompts      |
| Ready          | `/plan ready <slug>`  | Move Draft → Ready                            |
| Execute phase  | `/dev` or `/dev <n>`  | One phase with focused checks                 |
| Bounded loop   | `/dev loop start …`   | Approved plan phase(s) or task contract       |
| Execute all    | `/ship <slug>`        | All remaining phases                          |
| GitHub stage   | `/github` / `ready`   | Feature branch staging, commit, push, PR list |
| PR & 5-gate    | `/review <pr_number>` | 5-gate audit (Tenant, Types, ADS, CLS, CI)    |
| Safe merge     | `/review --merge`     | Squash merge when CI is 100% green            |
| Docs & Version | `/docs` / `/version`  | Changelog, PRD sync, semantic git tag         |
| Deploy         | `/deploy <app>`       | Production / staging manual dispatch          |

Plan folders: `docs/plan/{Draft,Ready,Active,Complete}/`. Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` when moving plans.

---

## Command reference

| Workflow v2 command                               | When to use                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| `/focus`                                          | Inspect/select the one active pilot app                                   |
| `/audit`                                          | Collect read-only app/page/security/pilot evidence                        |
| `/progress`                                       | Report stage, scores, coverage, blockers, one next command                |
| `/page-map`, `/page`, `/components`, `/usability` | Plan and review focused pages                                             |
| `/check`, `/test`, `/security`                    | Produce deterministic dated evidence                                      |
| `/design`, `/api`, `/database`, `/observe`        | Apply cross-cutting contracts                                             |
| `/github`, `/vercel`, `/release`                  | Inspect readiness; mutations need authorization                           |
| `/github ready`                                   | Generate a head-bound PR and runtime-proof checklist with `pnpm pr:ready` |
| `/pilot`, `/certify`, `/next-app`                 | Orchestrate, certify, and unlock the sequence                             |
| `/dev loop`                                       | Run approved phases/tasks in bounded batches                              |
| `/pilot loop`                                     | Run the bounded controller with pilot gates                               |

| Command           | When to use                                                   |
| ----------------- | ------------------------------------------------------------- |
| **`/guide`**      | Router + coach — what to do next; **does not execute phases** |
| **`/dev`**        | Implement exactly one plan phase                              |
| **`/ship`**       | Run full plan via repeated `/dev`-style execution             |
| **`/ralph`**      | Compatibility alias for bounded local all-phase execution     |
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

| You type          | Routes to                                  |
| ----------------- | ------------------------------------------ |
| `/guide check`    | `/check` (preflight and evidence check)    |
| `/guide plan X`   | `/plan X`                                  |
| `/guide dev X N`  | `/dev X N` (phase execution)               |
| `/guide test`     | `/test` or `pnpm preflight`                |
| `/guide github`   | `/github` flow                             |
| `/guide security` | `/security` review                         |
| `/guide all`      | `/dev ralph` / `/ship` (sequential phases) |

Bare **`/guide`** or **“what should I do now”** loads **`gf-guide`** skill: Situation → Teach → Ask → Action → Motivate, plus Must do / Recommended / Critical.

---

## Conductor Routing Table

| User Intent                      | Command           | Primary Role                | Active Skills (≤ 3)                               |
| :------------------------------- | :---------------- | :-------------------------- | :------------------------------------------------ |
| Workspace guidance / "what next" | `/guide`          | Orchestrator                | `gf-guide`, `cli-limits`                          |
| Implement single phase           | `/dev <slug> <n>` | Domain Role                 | `gf-guide`, `testing`, `<domain>`                 |
| Execute full plan sequentially   | `/ship <slug>`    | Orchestrator                | `gf-guide`, `testing`, `architecture`             |
| Security / Auth / QR review      | `/security`       | `roles/security.md`         | `security`, `qr-crypto`, `data-privacy`           |
| API design & contract review     | `/api`            | `roles/backend-api.md`      | `api`, `api-gateway`, `security`                  |
| Database schema & migrations     | `/database`       | `roles/backend-database.md` | `database`, `prisma-performance`                  |
| UI/UX & Design system tokens     | `/design`         | `roles/frontend.md`         | `ads-foundations`, `ads-data`, `ads-a11y-rtl`     |
| Mobile Expo / Scanner app        | `/pilot` / `/dev` | `roles/mobile.md`           | `mobile`, `expo-mobile-optimization`, `qr-crypto` |
| App audit & score evidence       | `/audit`          | `roles/qa.md`               | `testing`, `workflow-v2-contract`                 |
| Certification receipt creation   | `/certify`        | `roles/qa.md`               | `workflow-v2-contract`, `testing`                 |

---

## Subcommand refs

Detailed sub-steps: `.agents/commands-ref/`.

---

## Rules always in effect

- **pnpm only**
- **`organizationId`** on tenant queries; **`deletedAt: null`** (when model defines `deletedAt`)
- **QR** payloads HMAC-SHA256 signed
- **CLI 80% rule** — load `cli-limits` before suggesting paid CLIs
- **Orchestrator is master** — CLIs propose; the active IDE/orchestrator (usually Cursor) applies and verifies (`pnpm preflight`)

---

## Related docs

- [GOALS.md](./GOALS.md) — strategic pilot roadmap and metrics
- [WORKSPACE_GUIDE.md](./WORKSPACE_GUIDE.md) — lifecycle and agents overview
- [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) — skill index
- [GUIDE_PREFERENCES.md](../development/learning/GUIDE_PREFERENCES.md) — how `/guide` adapts to you
- [docs/CLAUDE.md](../CLAUDE.md) — repo mandates for AI assistants
