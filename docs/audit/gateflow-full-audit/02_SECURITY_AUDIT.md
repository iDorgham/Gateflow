# 02. SECURITY & AUTHENTICATION AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Authentication, Session Security, Authorization (RBAC), Secrets Management, Cryptography, and API Threat Resistance

---

## 1. Authentication & Session Architecture

GateFlow enforces distinct, specialized authentication models across its core user surfaces:

### 1.1 Operator Console (`apps/client-dashboard`)

- **Authentication Standard**: NextAuth / JWT session tokens stored in `httpOnly`, `sameSite: lax`, `secure` cookies.
- **Session Lifespan**: Standard 12-hour session with rolling refresh token updates stored in `RefreshToken` database records (`packages/db`).
- **CSRF Protection**: Native Next.js CSRF token verification combined with Origin / Referer header validation on mutating POST/PUT/PATCH/DELETE endpoints.
- **Audit Finding**: Session cookies correctly apply `httpOnly` and `sameSite` flags. `secure: true` is dynamically toggled based on `NODE_ENV === 'production'`.

### 1.2 Governance Control Plane (`apps/admin-dashboard`)

- **Authentication Standard**: Custom HMAC-SHA256 signed session cookie (`admin_session`) generated with a high-entropy secret (`ADMIN_ACCESS_KEY`).
- **Bearer Token Support**: Dedicated API routes support `Authorization: Bearer <key>` authentication by hashing incoming tokens via SHA-256 and matching against `AdminAuthorizationKey` in PostgreSQL.
- **Audit Finding**: Key fingerprints (`adminKeyFingerprint()`) are strictly computed using `sha256(key)` for UI identification without exposing static tokens in session payloads.

### 1.3 Mobile Hardware & Guard Scanner (`apps/scanner-app`)

- **Authentication Standard**: JWT-backed device tokens paired with local PIN and Biometric (Expo LocalAuthentication) validation.
- **Secure Token Storage**: Mobile tokens are persisted via `expo-secure-store` using iOS Keychain and Android KeyStore hardware encryptions.

---

## 2. Secrets Management & Environment Security

- **Repository Scan Results**: Zero hardcoded secrets, database credentials, or private HMAC signing keys were detected in source files across `apps/` and `packages/`.
- **Environment Isolation**: `.env.example` templates document mandatory environment variables (`DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_ACCESS_KEY`, `QR_HMAC_SECRET`).
- **Prisma Direct Connection Security**: Direct database connections (`DIRECT_DATABASE_URL`) required for migrations are strictly isolated from runtime connection pools (`prisma+postgres://`).

---

## 3. Cryptography & QR Access Signing

- **QR HMAC Signing Standard**: Pass payload data (Contact ID, Unit ID, Gate ID, Expiry, Nonce, Usage Count) is signed server-side using HMAC-SHA256 (`packages/utils`).
- **Replay & Tamper Prevention**: Every generated pass encodes a unique cryptographically random UUID nonce. During scan verification (`apps/scanner-app` or `/api/qrcodes/validate`), nonces are checked against processed records to prevent replay attacks.
- **Clock Skew Tolerance**: QR verification logic accepts a configurable 60-second clock skew window to handle minor timestamp discrepancies between mobile scanners and central API servers.

---

## 4. Security Findings & Recommendations

### Pros

- Strong cryptographic pass signing using HMAC-SHA256 with nonce replay protection.
- Isolated admin authentication model using signed session cookies and DB-backed authorization keys.
- Hardware-backed token encryption on iOS and Android scanner devices.

### Cons

- Missing automated rate limiting on public validation routes (documented in P0-001).
- Outbound webhooks require persistent dead-letter queueing (documented in P1-001).

### Security Verification Commands

```bash
# Check secret patterns across repository
rg -n "(secret|private_key|password)\s*=\s*[\"'][^\"']+[\"']" apps packages

# Verify auth guards in API routes
rg -n "isAdminAuthorized|getSession|requireAuth" apps --glob "**/route.ts"
```
