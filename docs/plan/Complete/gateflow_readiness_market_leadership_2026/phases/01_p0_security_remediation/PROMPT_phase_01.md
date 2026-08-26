# Phase 1: P0 Security & Exposure Remediation

## Primary Role

SECURITY / BACKEND-API

## Tool Selection

- **Tool 1**: Cursor IDE (Security guards & fail-closed auth)
- **Tool 2**: Opencode CLI (Security test execution)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/admin-dashboard`
- **Scope**: Fail-closed cron authentication, destructive action authorization, rate limiting.
- **Packages**: `@gate-access/types`, `@gate-access/ui`.

## Goal

Eliminate critical security audit risks by enforcing fail-closed authentication on background/cron endpoints and adding strict authorization guards on destructive actions.

## Scope (In)

1. Fail-closed Cron & Background Auth:
   - Requires valid `CRON_SECRET` and HMAC bearer token verification.
   - Rejects unauthenticated requests with `401 Unauthorized` (fail-closed).
2. Destructive Action Authorization Guard:
   - Validates user role (`SUPER_ADMIN` / `ORGANIZATION_ADMIN`), 2FA confirmation, and tenant match before allowing deletions.
3. Unit tests:
   - Test unauthorized cron calls, missing bearer tokens, and invalid deletion attempts.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Cron endpoint fails closed when secret is missing or invalid.
- [ ] Destructive actions require explicit authorization and tenant validation.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
