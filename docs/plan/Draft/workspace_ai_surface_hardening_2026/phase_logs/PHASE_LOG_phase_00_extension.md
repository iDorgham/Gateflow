# Phase Log — Phase 0 CI/runtime-proof extension

## Scope

Harden PR #283 without modifying scanner application code: required runtime
proof, single-run PR CI, honest performance and AI gates, broader classification,
canonical artifact containment, and workflow contract tests.

## Root causes and fixes

- Runtime proof published a summary but was absent from `CI OK`; added a
  head-bound required check that requires evidence only for classified diffs.
- Feature branches matched both push and pull-request triggers; restricted push
  validation to protected branches.
- Performance steps used `continue-on-error` and import summary mode; made the
  deterministic checks blocking and enabled `--fail`.
- Missing `.agents` returned valid/skipped; clean CI now validates the tracked
  routing registry and fails if neither source exists.
- Runtime rules missed manifests/assets/dependencies/shared UI and rename old
  paths; expanded rules and parse name-status rename/copy records.
- Artifact checks followed symlinked parents; compare canonical artifact and
  repository paths before hashing.

## Verification

- Red tests reproduced all targeted gaps before production changes.
- Focused regression suite: passing.
- `pnpm workflow:v2:check`: 72 passed.
- `pnpm test:check-scripts`: 15 passed.
- `pnpm preflight`, changelog, AI registry, import-cycle, and security gates:
  passed.
- Next.js production builds: environment-blocked because Turbopack cannot bind
  an internal process port locally; the required GitHub performance job must
  supply final build/bundle evidence.
