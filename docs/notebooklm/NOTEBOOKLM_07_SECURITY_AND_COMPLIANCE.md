# NOTEBOOKLM SOURCE 7: GateFlow Security, Compliance & Privacy Architecture

## 1. Security Posture

GateFlow is a **zero-trust digital gate infrastructure**. Security is enforced at three layers:

1. **Core rules** — always-on invariants (multi-tenancy, soft deletes, QR signing, secrets).
2. **Contracts** — implementation-level guarantees (queries, tokens, scanner behavior).
3. **Specialist guidance** — security skills and PRD requirements.

---

## 2. Non-Negotiable Security Invariants

| #   | Invariant                                                                                                                                                                                                                                      | Where Enforced                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | Every tenant query **must** include `organizationId` scope.                                                                                                                                                                                    | Contracts, core rules, tenant DB guard |
| 2   | Soft deletes only — filter `deletedAt: null` on tenant-facing reads for models with `deletedAt`; never hard-delete tenant data. (Exception: global-admin forensic queries explicitly include soft-deleted records for audit trail visibility.) | Contracts, schema, Prisma queries      |
| 3   | QR payloads **must** be HMAC-SHA256 signed with `QR_SIGNING_SECRET`.                                                                                                                                                                           | QR create/validate routes              |
| 4   | Tokens stored in **secure cookies** (web) or **SecureStore** (mobile) — never `localStorage`.                                                                                                                                                  | Auth helpers, scanner/resident apps    |
| 5   | `scanUuid` is the deduplication key for scan sync — contract must not change.                                                                                                                                                                  | Offline queue, bulk sync API           |
| 6   | Security-critical env vars fail closed if missing (refuse to start).                                                                                                                                                                           | Auth, QR, Redis, cron helpers          |
| 7   | No direct DB access from mobile apps — all flows go through the API layer.                                                                                                                                                                     | Architecture constraint                |

---

## 3. Multi-Tenancy & Data Isolation

- The primary tenant boundary is `Organization`.
- Every database query scoped to tenant data must explicitly filter by `organizationId`.
- App Router API routes enforce request-local fail-closed tenant scoping via `AsyncLocalStorage` (`packages/db/src/tenant.ts`).
- A privileged Prisma client exists for explicit cross-tenant operations (e.g., super-admin analytics).
- Mutable models use `deletedAt: DateTime?`; standard queries include `deletedAt: null`.

---

## 4. Authentication & Session Architecture

### Access Tokens

- JWT signed with HS256 via `jose`.
- 15-minute expiry.
- Issuer/audience: `gateflow` / `gateflow-api`.
- Claims: `sub` (userId), `email`, `role`, `orgId`.

### Refresh Tokens

- Long-lived, stored in DB (`RefreshToken` model) with rotation.
- On refresh, old token is invalidated and a new token is issued.
- 30-day lifetime.

### Storage

- **Web**: secure, HttpOnly cookies (never `localStorage`).
- **Mobile**: Expo SecureStore (never plain AsyncStorage).

### Password Hashing

- Argon2id for credential passwords.

### Cross-Subdomain SSO

- Production client-dashboard uses `AUTH_COOKIE_DOMAIN=.gateflow.site` for cross-subdomain SSO with `portal.gateflow.site`.
- Matching JWT / `NEXTAUTH_SECRET` across apps is required.

---

## 5. QR Security & Scanner Invariants

- All QR payloads are **HMAC-SHA256 signed** using `QR_SIGNING_SECRET`.
- Scanner app verifies signatures **offline** using a shared secret.
- Offline scan queue is encrypted with **AES-256 + PBKDF2**.
- `scanUuid` is the immutable deduplication key for sync.
- Unsigned QR codes are never accepted.

---

## 6. RBAC & Permissions

RBAC is enforced via:

- `Role` model in Prisma (`packages/db/prisma/schema.prisma`).
- JSON `permissions` map (e.g., `gates:manage`, `scans:override`, `roles:manage`).
- `User.roleId` linking to a `Role`.

### Built-in Roles

| Role               | Scope                                               |
| ------------------ | --------------------------------------------------- |
| Super Admin        | Platform-level                                      |
| Organization Admin | Full tenant control                                 |
| Security Manager   | Security, analytics, overrides, watchlists          |
| Gate Operator      | Scanner-focused, limited permissions                |
| Resident           | Resident portal/mobile with visitor QR capabilities |

Custom roles can be narrower but **never** grant more power than the creating admin already has.

---

## 7. Visitor Identity & Trust Levels

| Level   | Description                                              | Typical Use Cases                |
| ------- | -------------------------------------------------------- | -------------------------------- |
| Level 0 | Basic details: name + phone                              | Casual guests, low-risk events   |
| Level 1 | ID photo capture at gate (front/back), stored with scan  | Contractors, vendors, long stays |
| Level 2 | ID OCR + matching (name/ID number vs invite data) — stub | High-security compounds (future) |

- Org default: `Organization.requiredIdentityLevel` (default 0).
- Gate override: `Gate.requiredIdentityLevel` (null = use org default).
- Artifacts stored in `ScanAttachment`; retrieval is org-scoped and requires `gates:manage`.

---

## 8. Watchlists, Guard Shifts & Incidents

### Watchlists

- Person entries (name, optional ID/phone/notes); future vehicle/plate support.
- Checked on every scan (online and sync).
- On match: hard-stop scanner UI + automatic incident creation.
- Changes are role-restricted and audit-logged.

### Guard Shifts

- Guards start/end shifts in scanner app.
- Every scan, override, and incident tagged with shiftId, operatorId, gateId.
- KPIs: scans per shift/guard, override rate, incident rate.

### Incidents

- Reason codes: fake QR, tailgating, aggressive visitor, barrier failure, etc.
- States: Under Review → Resolved / Escalated.
- Reviewed in dashboards by Security Managers.

---

## 9. Scanner Policies & Gate Controls

### Gate–Account Assignment

- Operator accounts may be restricted to specific gates.
- Scanner shows only allowed gates.
- APIs reject scans for gates the operator is not assigned to.

### Location Enforcement (Optional)

- Per-gate latitude/longitude/radius.
- Haversine distance check on server for single-scan validate and bulk-sync.
- Rejection reason: `not_on_location`.
- If device location is unavailable/denied when rule is on, scan is rejected (not queued as success).

---

## 10. Privacy & Data Retention

### Resident / Visitor Privacy Settings

- `Organization.maskResidentNameOnLandingPage`
- `Organization.showUnitOnLandingPage`
- Applied on resident portal/landing guest-facing content.

### Data Retention Controls (Tenant-Level)

- `scanLogRetentionMonths`
- `visitorHistoryRetentionMonths`
- `idArtifactRetentionMonths`
- `incidentRetentionMonths`
- Null = keep indefinitely; values 1–120 months.
- Cleanup job: `packages/db/scripts/retention-cleanup.ts` (placeholder / to be implemented).
- Future: legal-hold flags to prevent automatic deletion.

---

## 11. API Security Patterns

- Input validation with Zod on all mutation routes.
- CSRF double-submit cookie pattern on cookie-auth web routes.
- Rate limiting via Upstash Redis on sensitive endpoints (auth, exports, bulk ops).
- Shared HSTS + CSP headers across Next.js apps.
- Admin/API routes use `withApiGuards` / `requireAdminApi` helpers.
- Cron and privileged automation fail closed without strong secrets.

---

## 12. Secrets & Configuration

- `.env` / `.env.local` files must never be committed.
- Only `.env.example` files with placeholder values are tracked.
- Security-critical env vars must **fail closed** on missing/invalid values.
- Key env vars: `DATABASE_URL`, `DIRECT_DATABASE_URL`, `NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, `REDIS_URL`, `ADMIN_ACCESS_KEY`.

---

## 13. Known Security Risks & Mitigations

| Risk                                       | Mitigation                                                        |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Cross-tenant leakage from unscoped queries | AsyncLocalStorage fail-closed tenant guard; code-review/CI checks |
| JWT secret fallback to weak value          | Startup throw if secret missing (post-audit fix)                  |
| Admin key hardcoded default                | Enforce min-length and env-only value (post-audit fix)            |
| QR signing bypass via empty secret         | Startup throw if `QR_SIGNING_SECRET` missing (post-audit fix)     |
| CSV formula injection in exports           | Add formula-character escaping (post-audit fix)                   |
| SSRF via wildcard image hostname           | Restrict hostname allowlists (post-audit fix)                     |
