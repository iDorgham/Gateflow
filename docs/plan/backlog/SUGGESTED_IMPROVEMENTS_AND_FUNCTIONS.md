# GateFlow — Suggested Improvements and Functions Map

This document is a **single, practical map** of:

- what GateFlow does today (and what’s planned), and
- what we should improve next (product + engineering), with pointers to existing deeper docs.

If you only read one document to understand “what to build next”, read this one plus `docs/PRD_v5.0.md`.

---

## 1) Platform functions (what we’re building)

### Apps and their responsibilities

| App | Who uses it | Primary functions |
|---|---|---|
| `apps/client-dashboard` | Tenant admins/users | Org + gate mgmt, QR mgmt (single/bulk), scan logs + export, analytics, webhooks, API keys, onboarding |
| `apps/scanner-app` | Gate operators | Fast scanning, offline validation + queue, bulk sync, supervisor override |
| `apps/admin-dashboard` | Platform team | Cross-tenant org/user oversight, audit logs, system analytics/monitoring (in progress) |
| `apps/marketing` | Prospects | Acquisition + landing + pricing/CTA |
| `apps/resident-portal` (planned) | Residents | Unit linking, visitor QR creation, quota tracking, access rules, visitor history |
| `apps/resident-mobile` (planned) | Residents | Native UX + push notifications + wallet/biometrics (future) |

Canonical reference: `docs/APP_DESIGN_DOCS.md`.

---

### Core platform capabilities (MVP)

| Capability | What it means | Where it lives (starting points) |
|---|---|---|
| **Multi-tenancy** | Every tenant sees only their data | Prisma models in `packages/db` + API routes in `apps/client-dashboard/src/app/api` |
| **RBAC** | ADMIN / TENANT_ADMIN / TENANT_USER / VISITOR (+ RESIDENT planned) | Shared enums in `packages/types` + auth claims in client-dashboard |
| **JWT auth + rotation** | Short access tokens + refresh tokens | Client Dashboard auth libs and API routes (see `CLAUDE.md` pointers) |
| **CSRF protection** | Double-submit cookie for web routes | `apps/client-dashboard/src/lib/csrf.ts` + middleware |
| **QR signing** | HMAC-SHA256 signed payloads | Client Dashboard QR creation + Scanner verification |
| **Offline-first scanning** | Queue scans securely when offline, sync later | `apps/scanner-app/src/lib/offline-queue.ts` + bulk sync API |
| **Scan audit logs** | Immutable-ish record of entry attempts | `ScanLog` model + scans APIs + export |
| **Analytics** | Trends, breakdowns, top gates | Client Dashboard analytics pages + APIs |
| **Integrations** | Webhooks + API keys for external systems | Client Dashboard workspace settings + API routes |

For the full feature matrix + status, see `docs/PRD_v5.0.md` and `docs/IMPROVEMENTS_AND_ROADMAP.md`.

---

### Phase 2 capabilities (Resident Portal)

Resident Portal is the planned expansion adding:

- **Unit linking** (resident ↔ unit)
- **Quota-driven visitor invites**
- **AccessRule engine** (one-time / date-range / recurring / permanent)
- **Open QR** for permanent trusted access (unit-level)
- **Resident history + notifications** (later)

Spec reference: `docs/RESIDENT_PORTAL_SPEC.md`.

---

## 2) Suggested improvements (prioritized)

This section consolidates recommendations across:

- `docs/IMPROVEMENTS_AND_ROADMAP.md` (product/UX roadmap)
- `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` (security/perf audit findings)

### P0 — Must-fix before production

Focus: **prevent auth bypass**, **protect offline sync integrity**, **avoid CSV injection**.

- **Fix insecure env var fallbacks (auth bypass risk)**
  - Client Dashboard: missing JWT secret should **throw**, not sign with an “undefined” secret.
  - Admin Dashboard: remove any hardcoded “dev” access keys; fail closed.
  - Reference: `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` (C2–C4).

- **Make scanner `scanUuid` cryptographically secure**
  - Offline sync dedup relies on scan UUID integrity.
  - Reference: `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` (C1, M2).

- **Block CSV injection on all exports**
  - Escape values that begin with `=`, `+`, `-`, `@`, and control characters.
  - Reference: `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` (B1, B2).

---

### P1 — High impact (ship next)

- **Robustness on scanner bulk sync**
  - Guard `response.json()` with try/catch + handle non-JSON server bodies.
  - Reference: audit (H1).

- **Fail fast on missing `QR_SIGNING_SECRET`**
  - Avoid any scenario where empty/weak secrets can leak into production flows.
  - Reference: audit (H2).

- **Pagination + filtering consistency for large tenants**
  - Add cursor pagination to list endpoints and tables (gates, scans, qrs).
  - Reference: `docs/IMPROVEMENTS_AND_ROADMAP.md`.

---

### P2 — Engineering quality and scale

- **Fix request-scope tenant context**
  - Avoid module-level mutable state; prefer `AsyncLocalStorage` or explicit scoping.
  - Reference: audit (M5, L4).

- **Remove duplicated utilities**
  - Consolidate `cn()` usage into `@gate-access/ui`.
  - Reference: audit (M6).

- **Type safety cleanup**
  - Replace `any` in settings/sidebar translation and tighten admin/marketing TS configs.
  - Reference: audit (M7–M9, A1–A7).

---

## 3) Phase 3 — AI & Advanced Operations (Suggested)

Beyond Phase 2, these features represent the "Enterprise Grade" evolution of GateFlow.

- **AI-Powered Traffic Insights**
    - Predict peak visitor times based on historical scan patterns.
    - Automated staff allocation suggestions for security teams.

- **Real-time Operations Bridge**
    - Real-time WebSocket updates for scan logs in Client/Admin dashboards.
    - Live "Snapshot" of active visitor count across all gates.

- **Advanced Biometric Integration**
    - Native Resident App integration with FaceID/TouchID for gate triggers.
    - Optional facial recognition support for high-security commercial zones.

- **Automated Compliance Engine**
    - Auto-generated weekly security audits.
    - Anomaly detection (e.g., unusual scan volume at 3 AM).

---

## 4) Recommended “AI-assisted” execution patterns

These patterns help keep changes correct and reduce regressions.

### For feature work (UI + API)

- **Explore first**: identify the route(s), the API endpoints, the schema, and shared UI components.
- **Design changes**: if UI/UX is non-trivial, use the `superdesign` skill before implementation.
- **Implement smallest vertical slice**: schema → API → UI → tests → docs.
- **Verify**: run `pnpm turbo lint` + `pnpm turbo typecheck` for affected workspaces (and tests if logic changed).

### For security fixes

- Prefer **fail-closed** behavior (throw at startup / return explicit 500 with safe message) over insecure defaults.
- Add/extend tests around:
  - missing env vars,
  - QR signature validation,
  - export sanitization.

### For performance work

- Start by locating hot paths (scanner nonce checks, analytics query aggregation, export loops).
- Favor algorithmic improvements first (Sets, batching, pagination).

---

## 4) Where the truth lives (avoid duplication)

- **Product truth**: `docs/PRD_v5.0.md`
- **Route map**: `docs/APP_DESIGN_DOCS.md`
- **Short roadmap**: `docs/IMPROVEMENTS_AND_ROADMAP.md`
- **Audit findings**: `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`

