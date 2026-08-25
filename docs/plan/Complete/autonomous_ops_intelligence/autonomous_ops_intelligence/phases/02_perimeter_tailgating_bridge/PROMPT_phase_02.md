# Phase 2: Perimeter Security & Tailgating Ingestion Bridge

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Camera webhook & tailgating detector)
- **Tool 2**: Opencode CLI (Security webhook unit tests)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/scanner-app`
- **Scope**: Edge AI camera webhook, multi-vehicle tailgating classification, instant incident broadcast.
- **Packages**: `@gate-access/types`, `@gate-access/ui/tokens`.

## Goal

Implement a secure camera AI webhook endpoint that ingests perimeter events and detects vehicle tailgating violations with instant alert broadcast.

## Scope (In)

1. Camera Webhook Ingestion (`POST /api/perimeter/events`):
   - Validates webhook HMAC signature and organization multi-tenant scope.
   - Accepts vehicle optical passage events with timestamp, gateId, and optional LPR snapshot token.
2. Tailgating Incident Classifier:
   - Detects vehicle crossings occurring within $< 3.0$ seconds without an accompanying authorized QR scan.
   - Generates high-priority `SECURITY_ALERT` payload.
3. Unit tests:
   - Webhook security validation, tailgating timing rules, and alert payload generation.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Webhook authenticates HMAC signature and validates tenant scope.
- [ ] Tailgating classifier flags unauthorized vehicle entry within 3s window.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
