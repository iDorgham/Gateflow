# PLAN: Workspace AI surface hardening

**Slug:** `workspace_ai_surface_hardening_2026`
**Status:** Draft
**Created:** 2026-08-14
**Target:** Q3 2026
**Primary app:** workspace (`.agents/`, `.ai/`, `scripts/`, `docs/workspace/`) — not an application pilot
**Audit canvas:** Cursor canvas `workspace-ai-surface-audit.canvas.tsx`
**Overall score:** 5.4 / 10

## Overview

GateFlow already has a serious AI operating system: Workflow v2, bounded loops, security contracts, and a large skill/command library. The surface is too large, too duplicated, and mostly **gitignored**, so clones and CI cannot use it. This plan prunes, versions, and unifies skills, agents, subagents, commands, rules, scripts, automations, loops, and goals **without** growing the catalog.

Success: one command universe, executable (not stub) skills, truthful workflow state, tracked canonical config, generated indexes that match disk.

**Do not** treat this as a substitute for scanner Phase 05 / certification. Product P0 stays `scanner_onboarding_session`. Run this plan when the user chooses workspace hardening over the focused app, or after scanner certifies.

## Current scores (14 Aug 2026)

| Surface        | Score / 10 | Count                           | Grade                                               |
| -------------- | ---------- | ------------------------------- | --------------------------------------------------- |
| Scripts        | 7.5        | 76 under `scripts/`             | Keep, dual-loop cleanup                             |
| Rules          | 7.0        | 13 (md + mdc)                   | Core strong; contradictions                         |
| Commands       | 6.5        | 36 registered / 35 workflows    | Collides with `.ai/commands`; orphan `commands-ref` |
| Subcommands    | 6.0        | `/dev` `/pilot` `/man` `/guide` | Powerful, hard to find                              |
| Goals          | 5.5        | 3-app pilot sequence            | State vs filesystem drift                           |
| Role agents    | 5.5        | 14 + 3 scenarios                | Thin but usable                                     |
| Subagents      | 5.0        | 6 prompts                       | Not wired to Task types                             |
| Automations    | 5.0        | 9 GitHub workflows              | `sync-ai-tools` soft-skip                           |
| Skills         | 4.5        | 164 SKILL.md / 165 dirs         | 44% stubs; not in git                               |
| Loops          | 4.0        | 4 overlapping systems           | Ralph vs v2 vs Cursor `/loop`                       |
| v2 specialists | 3.5        | 50 files, mean 14 lines         | Contract stubs                                      |

## Critical (must fix)

1. **Canonical AI config is gitignored** — `.agents`, `.antigravity`, `.cursor`, `.claude`. Clone/CI have no skills, agents, commands, or Cursor rules. `sync-ai-tools` CI soft-skips when `.agents/` is absent.
2. **Two command universes** — GateFlow `.agents/workflows` and Sovereign `.ai/commands` both claim `/guide`, `/dev`, `/plan`, `/audit`.
3. **Stub flood** — 72 skill stubs (0–15 lines) + 49/50 workflow-v2 specialists (mean 14 lines) drown discovery.
4. **Stale Workflow v2 state** — `state.json` lists scanner plan as Ready; filesystem has it in `Active/`; Ready is empty; workdir lock held for phase 05; client-dashboard certified with `pilotFlowCoverage` 0/9 blocked.
5. **Rule contradictions** — `01-gateflow-ai-workflow` still says `/dev ralph` is unbounded autopilot; `ralph.md` is a bounded `/dev loop` alias; always-apply `deletedAt: null` vs models without `deletedAt`; `06-response-format` uses emojis vs `GUIDE_PREFERENCES` / GUIDE_RESPONSE_CONTRACT.
6. **`/guide` routes to unregistered commands** — `/ready`, `/develop`, `/perf`, `/dept`, `/automate`, `/run` exist only in `commands-ref/`, not in `commands.json`.
7. **Sync holes** — `.claude/agents/` is empty; One Man folders (`planning/`, `planned/`, `in-progress/`, `done/`) are documented and unused.

## Architecture

- Keep **`.agents/` → `.antigravity/`** as the only writable canonical tree.
- Track a **versioned slice** (or restore tarball path) so CI and new clones are not empty. `docs/workspace/` stays the human index, generated from disk.
- **GateFlow slash names win.** Sovereign content-factory commands move under `/factory` or `.ai/commands/` without colliding names.
- **One bounded loop:** `scripts/workflow-v2/loop-cli.js`. `pnpm ralph` stays a status dashboard. `/ralph` remains the compatibility alias only.
- **Skills quality bar:** trigger, inputs, method, stop, anti-patterns, and enough procedure to execute (target ≥40 lines unless the skill is a one-screen contract that **links** a full workflow).
- **Agents:** keep role personas for `/dev` phases; keep v2 specialists only where they add a packet/lock contract not already in a skill. Merge the rest.

## Phases

| #   | Phase                                                | Tool   | Status |
| --- | ---------------------------------------------------- | ------ | ------ |
| 0   | Version canonical AI slice + fail-closed sync        | cursor | [ ]    |
| 1   | Quarantine Sovereign command collisions              | cursor | [ ]    |
| 2   | Prune/merge skills, agents, source-command copies    | cursor | [ ]    |
| 3   | Unify loops + reconcile `state.json` / lock          | cursor | [ ]    |
| 4   | Rules: one always-apply core; fix contradictions     | cursor | [ ]    |
| 5   | Generated indexes, skill-quality CI, conductor table | cursor | [ ]    |

### Phase 0 — Version the canonical slice

**Goal:** A fresh clone can load GateFlow commands/skills/rules, or CI fails honestly.

- Decide: (A) stop gitignoring `.antigravity/` (preferred, with secrets still ignored) **or** (B) commit a `docs/workspace/ai-canonical/` mirror and make `pnpm sync` restore `.agents` from it.
- Update `.github/workflows/sync-ai-tools.yml` so missing `.agents/` is a **failure** on main, not a soft-skip, once a restore path exists.
- Document the restore one-liner in `docs/workspace/WORKSPACE_GUIDE.md`.
- Do not commit `.cursor/hooks/state/` or `.ai-memory/`.

**Acceptance:** `git check-ignore .antigravity/skills/gf-guide/SKILL.md` is empty **or** `pnpm sync` recreates it from a tracked path. CI comment explains the chosen model.

### Phase 1 — One command universe

**Goal:** `/guide`, `/dev`, `/plan`, `/audit` have a single definition.

- Inventory `.ai/commands/*.md` vs `.agents/workflows/*.md` name collisions.
- Rename or nest Sovereign factory commands (`/brand`, `/scrape`, `/create`, …) so they cannot override GateFlow workflows after sync.
- Stop `factory/scripts/.../sync_ide_triple_layer.sh` (documented in `.ai/commands/commands.md`) from rsyncing onto `.cursor/commands/` / `.antigravity/`.
- `commands.json` remains the GateFlow registry; add a `conflicts` check script.
- Either register `/ready`, `/develop`, `/perf`, `/dept`, `/automate`, `/run` as aliases of existing workflows, or delete those rows from `/guide` and `commands-ref/`.
- Include `.claude/agents/` in `pnpm sync` (currently empty while `.cursor/agents/` has 69 files).

**Acceptance:** `rg -l '^name: (guide|dev|plan|audit)' .ai/commands .agents/workflows` shows each name in **one** tree only. `pnpm sync --dry-run` does not copy Sovereign files over GateFlow workflows.

### Phase 2 — Prune skills and agents

**Goal:** Discovery load drops; remaining skills are executable.

- Keep Tier 1: `gf-guide`, `cli-limits`, `security`, `api`, `database`, `testing`, `workflow-v2-contract`, bounded-loop delivery skills, domain QR/tenant/auth skills that are **not** 9-line stubs.
- Merge `ads-*` (16) into 2–3 skills (`ads-foundations`, `ads-data`, `ads-a11y-rtl`) with pointers to existing token docs.
- Either delete `source-command-*` (14) or generate them from workflows in `pnpm sync` so they cannot drift.
- Align folder = frontmatter `name` (15+ mismatches: `security`/`gateflow-security`, `api`/`gateflow-api`, `cli-limits`/`gf-cli-limits`, `mcp-guide`/`gf-mcp`, `gf-strategist`/`strategist`, …). Add redirects for legacy `gf-security`, `gf-dev`, `gf-cli-limits`, `gf-mcp` — do not recreate missing `gf-planner` / `gateflow-planner` / `multi-cli-cursor-workflow` unless a real skill is needed.
- Delete empty `one-man-guide`. Add YAML frontmatter to `qr-crypto`. Strip `file://` home paths from `creative-director`. Fix `ui-ux-pro-max` script paths to `.agents/skills/...`.
- Cap workflow-v2 specialists: keep conductor, gatekeepers, and writers that have lock/packet semantics; fold the rest into role agents + skills.
- Subagents: keep `explore` / `shell` / `browser-use`; map Cursor Task types in orchestrator; archive ads/visual-storytelling or fold into creative-director.
- Workflows currently load ~8 skills by name; ~150 skills are discovery-only. After prune, each remaining workflow must list ≤3 skills by **folder** name. Drop GateFlow refs to user-global `using-superpowers` / `executing-plans` or vendor those files into `.agents/skills/`.

**Acceptance:** Skill dirs ≤ 80. Stub share (≤15 lines, no linked workflow) ≤ 15%. Folder equals frontmatter `name`. `SKILLS_GUIDE.md` count matches `ls .agents/skills`. No broken `gf-*` references in rules, contracts, orchestrator, or `cli-limits`.

### Phase 3 — Unify loops and truthfulness

**Goal:** One writer loop; state matches disk.

- Document: `/dev loop` = bounded writer; `/pilot loop` = same + cert gates; `/ralph` = alias; `pnpm ralph` = dashboard only; Cursor `/loop` = session wake, not GateFlow.
- Reconcile `.ai/workflow-v2/state.json` with `docs/plan/{Active,Ready}` (scanner is Active, not Ready).
- Release or confirm workdir lock `cursor-dev-scanner-onboarding-20260814`.
- Fix certified-app coverage lies (client-dashboard 0/9 blocked vs `certified`) or downgrade stage until evidence is fresh.
- Move completed Draft plans (`client_dashboard_readiness_2026`, `repo_hygiene`) to Complete if they are done; keep security drafts explicit.

**Acceptance:** `pnpm workflow:v2:guide --json` `currentPlan` path exists on disk. Ready/Active counts match folders. Lock is held only by a live session.

### Phase 4 — Rules

**Goal:** Small always-on core; no contradictions.

- Always-apply: `00-gateflow-core` only (pnpm, tenant, QR, tokens, secrets). Soft-delete wording: “filter `deletedAt: null` **when the model has `deletedAt`**.”
- Requestable: guide, CLI limits, Cursor-master, CLI learning, adversarial review.
- Delete duplicate `.md` copies if `.mdc` is the Cursor source (keep one format in canonical tree).
- Rewrite `01-gateflow-ai-workflow` `/dev ralph` line to match `ralph.md`.
- Rewrite `06-response-format` to match `GUIDE_RESPONSE_CONTRACT.md` (no emoji banners).

**Acceptance:** Always-apply rule count ≤ 2. `rg 'autopilot|✅|deletedAt' .agents/rules .cursor/rules` shows aligned text.

### Phase 5 — Indexes, CI, conductor

**Goal:** Docs and routing cannot drift from disk.

- Generate `docs/workspace/SKILLS_GUIDE.md` and command tables from frontmatter + `commands.json`.
- Add `scripts/check/check-ai-surface.js`: missing SKILL.md, name mismatch, stub without `run:` workflow link, command collision, broken skill refs.
- Add a one-page conductor routing table: intent → command → agent → skills (max 3).
- Add `docs/workspace/GOALS.md`: pilot sequence, current focused app, workspace hardening status.

**Acceptance:** `pnpm docs:workspace:check` (or equivalent) fails on stub flood / collisions. `/guide` can point at GOALS.md.

## Technical constraints

- pnpm only. Do not add `ai:sync` / `ai:check` to root `package.json` (keep in template-project if needed; root already has `pnpm sync`).
- Do not edit scanner app code in this plan.
- Do not commit secrets, `.env`, or hook state under `.cursor/hooks/state/`.
- After moving this plan Draft → Ready → Active, update `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.

## Risks

| Risk                                         | Mitigation                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| Pruning deletes a skill someone still loads  | Archive to `.agents/skills/_archive/` for one release; generate redirect map |
| Tracking `.antigravity` bloated git          | Track skills/workflows/agents/rules only; ignore DS_Store, hooks state       |
| Sovereign factory still needed for marketing | Keep under `/factory` prefix, not GateFlow names                             |
| State reconcile during live scanner lock     | Phase 3 requires user confirm before releasing lock                          |

## Out of scope

- New skills, agents, or slash commands except the quality-check script and GOALS.md
- Product features, scanner UI, or recertifying apps
- Enabling paid CLIs (80% rule still applies)
