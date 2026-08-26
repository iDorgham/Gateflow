# PROMPT: Phase 4 — Perimeter Hardware Security & Anti-Spoofing

**Slug:** `gateflow_security_readiness_mena`  
**Phase:** 4 of 5  
**Primary Role:** `mobile` / `backend-api`  
**Preferred Tool:** `gemini` / `claude`  
**Application Scope:** `apps/scanner-app`, `packages/db`

---

## Objective

Harden perimeter gate barrier communication against physical and network spoofing attacks using CRC16 frame validation, offline replay nonce quarantine, and cryptographically signed emergency gate override tokens.

---

## Concrete Steps

1. **Hardware CRC16 Frame Validation**:
   - Implement CCITT-CRC16 checksum generation and verification for barrier controller telemetry packets.
2. **Replay Nonce Quarantine**:
   - Build an in-memory & database quarantine queue in scanner service for already-scanned or out-of-sequence nonces.
   - Trigger instant visual alert on scanner screen upon duplicate nonce presentation.
3. **Signed Emergency Override Token**:
   - Provide offline HMAC-signed emergency tokens allowing guard override only during active, authenticated duty shifts.
4. **Unit & Integration Tests**:
   - Test corrupted CRC16 frame rejection, rapid replay nonce quarantine, and offline emergency token decoding.

---

## Acceptance Criteria

- [ ] All hardware gate controller packets pass CRC16 frame verification before relaying barrier commands.
- [ ] Nonce replay attacks are detected within <5ms and quarantined with explicit security incident logging.
- [ ] Emergency overrides require valid guard shift authentication and leave signed audit trails.
- [ ] `pnpm turbo test --filter=scanner-app` passes cleanly with 0 failures.
