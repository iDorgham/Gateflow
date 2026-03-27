---
name: dev
description: Implement a single plan phase end-to-end (code, tests, git) using the corresponding PROMPT_<slug>_phase_<N>.md. Moves plan to in-progress/ when starting, to done/ when last phase completes.
---

# /dev — Execute One Phase

Use `/dev` to implement **exactly one** phase from a plan end-to-end: code, tests, and git, following the acceptance criteria in its pro prompt. Respects **plan lifecycle** (`docs/plan/PLAN_LIFECYCLE.md`).

## What `/dev` does

- Runs a lightweight internal `/ready` flow:
  - Check `git status` (clean or committed branch).
  - Optionally run `pnpm preflight` when appropriate.
- **Resolves plan location**: check `in-progress/<slug>/`, `planned/<slug>/`, `planning/<slug>/`, then legacy `execution/`.
- **Resolves phase prompt** (new folder structure): `phases/NN_<title>/PROMPT_phase_NN.md` OR `phases/NN_<title>/PROMPT_phase_NN_part_a.md`. Falls back to legacy flat `PROMPT_<slug>_phase_N.md`.
- **Parts**: When a phase has multiple parts, executes each part in sequence as sub-phases. Each part gets its own commit. Updates `TASKS_<slug>.md` per part.
- **Lifecycle transitions:**
  - **When starting a phase:** If plan is in `planned/<slug>/`, move it to `in-progress/<slug>/` before executing.
  - **When completing the last phase:** Move `in-progress/<slug>/` → `done/<slug>/`.
- Determines which phase to execute:
  - Next incomplete phase for the active `PLAN_<slug>.md`, or
  - A specific phase number/slug if provided.
- Reads:
  - `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` from the resolved location
  - `docs/plan/brainstorming/STRATEGY_<slug>.md` (to ensure vision alignment)
  - Relevant guidelines from `PHASED_DEVELOPMENT_WORKFLOW.md` and `AI_SKILLS_SUBAGENTS_RULES.md`
- Executes the phase by:
  - Adopting the phase's **Primary role** and **Preferred tool**.
  - Following the **Steps** section, invoking subagents when specified.
  - Running checks required by **Acceptance criteria**:
    - `pnpm turbo lint --filter=<workspace>`
    - `pnpm turbo typecheck --filter=<workspace>`
    - `pnpm turbo test --filter=<workspace>` (or `pnpm preflight` when called out)
  - Using the internal `/github` flow to add, commit, pull (rebase), and push when the phase is green.

## How to use it

- `/dev` — Execute the next incomplete phase of the active plan.
- `/dev <n>` — Execute phase `<n>` of the active plan.
- `/dev <slug> <n>` — Execute phase `<n>` of `PLAN_<slug>.md`.
- `/dev ralph` — Recursive autopilot: implement current phase AND auto-start subsequent phases until the plan is complete.

## Progressive Disclosure — Context Layers

Load context in order. **Stop when you have enough.** Never load L3/L4 unless the phase needs it.

| Layer | File | Est. Tokens | Load when |
| ----- | ---- | ----------- | --------- |
| L0 | `git log --oneline -3` + phase name | ~50 | Always |
| L1 | `TASKS_<slug>.md` | ~150 | Always — track progress |
| L2 | `PLAN_<slug>.md` | ~600 | Always — understand scope |
| L3 | `PROMPT_phase_N.md` | ~1,200 | When executing a phase |
| L4 | `CONTEXT_<slug>.md` | ~1,800 | Only when touching DB/types/env |
| L5 | `SESSION_MEMORY.md` | ~400 | Always — cross-session decisions |

**Baseline session cost:** L0 + L1 + L2 + L5 ≈ **1,200 tokens**
**Phase execution:** + L3 → ≈ **2,400 tokens**
**Schema/types work:** + L4 → ≈ **4,200 tokens**

> Never pre-load L4 speculatively. If you discover mid-phase that you need schema context, load it then and note it in SESSION_MEMORY.

---

## Persistent Memory — Session Continuity

Every `/dev` session reads and writes `SESSION_MEMORY.md` in the plan folder. This file survives context resets so a new session can resume instantly.

**At session START (mandatory):**

1. Check `docs/plan/{in-progress,done}/<slug>/SESSION_MEMORY.md`.
2. If it exists: read it first (L5, ~400t) before loading any other file.
3. Apply cross-session decisions, discovered gotchas, and resume-from pointer.
4. If it doesn't exist: create it from `docs/plan/templates/SESSION_MEMORY_template.md`.

**At session END (mandatory — after every phase or part):**

Update `SESSION_MEMORY.md` with:

- **Active State** — phase + status + last commit hash + exact next action
- **Cross-Session Decisions** — architectural/tooling decisions made this session
- **Discovered Gotchas** — non-obvious behaviours or deviations found
- **State Handoff** — files modified, test status, blockers, resume-from pointer
- **Context Budget** — which layers (L0–L5) were loaded this session

> Template: `docs/plan/templates/SESSION_MEMORY_template.md`

---

## Implementation notes (for agents)

- **Skill discovery (mandatory):** Start every `/dev` session by invoking `using-superpowers` — check skills before any response.
- **Persistent memory (mandatory):** Read `SESSION_MEMORY.md` (L5) before anything else. Apply decisions + gotchas. Save it after every phase.
- **Progressive disclosure (mandatory):** Load layers L0→L5 in order. Show token cost before loading L3 or L4. Never load L4 speculatively.
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
- **Plan lifecycle:** Before starting: if plan is in `planned/`, move to `in-progress/`. After completing the **last** phase: move to `done/`. Update `TASKS_<slug>.md` in the same location as the plan.
- Respect the phase's **Preferred tool**:
  - Cursor by default for edits.
  - When **Preferred tool** is **Kiro CLI**, **Kilo CLI**, or **Qwen CLI**: run that CLI with the phase prompt, or use Cursor for edits and that CLI for analysis/review as the phase specifies.
  - Invoke CLIs (Claude, Gemini, OpenCode, Kiro, Kilo, Qwen) when the prompt explicitly calls for that CLI.
- **Limits + permission (mandatory)**:
  - Load `cli-limits` skill and check `CLI_LIMITS_TRACKING.md` before invoking any CLI.
  - **80% rule**: if a CLI is at **80%+** of its limit, **do not use it** unless the user has given explicit permission.
- **Learning (mandatory after CLI usage)**:
  - After any task/phase where a CLI was used, append one entry to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
  - Optionally record durable notes in `docs/plan/learning/CLI_TOOL_MEMORY.md`.
- Use learning docs after completion:
  - Add any cross-plan patterns/incidents/decisions to `docs/plan/learning/{patterns,incidents,decisions}.md` when appropriate.

## Ralph Loop (Automated Phase Execution)

1. **Preflight** — Run `/ready`.
1.5. **Load Session Memory** — Read `SESSION_MEMORY.md` (L5, ~400t). Apply cross-session decisions + gotchas. If none exists, create from template.
2. **Select phase**: Next incomplete phase from the active plan.
3. **Worktree isolation** — If phase is risky or parallel, invoke `using-git-worktrees`.
4. **Automated Branching** — Run `node scripts/ralph-git.js branch <slug> <N>`.
5. **Load prompt** — Open Phase Prompt. Invoke `executing-plans` skill.
6. **Recursive Implementation (Ralph Loop)**:
   - **Step 0: Branch Initialization**: Run `node scripts/ralph-git.js branch <slug> <N>`.
   - **Step A: TDD first**: Invoke `test-driven-development` — write failing test, then implement. No production code before red test.
   - **Step B: Implement**: Write code following the prompt.
   - **Step C: Aggressive Enforce**:
     - Run `node scripts/enforce-ads-design.js`.
     - Run `node scripts/enforce-security-invariants.js`.
     - **UI/UX Audit**: If UI task, check against `ui-ux-pro-max` checklist.
     - Run `pnpm preflight`.
   - **Step D: Self-Correction**: If any check fails, invoke `systematic-debugging` (find root cause, no guess fixes). **Jump to Step C**.
   - **Step E: Completion**: Invoke `verification-before-completion` — run all checks fresh, provide evidence, only then claim done.
7. **Parallel failures**: If 2+ independent failures exist → invoke `dispatching-parallel-agents`.
8. **Automated Versioning (Auto-Sync Mandate)**:
   - Once all criteria pass: Run `node scripts/ralph-git.js commit <slug> <N>` then `node scripts/ralph-git.js tag <slug> <N> stable`.
9. **Branch completion & PR / Merge**:
   - If not the last phase: Push branch via `git push origin head`.
   - **If the last phase in the plan**: Run `node scripts/ralph-git.js merge <slug> <N>` to merge into master and push.
   - Status Update: Mark the phase as "Completed" in `PLAN_<slug>.md` and `TASKS_<slug>.md`.
10. **Save Session Memory**: Update `SESSION_MEMORY.md`: phase + status, last commit hash, decisions made, gotchas, files modified, test status, exact next action (or "all phases complete").
8. **Inject Next Prompt / Autopilot**:
   - Analyze plan for the next task.
   - **Output the full `/dev` prompt** for the next phase.
   - **Autopilot Trigger**: Proactively offer to start the next phase immediately: "Phase N+1 prompt is ready. Should I proceed with `/dev <slug> <N+1>` now?"
