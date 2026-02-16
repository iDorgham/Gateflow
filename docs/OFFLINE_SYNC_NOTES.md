# Offline Sync Notes

## Overview

This document outlines the current implementation of offline QR code scanning and sync functionality in the Gate Access scanner app.

## Current Approach

### 1. Encryption

**Implementation:** AES-256 encryption for queued scan data

**Key Derivation:**
- Uses SHA-256 hash of JWT token via `expo-crypto.digestStringAsync()`
- Falls back to random key if no token exists
- Key stored in `expo-secure-store` for persistence

```typescript
async function deriveEncryptionKey(token: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    token
  );
  return hash;
}
```

**Encryption Flow:**
1. On scan: Create JSON payload → Encrypt with AES → Store encrypted blob in AsyncStorage
2. On sync: Decrypt blob → Send plaintext to server → Clear from queue

### 2. Conflict Resolution

**Strategy:** Last-Write-Wins (LWW) based on `scannedAt` timestamp

**Algorithm:**
```
For each incoming scan:
  1. Find existing scan with same qrCode
  2. Compare scannedAt timestamps
  3. If incoming is newer → update existing record
  4. If existing is newer → mark as conflicted (skip)
  5. If no existing → create new record
```

**Audit Notes:**
Each resolved conflict includes JSON metadata:
```json
{
  "action": "sync_resolve",
  "strategy": "lww",
  "timestampsCompared": {
    "existing": "2024-01-15T10:00:00.000Z",
    "incoming": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Sync Flow

1. **Trigger:** Network becomes available OR user manually triggers
2. **Auth Check:** Verify JWT token exists in secure storage
3. **Batch:** Get pending scans → decrypt → POST to `/api/scans/bulk`
4. **Handle Response:**
   - `synced`: Clear from queue
   - `conflicted`: Keep with error message
   - `failed`: Increment retry, keep in queue

### 4. Retry Strategy

| Retry | Delay |
|-------|-------|
| 1 | Immediate |
| 2 | 5s |
| 3 | 30s |
| 4 | 2min |
| 5 | 5min |
| 6+ | 10min |

Max retries: 10

---

## Assumptions & TODOs

### Security

| Item | Status | Notes |
|------|--------|-------|
| SHA-256 key derivation | ⚠️ TODO | Currently uses simple hash; needs PBKDF2 |
| Salt for key derivation | ⚠️ TODO | No salt; vulnerable to rainbow tables |
| Key rotation | ⚠️ TODO | No rotation mechanism |
| IV management | ⚠️ TODO | crypto-js handles internally but not explicit |
| Perfect forward secrecy | ⚠️ TODO | Not implemented |

### Conflict Resolution

| Item | Status | Notes |
|------|--------|-------|
| Real conflict merging | ⚠️ TODO | Simple LWW only; no field-level merge |
| Deleted record handling | ⚠️ TODO | Not handled |
| Partial updates | ⚠️ TODO | Full record replacement only |

### Audit & Compliance

| Item | Status | Notes |
|------|--------|-------|
| Audit log schema | ⚠️ TODO | Basic JSON field; needs structured table |
| Tamper detection | ⚠️ TODO | No HMAC signing |
| Sync audit trail | ⚠️ TODO | Not fully implemented |

### Offline Validation

| Item | Status | Notes |
|------|--------|-------|
| Offline expiration check | ⚠️ TODO | Requires cached gate/QRC time |
| Usage count sync | ⚠️ TODO | Not synced offline |
| Gate status cache | ⚠️ TODO | Not implemented |

---

## Future Improvements

### Phase 2: Production Hardening
1. Implement PBKDF2 with proper salt for key derivation
2. Add device-level key storage (Keychain/Keystore)
3. Implement key rotation with re-encryption
4. Add HMAC for data integrity

### Phase 3: Advanced Sync
1. CRDT-based conflict resolution for complex merges
2. Delta sync (only changed fields)
3. Background sync with WorkManager
4. Sync status UI with progress

### Phase 4: Compliance
1. Structured audit log table
2. GDPR data export endpoint
3. Consent management
4. Access review logs

---

## API Contract

### POST /api/scans/bulk

**Request:**
```json
{
  "scans": [
    {
      "id": "scan_123",
      "qrCode": "QR_CODE_STRING",
      "gateId": "gate_456",
      "scannedAt": "2024-01-15T10:30:00.000Z",
      "status": "SUCCESS",
      "retryCount": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "synced": ["scan_123"],
  "conflicted": [
    { "id": "scan_456", "reason": "LWW resolved - existing record newer" }
  ],
  "failed": [
    { "id": "scan_789", "error": "QR code not found" }
  ]
}
```

---

## Testing Notes

Current tests cover:
- ✅ AES encryption/decryption round-trip
- ✅ Encryption with token-derived key
- ✅ Queue add/remove/mark operations
- ✅ LWW timestamp comparison logic

Missing:
- ❌ End-to-end sync with mock server
- ❌ Offline mode simulation
- ❌ Conflict resolution edge cases

---

**Last Updated:** 2024-01-15
**Version:** 1.0.0
