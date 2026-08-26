# Phase 1: Backend API & Push Notification Dispatch

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (API routes & server integration)
- **Tool 2**: Gemini CLI (Fast query/schema validation)

## Context

- **Focused Apps**: `apps/client-dashboard` & `apps/resident-mobile`
- **Scope**: REST endpoints under `apps/client-dashboard/src/app/api/resident/*` and push notification triggers.
- **Rules**: Multi-tenancy (`organizationId`), soft-deletes (`deletedAt: null` if model defines field), fail-closed error handling, zero unauthenticated endpoints.

## Goal

Harden the resident REST API endpoints and integrate the automated Expo Push Notification dispatch upon gate entry scan events.

## Scope (In)

1. Verify and harden:
   - `POST /api/resident/express-invite`: Creates HMAC-signed pass with short URL.
   - `GET /api/resident/visitors`: Lists active visitor passes for the authenticated resident's unit.
   - `DELETE /api/resident/visitors/[id]`: Revokes a visitor pass.
   - `GET /api/resident/history`: Fetches paginated entry history.
   - `POST /api/resident/push-token`: Registers/updates user's Expo Push Token.
2. In `scanner` scan processing endpoint (`/api/qrcodes/validate` or scanner hook):
   - When a valid scan occurs for a visitor pass, query active push tokens for the owning resident.
   - Dispatch push notification: `"[Visitor Name] entered via [Gate Name] at [Time]"`.
3. Add automated integration tests covering tenant isolation, invalid auth, pass creation, and push dispatch payload formation.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] All 5 resident endpoints return proper JSON responses with HTTP 401 when unauthenticated.
- [ ] `express-invite` returns a cryptographically valid HMAC pass URL.
- [ ] Push token registration saves token to database under authenticated resident user.
- [ ] Automated integration tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
