# Phase 3 log — Trustworthy CI and repository scanners

**Date:** 2026-07-21  
**Branch:** `fix/audit-remediation-phase-3`  
**Tool:** Cursor (Gemini preferred but usage unknown — Cursor as master)

## Changes

- Added `scripts/check/repo-root.js` — resolves monorepo root as `../..` from `scripts/check/` and validates markers.
- Fixed false-green root bug in: `check-imports.js`, `todos.js`, `scan-secrets.js`, `check-env.js`, `check-bundle-size.js`, `check-db-drift.js`.
- `check-imports.js`, `todos.js`, and `scan-secrets.js` now report coverage and reject unexpected empty scans; the other checks retain their own input-validation behavior.
- `scan-secrets.js`: `--all` coverage reporting; `--history N` (HIGH-only, path excludes); skip lighthouse/`scan_results.txt` noise.
- `check-security.js`: lockfile via repo root; `status=clean|vulnerabilities|unavailable`; unavailable always exits **2** (distinct from clean).
- Smoke tests: `scripts/check/__tests__/*.test.js` (`pnpm test:check-scripts`).
- Restored **full** `pnpm turbo typecheck` in root `typecheck` / `preflight` and CI (fixed missing `organizationId` on watchlist incident create).
- Broke UI circular import: `progress.tsx` imports `cn` from `lib/utils` not barrel `index`.
- Test budgets: `scripts/check/test-budgets.json` + `check-test-budgets.js` (skipped=1, forceExit=2, expiry 2026-09-30).
- Documented pnpm/Node drift: `docs/development/learning/PNPM_RUNTIME_DRIFT.md` (no blind pnpm upgrade).
- Targeted override: `js-yaml@^3` → 3.15.0, `js-yaml@^4` → 4.3.0 (GHSA-52cp-r559-cp3m).
- CI Security Scan job: secrets tree + history, smoke tests, imports/todos, budgets, `check:security:fail`.

## Verification

```bash
pnpm check:imports:fail          # 838 files, 0 cycles
pnpm check:todos                 # 943 files
pnpm check:secrets               # mode=all, nonzero scanned
pnpm check:secrets:history       # history:100, HIGH clean
pnpm check:security:fail         # status=clean (after js-yaml pin)
pnpm test:check-scripts          # 7 pass
pnpm check:test-budgets          # within budget
pnpm typecheck:all               # includes dashboards
pnpm preflight                   # (run at phase close)
```

## Residual risks

- Phase 1 credential-rotation receipt still pending (ops).
- Jest `--forceExit` (2 scripts) and 1 skipped suite remain budgeted until Phase 4 / 2026-09-30.
- MEDIUM secret findings in archived docs still warn (non-blocking); do not treat as clean for HIGH.
- Local Node may be newer than CI Node 22 — see PNPM_RUNTIME_DRIFT.md.

## Rollback

Do not revert scanners to `path.resolve(__dirname, '..')` (scripts/ root). Forward-fix only.
