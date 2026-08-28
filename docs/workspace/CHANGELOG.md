# Workspace Changelog

## [Unreleased]

### Added

- **Scanner App Onboarding & Biometric Session Management (`scanner_onboarding_session`)**:
  - 4-step onboarding wizard (`OnboardingNavigator`) with system settings deep-linking recovery.
  - Fail-closed biometric hardware authentication with SHA-256 PIN vault in `expo-secure-store`.
  - Shift-gated scanning preventing barcode scans without an active, matching shift (`canScanWithShift`).
  - ADS Home Screen redesign with 8pt spatial grid, 72x72px `MasterScanFab`, and live duty timer.
  - `BiometricGuard` 5-minute background inactivity auto-lock.
- **Guard Patrol Checkpoints & QR Route Scanner (`guard_patrol_checkpoints`)**:
  - Defined patrol loops, physical HMAC-signed QR checkpoint tokens, and route editor (`PatrolRouteManager.tsx`).
  - Live polyline map telemetry overlay on `GuardShiftVisualMap.tsx`.
  - Supervisor patrol compliance monitoring (`PatrolComplianceSummary.tsx`).
- **Guard Shift Visual Map & Real-Time Gate Monitor (`guard_shift_visual_map`)**:
  - Live gate terminal occupancy, active shift duration counters, terminal health indicators, and shift handover controls on Client Dashboard.
- **Master AI Knowledge Base & NotebookLM Suite**:
  - Extended NotebookLM source suite (01–11 + `NOTEBOOKLM_GATEFLOW_ULTIMATE_CONTEXT.md`) covering monorepo history, 67 Prisma database models, all 7 applications, and GitFlow quality gates.
- Automated, diff-aware runtime-proof planning with `pnpm proof:plan`,
  head-bound evidence validation with `pnpm proof:check`, and fast PR readiness
  through `pnpm pr:ready` / `/github ready`.
- A runtime proof coordinator agent for browser, device, API, database, and
  access-decision evidence.
- AI workspace graph validation for commands, agents, parents, skills, and
  generated-artifact hygiene; Guide routing now discovers the live registry.
- Loop worktrees now use the pre-push-compatible `feat/loop-*` branch prefix.
- CI jobs now skip redundant dependency installation after an exact cache hit,
  and the required gate no longer describes advisory performance as required.
- Red Sea `--demo-full` / `pnpm --filter=@gate-access/db seed:demo` fills all demo orgs with 6-month contacts, units/classrooms, role logins, and optional scan history.
- Root `pnpm health` runs workflow v2 contract tests, changelog check, and preflight.

### Changed

- Runtime proof is now a required `CI OK` dependency, covers runtime manifests,
  assets, dependency resolution, shared UI, deletions, and both rename paths,
  and rejects evidence that escapes through symlinked directories.
- Feature branches use the pull-request CI run only, deterministic performance
  failures are blocking, and clean checkouts validate the tracked AI registry
  instead of silently skipping AI checks.
- `/plan`, `/dev`, and `/guide` now enforce Workflow v2 focus and stage.
- AI sync registers the Workflow v2 command surface for all supported clients.
- `/pilot loop` delegates to `/dev loop --profile=pilot`; `/ralph` delegates to
  bounded local all-phase execution and no longer authorizes legacy Ralph Git
  mutation behavior.
