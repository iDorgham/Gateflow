# SKILL: Github Actions & Turborepo CI/CD

## Purpose
Standardize the automated build, test, and deployment pipelines using Github Actions and Turborepo for the GateFlow v9.0 monorepo.

## Core Principles
1.  **Incremental Execution**: Only run tests and builds for the packages that have changed (`turbo run build --filter=...`).
2.  **Shared Cache**: Use Turborepo remote caching (or Github local cache) to accelerate repeat CI runs.
3.  **Gatekeeping**: No code merges to `main` without passing lint, typecheck, and all unit/integration tests.

## Implementation Rules
- **Workflow Triggers**:
  - `PR`: Lint, Typecheck, Test, Build check.
  - `Push main`: Full deployment sequence.
- **Parallelization**: Map across apps to run builds in parallel to save time.
- **Environment Handling**: Safe injection of staging/prod secrets.

## Anti-Patterns
- Running `npm install` from scratch on every CI run (use `pnpm` with persistent cache).
- Hardcoding secrets in the `.yml` files.
- Not running the same checks locally before pushing (run `pnpm preflight`).

## Code Examples

### GitHub Action (CI Workflow)
```yaml
name: CI
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - name: Turbo Cache
        uses: actions/cache@v4 # Mapping to .turbo cache
      - run: pnpm install
      - run: pnpm turbo run lint typecheck test build
```

### Incremental Filter
```bash
# Only test the scanner app and its dependencies
pnpm turbo run test --filter=scanner-app...
```
