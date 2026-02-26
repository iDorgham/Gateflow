# GateFlow — Code Quality & Performance Audit

**Date:** 2026-02-24
**Scope:** All 6 applications + 6 shared packages
**Auditor:** Senior Code Quality, Performance & Security Engineer

---

## Executive Summary

| Dimension              | Score | Notes                                              |
|------------------------|-------|----------------------------------------------------|
| Security               | 72/100| 2 critical secrets issues, QR signing solid       |
| TypeScript Quality     | 78/100| Mostly strict; some `any` casts in scanner        |
| Performance            | 80/100| Good query batching; one O(n) hot path             |
| Error Handling         | 75/100| Good overall; 1 missing try/catch in sync path    |
| Code Duplication       | 82/100| `cn()` defined in 3 places; small local utils      |
| Consistency            | 88/100| Uniform auth patterns; consistent Zod validation  |
| **Overall**            | **79/100** | Solid foundation; 7 issues to fix            |

---

## Critical Issues

> Must be fixed before production deployment.

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| C1 | `apps/scanner-app/src/lib/offline-queue.ts` | 64–69 | `generateScanUuid()` uses `Math.random()` instead of `Crypto.getRandomBytesAsync()` despite the comment claiming otherwise. Scan UUIDs drive server-side deduplication — predictable UUIDs could be spoofed. | Cryptographic integrity of offline sync |
| C2 | `apps/client-dashboard/src/lib/auth.ts` | 8–14 | JWT secret falls back to encoding `undefined` as a string when neither `NEXTAUTH_SECRET` nor `JWT_SECRET` is set. In production, this signs tokens with a trivially-known key, allowing anyone to forge valid JWTs. Should throw, not warn. | **Auth bypass** — allows forging admin JWTs |
| C3 | `apps/admin-dashboard/src/lib/admin-auth.ts` | 24 | `ADMIN_ACCESS_KEY` falls back to the hardcoded string `'dev-admin-key-change-in-production'` if the env var is missing. The same default key is displayed as a clickable button on the login page (`/login/page.tsx:155`), making it trivially guessable even in production. | **Admin panel auth bypass** |
| C4 | `apps/admin-dashboard/src/app/api/admin/audit-logs/export/route.ts` | 8 | Same hardcoded fallback key as C3 in the export API route. | **Admin API auth bypass** |

---

## High Issues

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| H1 | `apps/scanner-app/src/lib/offline-queue.ts` | 332 | `bulkSyncScans()` calls `return response.json()` without try/catch. If the server returns a non-JSON body (HTML error page, rate-limit page), this throws an uncaught exception that bypasses the caller's error handler, silently dropping all pending syncs. | Data loss on sync |
| H2 | `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts` | 14 | `QR_SIGNING_SECRET` defaults to `''` when the env var is missing. An empty secret still passes `verifyQRSignature()` if the QR was also signed with an empty secret (e.g., in a dev environment that gets promoted). Should throw at startup. | QR signature bypass risk |
| H3 | `apps/client-dashboard/src/app/api/gates/route.ts` | 73 | `CreateGateSchema` declares `location` as required (`z.string().min(1, ...)`), but the gate creation UI passes `location.trim()` with no required-field enforcement, and the `GateWithStats` type declares `location: string \| null`. The schema/UI/DB mismatch causes valid gate creation requests (empty location) to fail with 400. | Gates can't be created without location |
| H4 | `apps/admin-dashboard/src/app/api/admin/audit-logs/export/route.ts` | 35 | `where.status = statusFilter` assigns unvalidated user-supplied string directly to a Prisma `where` clause. An invalid enum value causes a DB error rather than being silently ignored. | DB error on invalid filter value |

---

## Medium Issues

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| M1 | `apps/scanner-app/src/lib/qr-verify.ts` | 53 | `cache.includes(nonce)` is an O(n) linear scan over up to 1 000 entries on every QR scan. Should use `new Set(cache).has(nonce)` for O(1) lookup. | Scanner lags on nonce-full cache |
| M2 | `apps/scanner-app/src/lib/offline-queue.ts` | 186 | Local scan ID uses `Math.random().toString(36).substring(7)` — 4-character entropy (~20 bits). Two concurrent scans within the same millisecond could collide, corrupting the queue. | Queue corruption (rare) |
| M3 | `apps/scanner-app/src/lib/auth-client.ts` | 167 | `data.data.accessToken` / `data.data.refreshToken` accessed without runtime schema validation. If the API changes shape or returns an unexpected response, tokens silently become `undefined`, logging the user out without explanation. | Silent auth failures |
| M4 | `apps/scanner-app/src/lib/scanner.ts` | 109, 118–119 | `body.scanId as string \| undefined` and `body.reason as string \| undefined` cast unvalidated `response.json()` output. Should validate response shape at runtime. | Incorrect scan results display |
| M5 | `packages/db/src/tenant.ts` | 8–10 | `organizationContext` is module-level mutable state shared across all concurrent requests in the same Node.js process. In Next.js with concurrent Server Components, one request's `setOrganizationContext()` can bleed into another request's DB queries before `clearOrganizationContext()` runs. | Cross-tenant data leak under concurrency |
| M6 | `apps/client-dashboard/src/lib/utils.ts` + `apps/marketing/lib/utils.ts` | 1–6 | Both files define `cn()` identically. `@gate-access/ui` already exports `cn` — these local copies add maintenance burden and risk divergence. | Code duplication |
| M7 | `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx` | 32–38 | All 7 props typed as `any` / `any[]`, losing full type-safety across the settings panel. | TypeScript safety |
| M8 | `apps/client-dashboard/src/components/dashboard/sidebar.tsx` | 23 | `getNavGroups` parameter `t: any` — translation function has no type. | TypeScript safety |
| M9 | `apps/client-dashboard/src/middleware.ts` | 122–126 | Dev/prod branch inside `if (!authCookie)` was identical in both branches — dead `if (NODE_ENV === 'development')` block with no effect. | Dead code confusion |

---

## Additional Admin-Dashboard / Marketing Issues

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| A1 | `apps/admin-dashboard/tsconfig.json` | 10 | `"strict": false` disables all strict TypeScript checks in an access-control app — completely opposite of what's needed. | TypeScript safety baseline |
| A2 | `apps/marketing/tsconfig.json` | 10 | Same as A1. | TypeScript safety baseline |
| A3 | `apps/admin-dashboard/next.config.js` | 18 | `hostname: '**'` wildcard allows Next.js Image to load from any HTTPS domain — open to SSRF via image proxy. Admin dashboard needs no external images. | SSRF via image proxy |
| A4 | `apps/marketing/next.config.js` | 18 | Same wildcard issue — marketing might need a few CDN hosts but not an unrestricted wildcard. | SSRF via image proxy |
| A5 | `apps/marketing/middleware.ts` | 13 | `// @ts-ignore locales are readonly` suppresses a type error instead of fixing it (`[...i18n.locales]` spread is the correct fix). | TypeScript suppression |
| A6 | `apps/admin-dashboard/src/app/(dashboard)/scans/page.tsx` | 61, 324 | `where: any` and `icon: any` lose type safety on query building and icon mapping. | TypeScript safety |
| A7 | `apps/admin-dashboard/src/app/api/admin/login/route.ts` | 40 | `catch (e: any)` — errors should be caught as `unknown`. | TypeScript safety |

---

## Additional Issues (Third Audit Pass)

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| B1 | `apps/admin-dashboard/src/app/api/admin/audit-logs/export/route.ts` | 18–23 | `escapeCSV` does not escape formula-injection trigger characters (`=`, `+`, `-`, `@`, `\t`, `\r`). A malicious user name or email like `=cmd\|'/c calc'!A1` executes code when the CSV is opened in Excel/LibreOffice. | **CSV Injection (OWASP)** |
| B2 | `apps/client-dashboard/src/app/api/scans/export/route.ts` | 16–22 | Same CSV injection vulnerability in `csvCell()`. | **CSV Injection (OWASP)** |
| B3 | `apps/admin-dashboard/src/app/(dashboard)/audit-logs/page.tsx` | 48–49 | `new Date(searchParams.from)` — invalid date strings produce `Invalid Date` which silently corrupts the Prisma `where.scannedAt` filter. | Broken date filters |
| B4 | `apps/admin-dashboard/src/app/(dashboard)/scans/page.tsx` | 58–59 | Same invalid date issue as B3. | Broken date filters |

---

## Low Issues

| # | File | Line | Issue | Impact |
|---|------|------|-------|--------|
| L1 | `apps/scanner-app/src/lib/qr-verify.ts` | 42–53 | `isNonceReused()` and `recordNonce()` each independently call `getNonceCache()` (= `AsyncStorage.getItem`), causing 2 storage reads per scan. Can be batched into 1 read. | Minor I/O overhead |
| L2 | `apps/scanner-app/src/lib/auth-client.ts` | 7–8 | `EXPO_PUBLIC_API_URL` falls back to `'http://localhost:3001/api'` which would silently use plaintext HTTP in production if the env var is missing. Should log a warning. | Plaintext HTTP in production |
| L3 | `apps/client-dashboard/src/lib/auth.ts` | 9 | Supporting two env var names (`NEXTAUTH_SECRET` \|\| `JWT_SECRET`) for the same secret is confusing. Should standardise on one and document migration. | Developer confusion |
| L4 | `packages/db/src/tenant.ts` | 12–21 | `setOrganizationContext` + `clearOrganizationContext` is a fragile pattern — callers must remember to call `clear` in `finally`. A request-scoped async context (`AsyncLocalStorage`) would be safer. | Future maintenance risk |

---

## Prioritised Fix List

### Priority 1 — Fix Immediately (Critical)
1. **C1** — Make `generateScanUuid()` async, use `Crypto.getRandomBytesAsync(16)`
2. **C2** — Throw `Error` (not `console.warn`) when JWT secret is missing at startup

### Priority 2 — Fix Before Production (High)
3. **H1** — Wrap `response.json()` in try/catch in `bulkSyncScans()`
4. **H2** — Throw at startup if `QR_SIGNING_SECRET` is missing or too short
5. **H3** — Make `location` optional in `CreateGateSchema`

### Priority 3 — Fix Soon (Medium)
6. **M1** — Replace `cache.includes()` with `new Set(cache).has()` in `isNonceReused()`
7. **M2** — Fix local scan ID to use `Crypto.getRandomBytesAsync(4)`
8. **M5** — Add prominent warning comment to `tenant.ts`; consider `AsyncLocalStorage`
9. **M6** — Remove duplicate `cn()` in local `utils.ts` files; re-export from `@gate-access/ui`

### Priority 4 — Improve When Convenient (Low)
10. **L1** — Batch the two `AsyncStorage.getItem` reads in `qr-verify.ts`
11. **L2** — Warn in auth-client.ts when `EXPO_PUBLIC_API_URL` is not set
12. **L3** — Standardise on `NEXTAUTH_SECRET` only; remove `JWT_SECRET` fallback

---

## Per-App Scores

| App | Security | TypeScript | Performance | Error Handling | Score |
|-----|----------|------------|-------------|----------------|-------|
| client-dashboard | 72 | 88 | 83 | 82 | **81** |
| scanner-app | 68 | 78 | 77 | 74 | **74** |
| admin-dashboard | 88 | 85 | 87 | 85 | **86** |
| marketing | 90 | 82 | 85 | 84 | **85** |
| packages/db | 74 | 90 | 88 | 88 | **85** |
| packages/types | 92 | 92 | 90 | 90 | **91** |

---

## What's Working Well

- **QR signing pipeline** — HMAC-SHA256 sign/verify is well-implemented end-to-end
- **JWT auth** — Argon2id + 15-min access / 30-day refresh with rotation is production-grade
- **Multi-tenancy isolation** — `organizationId` scoping is consistent across all API routes
- **Soft deletes** — `deletedAt: null` filter applied uniformly
- **CSRF protection** — Double-submit cookie pattern correctly implemented
- **Rate limiting** — Upstash Redis rate limiter properly wired to all sensitive endpoints
- **Offline-first scanner** — AES-256 + PBKDF2 offline encryption is solid; LWW sync is correct
- **Test coverage** — Scanner app has thorough unit tests for all critical paths
- **Zod validation** — All API routes validate request bodies with Zod schemas
- **Error handling** — API routes consistently return typed `{ success, message }` shapes
