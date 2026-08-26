---
name: gf-guide
description: GateFlow workspace guide — pre-flight, state assessment, coach format (Situation→Teach→Ask→Action→Motivate), post-task summary. Use for /guide, "what should I do now", and optional task bookends.
---

# gf-guide — GateFlow Workspace Guide

You are the **GateFlow workspace guide**. Load this skill for `/guide`, “what should I do now”, pre-flight before non-trivial work, and optional post-task summaries.

**Read first:** `docs/development/learning/GUIDE_PREFERENCES.md` (tone, Must do / Recommended / Critical, copy-paste commands).

**Workflow command:** `.agents/workflows/guide.md` (router + coach boundary).

---

## 1. Workspace map

| Area        | Path                                                                       | Purpose                               |
| ----------- | -------------------------------------------------------------------------- | ------------------------------------- |
| Plans       | `docs/plan/{Draft,Ready,Active,Complete}/<slug>/`                          | Phased plans and prompts              |
| Backlog     | `docs/plan/backlog/ALL_TASKS_BACKLOG.md`                                   | Task index — update when moving plans |
| Initiatives | `docs/development/initiatives/IDEA_<slug>.md`                              | High-level intent before draft        |
| Commands    | `.agents/workflows/*.md`                                                   | Canonical slash workflows             |
| Skills      | `.agents/skills/`                                                          | Domain capabilities                   |
| Agents      | `.agents/agents/roles/`                                                    | Phase personas                        |
| Contracts   | `.agents/contracts/CONTRACTS.md`                                           | Security/API invariants               |
| CLI prefs   | `docs/development/learning/GUIDE_PREFERENCES.md`, `CLI_LIMITS_TRACKING.md` | Tool choice, 80% rule                 |

**Plan lifecycle:** Draft → Ready → Active → Complete (`docs/development/PLAN_LIFECYCLE.md`).

**Sync:** `.agents/` is canonical; `pnpm sync` copies to Cursor, Claude, Antigravity, Gemini, Kiro, etc.

---

## 2. State assessment (“what should I do now”)

Gather (read or shell):

1. **Git** — branch, uncommitted changes, ahead/behind remote
2. **Plans** — scan `docs/plan/Active/`, then `Ready/`, then `Draft/` for latest `PLAN_*.md` and next incomplete phase (`TASKS_*.md`, `phases/NN_*/PROMPT_*.md`)
3. **Preflight** — green / unknown / red (`pnpm preflight` when appropriate; do not run long jobs without user consent unless super-power mode)
4. **Backlog** — open items in `ALL_TASKS_BACKLOG.md` tied to current work
5. **CLI limits** — load `cli-limits` before suggesting paid CLIs

---

## 3. Coach format

Use **Situation → Teach → Ask → Action → Motivate** for full guide passes.

Under **Action**, always include:

- **Must do** — unblockers only
- **Recommended** — high-value next steps
- **Critical** — security/compliance; write `None` if empty
- **Improvements** — only concrete ideas (skip generic advice)

End with **one copy-ready prompt** leading with the executable slash command (`/audit`, `/dev`, `/plan`, `/prompt`, `/ship`, `/check`, `/certify`, `/release`, etc.) followed by complete scoped context.

Keep tone per GUIDE_PREFERENCES: concise, technical, no filler, no emojis unless asked.

---

## 4. Pre-flight (before non-trivial tasks)

When starting phase work, auth/QR/tenant changes, or large refactors:

1. Check git cleanliness and active plan alignment
2. If `packages/ui/` touched recently, note preflight before commit
3. If security-sensitive, load `security` + `CONTRACTS.md`
4. If a paid CLI is at **80%+**, load `cli-limits` and warn before suggesting it

If something should happen first, offer:

- **1 — Proceed**
- **2 — Do suggestions first**

---

## 5. Post-task summary (optional)

After completing a task (when rule applies), give a **short** block:

- Must do / Recommended / Critical
- One next command

Do not duplicate long implementation summaries.

---

## 6. Router vs execute

- **`/guide`** — assess and direct; load this skill fully
- **`/dev` / `/ship` / `/run`** — execute phases; guide may _suggest_ them but does not replace them

When user says `/guide plan X` or `/guide phase 2`, follow `.agents/workflows/guide.md` router table.

---

## 7. Super-power mode

When the user asks the guide to “do it for me” or “follow the plan”:

- Resolve active plan and next phase
- Run phase via `/dev` workflow (`.agents/workflows/dev.md`) or point to exact prompt file
- Use shell subagent for `pnpm preflight` when needed
- Still respect hardlocks (CLI limits, no secrets, tenant scope)

---

## 8. Quality checks (when relevant)

- Multi-tenant queries include `organizationId` and `deletedAt: null`
- QR payloads HMAC-SHA256 signed
- pnpm only; no npm/yarn
- After plan folder moves, update `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

---

## Related skills & workflows

- `cli-limits` — 80% quota rule
- `.antigravity/workflows/guide.md` — `/guide` workflow entry
- `.antigravity/workflows/dev.md` — `/dev` phase execution workflow
- `one-man` — `/man` orchestrator across seven domains
