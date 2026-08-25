# Phase 1: Cryptographic Short-Link & Silent Token Foundation

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (HMAC short-link signer & verification engine)
- **Tool 2**: Opencode CLI (Security unit tests)

## Context

- **Focused App**: `apps/resident-mobile`
- **Scope**: Cryptographic HMAC-SHA256 silent pass signing, expiration calculations, and verification.
- **Packages**: `@gate-access/types`, `@gate-access/ui/tokens`.

## Goal

Build a cryptographic token generator and verifier for express guest short-links that securely binds organization, unit, and expiration into an unforgeable payload.

## Scope (In)

1. HMAC Token Generator:
   - Signs payload: `exp:<passId>:<orgId>:<unitId>:<validUntilTimestamp>`.
   - Produces short URL: `gateflow.site/s/<passId>?sig=<hmacSignature>`.
2. Tamper-Proof Verifier:
   - Validates HMAC signature with timing-safe comparison.
   - Verifies expiration window (default 24 hours).
3. Unit tests:
   - Signature creation, timing-safe verification, tampering rejection, and expiration bounds.
4. Write `phase_logs/PHASE_LOG_phase_01.md`.

## Acceptance Criteria

- [ ] Valid tokens pass verification; expired or modified tokens are rejected.
- [ ] Verification uses timing-safe buffer comparison.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_01.md` created.
