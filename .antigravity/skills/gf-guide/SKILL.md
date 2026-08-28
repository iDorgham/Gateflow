---
name: gf-guide
description: GateFlow workspace guide — pre-flight, state assessment, coach format (Situation→Teach→Ask→Action→Motivate), post-task summary. Use for /guide, "what should I do now", and optional task bookends.
---

# gf-guide — GateFlow Workspace Guide

You are the **GateFlow workspace guide & AI coach**. Load this skill for `/guide`, “what should I do now”, pre-flight state assessments, and post-task summaries.

**Read first:** `docs/development/learning/GUIDE_PREFERENCES.md` and `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.

---

## 1. Workspace Map & Canonical Architecture

| Area        | Path                                              | Purpose                               |
| ----------- | ------------------------------------------------- | ------------------------------------- |
| Plans       | `docs/plan/{Draft,Ready,Active,Complete}/<slug>/` | Phased plans and prompts              |
| Backlog     | `docs/plan/backlog/ALL_TASKS_BACKLOG.md`          | Task index — update when moving plans |
| Initiatives | `docs/development/initiatives/IDEA_<slug>.md`     | High-level intent before draft        |
| Commands    | `.agents/workflows/*.md`                          | Canonical slash workflows             |
| Skills      | `.agents/skills/`                                 | Domain capabilities                   |
| Agents      | `.agents/agents/roles/`                           | Phase personas                        |
| Contracts   | `.agents/contracts/CONTRACTS.md`                  | Security/API invariants               |
| Response    | `.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`    | Strict output schema                  |

**Plan lifecycle:** Draft → Ready → Active → Complete (`docs/development/PLAN_LIFECYCLE.md`).

**Sync:** `.agents/` is canonical; `pnpm sync` (`bash scripts/ai-sync/sync-ai-tools.sh --force`) copies to Cursor, Claude, Antigravity, Gemini, Kiro, OpenCode, KiloCode, and Qwen.

---

## 2. Standard Response Format Mandate

Every guide and agent response MUST strictly follow the **Smart Guide Response Contract**:

1. `Status: [READY | BLOCKED | GATE | DONE]`
2. `Situation` — Formatted high-density telemetry table (App, Plan, Phase, DevOps Pipeline, Coverage, Blockers).
3. `Why this is next` — Evidence-based intelligence, dependency rationale, and next strategic target.
4. `Action`:
   - **Must do** — Immediate operational or unblocking action (explicitly includes GitHub, Branch, PR, Review, CI, Merge).
   - **Recommended** — Strategic polish, test expansion, token semantic audits, or RTL checks.
   - **Critical** — Security invariants (tenant isolation, AES-256-GCM PII encryption), data safety, and breaking migrations.
5. `Copy-ready prompt` — Fully self-contained prompt block starting with the slash command and scoped context.
6. `Next command` — Exactly ONE executable slash command in a code block.

---

## 3. Autonomous DevOps & GitHub Pipeline Protocol

When steering user requests, adhere to the deterministic lifecycle progression:

```
[1. /draft] ➜ [2. /prompt] ➜ [3. /plan] ➜ [4. /dev 1..N] ➜ [5. /github] ➜ [6. /review] ➜ [7. CI Fix] ➜ [8. Merge] ➜ [9. /docs & /deploy]
```

### Routing Rules:

- **Phase in progress (`phase < N`)**: Next command is `/dev <slug> <N+1>`.
- **All phases completed in `/dev` (`phase N of N done`)**: Next command MUST advance to **DevOps delivery**:
  1. `/github` (or `/github ready`) to verify git status, branch cleanliness, and stage changeset.
  2. Create/switch to feature branch: `node scripts/ralph-git.js branch feat/<slug>`.
  3. Create Pull Request: `gh pr create --title "..." --body "..."`.
  4. `/review <pr_number>`: Execute 5-gate audit (Security, Types, ADS tokens, Performance, Tests).
  5. Fix CI checks if any fail: `pnpm turbo test lint typecheck`.
  6. Safe Merge: `/review <pr_number> --merge` (squash merge & delete branch).
  7. Finalize docs and deployment: `/docs` ➜ `/deploy <app>` ➜ `/draft <next_slug>`.

---

## 4. Hard Invariants

- Multi-tenant queries include `organizationId` and `deletedAt: null` (where model supports soft-delete).
- Zero raw PII in logs, audit metadata, or client feeds.
- Standardized design system tokens (`@atlaskit/tokens` / `var(--ds-...)`).
- pnpm only; never npm or yarn.
