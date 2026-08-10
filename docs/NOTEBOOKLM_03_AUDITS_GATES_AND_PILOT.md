# NOTEBOOKLM SOURCE 3: GateFlow Audits, Quality Gates, Pilot Certification & Ralph Loop

## 1. Audit History & Security Remediation Timeline

### 1.1 Code Quality & Performance Audit (2026-02-24)

A senior code-quality and security audit scored GateFlow at **79/100** overall.

| Dimension          | Score  | Notes                                            |
| ------------------ | ------ | ------------------------------------------------ |
| Security           | 72/100 | 2 critical secrets issues, QR signing solid      |
| TypeScript Quality | 78/100 | Mostly strict; some `any` casts in scanner       |
| Performance        | 80/100 | Good query batching; one O(n) hot path           |
| Error Handling     | 75/100 | Good overall; 1 missing try/catch in sync path   |
| Code Duplication   | 82/100 | `cn()` defined in 3 places; small local utils    |
| Consistency        | 88/100 | Uniform auth patterns; consistent Zod validation |
| **Overall**        | **79** | Solid foundation; 7+ issues to fix               |

#### Critical Findings (Pre-Production Blockers)

| ID  | File / Area                                                           | Issue                                                                                                                                                     | Impact                                  |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| C1  | `apps/scanner-app/src/lib/offline-queue.ts:64–69`                     | `generateScanUuid()` used `Math.random()` despite comment claiming `Crypto.getRandomBytesAsync()`. Predictable UUIDs undermine server-side deduplication. | Cryptographic integrity of offline sync |
| C2  | `apps/client-dashboard/src/lib/auth.ts:8–14`                          | JWT secret fell back to encoding `undefined` as a string when `NEXTAUTH_SECRET` / `JWT_SECRET` missing, allowing forged admin JWTs.                       | Auth bypass                             |
| C3  | `apps/admin-dashboard/src/lib/admin-auth.ts:24`                       | `ADMIN_ACCESS_KEY` defaulted to hardcoded `'dev-admin-key-change-in-production'`, also shown as a clickable button on the login page.                     | Admin panel auth bypass                 |
| C4  | `apps/admin-dashboard/src/app/api/admin/audit-logs/export/route.ts:8` | Same hardcoded admin key fallback in the export API route.                                                                                                | Admin API auth bypass                   |

#### High Findings

| ID  | File / Area                                                            | Issue                                                                                                                  | Impact                     |
| --- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| H1  | `apps/scanner-app/src/lib/offline-queue.ts:332`                        | `bulkSyncScans()` calls `return response.json()` without try/catch; non-JSON server responses silently drop all syncs. | Data loss on sync          |
| H2  | `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts:14`       | `QR_SIGNING_SECRET` defaulted to empty string; empty-secret promotion breaks HMAC verification.                        | QR signature bypass risk   |
| H3  | `apps/client-dashboard/src/app/api/gates/route.ts:73`                  | `CreateGateSchema` requires `location` but UI/DB type allow null, causing 400s.                                        | Gate creation friction     |
| H4  | `apps/admin-dashboard/src/app/api/admin/audit-logs/export/route.ts:35` | Unvalidated `statusFilter` string assigned directly to Prisma `where`, causing DB errors on bad enum input.            | DB error on invalid filter |

#### Medium / Low Findings (Selected)

- `scanner-app/src/lib/qr-verify.ts:53` — O(n) `cache.includes(nonce)` should be `Set.has()` for O(1) lookup.
- `scanner-app/src/lib/offline-queue.ts:186` — 4-character local scan ID entropy (~20 bits) risks queue collision.
- `scanner-app/src/lib/auth-client.ts:167` — No runtime validation of token response shape, causing silent auth failures.
- `packages/db/src/tenant.ts:8–10` — Module-level mutable `organizationContext` can leak across concurrent Next.js requests.
- `apps/admin-dashboard/tsconfig.json:10` and `apps/marketing/tsconfig.json:10` — `"strict": false` weakens type safety in access-control apps.
- `apps/admin-dashboard/next.config.js:18` / `apps/marketing/next.config.js:18` — `hostname: '**'` wildcard allows SSRF via image proxy.
- `admin-dashboard` and `client-dashboard` CSV export helpers lacked formula-injection escaping (`=`, `+`, `-`, `@`, `\t`, `\r`) — OWASP CSV Injection risk.

#### Audit Remediation 2026 (Shipped 2026-07-20 → 2026-07-21)

| Phase                 | Outcome                                                                                                                    |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| 1 — P0 containment    | Removed deployable admin reset/bootstrap route; CMS HTML + branding CSS sanitization; CI bootstrap-route guard             |
| 2 — Tenant isolation  | Request-local fail-closed tenant `db` via AsyncLocalStorage; privileged client for explicit cross-tenant ops               |
| 3 — Trustworthy CI    | Scanner root resolution, nonzero coverage, history secrets scan, full dashboard typecheck in preflight                     |
| 4 — API certification | High-risk API guards (`withApiGuards`, `requireAdminApi`), admin-login throttle, shared HSTS+CSP headers, cron fail-closed |

Residual follow-up: credential-rotation receipt for Phase 1 secrets (non-blocking operational task).

---

## 2. Preflight Verification Gates (`pnpm preflight`)

`pnpm preflight` is the canonical local verification command before push/merge. It runs the root `package.json` turbo chain without extra flags.

### Included Checks

1. **Changelog** — Validates workspace changelog entries (`docs:changelog:check`).
2. **ADS Design** — Enforces Atlassian Design System token usage (`check:ads`).
3. **Bootstrap Routes** — Verifies admin bootstrap route is disabled in deployable builds (`check:bootstrap-routes`).
4. **Lint** — ESLint across all workspaces.
5. **Typecheck** — Full TypeScript type-checking including all dashboards (restored in audit remediation Phase 3).
6. **Tests** — Jest test suites with skipped-test and `--forceExit` budgets.

### Important Usage Rules

- Use exactly `pnpm preflight`; unsupported args can break the underlying `turbo` chain.
- Preflight/typecheck include **all** workspaces (no dashboard exemptions).

---

## 3. CI / Repository Gates

GateFlow CI enforces several hard gates before merge:

- **Conventional commits** — commitlint enforces 13 types / 30 scopes.
- **Branch naming** — Husky pre-push requires names matching `^(feat|fix|chore|hotfix|refactor|docs|test|perf|ci|security)(/.+)?$`.
- **Secret scanner** — 12 HIGH patterns block commit; 4 MEDIUM warn.
- **Env validator** — Checks env presence, placeholder detection, and min-length.
- **Bundle size guard** — Warns >10% / fails >25% growth vs baseline.
- **Circular import detector** — Static DFS analysis across TS/JS.
- **DB schema drift** — Hash-based change detection vs committed baseline.
- **Lighthouse CI** — Default URLs are `https://www.gateflow.site` and `https://app.gateflow.site`; individual Lighthouse jobs are not required to merge (soft-pass gate).

---

## 4. Ralph Loop Autonomous Quality Engine

The Ralph Loop is a workspace automation engine that runs quality and governance checks:

- `pnpm ralph` — master dashboard showing git state, active plans, hook health, quality snapshot, and next action.
- Plan lifecycle automation: `plan:new → plan:ready → plan:start → plan:run → plan:done` with automatic folder moves and doc cascades.
- Phase auto-close: commit messages containing `phase 3`, `[p3]`, `closes phase 3` auto-mark PLAN phases complete.
- Hotfix workflow, semantic versioning, docs release, and post-merge auto-bump.

---

## 5. Pilot Certification Model

GateFlow Workflow v2 uses an evidence-based, zero-manual-checkbox certification model (`/certify`).

### Certification Requirements

- `CERTIFICATION_PACKET` must be `valid:true`.
- Owned browser/session gates must be proven (not just manual checkboxes).
- Do not `/certify` until all evidence is fresh and complete.
- Certification is app-sequenced and locked: one primary app must reach pilot-ready status before the next begins.

### Pilot Flow (Residential)

1. Resident receives invitation.
2. Resident registers and links to a unit.
3. Resident creates a visitor QR (single-use, recurring, date-range, or permanent).
4. Visitor arrives at gate; scanner validates QR offline/online.
5. Scan log is appended; resident may receive arrival notification.
6. Certification packet validates end-to-end telemetry.

---

## 6. Per-App Quality Scores (Audit Snapshot)

| App              | Security | TypeScript | Performance | Error Handling | Score  |
| ---------------- | -------- | ---------- | ----------- | -------------- | ------ |
| client-dashboard | 72       | 88         | 83          | 82             | **81** |
| scanner-app      | 68       | 78         | 77          | 74             | **74** |
| admin-dashboard  | 88       | 85         | 87          | 85             | **86** |
| marketing        | 90       | 82         | 85          | 84             | **85** |
| packages/db      | 74       | 90         | 88          | 88             | **85** |
| packages/types   | 92       | 92         | 90          | 90             | **91** |

---

## 7. What’s Working Well (Audit Praise)

- **QR signing pipeline** — HMAC-SHA256 sign/verify end-to-end.
- **JWT auth** — Argon2id + 15-min access / 30-day refresh with rotation.
- **Multi-tenancy isolation** — `organizationId` scoping consistent across API routes.
- **Soft deletes** — `deletedAt: null` filtering applied to tenant-facing reads on soft-deletable models; global-admin forensic queries explicitly retain visibility of soft-deleted records for audit purposes.
- **CSRF protection** — Double-submit cookie pattern.
- **Rate limiting** — Upstash Redis wired to sensitive endpoints.
- **Offline-first scanner** — AES-256 + PBKDF2 encryption; LWW sync.
- **Test coverage** — Scanner app has thorough unit tests.
- **Zod validation** — All API routes validate request bodies.
