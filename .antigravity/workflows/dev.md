---
name: dev
description: Implement one plan phase end-to-end. Resolves plan under Active/Ready/Draft/Complete; moves Ready→Active, last phase→Complete.
---

# /dev — Execute One Phase

Render Workflow v2 responses with
`.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.

## Workflow v2 gate

Run `workflow-v2 status --json` and focused-diff validation before edits. Refuse
any phase outside the focused app. Execute exactly one phase unless the user
explicitly requests Ralph/autopilot. Shared packages may change only when the
phase explains why the focused app requires them. Behavioral work is
test-first. Acquire the single workdir lock, run app-scoped checks, update phase
log/session memory/evidence, release the lock, and transition planned →
developing → checking only through the state CLI. This workflow never commits,
pushes, opens a PR, deploys, or migrates without separate authorization.

Use `/dev` to implement **exactly one** phase from a plan end-to-end: code, tests, and git, following the acceptance criteria in its pro prompt. Respects **plan lifecycle** (`docs/development/PLAN_LIFECYCLE.md`).

## What `/dev` does

- Runs a lightweight internal `/ready` flow:
  - Check `git status` (clean or committed branch).
  - Optionally run `pnpm preflight` when appropriate.
- **Resolves plan location** (first hit wins): `Active/<slug>/`, `Ready/<slug>/`, `Draft/<slug>/`, then `Complete/<slug>/` (read-only unless migrating).
- **Resolves phase prompt** (new folder structure): `phases/NN_<title>/PROMPT_phase_NN.md` OR `phases/NN_<title>/PROMPT_phase_NN_part_a.md`. Falls back to legacy flat `PROMPT_<slug>_phase_N.md`.
- **Parts**: When a phase has multiple parts, execute them as sub-phases and
  checkpoint each part. Commit only when the selected delivery mode and
  `ship-phase` gate authorize it.
- **Lifecycle transitions:**
  - **When starting a phase:** If plan is in `Ready/<slug>/`, move it to `Active/<slug>/` before executing.
  - **When completing intermediate phases (< N):** Update `TASKS_<slug>.md`, write `phase_logs/PHASE_LOG_phase_NN.md`. Next command is `/dev <slug> <N+1>`.
  - **When completing the last phase (N of N):**
    - Move `Active/<slug>/` → `Complete/<slug>/`.
    - Update `TASKS_<slug>.md`, `PLAN_<slug>.md`, and `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
    - **DevOps Transition Protocol**: When all plan phases are finished, **Next command MUST advance to the GitHub & PR review lifecycle**:
      1. `/github` (or `/github ready`) — Verify diff, stage, commit on feature branch, and push.
      2. `/review` — Open PR and run 5-gate audit (Security/Tenant, Types, ADS/RTL, CLS/Perf, CI checks).
      3. **Fix CI** — Inspect `gh pr checks`, resolve any failing jobs.
      4. **Merge** — `/review <pr_number> --merge` — safe merge into master.
      5. **Post-Merge Release** — `/docs` (sync changelog & docs), then `/version`.
      6. **Audit/Certify** — `/audit` or `/certify` with deterministic evidence.
      7. **Deploy** — `/deploy <app>` only after the audit or certification gate passes.
- Determines which phase to execute:
  - Next incomplete phase for the active `PLAN_<slug>.md`, or
  - A specific phase number/slug if provided.
- Reads:
  - `PLAN_<slug>.md` and `phases/NN_<title>/PROMPT_phase_NN.md` (or legacy `PROMPT_<slug>_phase_<N>.md`) from the resolved location
  - Plan folder **`context/`** when the phase touches API, DB, or contracts (`docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`)
  - `docs/development/brainstorming/STRATEGY_<slug>.md` (to ensure vision alignment)
  - Relevant guidelines from `PHASED_DEVELOPMENT_WORKFLOW.md` and `AI_SKILLS_SUBAGENTS_RULES.md`
- Executes the phase by:
  - Adopting the phase's **Primary role** and **Preferred tool**.
  - Following the **Steps** section, invoking subagents when specified.
  - Running checks required by **Acceptance criteria**:
    - `pnpm turbo lint --filter=<workspace>`
    - `pnpm turbo typecheck --filter=<workspace>`
    - `pnpm turbo test --filter=<workspace>` (or `pnpm preflight` when called out)
  - Recording green evidence. Git delivery happens only through the bounded
    loop permissions and ownership-safe delivery skills.

## How to use it

- `/dev` — Execute the next incomplete phase of the active plan.
- `/dev <n>` — Execute phase `<n>` of the active plan.
- `/dev <slug> <n>` — Execute phase `<n>` of `PLAN_<slug>.md`.
- `/dev loop start <slug> --phase=<n> --delivery=local|draft-pr` — start a bounded phase loop.
- `/dev loop task draft|approve ...` — create and approve a durable ad-hoc task contract.
- `/dev loop status|resume|pause|stop|ship-phase` — control the current run.
- `/dev ralph` — compatibility alias for `/dev loop start <slug> --all --delivery=local`.

## Progressive Disclosure — Context Layers

Load context in order. **Stop when you have enough.** Never load L3/L4 unless the phase needs it.

| Layer | File                                                            | Est. Tokens | Load when                        |
| ----- | --------------------------------------------------------------- | ----------- | -------------------------------- |
| L0    | `git log --oneline -3` + phase name                             | ~50         | Always                           |
| L1    | `TASKS_<slug>.md`                                               | ~150        | Always — track progress          |
| L2    | `PLAN_<slug>.md`                                                | ~600        | Always — understand scope        |
| L3    | `phases/.../PROMPT_phase_NN.md`                                 | ~1,200      | When executing a phase           |
| L4    | `CONTEXT_<slug>.md`                                             | ~1,800      | Only when touching DB/types/env  |
| L4b   | `context/database.md`, `context/api.md`, `context/contracts.md` | ~400–800    | When phase touches those layers  |
| L5    | `SESSION_MEMORY.md`                                             | ~400        | Always — cross-session decisions |
| L6    | `phase_logs/PHASE_LOG_phase_NN.md` (prior)                      | ~300        | Before starting phase N if N > 1 |

**Baseline session cost:** L0 + L1 + L2 + L5 ≈ **1,200 tokens**
**Phase execution:** + L3 → ≈ **2,400 tokens**
**Schema/types work:** + L4 → ≈ **4,200 tokens**

> Never pre-load L4 speculatively. If you discover mid-phase that you need schema context, load it then and note it in SESSION_MEMORY.

**Phase log (mandatory):** After each phase, write or update **`phase_logs/PHASE_LOG_phase_NN.md`**: errors, commands, root cause, fix. Link to `docs/development/learning/` if the lesson is global.

---

## Persistent Memory — Session Continuity

Every `/dev` session reads and writes `SESSION_MEMORY.md` in the plan folder. This file survives context resets so a new session can resume instantly.

**At session START (mandatory):**

1. Check `docs/plan/{Active,Complete}/<slug>/SESSION_MEMORY.md`.
2. If it exists: read it first (L5, ~400t) before loading any other file.
3. Apply cross-session decisions, discovered gotchas, and resume-from pointer.
4. If it doesn't exist: create it from `docs/development/plan-templates/SESSION_MEMORY_template.md`.

**At session END (mandatory — after every phase or part):**

Update `SESSION_MEMORY.md` with:

- **Active State** — phase + status + last commit hash + exact next action
- **Cross-Session Decisions** — architectural/tooling decisions made this session
- **Discovered Gotchas** — non-obvious behaviours or deviations found
- **State Handoff** — files modified, test status, blockers, resume-from pointer
- **Context Budget** — which layers (L0–L6) were loaded this session
- **Phase log** — confirm `phase_logs/PHASE_LOG_phase_NN.md` updated for the completed phase

> Template: `docs/development/plan-templates/SESSION_MEMORY_template.md`

---

## Implementation notes (for agents)

- **Skill discovery (mandatory):** Start every `/dev` session by invoking `using-superpowers` — check skills before any response.
- **Persistent memory (mandatory):** Read `SESSION_MEMORY.md` (L5) before anything else. Apply decisions + gotchas. Save it after every phase.
- **Progressive disclosure (mandatory):** Load layers in order (L0→L6 as needed). Show token cost before loading L3 or L4. Never load L4 speculatively.
- **Plan execution discipline:** Invoke `executing-plans` skill at the start. Load plan, review critically, execute in batches of ~3 tasks, report between batches.
- **TDD iron law:** Invoke `test-driven-development` for any behavior-changing code. Write failing test first — no production code without a red test.
- **Debugging:** When a fix attempt fails or cause is unclear, invoke `systematic-debugging`. Find root cause before writing any fix.
- **Verification gate:** Invoke `verification-before-completion` before any completion claim, commit, or PR. Run fresh verification commands; no claims without evidence.
- **Branch completion:** After all acceptance criteria pass, invoke `finishing-a-development-branch` for the git/PR handoff flow.
- **Code review:** After pushing, invoke `requesting-code-review` to dispatch code-reviewer subagent before merge.
- **Multi-task phases:** For phases with 3+ independent sub-tasks, invoke `subagent-driven-development` — fresh subagent per task, two-stage review gate.
- **Parallel failures:** When 2+ unrelated failures exist simultaneously, invoke `dispatching-parallel-agents` — one subagent per independent domain.
- **Isolated work:** For risky or parallel work, invoke `using-git-worktrees` to set up an isolated workspace.
- Treat the phase's **Acceptance criteria** as **hard gates**: do not mark the phase complete until all items pass.
- **Plan lifecycle:** Before starting: if plan is in `Ready/`, move to `Active/`. After completing the **last** phase: move to `Complete/`. Update `TASKS_<slug>.md` and **`phase_logs/PHASE_LOG_phase_NN.md`** in the same folder as the plan.
- Respect the phase's **Preferred tool**:
  - Cursor by default for edits.
  - When **Preferred tool** is **Kiro CLI**, **Kilo CLI**, or **Qwen CLI**: run that CLI with the phase prompt, or use Cursor for edits and that CLI for analysis/review as the phase specifies.
  - Invoke CLIs (Claude, Gemini, OpenCode, Kiro, Kilo, Qwen) when the prompt explicitly calls for that CLI.
- **Limits + permission (mandatory)**:
  - Load `cli-limits` skill and check `CLI_LIMITS_TRACKING.md` before invoking any CLI.
  - **80% rule**: if a CLI is at **80%+** of its limit, **do not use it** unless the user has given explicit permission.
- **Learning (mandatory after CLI usage)**:
  - After any task/phase where a CLI was used, append one entry to `docs/development/learning/CLI_USAGE_AND_RESULTS.md`.
  - Optionally record durable notes in `docs/development/learning/CLI_TOOL_MEMORY.md`.
- Use learning docs after completion:
  - Add any cross-plan patterns/incidents/decisions to `docs/development/learning/{patterns,incidents,decisions}.md` when appropriate.

## Bounded loop controller

The only supported automatic phase loop is
`scripts/workflow-v2/loop-cli.js`. Do not call `scripts/ralph/ralph-git.js`;
it is a legacy utility and does not satisfy Workflow v2 ownership or approval
requirements.

Loop profiles:

- `phase`: a Ready/Active plan phase for the focused application.
- `task`: an approved hash-bound task contract. Workspace tasks cannot edit app
  code; app tasks must target the focused app.
- `pilot`: the phase loop plus page scores, pilot-flow gates, application
  certification, and fixed-sequence next-app behavior.

Loop limits are three tasks per batch and three repair attempts per distinct
failure. Every batch writes an atomic checkpoint under
`.ai/workflow-v2/loops/`.

Delivery boundaries:

- `local`: may create `codex/loop-*` branch/worktree; staging and commit require
  `/dev loop ship-phase` after phase-green evidence.
- `draft-pr`: authorizes focused commits, feature-branch push, draft PR, CI and
  review inspection, and bounded minimal fixes.
- Merge requires approval bound to the current PR head SHA.
- Tag/release requires an approved release plan bound to a target commit.
- Deployment and database migration always require separate explicit commands.

Every loop result reports run, target, batch, work, artifacts, verification,
score/coverage changes when applicable, security/privacy, repair attempts,
branch/PR/CI/release state, readiness, and exactly one next command.
