# Ultra-Detailed Context Reference: Security, Cryptography & Compliance

> **Comprehensive Technical Specification for AI Assistants & Security Engineers**  
> **Packages**: `packages/security`, `packages/db`  
> **Last Verified**: August 28, 2026

---

## 1. Zero-Trust Multi-Tenancy Architecture

Every data layer query, API route handler, and background worker in GateFlow adheres to strict multi-tenant boundary isolation:

### Invariants:

1. **Tenant Root (`Organization`)**: All data records (Projects, Units, Residents, QR Codes, Gates, Patrol Routes, Audit Logs) MUST be scoped to `organizationId`.
2. **Session Verification**: The `organizationId` is extracted from verified JWT claims (`session.user.organizationId` or API key context) and NEVER trusted from unauthenticated client request bodies.
3. **Database Query Isolation**:
   ```typescript
   // Correct pattern:
   const qrcodes = await db.qRCode.findMany({
     where: {
       organizationId: session.organizationId,
       deletedAt: null,
     },
   });
   ```

---

## 2. Cryptographic Protocol Specifications

### 2.1 Cryptographic HMAC-SHA256 QR Tokens

- **Algorithm**: `HMAC-SHA256`
- **Signing Payload**: `"${qrId}:${orgId}:${validFrom}:${validUntil}:${nonce}"`
- **Output Token Format**: `gf:v1:<base64-encoded-payload>.<base64-encoded-signature>`
- **Verification Flow**:
  1. Base64 decodes token components.
  2. Recomputes HMAC-SHA256 signature using the organization's private secret.
  3. Verifies constant-time signature equality (`crypto.timingSafeEqual`).
  4. Checks expiration boundary (`Date.now() <= validUntil`).
  5. Queries anti-replay sliding nonce quarantine (`nonce-quarantine.ts`).

### 2.2 Field-Level PII Envelope Encryption

- **Algorithm**: `AES-256-GCM` with 96-bit random Initialization Vector (IV) and 128-bit authentication tag.
- **Encrypted Fields**: Resident National IDs, phone numbers, passport numbers, vehicle license plates.
- **Key Hierarchy**: Master Key (KMS / Environment) wraps per-tenant Data Encryption Keys (DEK).

### 2.3 Tamper-Evident Chained Audit Ledger

- **Algorithm**: `SHA-256` hash chaining.
- **Payload Hash Calculation**:
  $$\text{CurrentHash} = \text{SHA-256}(\text{prevHash} \parallel \text{action} \parallel \text{entityType} \parallel \text{entityId} \parallel \text{actorId} \parallel \text{timestamp} \parallel \text{diffPayload})$$
- **Verification**: Any modification to a historical `AuditLog` row breaks the cryptographic chain across all subsequent records.

---

## 3. Physical Barrier Relay Packet Framing

Gate terminal hardware barrier relays communicate over TCP/RS-485 using binary framed packets with CCITT-CRC16 checksum validation:

```
+--------+--------+--------+-------------+-------------+-------------+--------+
| 0xAA   | 0x55   | 0x01   | GateId (2B) | Duration(2B)| CRC16 (2B)  | 0xEE   |
+--------+--------+--------+-------------+-------------+-------------+--------+
| Preamble 1 & 2  | Command| Big-Endian  | Open Hold ms| CCITT Poly  | Postfix|
+--------+--------+--------+-------------+-------------+-------------+--------+
```
