# Phase 5: Arabic RTL Localization, Latency Benchmarks & Full Certification

## Primary Role

QA / DESIGN / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Arabic RTL inspection & latency benchmarking)
- **Tool 2**: Opencode CLI (Full test suite execution & typecheck)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/scanner-app`, `apps/resident-mobile`
- **Scope**: Arabic RTL layout perfection, sub-200ms latency verification, full test suites.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Verify 100% Arabic RTL design quality across all autonomous intelligence interfaces, certify sub-200ms alert dispatch performance, and execute complete automated test suites.

## Scope (In)

1. Arabic RTL Localization Audit:
   - Verify Arabic concierge copy, security alert banners, and perimeter map labels.
   - Enforce directional logical CSS properties and WCAG 2.2 AA contrast compliance.
2. Latency Benchmarking:
   - Verify camera webhook ingestion $\to$ alert emission round-trip latency completes within $< 200$ms.
3. Automated Test Certification:
   - Run full test suites across all affected applications.
   - Verify 0 TypeScript errors and 0 lint warnings.
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Arabic RTL renders cleanly with natural enterprise terminology.
- [ ] Alert dispatch latency benchmark passes with $< 200$ms average.
- [ ] All automated test suites pass with 100% green status.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
