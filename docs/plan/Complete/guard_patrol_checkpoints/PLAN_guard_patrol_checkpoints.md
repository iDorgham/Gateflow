# PLAN: Guard Patrol Checkpoints & QR Route Scanner

**Slug:** `guard_patrol_checkpoints`  
**Status:** planning  
**Created:** 2026-08-28  
**Target:** Q3/Q4 2026  
**App:** `apps/client-dashboard`, `packages/db`, `packages/types`, `packages/security`

## Overview

> Implement verifiable perimeter guard patrol routes, cryptographically signed physical QR checkpoints, real-time patrol telemetry on `GuardShiftVisualMap`, and supervisor compliance reporting for compound security operations.

## Phases

| #   | Phase                                                                            | Tool   | Status |
| --- | -------------------------------------------------------------------------------- | ------ | ------ |
| 1   | Phase 1: Schema, Route APIs & Cryptographic Checkpoint Signing                   | gemini | [x]    |
| 2   | Phase 2: Perimeter Visual Map Patrol Telemetry & Real-Time Monitoring            | cursor | [x]    |
| 3   | Phase 3: Guard Mobile Checkpoint Scanner, Supervisor Alerts & Full Certification | claude | [x]    |

## Technical Constraints

- **Stack**: Next.js 14 App Router, Prisma 5, TypeScript 5, Turborepo monorepo.
- **Tenant Isolation**: Every database query and mutation MUST be scoped to `organizationId` and include `deletedAt: null`.
- **Cryptographic Checkpoint Integrity**: Checkpoint QR codes must encode HMAC-SHA256 signatures (`{ orgId, routeId, checkpointId, nonce, hmac }`) to prevent spoofed or replayed check-ins.
- **Verification**: `pnpm turbo test --filter=client-dashboard` must pass 100% with zero lint or typecheck regressions.
- **RTL & Design Tokens**: Strict adherence to `@gate-access/ui/tokens`, ADS elevation tokens, and Arabic (`ar-EG` / `ar-SA`) logical directional properties.

## Tools Reference

| Tool   | Best for                                               | Auto-accept                      |
| ------ | ------------------------------------------------------ | -------------------------------- |
| gemini | DB/schema, fast structural analysis, API routes        | `--yolo`                         |
| cursor | UI/visual iteration, map overlays, interactive drawers | IDE (manual)                     |
| claude | Security review, audit logs, full certification        | `--dangerously-skip-permissions` |
