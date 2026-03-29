# Memory Layer

Three-tier persistent AI context system.

## Layer 1 — Project Memory (`docs/memory/`)

Committed, project-wide AI knowledge. Survives context resets.

| File               | Type     | Purpose                      | Load when   |
| ------------------ | -------- | ---------------------------- | ----------- |
| `MEMORY.md`        | index    | Master index — always loaded | Always      |
| `architecture.md`  | project  | Stack, apps, ports, commands | Any task    |
| `api_patterns.md`  | project  | Auth, org scope, conventions | API work    |
| `common_errors.md` | feedback | Gotchas, known bugs          | Debugging   |
| `decisions.md`     | project  | Architectural decisions      | Design work |

Initialize: `pnpm memory:init`

## Layer 2 — Plan Session Memory (`docs/plan/.../SESSION_MEMORY.md`)

Per-plan cross-session state. Updated by `/dev` after each phase.

Template: `docs/workspace/templates/SESSION_MEMORY_template.md`

Contains: active phase + status, last commit, cross-session decisions, gotchas, file changes, context budget.

## Layer 3 — Learning (`docs/learning/`)

Accumulated learnings across all plans.

| File                       | Contents                                            |
| -------------------------- | --------------------------------------------------- |
| `CLI_TOOL_MEMORY.md`       | CLI scoreboard — which CLI wins for which task type |
| `CLI_USAGE_AND_RESULTS.md` | Raw log of CLI invocations                          |
| `CLI_LIMITS_TRACKING.md`   | Quota tracking (80% rule)                           |
| `patterns.md`              | Recurring code/arch patterns                        |
| `decisions.md`             | Cross-plan architectural decisions                  |
| `incidents.md`             | Post-mortems and failures                           |
