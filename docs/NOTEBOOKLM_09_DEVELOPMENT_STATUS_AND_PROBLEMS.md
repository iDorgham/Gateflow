# NOTEBOOKLM SOURCE 9: GateFlow Development Status, Active Work & Known Problems

## 1. Overall Project Status

| Attribute      | Value                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| **Product**    | GateFlow — Zero-Trust Digital Gate Infrastructure Platform                 |
| **Status**     | Production MVP · Workflow v2 Client Dashboard pilot focus                  |
| **Phase**      | Phase 1 & 2 Complete; Phase 3 (Marketing Suite) future                     |
| **Tech Stack** | Next.js 16 · Expo SDK 54 · PostgreSQL 15 · Prisma 5 · pnpm 8 · Turborepo 2 |

### MVP Completion Status

Project dashboard reports **100% MVP complete**. Major shipped features include:

- Organization CRUD and multi-tenancy
- JWT Auth (Argon2id + 15-min access / 30-day refresh)
- Single and bulk CSV QR creation
- Gate management, assignments, and shift tracking
- Offline-capable mobile scanner with 5 tabs
- RBAC with built-in + custom roles
- Live analytics dashboard
- Webhooks + API keys
- Admin authorization keys
- CSRF protection and rate limiting
- Field encryption and HMAC-SHA256 QR signing
- Supervisor override
- Advanced analytics
- Admin dashboard
- Resident portal and resident mobile app
- Marketing site (5 phases)
- Projects CRM, contacts, units
- Watchlists and incidents
- Visitor identity levels (0/1/2)
- Privacy & retention controls
- Real-time updates via SSE
- Location enforcement
- ID capture at gate

---

## 2. Recent Active Work (Unreleased Changelog)

### Scanner App

- Phase 01: device unlock gate and QR secret fail-closed
- Phase 02: onboarding wizard (PIN, biometrics toggle, camera)
- Phase 03: shift start/end and scan gate accountability
- Audit packet 2026-07-30 and active onboarding plan
- BiometricGuard inactivity lock, motion polish, error boundaries
- High-density home dashboard with ADS-compliant master scan action
- Hardening shift accountability against code-review findings

### Client Dashboard

- Share auth cookies across `gateflow.site`
- Fix shift/end body parsing under Jest after CodeRabbit autofix
- Loading skeletons for routes that lacked one
- Next billing date on billing settings page
- Polish header search input

### Resident Portal

- Phase 06: auth session and tenant containment
- Phase 07: API upstream, scannable QR, offline read
- Phase 08: pilot UX revoke, share, and sign-out
- Phase 09: i18n interim, logical CSS, and evidence
- Phase 10: pilot gate and certification packet
- CHECK_ALL 2026-07-29 focused check evidence (pilot blocked)

### Workspace / CI

- Tailwind v4 migration completed (production builds were broken)
- Workflow v2 guide/status/next/prompt/delivery bootstrap
- Reconcile CodeRabbit autofix — Babel dependency fix
- Bump `@prisma/client` to ^6.19.3
- Repair pnpm-lock.yaml after CodeRabbit autofix merge
- Vercel `ignoreCommand` to skip Dependabot and automatic Preview builds (Hobby quota)
- Production Prisma migrate unblock after failed `platform_evolution`

---

## 3. Known Problems & Risks

### 3.1 Security / Audit Residuals

| Problem / Risk                                                    | Status / Mitigation                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| Credential-rotation receipt for Phase 1 secrets                   | Non-blocking operational follow-up                      |
| CSV formula injection in audit/scans exports                      | Fixed in audit remediation (formula-character escaping) |
| SSRF via wildcard image hostname in admin/marketing               | To be fixed: restrict hostname allowlists               |
| `"strict": false` in admin-dashboard and marketing tsconfig       | To be fixed: enable strict TypeScript                   |
| Module-level mutable tenant context (`packages/db/src/tenant.ts`) | Migrated to AsyncLocalStorage fail-closed guard         |

### 3.2 Pilot / Certification Blockers

- **Resident Portal** `CHECK_ALL 2026-07-29` evidence marked as "pilot blocked" in changelog.
- Certification requires `CERTIFICATION_PACKET` to be `valid:true` with owned browser/session gates proven.
- Do not `/certify` until packet is valid.

### 3.3 Technical Debt

- `apps/design-system` is mostly build artifacts; active DS work lives in `packages/ui`.
- Some local `cn()` duplicates exist in app `utils.ts` files (audit M6).
- Scanner app has some `any` casts and runtime casts that need runtime validation.
- Resident mobile and scanner app TypeScript strictness is lower than web dashboards.

### 3.4 Operational / CI Risks

- Vercel Hobby enforces `api-deployments-free-per-day` quota.
- Lighthouse CI defaults to production URLs that may be unreachable in CI; jobs soft-pass.
- GitHub Deployments sidebar can show stale Preview failures that are not live outages.
- Production Prisma migrations can get stuck (P3009) and require `.github/workflows/db-migrate.yml` unblock.

### 3.5 Core Product Risks (from PRD)

- Cross-tenant leakage from unscoped queries.
- API contract drift across fast-changing route surfaces.
- Operational regressions in scan and guard-critical flows.
- Documentation drift between implementation and planning references.

---

## 4. Optional Future Enhancements

| Feature                     | Priority | Notes                             |
| --------------------------- | -------- | --------------------------------- |
| WhatsApp/SMS Delivery       | Low      | Phase 3 Marketing Suite           |
| LPR Integration             | Low      | Phase 4 License Plate Recognition |
| Advanced Attribution Models | Low      | Multi-touch attribution           |

---

## 5. App Status Snapshot

| App              | Port | Status         |
| ---------------- | ---- | -------------- |
| Marketing        | 3000 | ✅ Live (100%) |
| Client Dashboard | 3001 | ✅ Live (100%) |
| Admin Dashboard  | 3002 | ✅ Live (100%) |
| Scanner App      | 8081 | ✅ Live (100%) |
| Resident Portal  | 3004 | ✅ Live (100%) |
| Resident Mobile  | 8082 | ✅ Live (100%) |

---

## 6. Package Status Snapshot

| Package                   | Status    |
| ------------------------- | --------- |
| `@gate-access/db`         | ✅ Stable |
| `@gate-access/types`      | ✅ Stable |
| `@gate-access/ui`         | ✅ Stable |
| `@gate-access/api-client` | ✅ Stable |
| `@gate-access/i18n`       | ✅ Stable |
| `@gate-access/config`     | ✅ Stable |

---

## 7. Development Workflow Health

- Plan lifecycle: `Draft → Ready → Active → Complete` enforced via folder moves and `ALL_TASKS_BACKLOG.md` updates.
- `pnpm preflight` is the canonical verification gate.
- Workflow v2 adds single-app pilot focus, evidence-based page scoring, deterministic local gates, specialist contracts, and certification-locked app sequencing.
- Ralph Loop automation covers quality checks, versioning, docs release, and branch enforcement.
