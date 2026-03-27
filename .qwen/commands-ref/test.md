# Test

Run tests, preflight, verify quality.

## Instructions

1. Run `pnpm preflight` (lint + typecheck + test).
2. Or run tests for specific workspace: `pnpm turbo test --filter=<workspace>`.
3. Use **shell subagent** for test runs and failure reports.
4. Use **cursor-ide-browser** MCP for E2E verification (login, nav, i18n).

## Shell prompt

```
Run pnpm preflight and report failures with file:line. Fix the first error and re-run.
```
