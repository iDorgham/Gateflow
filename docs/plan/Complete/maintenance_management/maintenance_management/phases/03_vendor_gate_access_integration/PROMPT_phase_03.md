# Phase 3: Automated Vendor Access QR Pass Generation

## Primary Role

BACKEND-API / SECURITY

## Tool Selection

- **Tool 1**: Cursor IDE (Vendor QR pass generation & policy evaluation)
- **Tool 2**: Opencode CLI (Cryptographic pass verification tests)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/scanner-app`
- **Scope**: External vendor dispatch, time-bounded QR access pass generation, gate zone verification.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/types`.

## Goal

Automatically generate cryptographically signed, time-bounded Vendor Gate Access QR passes when maintenance work orders are assigned to external contractors or technicians.

## Scope (In)

1. Vendor Pass Generation Engine:
   - When a work order is assigned to an external vendor, generate a signed pass payload containing work order ID, vendor technician name, target unit/gate, and valid time window.
   - Enforce cryptographic HMAC-SHA256 signing matching GateFlow scanner security standards.
2. Zone & Schedule Verification:
   - Scanner evaluation logic ensuring vendor pass is rejected if scanned outside the permitted compound gate or scheduled work order time window.
3. Unit tests:
   - Vendor pass creation, payload encryption/signature, expiration verification, and zone match evaluation.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Assigning vendor work orders generates valid HMAC-SHA256 signed passes.
- [ ] Scanner evaluation allows access only within scheduled time window and allowed gates.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
