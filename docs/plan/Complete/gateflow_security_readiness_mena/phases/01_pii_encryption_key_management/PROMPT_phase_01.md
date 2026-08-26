# PROMPT: Phase 1 — Field-Level PII Encryption & Key Management

**Slug:** `gateflow_security_readiness_mena`  
**Phase:** 1 of 5  
**Primary Role:** `backend-database`  
**Preferred Tool:** `gemini` / `claude`  
**Application Scope:** `packages/db`, `packages/security`

---

## Objective

Implement native AES-256-GCM field-level encryption for high-sensitivity resident and visitor PII fields (National IDs, Vehicle License Plates, Emergency Contacts) in `packages/security` and integrate transparent envelope decryption and dual-key rotation support with `packages/db`.

---

## Concrete Steps

1. **Crypto Primitives (`packages/security/src/field-encryption.ts`)**:
   - Build `encryptField(plainText: string, keyHex?: string): string` returning `iv:authTag:cipherText` (hex/base64 encoded).
   - Build `decryptField(encryptedPayload: string, primaryKeyHex?: string, fallbackKeyHex?: string): string`.
   - Ensure authenticated tag verification prevents ciphertext tampering.
2. **Key Rotation Engine**:
   - Support `ENCRYPTION_MASTER_KEY` (primary) and `ENCRYPTION_FALLBACK_KEY` (secondary) during active rotation cycles.
   - Graceful fallback with zero crash if ciphertext was encrypted with previous active key.
3. **Database Integration**:
   - Add encryption helper bindings for visitor/resident models in `packages/db`.
   - Ensure Prisma client extension decrypts transparently on read while encrypting on write.
4. **Unit Tests**:
   - Write comprehensive tests in `packages/security/src/field-encryption.test.ts` covering:
     - Correct encryption and decryption round-trip.
     - Tampered auth tag rejection (throws explicit security error).
     - Dual-key fallback decryption.
     - Empty/null field safety.

---

## Acceptance Criteria

- [ ] `encryptField` and `decryptField` pass 100% of unit tests with AES-256-GCM authenticated encryption.
- [ ] Ciphertext tampering immediately fails-closed without exposing plain text or stack secrets.
- [ ] Dual-key rotation allows decrypting older records seamlessly while encrypting new records with primary key.
- [ ] `pnpm turbo test --filter=@gate-access/security --filter=@gate-access/db` passes cleanly with 0 failures.
