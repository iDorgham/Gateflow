# Phase 1: Schema, Route APIs & Cryptographic Checkpoint Signing

**Initiative:** `guard_patrol_checkpoints`  
**Phase:** 1 of 3  
**Role:** Backend API & Security Architect  
**Preferred Tool:** `gemini`

## Objective

Implement the foundational Prisma schema models for perimeter guard patrol routes, checkpoints, and runs. Build tenant-scoped REST APIs for route/checkpoint configuration and cryptographic HMAC-SHA256 checkpoint QR generation with printable SVG exports.

## Steps

1. **Prisma Models (`packages/db/prisma/schema.prisma`)**:
   - `PatrolRoute`: `id`, `name`, `frequencyMinutes`, `isStrictSequence` (Boolean), `active` (Boolean), `startGateId`, `organizationId`, `createdAt`, `updatedAt`, `deletedAt`.
   - `PatrolCheckpoint`: `id`, `routeId`, `name`, `mapCoordinates` (JSON: x, y, lat, lng), `orderIndex` (Int), `secretHash` (String), `organizationId`, `createdAt`, `updatedAt`, `deletedAt`.
   - `PatrolRun`: `id`, `routeId`, `guardId`, `status` (`SCHEDULED` | `IN_PROGRESS` | `COMPLETED` | `MISSED`), `startedAt`, `completedAt`, `organizationId`, `createdAt`, `updatedAt`.
   - `PatrolLogEntry`: `id`, `runId`, `checkpointId`, `guardId`, `scannedAt`, `latencySeconds`, `organizationId`.
2. **Shared Types (`packages/types/src/patrol.ts`)**:
   - Export type definitions for routes, checkpoints, runs, and scan payloads.
3. **Route Management API (`apps/client-dashboard/src/app/api/patrols/routes/route.ts`)**:
   - `GET`: Returns active routes and checkpoints for the authenticated `orgId`.
   - `POST`: Creates/updates route with checkpoint list in a single atomic transaction.
4. **Checkpoint QR Tag Utility (`apps/client-dashboard/src/lib/patrols/checkpoint-qr.ts`)**:
   - Generates signed HMAC payload and printable high-contrast SVG/PNG QR placard.
5. **Unit & API Tests (`apps/client-dashboard/src/app/api/patrols/routes/route.test.ts`)**:
   - Test authentication, multi-tenant isolation, validation errors, and HMAC signature verification.

## Acceptance Criteria

- [ ] `pnpm --filter @gate-access/db build` and `pnpm --filter @gate-access/types build` succeed.
- [ ] `GET /api/patrols/routes` and `POST /api/patrols/routes` pass unit tests with 100% tenant scoping.
- [ ] Checkpoint QR payload generator verifies HMAC signature integrity.
