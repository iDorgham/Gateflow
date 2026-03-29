# PROMPT: ralph_plan_status_fix — Phase 1

## Goal

Stop `pnpm plan:status` from crashing and make phase progress reporting accurate.

## Scope

### In

- `scripts/ralph-plan.js`

### Out

- Plan lifecycle behavior changes outside status rendering
- CLI interface changes

## Steps

1. Isolate root cause in `status` command.
2. Parse progress only from phase table rows.
3. Clamp bar segment counts to avoid negative repeats.
4. Verify with `pnpm plan:status docs_workspace_template_cursor_bootstrap`.

## Acceptance Criteria

- `pnpm plan:status ...` exits 0.
- No `RangeError` from `String.repeat`.
- Done/total counts are derived from phase table rows only.
