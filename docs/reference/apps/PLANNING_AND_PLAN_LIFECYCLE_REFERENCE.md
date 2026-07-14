# Planning and Plan Lifecycle Reference (Ultra Comprehensive)

Use this document as the canonical planning context pack for AI-assisted execution in GateFlow.

## Coverage Status

- Covers planning lifecycle states, movement rules, and folder structure.
- Covers planning commands (`pnpm plan:*`, `/plan`, `/dev`, `/guide`) and when to use each.
- Covers planning-agent/skill orchestration patterns as encoded in workflow docs.
- Includes the **current live plan inventory** from `docs/plan/Active`, `docs/plan/Ready`, and `docs/plan/Complete`.
- Includes practical checklists, anti-patterns, and context-loading strategy for reliable phase execution.

## 1) Planning System at a Glance

GateFlow planning is a lifecycle-driven system with explicit plan states and deterministic transitions.

- Plan root: `docs/plan/`
- Lifecycle folders: `Draft/` -> `Ready/` -> `Active/` -> `Complete/`
- Backlog source: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- Canonical lifecycle doc: `docs/development/PLAN_LIFECYCLE.md`
- Canonical folder-shape doc: `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`

Primary goal: plans are executable artifacts, not notes. A plan must be structured to run phase-by-phase with verifiable acceptance criteria.

## 2) Lifecycle States and Transitions

### States

- `Draft`: plan is being authored/refined.
- `Ready`: approved and queued for implementation.
- `Active`: currently being executed.
- `Complete`: shipped or archived.

### Transitions

- `Draft -> Ready`: via `pnpm plan:ready <slug>` (or `/plan ready <slug>` in slash-command workflow).
- `Ready -> Active`: via `pnpm plan:start <slug>` or implicitly when `/dev` begins execution for a Ready plan.
- `Active -> Complete`: via `pnpm plan:done <slug>` or implicitly when final phase is completed by the phase runner.
- Manual override: `pnpm plan:move <slug> <from> <to>` equivalent through `ralph-plan.js move`.

### Operational Rules

- Move the **entire plan folder** as a unit (never move only files).
- Keep plan-local assets together during transitions:
  - `PLAN_<slug>.md`
  - `TASKS_<slug>.md`
  - `CONTEXT_<slug>.md`
  - `context/`
  - `phase_logs/`
  - `phases/`
  - `assets/`
- Legacy flat prompt files may exist in old plans, but new plans should use `phases/NN_<phase-title>/`.

## 3) Canonical Plan Folder Structure

Expected shape for modern plans:

- `PLAN_<slug>.md`: master scope, phase table, dependencies.
- `TASKS_<slug>.md`: execution checklist.
- `PLAN_FEEDBACK.md`: plan-level improvement and tooling notes.
- `CONTEXT_<slug>.md`: frozen high-value context snapshot.
- `SESSION_MEMORY.md`: cross-session continuity.
- `context/`: focused references (`api.md`, `database.md`, `contracts.md`, `design.md`, `structure.md`, `documentation.md`).
- `phase_logs/`: per-phase log files (`PHASE_LOG_phase_NN.md`).
- `phases/NN_<title>/`: phase prompt(s) and optional `files/` scaffolds.
- `assets/`: ADRs and architecture notes.

For exact structure and responsibilities, use:

- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`

## 4) Planning Commands (CLI + Slash)

### A. Core pnpm lifecycle commands

- `pnpm plan:new <slug> [--phases N] [--title "..."]`
  - Creates plan in Draft, seeds PLAN + prompts.
- `pnpm plan:ready <slug>`
  - Moves `Draft -> Ready`.
- `pnpm plan:start <slug>`
  - Moves plan to Active and triggers docs hook (`on-plan-start`).
- `pnpm plan:run <slug> <phase|--next|--all>`
  - Executes phase prompt(s) through configured tool mapping.
- `pnpm plan:done <slug>`
  - Moves plan to Complete, triggers docs hook (`on-plan-done`), attempts PR creation.
- `pnpm plan:status`
  - Prints grouped status and progress bars across states.
- `pnpm plan:pr <slug>`
  - Manually generate PR body/title from plan completion state.

### B. Slash planning workflow

- `/draft <slug>`: quick draft capture.
- `/prompt <slug>`: create planning handoff prompt.
- `/plan <slug>`: build full phased plan package.
- `/plan ready <slug>`: promote for execution.
- `/dev`: execute one phase end-to-end.
- `/dev ralph`: recursive/autopilot multi-phase run.
- `/guide`: route to proper command based on intent.

## 5) `/dev` Execution Model (Phase Engine)

`/dev` is the core implementation executor and contains the strongest planning/runtime contract.

- Resolves plan by state order: `Active`, then `Ready`, then `Draft`, then `Complete`.
- If target plan is in Ready, moves it to Active before implementation.
- Resolves phase prompt (preferred modern structure first, legacy fallback second).
- Supports phase split parts (`part_a`, `part_b`, etc.) and sequential execution.
- Updates plan progress and task status after phase completion.
- Moves plan to Complete when final phase finishes.

### Mandatory execution discipline in `/dev` documentation

- Progressive context loading (L0..L6) to control token budget.
- Session continuity via `SESSION_MEMORY.md` at start and end.
- Mandatory phase logging under `phase_logs/`.
- Verification gates before completion claims.
- TDD and debugging discipline for behavior-changing or failing work.

## 6) Planning Agents, Skills, and Roles

Planning in this workspace is not a single-agent behavior; it is role-driven orchestration.

### Planning-role model

- Primary role per phase should be explicit (examples: backend, frontend, security).
- Preferred tool per phase should be declared in phase prompts.
- Skill and subagent usage should be explicit, not implicit.

### Skill/agent orchestration expectations (as documented in workflow files)

- Planning and execution should invoke the appropriate planning/execution skills first.
- Security-sensitive work should include security-oriented role/validation layers.
- Multi-domain phases should split responsibilities rather than overloading one prompt.
- Post-phase verification is non-optional before phase closeout.

### Guide-level orchestration

`/guide` maps user intent to the correct command family:

- Planning requests -> `/plan`
- Phase prompt extraction -> `/prompt`
- Implementation -> `/develop` or `/dev`
- Validation -> `/test` and preflight flow
- Git handoff -> `/github`

## 7) Plan Prompt Design (What Makes a Phase Runnable)

A good phase prompt should contain:

- Primary role
- Preferred tool(s)
- Context constraints (tenancy, soft-delete, security invariants)
- Clear "in scope" vs "out of scope"
- Ordered implementation steps
- Acceptance criteria with explicit checks

Recommended prompt quality traits:

- One concern per phase (or deliberate part split)
- Minimal ambiguity in deliverables
- Explicit verification commands
- Explicit artifact updates (`TASKS`, `phase log`, `SESSION_MEMORY`)

## 8) Plan Structure Quality Gates

A plan is considered execution-ready when all are true:

- `PLAN_<slug>.md` has complete phase table and realistic dependencies.
- Every phase has a runnable prompt file.
- `TASKS_<slug>.md` matches phase granularity.
- `CONTEXT_<slug>.md` is present when DB/contracts/env are relevant.
- `phase_logs/README.md` and logging convention are in place.
- Lifecycle location is correct (`Ready` for queued work, `Active` for in-flight).

## 9) Live Inventory: Done, Ready, Active

Snapshot based on current `docs/plan` directory contents.

### Draft

- No `docs/plan/Draft` folder currently present.

### Active (1)

- `admin_dashboard_redesign`

### Ready (3)

- `gateflow_design_system`
- `resident_portal_responsive`
- `scanner_onboarding_session`

### Complete (47 entries)

- `PLAN_projects_crm_ui.md` (legacy/special artifact under Complete root)
- `admin_dashboard_completion_v6`
- `admin_dashboard_redesign`
- `admin_dashboard_v6`
- `admin_emulation_hub`
- `advanced_seeding_emulation_v3`
- `ai_assistant_v2`
- `ai_sdk_v6_migration`
- `analytics_dashboard`
- `analytics_pdf_export`
- `analytics_rebuild`
- `atlassian_ui_remake`
- `autonomous_ops_intelligence`
- `client_dashboard_ui_refine`
- `client_dashboard_v10_redesign`
- `core_security_v6`
- `crm_followups`
- `dashboard_polish`
- `docs_v2_refresh`
- `docs_workspace_template_cursor_bootstrap`
- `domain_migration_2026`
- `gateai`
- `gateai_hub_v2`
- `gateflow_v9_autonomy`
- `github_security_hardening`
- `maintenance_management`
- `marketing_growth_engine_q3_2026`
- `marketing_suite`
- `marketing_website`
- `org_types_dashboard`
- `pagespeed_100`
- `platform_evolution`
- `project_dashboard`
- `projects_crm`
- `projects_crm_ui`
- `qr_create_wizard`
- `ralph_plan_status_fix`
- `real_estate_palette`
- `realtime_updates`
- `resident_mobile`
- `resident_mobile_one_tap`
- `resident_portal`
- `residents_analytics`
- `security_isolation_fix`
- `settings_v6`
- `team_page`
- `token_system_v2`
- `watchlist_ui`

## 10) Backlog vs Lifecycle Reality

`ALL_TASKS_BACKLOG.md` is a strategic tracking view, while `docs/plan/{Active,Ready,Complete}` is the operational source of truth for state.

- Use lifecycle folders to determine current executable status.
- Use backlog for initiative-level narrative and roadmap reporting.
- If mismatch appears, reconcile backlog entries to folder reality.

## 11) Planning Workflow (Recommended End-to-End)

1. Capture intent in `IDEA_<slug>.md` if needed.
2. Build Draft plan package with clear phases and prompts.
3. Validate structure and acceptance criteria.
4. Promote to Ready.
5. Start execution (`/dev` or `pnpm plan:run ...`) and transition to Active.
6. For each phase:
   - Implement
   - Verify
   - Update tasks/logs/session memory
7. Complete final phase and transition to Complete.
8. Run docs/status sync and PR flow.

## 12) Anti-Patterns to Avoid

- Writing plan docs without executable phase prompts.
- Mixing lifecycle states manually without moving full folder.
- Marking phase complete without passing acceptance checks.
- Skipping phase logs or session memory updates.
- Putting all implementation into a single mega-phase.
- Leaving DB/API/security constraints implicit.

## 13) Practical Checklists

### Before moving plan to Ready

- [ ] Phase breakdown is realistic.
- [ ] Every phase has prompt(s).
- [ ] Tasks file is aligned with prompts.
- [ ] Context and constraints are explicit.

### Before starting phase execution

- [ ] Plan is in `Ready` or `Active`.
- [ ] Target phase and dependencies are clear.
- [ ] Verification commands are known.

### Before closing phase

- [ ] Acceptance criteria are green.
- [ ] `TASKS_<slug>.md` updated.
- [ ] `phase_logs/PHASE_LOG_phase_NN.md` updated.
- [ ] `SESSION_MEMORY.md` updated.

### Before marking plan Complete

- [ ] All phases marked complete.
- [ ] No unresolved blockers in logs/tasks.
- [ ] Final verification completed.
- [ ] Docs/backlog sync executed as needed.

## 14) Key Source Files for Planning Agents

Load these first when planning/executing:

- `docs/development/PLAN_LIFECYCLE.md`
- `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`
- `docs/development/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`
- `docs/development/plan-guides/PLANNING_ENHANCEMENTS.md`
- `scripts/plan/ralph-plan.js`
- `scripts/plan/ralph-run.js`
- `docs/plan/README.md`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## 15) Quick Command Cookbook

- Create new plan:
  - `pnpm plan:new my_feature --phases 5 --title "My Feature"`
- Promote to ready:
  - `pnpm plan:ready my_feature`
- Start execution:
  - `pnpm plan:start my_feature`
- Run next phase:
  - `pnpm plan:run my_feature --next`
- Run specific phase:
  - `pnpm plan:run my_feature 2`
- Run all phases:
  - `pnpm plan:run my_feature --all`
- Mark done:
  - `pnpm plan:done my_feature`
- Show status:
  - `pnpm plan:status`

---

If you use this file as context for another AI tool, pair it with:

- `WORKSPACE_AI_ENVIRONMENT_REFERENCE.md` (tooling/agents/commands surface)
- `MEMORY_AND_LEARNED_DATA_REFERENCE.md` (preferences, incidents, limits)
- One app-specific reference file for feature/domain constraints.
