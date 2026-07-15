# GateFlow Memory and Learned Data Reference

This document consolidates memory-related sources in the repository so AI tools can load one entry point for learned preferences, historical outcomes, and operational memory.

## Coverage Status

- User/workspace learned preferences: covered.
- CLI usage memory and limits memory: covered.
- Decision and pattern memory files: indexed.
- Incident memory and postmortem logs: covered.
- One-man profile/settings memory: indexed.

## 1) Primary Memory Sources (Load First)

For most AI planning/execution sessions, load these first:

- `AGENTS.md`
- `docs/development/learning/GUIDE_PREFERENCES.md`
- `docs/development/learning/CLI_TOOL_MEMORY.md`
- `docs/development/learning/CLI_LIMITS_TRACKING.md`
- `docs/development/learning/CLI_USAGE_AND_RESULTS.md`
- `docs/development/learning/incidents.md`

## 2) Learned User Preferences (Current)

From `AGENTS.md`:

- Keep workspace docs organized with clear separation (Workspace / AI tools / Apps).
- Treat `docs/workspace` as home for workspace-facing docs and mirrors.
- Do not edit attached plan files directly during execution; update task status instead.
- Enforce changelog structure in CI (`pnpm docs:changelog:check`) and formatting (`pnpm docs:changelog:format`).
- Keep `ai:sync` and `ai:check` only in `docs/workspace/template-project/package.json` (not root `package.json`).
- Avoid mixing transient hook/sync state with feature commits.
- Prefer multi-tool guidance (Cursor, Kiro, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, Kilo CLI).
- Prefer phased plan-first execution workflow.

## 3) Learned Workspace Facts (Current)

Also from `AGENTS.md`:

- AI folder sync uses enabled tools config and supports CI full-sync behavior.
- Prisma `directUrl` uses `DIRECT_DATABASE_URL`; runtime/migration URLs can differ and must remain aligned.
- `pnpm preflight` should be used exactly as defined in root scripts.
- Plan moves across lifecycle folders should be reflected in backlog index updates.
- `token()` values are CSS variable references; React Native should use resolved/native token exports.

## 4) CLI Memory and Learning Data

Memory files under `docs/development/learning/`:

- `CLI_USAGE_AND_RESULTS.md`  
  Historical task outcomes by CLI (success/partial/fail), used to improve tool choice.
- `CLI_LIMITS_TRACKING.md`  
  Quota-awareness memory; includes 80% threshold behavior for paid tools.
- `CLI_TOOL_MEMORY.md`  
  Tool-choice memory scoreboard/patterns for task-type recommendations.
- `CLI_TEAMS.md`  
  Team-based CLI orchestration memory (`seo`, `refactor`, `audit`) and role splits.
- `GUIDE_PREFERENCES.md`  
  How `/guide` should adapt output style and recommendations.

## 5) Incident and Reliability Memory

- `docs/development/learning/incidents.md`  
  Incident/postmortem memory with root cause and prevention notes.

Use this as historical guardrail before touching:

- multi-tenant isolation,
- security-sensitive APIs,
- docs/planning lifecycle flows.

## 6) Additional Learning/Memory Files

Present in `docs/development/learning/`:

- `decisions.md`
- `patterns.md`
- `SKILL_DISCOVERY_REPORT.md`
- `ONE_MAN_MEMORY.md`
- `ONE_MAN_PROFILES.md`
- `ONE_MAN_CODE_SETTINGS.md`
- `pagespeed_results.md`

Use these when the task overlaps with:

- historical decision rationale,
- recurring implementation patterns,
- one-man orchestrator profiles/settings,
- performance regressions and benchmarks.

## 7) Memory Directory Map

### Main learning store

- `docs/development/learning/*.md`

### Architecture memory seed

- `docs/development/memory/architecture.md` (template/scaffold; partially filled)

### Tool/workspace memory references

- `docs/reference/workspace/GATEFLOW_CONFIG.md`
- `docs/workspace/WORKSPACE_GUIDE.md`
- `docs/guides/TOOL_AND_CLI_REFERENCE.md`

## 8) How AI Tools Should Use Memory

Recommended memory load order for strong context:

1. `AGENTS.md`
2. `GUIDE_PREFERENCES.md`
3. `CLI_TOOL_MEMORY.md` + `CLI_LIMITS_TRACKING.md`
4. `CLI_USAGE_AND_RESULTS.md`
5. `incidents.md`
6. Then task-specific app/reference docs.

## 9) Memory Maintenance Rules

When new learnings happen:

- Add CLI outcomes to `CLI_USAGE_AND_RESULTS.md`.
- Update `CLI_TOOL_MEMORY.md` if repeated patterns emerge.
- Record notable failures/regressions in `incidents.md`.
- Keep preferences in `GUIDE_PREFERENCES.md` aligned with current user style.

## 10) Quick Scan Commands (Memory Files)

From repo root:

```bash
ls -la docs/development/learning
rg --files docs/development/learning
rg --files docs/development/memory
```

To inspect key memory quickly:

```bash
rg "Learned User Preferences|Learned Workspace Facts" AGENTS.md
rg "80%|quota|Current status" docs/development/learning/CLI_LIMITS_TRACKING.md
rg "Outcome|success|partial|fail" docs/development/learning/CLI_USAGE_AND_RESULTS.md
```
