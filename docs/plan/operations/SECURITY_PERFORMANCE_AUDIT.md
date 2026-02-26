# GateFlow — Security & Performance Audit

**Date:** 2026-02-23  
**Scope:** Full monorepo (6 apps, 3 shared packages)  
**Auditor:** Automated + Manual Code Review

---

## Executive Summary

| Category | Status | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| 🔐 Secrets Management | ⚠️ | 1 | 1 | 0 | 0 |
| 🛡️ Authentication & Authorization | ✅ | 0 | 1 | 1 | 0 |
| 🔒 CSRF Protection | ✅ | 0 | 0 | 1 | 0 |
| 💉 Injection (SQL/XSS) | ✅ | 0 | 0 | 0 | 0 |
| 🔑 Encryption | ⚠️ | 0 | 1 | 0 | 0 |
| 📦 Dependencies | ⚠️ | 0 | 0 | 1 | 1 |
| 🌐 HTTP Security Headers | ❌ | 0 | 1 | 0 | 0 |
| ⚡ Performance | ⚠️ | 0 | 0 | 2 | 1 |
| 🚦 Rate Limiting | ✅ | 0 | 0 | 1 | 0 |

**Overall: 1 Critical · 4 High · 6 Medium · 2 Low**

---

## 🔐 SECRETS MANAGEMENT

### CRITICAL — Production QR_SIGNING_SECRET committed in `packages/types/test_qr.js`

**File:** `packages/types/test_qr.js:7`  
```js
const secret = "[REDACTED]";
```

This is the **same value** as `QR_SIGNING_SECRET` in `.env`. This file is committed to Git.

**Risk:** Anyone with repo access can forge valid QR codes.

**Fix:**
1. Delete `packages/types/test_qr.js` (it's a test/debug file)
2. **Rotate `QR_SIGNING_SECRET`** — generate a new secret and update `.env`
3. Add `test_qr.js` to `.gitignore`

### HIGH — `.env` not committed (✅ good) but `.env.local` patterns need review

`.gitignore` correctly excludes `.env`, `.env.local`, `.env.production`. ✅

**However:** The `.env` file contains live Upstash Redis credentials:
```
UPSTASH_REDIS_REST_URL="https://eager-fox-32129.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AX2BAAIncDJjZDBhYzY3Nzg4NjY0NDBiYTQ1ZGVmMTFiMzkwODc3ZnAyMzIxMjk"
```

**Verify:** Ensure `.env` has never been committed via `git log --all -- .env` → ✅ Confirmed: no history found.

---

## 🛡️ AUTHENTICATION & AUTHORIZATION

### ✅ Strengths

| Feature | Implementation | Assessment |
|---------|---------------|------------|
| Password hashing | Argon2id (64 MiB, 3 iter, 4 parallel) | ✅ Industry best practice |
| JWT signing | HS256 via `jose` with issuer/audience validation | ✅ Solid |
| Access tokens | 15-minute expiry | ✅ Short-lived |
| Refresh tokens | 30-day expiry, DB-stored, rotation on use | ✅ Good |
| Token reuse detection | Revokes ALL user tokens on reuse | ✅ Excellent |
| Timing oracle prevention | Dummy hash on non-existent user | ✅ Good |
| Input validation | Zod schemas on all login/refresh bodies | ✅ Consistent |
| Admin auth | SHA-256 hashed access key in cookie | ✅ Acceptable for admin |

### HIGH — `/api/scans/bulk` has NO authentication

**File:** `apps/client-dashboard/src/app/api/scans/bulk/route.ts`

This endpoint accepts `POST` requests to sync scan logs from the scanner app but has **no `requireAuth()` check**. The CSRF middleware also explicitly excludes it:
```ts
'/api/scans/bulk', // Scanner app offline sync
```

**Risk:** Any unauthenticated client can inject scan log records into the database.

**Fix:** Add `requireAuth()` — the scanner app already sends Bearer tokens.

### MEDIUM — Rate limiting only on `/api/qrcodes/validate`

Only 1 of 22 API routes has rate limiting. The login route (`/api/auth/login`) is especially critical and should be rate-limited to prevent credential stuffing.

**Fix:** Apply `checkRateLimit()` to at minimum:
- `/api/auth/login` (10 req/min per IP)
- `/api/auth/refresh` (20 req/min per user)
- `/api/scans/bulk` (5 req/min per device)

---

## 🔒 CSRF PROTECTION

### ✅ Strengths

- Double-submit cookie pattern implemented ✅
- CSRF token rotated on login and refresh ✅
- `sameSite: 'strict'` on cookies ✅
- Server Actions excluded (Next.js has built-in CSRF for those) ✅

### MEDIUM — CSRF cookie inconsistency between login and refresh

**Login** (`/api/auth/login/route.ts:93`):
```ts
httpOnly: false  // Client needs to read it
```

**Refresh** (`/api/auth/refresh/route.ts:120`):
```ts
httpOnly: true   // Client can't read it
```

After a token refresh, the client cannot read the new CSRF token, which will break CSRF validation on subsequent requests until the next full login.

**Fix:** Both should use `httpOnly: false` (client needs to extract the token for the header).

---

## 💉 INJECTION PROTECTION

### ✅ SQL Injection — SAFE

- All raw SQL queries use **Prisma tagged template literals** (`prisma.$queryRaw\`...\``) which parameterize inputs automatically
- No `$queryRawUnsafe` or `$executeRawUnsafe` usage found
- No string concatenation in SQL
- Conditional raw queries handled by separate static templates (not dynamic string building)

### ✅ XSS — SAFE

- No `dangerouslySetInnerHTML` found
- No `innerHTML` assignment
- No `eval()` or `new Function()` usage
- React's JSX auto-escapes by default

---

## 🔑 ENCRYPTION

### HIGH — CryptoJS AES uses weak default mode (CBC without explicit IV)

**File:** `apps/client-dashboard/src/lib/encryption.ts`

```ts
CryptoJS.AES.encrypt(plaintext, key)
```

When CryptoJS receives a string passphrase (not a WordArray key), it uses:
- OpenSSL's `EVP_BytesToKey` key derivation (MD5-based, no salt randomization control)
- AES-CBC mode (not AES-GCM as the comment claims)
- Random IV per encryption (OK), but no authentication tag

**Discrepancy:** The file header comment says "AES-256-GCM" but the implementation is actually AES-CBC without authentication.

**Risk:** Malleable ciphertext — an attacker who can modify the encrypted values could alter plaintext without detection.

**Fix:** Switch to Node.js native `crypto` module with proper AES-256-GCM:
```ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export function encryptField(plaintext: string): string {
  const key = Buffer.from(MASTER_KEY!, 'hex'); // 32 bytes
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
```

---

## 🌐 HTTP SECURITY HEADERS

### HIGH — No security headers configured on any Next.js app

None of the 4 `next.config.js` files set security headers.

**Missing headers:**
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `Referrer-Policy`
- `Permissions-Policy`

**Fix:** Add to each app's `next.config.js`:
```js
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // ... existing config
};
```

Add HSTS and CSP in production only (via middleware or Vercel/hosting config).

---

## 📦 DEPENDENCY VULNERABILITIES

### MEDIUM — 9 npm audit vulnerabilities (5 high, 3 moderate, 1 low)

```
5 high    — ajv@6 prototype pollution (via eslint), cross-spawn ReDoS
3 moderate — micromatch ReDoS, path-to-regexp ReDoS
1 low     — tmp symlink write
```

All are in **dev/build** dependencies (eslint, turbo), not runtime. No user-facing risk.

**Fix (low priority):** Update eslint to v9+ and turbo to latest when ready.

### LOW — Deprecated subdependencies

8 deprecated packages detected (glob@7, inflight, rimraf@3, etc.). All are transitive dev deps.

---

## ⚡ PERFORMANCE

### Bundle Sizes

| App | Shared JS | Largest Page | Assessment |
|-----|-----------|-------------|------------|
| admin-dashboard | 87.3 kB | 134 kB (/) | ✅ Good |
| client-dashboard | 87.6 kB | **242 kB** (/analytics) | ⚠️ Heavy |
| marketing | 87.3 kB | ~90 kB (/) | ✅ Good |
| resident-portal | ~87 kB | ~90 kB | ✅ Good |

### MEDIUM — Analytics page is 242 kB First Load JS

**File:** `/dashboard/analytics` — 113 kB page-level + 87.6 kB shared = **242 kB**

This is due to Recharts being loaded eagerly (+60 kB). The page also fires **12 parallel Prisma queries** on every load.

**Fix:**
1. Lazy-load chart components with `next/dynamic`:
   ```tsx
   const AnalyticsCharts = dynamic(() => import('./analytics-charts'), { ssr: false });
   ```
2. Cache expensive aggregation queries with `unstable_cache` or Redis

### MEDIUM — N+1 query pattern in daily counts

**File:** `analytics/page.tsx:121-133`
```ts
Promise.all(
  days.map(async (dayStart) => {
    const count = await prisma.scanLog.count({
      where: { ... }
    });
    return { date: dayStart, count };
  })
)
```

This fires **7-90 separate COUNT queries** (one per day in range). For a 30-day range, that's 30 DB roundtrips.

**Fix:** Replace with a single GROUP BY query:
```sql
SELECT DATE(sl."scannedAt") AS day, COUNT(*) 
FROM "ScanLog" sl JOIN "QRCode" qr ON ...
WHERE sl."scannedAt" >= $1 AND sl."scannedAt" <= $2
GROUP BY day ORDER BY day
```

### LOW — No image optimization configured

`next.config.js` doesn't configure `images.remotePatterns` or `images.formats`. If external images are used, they won't be optimized.

---

## 🚦 RATE LIMITING

### ✅ Strengths

- Redis-backed (Upstash) with in-memory fallback ✅
- Sliding window algorithm ✅
- Atomic Redis pipeline operations ✅
- Graceful fallback on Redis failure ✅
- Rate limit headers in responses ✅

### MEDIUM — Coverage gap

Only `/api/qrcodes/validate` is rate-limited. At minimum, auth endpoints and write-heavy endpoints should be protected.

---

## 📋 ACTION ITEMS (Priority Order)

### 🔴 Critical (Fix immediately)
1. **Delete `packages/types/test_qr.js`** — contains production QR signing secret
2. **Rotate `QR_SIGNING_SECRET`** in `.env` after deletion

### 🟠 High (Fix before production)
3. **Add `requireAuth()` to `/api/scans/bulk`** — currently unauthenticated
4. **Add security headers** to all `next.config.js` files
5. **Fix encryption** — switch from CryptoJS CBC to Node.js native AES-256-GCM
6. **Fix CSRF cookie consistency** — both login and refresh should use `httpOnly: false`

### 🟡 Medium (Fix soon)
7. **Add rate limiting to auth endpoints** (`/api/auth/login`, `/api/auth/refresh`)
8. **Optimize analytics queries** — replace N+1 daily counts with GROUP BY
9. **Lazy-load Recharts** on analytics page to reduce bundle size
10. **Review npm audit** — update dev dependencies when convenient

### 🟢 Low (Nice to have)
11. Configure `images.remotePatterns` in `next.config.js`
12. Update deprecated transitive dev dependencies
