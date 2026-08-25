# Phase 2: CI/CD, Script Resolution & Dependency Gate Hardening

## Primary Role

DEVOPS / ARCHITECTURE

## Tool Selection

- **Tool 1**: Cursor IDE (Script path resolver & non-zero scanner)
- **Tool 2**: Opencode CLI (CI validation tests)

## Context

- **Focused App**: Monorepo root / CI scripts
- **Scope**: Script path resolution, non-zero file scanners, dependency advisory guards.
- **Packages**: Monorepo root scripts, `@gate-access/config`.

## Goal

Harden CI/CD pipelines to guarantee scripts resolve from repository root and enforce non-zero scan checks to eliminate false-positive passing tests.

## Scope (In)

1. Repository Root Path Resolver:
   - Normalizes path resolution regardless of invocation directory (`packages/`, `apps/`, or root).
2. Non-Zero Scan Verifier:
   - Validates that linters, scanners, and test runners evaluate $>0$ files, failing immediately if 0 files are matched.
3. Unit tests:
   - Verify path resolution logic and non-zero scanner assertion behavior.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Path resolver reliably resolves repository root across all directory depths.
- [ ] Non-zero scanner raises errors when 0 matching files are found.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
