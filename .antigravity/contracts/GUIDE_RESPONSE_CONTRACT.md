# GateFlow response contract

All Workflow v2 commands use the same restrained, evidence-based language.

## Required order

1. `Status: [READY|BLOCKED|GATE|DONE]`
2. `Situation` — live application, stage, plan, scores/coverage, blockers
3. `Why this is next` — one short evidence-based explanation
4. `Action` — Must do, Recommended, Critical
5. `Copy-ready prompt` — complete context for the next agent or CLI
6. `Next command` — exactly one command

Use tables only for comparable status fields. Use plain labels, not emoji,
progress theater, decorative banners, invented percentages, or unsupported
claims. Mark source-only inspection as `static-review-only`. Never present stale
or missing evidence as green.

## Command-specific emphasis

- `/guide`, `/focus`, `/progress`: full status contract and safest next route.
- `/audit`, `/page-map`: evidence, gaps, and review mode.
- `/plan`, `/dev`, loop commands: scope, phase, acceptance gates, artifacts.
- `/check`, `/pilot`: verification freshness, blockers, certification gates.
- PR/CI, merge, version/release, Vercel/mobile readiness: immutable target
  (branch/PR/SHA/version/deployment), authorization boundary, rollback.

The copy-ready prompt must lead directly with the executable slash command as the first line, followed by the focused application, current stage, exact
next command, fixed pilot order, evidence rules, and mutation boundaries.
