# SKILL: QR Cryptographic Security & Anti-Replay

## Purpose
Enforce non-forgeable, time-limited, and anti-replay security standards for QR codes used in the GateFlow v9.0 ecosystem.

## Core Principles
1.  **HMAC Signing**: All QR payloads must be signed using a server-side secret to prevent tampering.
2.  **Short-Lived Tokens**: QR codes must have an expiration window (e.g., 30-60 seconds) to prevent photo-sharing.
3.  **One-Time Use (Nonce)**: Use unique nonce values per QR to prevent replay attacks during the validity window.

## Implementation Rules
- **Payload Structure**: `{ data: string, exp: number, nonce: string, signature: string }`.
- **Encryption**: Sensitive IDs (like `residentId`) should be encrypted, not just signed, if transmitted in public QR codes.
- **Verification**: The Scanner App must verify:
  1. Signature integrity.
  2. Timestamp (not expired).
  3. Nonce (not previously used in the last 2 minutes).

## Anti-Patterns
- Using static IDs (e.g., `userId: 123`) in a QR code without a signature.
- Storing the HMAC secret in the client/app (must be in server/secure-vault).
- Allowing "infinite" QR validity.

## Code Examples

### Server-Side QR Signing (Node.js)
```typescript
import { createHmac } from "crypto";

export const generateSecureQR = (payload: any, secret: string) => {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 60000 });
  const signature = createHmac("sha256", secret).update(data).digest("hex");
  return Buffer.from(JSON.stringify({ data, signature })).toString("base64");
};
```

### Scanner Verification Logic
```typescript
const verifyQR = (encoded: string, secret: string) => {
  const { data, signature } = JSON.parse(Buffer.from(encoded, "base64").toString());
  const expectedSig = createHmac("sha256", secret).update(data).digest("hex");
  
  if (signature !== expectedSig) throw new Error("Tampered QR");
  const payload = JSON.parse(data);
  if (Date.now() > payload.exp) throw new Error("Expired QR");
  return payload;
};
```
