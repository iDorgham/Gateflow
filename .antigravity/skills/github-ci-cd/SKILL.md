---
name: github-ci-cd
description: Enterprise GitHub Actions, Turborepo CI caching, automated test matrices, and Vercel deployment pipelines for GateFlow.
---

# SKILL: GitHub Actions, Turborepo CI/CD & Deployment Pipelines

## Purpose

Standardize and accelerate automated builds, testing matrices, security scans, and deployment workflows across the GateFlow monorepo.

---

## Core Principles

1. **Incremental Execution**: Only run tasks for modified workspaces and their downstream dependents (`pnpm turbo run build --filter=...[origin/master]`).
2. **Remote & Local Caching**: Leverage Turborepo caching to eliminate redundant build and test cycles.
3. **Deterministic Quality Gates**: No pull request may be merged without passing all 18 automated CI checks (CodeQL, Lint, Typecheck, Test, Runtime Proof, Performance Budget, Security Scan).
4. **Fail-Closed Security**: Injected secrets and deployment keys must be validated at runtime and fail safely if unconfigured.

---

## Standard Workflow Matrix

| Workflow File                           | Trigger                            | Purpose                                                                  |
| :-------------------------------------- | :--------------------------------- | :----------------------------------------------------------------------- |
| `.github/workflows/ci.yml`              | `pull_request`, `push` to `master` | Lint, typecheck, unit/integration tests, and runtime proof verification. |
| `.github/workflows/codeql-analysis.yml` | Weekly / PRs to `master`           | Static security analysis for vulnerability detection.                    |
| `.github/workflows/deploy.yml`          | Manual dispatch (`/deploy <app>`)  | Production and preview deployments to Vercel and Expo EAS.               |
| `.github/workflows/db-migrate.yml`      | Manual dispatch / Release          | Direct database migration runner using `DIRECT_DATABASE_URL`.            |

---

## Best Practices & CLI Commands

### 1. Local Pre-Flight Check (Run Before Pushing)

```bash
# Run the complete test and quality pipeline locally
pnpm preflight
```

### 2. Investigating Failed CI Runs

```bash
# View last failed run logs directly in terminal
gh run list --limit 5
gh run view <run_id> --log-failed
```

### 3. Triggering Manual Production Deployment

```bash
# Trigger deployment workflow for a specific application
gh workflow run deploy.yml -f app=client -f environment=Production
```
