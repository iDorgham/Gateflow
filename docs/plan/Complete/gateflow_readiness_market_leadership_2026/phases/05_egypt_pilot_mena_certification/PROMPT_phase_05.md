# Phase 5: Egypt Pilot Wedge, Partner Integration & MENA Readiness Certification

## Primary Role

QA / FULLSTACK / DEVOPS

## Tool Selection

- **Tool 1**: Cursor IDE (Egyptian hardware integrator bridge & offline sync)
- **Tool 2**: Opencode CLI (Monorepo test suite & build verifier)

## Context

- **Focused Apps**: `apps/scanner-app`, `apps/client-dashboard`, `apps/resident-mobile`
- **Scope**: Egyptian gate controller integration, offline fallback sync, full certification.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Establish Egyptian hardware integrator adapter specifications, certify offline-first gate synchronization reliability, and run the full monorepo test suite for market leadership readiness.

## Scope (In)

1. Egyptian Integrator Bridge:
   - Formats standard Wiegand / Relay trigger payloads for local Egyptian boom barrier systems (BFT, Came, Nice).
2. Offline Sync Resilience Verifier:
   - Simulates intermittent 3G/4G connectivity and verifies zero dropped scan logs.
3. Full Monorepo Certification:
   - Run unit and integration tests across all affected workspaces.
   - Verify 0 TypeScript errors and 0 lint warnings.
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Hardware integrator generates valid relay trigger commands.
- [ ] Offline sync verifier catches and resolves dropped logs.
- [ ] All automated test suites pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
