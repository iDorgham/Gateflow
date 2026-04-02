# PROMPT: Admin Emulation Hub — Phase 1: Advanced Seeding Integration (Backend)

## Goal

Extend the existing advanced seeding engine (`v3`) to support organizational hierarchy generation (Units/Contacts) alongside traffic emulation, and implement the auditing history APIs for the new Control Panel.

## Role & Tool

- **Primary Role**: Backend Engineer (DB/API)
- **Preferred Tool**: Gemini CLI / Opencode CLI

## Context

- `packages/db/src/advanced-seed-service.ts`: Core simulation logic (mirroring v3 logic).
- `apps/admin-dashboard/src/app/api/admin/emulate-traffic/route.ts`: Current emulation API.
- `apps/admin-dashboard/src/components/emulation/emulation-schema.ts`: Zod schema for payloads.

## Steps

### 1. Extend `RunEmulationParams` & `runEmulation`

In `packages/db/src/advanced-seed-service.ts`:

- Update `RunEmulationParams` to include `ranges?: UnitHierarchyRangeConfig` and `unitIdFormat?: UnitIdFormat`.
- Update `runEmulation` function:
  - If `ranges` is provided and `dryRun` is false:
    - Automatically resolve or create the required number of `Contacts` (Phases 3/4 of v3).
    - Call `seedUnitHierarchyForProject(db, { organizationId, projectId, ranges, seed, ... })` to generate the structural data.
    - Log the counts of `Units` and `Contacts` generated.
  - After seeding, trigger the `Relational Chain` generation for traffic simulation as before.

### 2. Implement Seeding-only Admin API

Create `apps/admin-dashboard/src/app/api/admin/seed-hierarchy/route.ts`:

- Method: `POST`
- Auth: `isAdminAuthorized(request)` required.
- Logic: Wrapper around `seedUnitHierarchyForProject`. It targets a specific `organizationId` and `projectId`, taking the `ranges` and `unitIdFormat` as inputs.
- Audit: Append to `AiActionLog` with `actionType: 'SEED_HIERARCHY'`.

### 3. Implement Emulation History API

Create `apps/admin-dashboard/src/app/api/admin/emulation-history/route.ts`:

- Method: `GET`
- Auth: `isAdminAuthorized(request)` required.
- Logic: Fetch the last 50 `AiActionLog` entries filtered by `actionType` in `('EMULATE_TRAFFIC', 'SEED_HIERARCHY')`. Ensure strictly scoped to the `Actor` or `Target Organization` metadata.
- Return: JSON list of audit logs with structured metadata.

### 4. Admin Schema Extension

In `apps/admin-dashboard/src/components/emulation/emulation-schema.ts`:

- Synchronize all `UnitHierarchyRangeConfig` types with `@gate-access/db/src/lib/unit-hierarchy-seed.ts`.
- Ensure `EmulateTrafficBodySchema` supports the new `ranges` parameters for combined seeding/emulation runs.

## Acceptance Criteria

- [ ] `pnpm turbo build --filter=@gate-access/db` succeeds.
- [ ] `POST /api/admin/seed-hierarchy` correctly generates the units/contacts hierarchy.
- [ ] `GET /api/admin/emulation-history` returns recent audit activities.
- [ ] All database writes follow the organizational isolation principle and link correctly to the target project.
