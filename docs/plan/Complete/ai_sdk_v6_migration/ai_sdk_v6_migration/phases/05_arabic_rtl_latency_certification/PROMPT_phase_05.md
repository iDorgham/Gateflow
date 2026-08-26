# Phase 5: Arabic RTL Polish, Latency Benchmarks & Full Certification

## Primary Role

QA / DESIGN / PERFORMANCE

## Tool Selection

- **Tool 1**: Cursor IDE (RTL audit & streaming latency benchmark)
- **Tool 2**: Opencode CLI (Full monorepo test suite)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/admin-dashboard`
- **Scope**: Arabic RTL layout inspection, stream TTFT latency benchmarks, full test run.
- **Packages**: `@gate-access/ui`, `@gate-access/i18n`.

## Goal

Perform comprehensive Arabic RTL layout validation across all tool confirmation cards, benchmark streaming response speed, and certify the full migration with automated test suites.

## Scope (In)

1. Arabic RTL Layout Audit:
   - Validate RTL alignment, badge positioning, and action buttons in assistant confirmation cards.
2. Latency Benchmarks:
   - Benchmark streaming parser to ensure $< 150$ms time-to-first-token parsing overhead.
3. Full Certification:
   - Run unit tests across all affected packages.
   - Verify 0 TypeScript errors and 0 lint warnings.
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Arabic RTL layout is 100% natural and compliant with ADS tokens.
- [ ] Streaming parser overhead is $< 150$ms.
- [ ] All automated test suites pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
