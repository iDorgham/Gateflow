# Gemini CLI — Project Instructions (GEMINI.md)

This file defines the foundational mandates and custom commands for Gemini CLI in the **GateFlow** workspace. These instructions take absolute precedence over general workflows.

---

## custom Commands

Gemini CLI supports the following slash commands by following the workflows defined in `.claude/commands/` and `docs/plan/`:

### `/idea [<slug>]`
**Purpose:** Capture and refine initiatives into `IDEA_<slug>.md` and backlog entries.
- **Workflow:** 
  1. Load `docs/CLAUDE.md`, `docs/PRD_v7.0.md`, and `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
  2. Conversationally refine goals, constraints, and scope.
  3. Write/update `docs/plan/context/IDEA_<slug>.md`.
  4. Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.

### `/plan [<slug>]`
**Purpose:** Turn an IDEA into a phased `PLAN_<slug>.md` and per-phase `PROMPT_<slug>_phase_<N>.md` prompts.
- **Workflow:**
  1. Read `docs/plan/context/IDEA_<slug>.md`.
  2. Create/update `docs/plan/execution/PLAN_<slug>.md` with ordered phases.
  3. Generate `docs/plan/execution/PROMPT_<slug>_phase_<N>.md` using the template in `docs/plan/guidelines/TEMPLATE_PROMPT_phase.md`.
  4. Ensure each phase has **Acceptance Criteria** (lint, typecheck, tests).

### `/dev [<slug>] [<n>]`
**Purpose:** Implement exactly one phase from a plan end-to-end.
- **Workflow:**
  1. **Preflight:** Run `pnpm preflight` (or specific lint/test/typecheck) to ensure a clean state.
  2. **Load Prompt:** Read `docs/plan/execution/PROMPT_<slug>_phase_<n>.md`.
  3. **Implement:** Follow the "Steps" in the prompt.
  4. **Verify:** Run the acceptance criteria (lint, typecheck, tests).
  5. **Git:** Commit and push the phase changes (if requested).

### `/man [<subcommand>]`
**Purpose:** High-level orchestrator for seven domains (Code, Brand, SaaS, Marketing, Business, Content, Copywrite).
- **Subcommands:**
  - `tasks`: Manage backlog, planning, planned, in-progress, done.
  - `settings`: Interactive wizard for GitHub, MCPs, skills.
  - `mindset`: Change profile/domain.
  - `run`/`go`: Execute the next step in the current domain.
  - `ship <slug>`: Ship a plan to completion.
- **Workflow:**
  1. Load `.cursor/skills/one-man/SKILL.md`.
  2. Scan project state (backlog, git, plans).
  3. Execute based on the subcommand or recommend the next action.

### `/ship [<slug>]`
**Purpose:** Execute all remaining phases of a plan sequentially.
- **Workflow:**
  1. Iterate through phases from current to $N$.
  2. For each phase, run the `/dev` workflow.
  3. **Stop on failure:** Do not move to the next phase until the current one is green.

### `/clis team <name>`
**Purpose:** Run a predefined CLI team workflow (`seo`, `refactor`, `audit`).
- **Workflow:**
  1. Load `docs/plan/learning/CLI_TEAMS.md` for the team roster and steps.
  2. Execute each step, acting as the designated CLI or coordinating output.
  3. Apply and verify results using `pnpm preflight`.

### `/guide`
**Purpose:** Provide next steps and recommended actions.
- **Workflow:**
  1. Read `docs/plan/learning/GUIDE_PREFERENCES.md` for tone and priorities.
  2. Assess git state and plan status.
  3. Report: **Must do**, **Recommended**, **Critical**, **Improvements**.

---

## Operational Mandates

1. **Planning Mode:** Always use `enter_plan_mode` for `/idea`, `/plan`, and before starting a `/ship` run.
2. **Context First:** Always read `docs/CLAUDE.md` and the active `PLAN_<slug>.md` at the start of a session.
3. **80% Rule:** Check `docs/plan/learning/CLI_LIMITS_TRACKING.md` (if it exists) before suggesting or using high-usage CLIs.
4. **Learning Log:** After completing a phase or major task, append an entry to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
5. **Pnpm Only:** Never use `npm` or `yarn`. Always use `pnpm` for commands.
6. **Multi-tenancy:** Ensure every DB query includes `organizationId` and `deletedAt: null`.

---

## Reference Docs
- `docs/CLAUDE.md`: Core project overview and commands.
- `docs/plan/learning/GUIDE_PREFERENCES.md`: User-specific AI interaction preferences.
- `docs/plan/execution/PROMPTS_REFERENCE.md`: Professional prompt templates.
