# Ralph Loop (Workspace Reference)

Ralph Loop is GateFlow's automation backbone for planning, execution, quality gates, and documentation.

## Core Flow

`Idea -> Plan -> Develop -> Test -> Commit -> Verify -> Ship -> Document`

## Primary Ralph Commands

- `pnpm ralph`
- `pnpm ralph:short`
- `pnpm plan:new <slug>`
- `pnpm plan:ready <slug>`
- `pnpm plan:start <slug>`
- `pnpm plan:run <slug> <phase>`
- `pnpm plan:done <slug>`

## Supporting Commands

- `pnpm docs:changelog`
- `pnpm docs:changelog:format`
- `pnpm docs:changelog:check`
- `pnpm docs:release`
- `pnpm preflight`

## Main Script Entry Points

- `scripts/ralph.js`
- `scripts/ralph-plan.js`
- `scripts/ralph-run.js`
- `scripts/ralph-docs.js`
- `scripts/phase-close.js`
- `scripts/ralph-prioritize.js`
- `scripts/ralph-skill-discover.js`

## Related Guards

- `scripts/scan-secrets.js`
- `scripts/check-security.js`
- `scripts/check-imports.js`
- `scripts/check-db-drift.js`
- `scripts/check-bundle-size.js`
- `scripts/check-changelog.js`

## Notes

- Ralph Loop is workspace infrastructure, not app-specific feature logic.
- Keep plan lifecycle and quality gates green before shipping.
