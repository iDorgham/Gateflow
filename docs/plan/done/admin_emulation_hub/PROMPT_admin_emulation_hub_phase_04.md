# PROMPT: Admin Emulation Hub — Phase 4: Polish, Stress Testing & Automation

## Goal

Implement "Global Stress" mode for simultaneous traffic emulation and a "Wipe & Re-Seed" utility for demo tenant management. Ensure high performance for large-scale data generation.

## Role & Tool

- **Primary Role**: Backend Engineer
- **Preferred Tool**: Gemini CLI / Opencode CLI

## Context

- `admin-api`: `POST /api/admin/emulate-traffic`
- `admin-api`: `POST /api/admin/seed-hierarchy`
- `PrismaClient`: Batch operations (`createMany`).

## Steps

### 1. Global Stress Mode API

In `apps/admin-dashboard/src/app/api/admin/emulate-traffic/route.ts`:

- Add a `"global": true` option to the payload.
- Logic:
  - If `global` is set, iterate over all active (non-deleted) organizations.
  - Call `runEmulation` for each in a controlled sequence (batch of 5-10 at a time to avoid DB pressure).
  - Collect results and summarize in a single `AiActionLog` entry.

### 2. Wipe & Re-Seed Utility (Admin Support)

Create `apps/admin-dashboard/src/app/api/admin/reset-tenant/route.ts`:

- Method: `POST`
- Auth: `isAdminAuthorized` required.
- Action:
  - Soft-delete all Projects, Units, Scans, and QRs for a specific `organizationId`.
  - Re-seed a "Clean" hierarchy using `seedUnitHierarchyForProject` from Phase 1.
  - Return: Summary of deleted/created rows.

### 3. Performance & Batching Audit

In `packages/db/src/advanced-seed-service.ts`:

- Audit `Prisma.createMany` calls.
- Ensure `skipDuplicates` is used where applicable to prevent job crashes.
- Verification: Run a 50k scan emulation (dry-run off) and measure memory/seconds.

### 4. Final Platform Audit

- Verify all Ops Hub pages follow Atlassian Design System (ADS) tokens.
- Perform an RTL audit for Arabic localization (alignment, text direction).
- Run `pnpm turbo build --filter=admin-dashboard` to ensure no type regressions.

## Acceptance Criteria

- [ ] Global emulation mode successfully triggers multiple org runs.
- [ ] Reset utility correctly cleans and re-seeds a tenant.
- [ ] Seeding 1,000 units takes < 10 seconds.
- [ ] All new APIs recorded in `AiActionLog`.
- [ ] RTL/Arabic dashboard fully functional.
