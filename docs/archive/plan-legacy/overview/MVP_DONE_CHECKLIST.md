# GateFlow — MVP Done Checklist
**Date:** February 23, 2026 | **Prepared by:** Senior QA / Product Engineering

---

## A. Current MVP Status

### Overall: ~97% Complete (MVP Scope)

> The five remaining PRD v5.0 features (originally ~25%) were all addressed in the latest implementation batch. The platform is ready for staged beta launch pending final deployment and smoke testing.

---

### Feature Status Table — Full MVP Scope

#### Core Platform (Client Dashboard)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Organization CRUD + onboarding | P0 | ✅ Done | Creates default project on signup |
| User authentication (JWT + Argon2id) | P0 | ✅ Done | 15-min access token, 30-day refresh |
| Token rotation (refresh endpoint) | P0 | ✅ Done | |
| CSRF protection | P0 | ✅ Done | Double-submit cookie |
| Rate limiting (Redis/Upstash) | P0 | ✅ Done | Multi-instance safe |
| Multi-tenant row isolation | P0 | ✅ Done | orgId on every query |
| Single QR code creation | P0 | ✅ Done | HMAC-SHA256 signed |
| Bulk CSV QR creation | P0 | ✅ Done | |
| Gate management (CRUD) | P0 | ✅ Done | |
| Scan logs with full audit trail | P0 | ✅ Done | `auditTrail` JSON array |
| Basic RBAC (ADMIN / TENANT_ADMIN / TENANT_USER) | P0 | ✅ Done | |
| Live dashboard (KPI cards + recent scans) | P0 | ✅ Done | |
| Team management | P1 | ✅ Done | |
| Webhooks (creation + delivery) | P1 | ✅ Done | Retry logic included |
| API keys with scopes | P1 | ✅ Done | |
| Field encryption (webhook secrets) | P1 | ✅ Done | |
| QR code export / download | P1 | ✅ Done | |
| Scan log export (CSV) | P1 | ✅ Done | |
| **Multi-project support** | P2 | ✅ **NEW** | Full switcher + CRUD |
| **Advanced analytics (Recharts)** | P1 | ✅ **NEW** | Line, bar, pie, heatmap |
| **Analytics date range picker** | P1 | ✅ **NEW** | 7d / 30d / custom |
| **Analytics print/PDF export** | P1 | ✅ **NEW** | `window.print()` |

#### Scanner App

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Login / JWT auth | P0 | ✅ Done | SecureStore tokens |
| Camera QR scanning | P0 | ✅ Done | |
| Local HMAC verification | P0 | ✅ Done | Offline-first |
| Offline queue + sync | P0 | ✅ Done | PBKDF2 encryption, dedup |
| Offline scan dedup (scanUuid) | P0 | ✅ Done | |
| Gate selector | P1 | ✅ Done | Persisted to AsyncStorage |
| Queue status UI | P1 | ✅ Done | |
| Location context (non-blocking) | P2 | ✅ Done | Best-effort |
| **Supervisor override (UI + PIN)** | P1 | ✅ **NEW** | Full modal, 3-attempt logic |
| **Supervisor override (server audit log)** | P1 | ✅ **NEW** | Appends to `auditTrail` |
| Scan history (local) | P2 | ⚠️ Partial | AsyncStorage log only, no UI |

#### Admin Dashboard

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Super-admin auth (separate JWT check) | P0 | ✅ Done | |
| System overview (KPIs + health) | P0 | ✅ Done | |
| Organization management (list, search, suspend, plan) | P0 | ✅ Done | |
| User management (list, search, suspend) | P0 | ✅ Done | |
| **Clickable org rows → search filter** | P2 | ✅ **NEW** | |
| System-wide analytics | P1 | ⚠️ Partial | Basic scan counts only |
| Billing management | P1 | ❌ Not built | Phase 2 |
| Compliance reporting | P2 | ❌ Not built | Phase 2 |

#### Marketing Website

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Landing page (hero, features, use cases, testimonials) | P0 | ✅ Done | |
| Pricing page with comparison table + FAQ | P1 | ✅ Done | |
| Contact form with success state | P1 | ✅ Done | |
| Nav + footer | P0 | ✅ Done | |
| **Open Graph + Twitter metadata** | P1 | ✅ **NEW** | |
| Features dedicated page | P1 | ❌ Not built | Covered by landing sections |
| Blog / Case studies | P2 | ❌ Not built | Phase 2 |

#### Resident Portal

| Feature | Priority | Status | Notes |
|---|---|---|---|
| All resident features | P0–P3 | ❌ Not built | Explicitly Phase 2 in PRD v5.0 |

---

### What Was Added in This Batch (Feb 23, 2026)

| # | Item |
|---|---|
| 1 | `Project` model in Prisma schema + migration (backfills default project per org) |
| 2 | `project-cookie.ts` helpers (`getCurrentProjectId`, `getValidatedProjectId`) |
| 3 | `/api/projects` — GET list, POST create |
| 4 | `/api/projects/[id]` — PATCH rename, DELETE soft-delete (refuses last project) |
| 5 | `/api/project/switch` — sets `gf_current_project` httpOnly cookie |
| 6 | `DashboardShell` — `ProjectSwitcher` dropdown, `Projects` in workspace nav |
| 7 | Dashboard layout passes `projects` + `currentProjectId` to shell |
| 8 | Gates, QR codes, scans, analytics pages filtered by `projectId` |
| 9 | Gate/QR create actions write `projectId` from cookie |
| 10 | `/dashboard/projects` management page (list, create, rename, delete) |
| 11 | Onboarding creates default `Project` on org completion, sets cookie |
| 12 | `recharts@^2.12.7` added to client-dashboard |
| 13 | `analytics-charts.tsx` — LineChart, horizontal BarChart, PieChart, heatmap grid |
| 14 | Analytics page — date range picker (7d/30d/custom), heatmap raw SQL, role breakdown |
| 15 | `print-button.tsx` — `window.print()` with `.no-print` class |
| 16 | `/api/override/log` — appends `supervisor_override` to `ScanLog.auditTrail` |
| 17 | `SupervisorOverride.tsx` — `onGranted(supervisorAuth, reason)` signature |
| 18 | `App.tsx` — `lastRejectedQRData` ref, fire-and-forget server audit log on override |
| 19 | Admin overview — org name rows are clickable links |
| 20 | Marketing layout — `openGraph` + `twitter` metadata |

---

## B. Remaining Critical Items Before Launch

### Bugs & Known Issues

| Severity | Item | File / Area |
|---|---|---|
| 🔴 High | `prisma migrate deploy` not yet run — new `Project` columns missing from DB | DB |
| 🔴 High | `recharts` not yet installed — run `pnpm install` before building | client-dashboard |
| 🟡 Med | `analytics-charts.tsx` uses `<style jsx global>` — requires `styled-jsx` or Next.js support; verify no CSP violation | analytics |
| 🟡 Med | Heatmap raw SQL returns `bigint` for `count`; serialised via `Number()` — verify no precision loss on very high counts | analytics/page.tsx |
| 🟡 Med | `ProjectSwitcher` does a plain `fetch` without CSRF token — the `/api/project/switch` POST should either exempt CSRF or the switcher should pass it | shell.tsx |
| 🟡 Med | Supervisor override API call in `App.tsx` uses `Authorization: Bearer` header — confirm `getValidAccessToken()` returns the scanner JWT (not dashboard JWT) and that the override endpoint accepts Bearer in addition to cookie | App.tsx / override/log |
| 🟡 Med | Gates page now filters by `projectId` — if a user has no cookie set and `getValidatedProjectId` falls back to first project, new orgs without a project may show 0 gates | gates/page.tsx |
| 🟠 Low | `deletedAt` filter on `getValidatedProjectId` uses Prisma but cookie may cache a now-deleted project ID; page-level fallback handles it, but the stale cookie persists indefinitely | project-cookie.ts |
| 🟠 Low | `window.location.href` on admin overview org row click — not a Next.js `router.push`, causes full page reload | admin/page.tsx |
| 🟠 Low | Scan log export (`/api/scans/export`) not yet filtered by `projectId` | scans/export/route.ts |

### Security Quick Checks

| Check | Status |
|---|---|
| All new POST routes verify `getSessionClaims()` → 401 on missing | ✅ |
| `/api/projects/[id]` PATCH/DELETE verifies ownership (`organizationId`) before mutating | ✅ |
| `/api/project/switch` validates project belongs to org before setting cookie | ✅ |
| `/api/override/log` verifies gate belongs to org | ✅ |
| Raw SQL heatmap uses Prisma tagged template literals (parameterised) — no SQL injection | ✅ |
| `gf_current_project` cookie is `httpOnly + sameSite: lax` | ✅ |
| CSRF check missing on `/api/project/switch` (plain `fetch` without token) | ⚠️ Fix before prod |
| Override log endpoint accepts Bearer token — ensure scanner can't call dashboard-only endpoints | ⚠️ Verify scope |

### Performance Quick Checks

| Check | Notes |
|---|---|
| Analytics daily loop makes N sequential Prisma queries (one per day) | Acceptable for ≤30d; use `groupBy` + date_trunc for >30d custom ranges |
| Heatmap raw SQL — missing `EXPLAIN ANALYZE`; add index on `scannedAt` if not present | Already indexed in schema |
| `getValidatedProjectId` makes 1–2 DB round trips on every page load | Accept for MVP; cache in session layer post-MVP |
| `prisma.project.findMany` in dashboard layout on every navigation | Acceptable; consider adding `staleTime` once RSC caching is configured |

### Final Test Scenarios

| Scenario | Expected | Priority |
|---|---|---|
| Register → onboarding → dashboard | Default project created, cookie set, gates page shows empty state for that project | 🔴 P0 |
| Create gate → verify it appears only in current project | Gate scoped to project | 🔴 P0 |
| Switch project via dropdown → page refreshes → different gates shown | `gf_current_project` cookie updated | 🔴 P0 |
| Create QR code → verify it's scoped to current project | `projectId` set on QRCode record | 🔴 P0 |
| Scanner login → select gate → scan valid QR → SUCCESS | Scan log created | 🔴 P0 |
| Scan invalid/expired QR → REJECTED → tap Override → enter reason + PIN | `auditTrail` updated server-side | 🔴 P0 |
| Scan offline → reconnect → queue syncs | Offline queue drains, dedup by scanUuid | 🔴 P0 |
| Analytics page → 7d → 30d → custom range → charts update | All 4 charts re-render with correct data | 🟡 P1 |
| Analytics print → charts visible in print preview | `.no-print` elements hidden | 🟡 P1 |
| Create second project → rename → delete (refuses if last) | PATCH/DELETE API responses correct | 🟡 P1 |
| Admin login → view orgs → click org name → filtered search | Redirects to `/organizations?q=...` | 🟠 P2 |
| Marketing site — check OG tags in `<head>` | Twitter card + OG title rendered | 🟠 P2 |

---

## C. Launch Readiness Checklist

### Pre-Deploy (One-Time)

```bash
# 1. Apply new migration (adds Project table, backfills existing orgs)
pnpm --filter @gate-access/db exec prisma migrate deploy

# 2. Regenerate Prisma client
pnpm --filter @gate-access/db exec prisma generate

# 3. Install new dependency (recharts)
pnpm install

# 4. Build all apps
pnpm build

# 5. Smoke-test locally
pnpm --filter client-dashboard dev
```

### Environment Variables (verify all are set in production)

| Variable | App | Required For |
|---|---|---|
| `DATABASE_URL` | All | Prisma |
| `JWT_SECRET` | client-dashboard, admin | Auth |
| `QR_SIGNING_SECRET` | client-dashboard, scanner-app | QR HMAC |
| `EXPO_PUBLIC_QR_SECRET` | scanner-app | Local QR verify |
| `EXPO_PUBLIC_API_URL` | scanner-app | Server calls |
| `UPSTASH_REDIS_REST_URL` | client-dashboard | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | client-dashboard | Rate limiting |
| `ENCRYPTION_KEY` | client-dashboard | Field encryption |
| `NEXT_PUBLIC_APP_URL` | client-dashboard | CSRF origin check |
| `NODE_ENV=production` | All | Cookie `secure` flag |

### Deployment Steps (Production)

1. **Database migration** — run `prisma migrate deploy` against production DB; confirm row counts on `Project` table match `Organization` count
2. **Build** — `pnpm build` for `client-dashboard`, `admin-dashboard`, `marketing`
3. **Scanner OTA** — publish Expo update or build new `.ipa`/`.apk` with updated `App.tsx` + `SupervisorOverride.tsx`
4. **Deploy web apps** — push to Vercel/Railway/VPS; confirm health endpoint responds
5. **Verify Redis** — confirm Upstash rate limiting still functional post-deploy
6. **Tail logs** — watch for `prisma` errors referencing missing `projectId` column (would indicate migration didn't run)

### Rollback Plan

| Failure Point | Rollback Action |
|---|---|
| Migration fails mid-run | `prisma migrate resolve --rolled-back 20260223000000_add_projects`; the nullable columns mean existing code still runs |
| `projectId` queries break existing APIs | `projectId` columns are nullable — all legacy code operates without it; remove `projectId` filter from pages as hotfix |
| Recharts causes client bundle error | Remove `analytics-charts.tsx` import, fall back to existing CSS bar chart temporarily |
| Scanner override audit call fails | Fire-and-forget — client-side override still works; server log is best-effort |
| Cookie-based project switching breaks auth | Delete `gf_current_project` cookie; `getValidatedProjectId` falls back to first project automatically |

### Monitoring (First 72 Hours)

- Watch for `500` errors on `/api/projects`, `/api/project/switch`, `/api/override/log`
- Alert on Prisma `P2025` (record not found) spikes — indicates stale project cookie issue
- Track analytics page load time — raw SQL heatmap may be slow on large datasets
- Confirm scanner app can reach `${API_BASE}/api/override/log` from field devices (firewall/CORS)

---

### Beta User Onboarding (First 5 Users)

| Step | Action |
|---|---|
| 1 | Whitelist their email; send invite link to `/login` |
| 2 | Walk through onboarding flow — org name, admin email → default project auto-created |
| 3 | Create 1–2 gates under the default project |
| 4 | Create 5–10 QR codes (mix of SINGLE + RECURRING) |
| 5 | Install scanner app on test device; login; select gate; run 10 test scans |
| 6 | Test one rejection → supervisor override → confirm `auditTrail` updated in Scan Logs |
| 7 | Open Analytics → verify data appears for their scans |
| 8 | Create a second project → switch → confirm data isolation |
| 9 | Collect feedback via WhatsApp / Google Form (no in-app feedback yet) |
| 10 | Monitor their logs in Admin Dashboard for any anomalies |

---

## D. Post-MVP Quick Wins (Phase 1.5)

Suggested additions for the **4–6 weeks after MVP launch**, ordered by user impact vs. effort:

| Priority | Feature | Effort | Impact | Why Now |
|---|---|---|---|---|
| 🔴 1 | **Resident Portal (Web)** — unit linking, visitor QR, quota tracking | 3 weeks | Very High | Core B2B differentiator for compound market |
| 🔴 2 | **CSRF token on ProjectSwitcher** — pass token in fetch headers | 30 min | High (security) | Known gap; fix immediately |
| 🟡 3 | **Scan log export filtered by projectId** | 2 hours | Medium | Current export ignores project scope |
| 🟡 4 | **Real-time scan feed** on dashboard (WebSocket or SSE polling) | 1 day | High | Security heads want live view |
| 🟡 5 | **Email notification on override** — email TENANT_ADMIN when forced override is used | 4 hours | High | Audit trail for security managers |
| 🟡 6 | **Analytics: groupBy date_trunc** (replace per-day loop with single SQL query) | 2 hours | Medium (perf) | Current loop is O(N days) round trips |
| 🟠 7 | **Scan history UI in scanner app** — local log list | 1 day | Medium | Operator asks "did this badge scan before?" |
| 🟠 8 | **Project-scoped webhook filters** — fire webhook only for current project's events | 3 hours | Medium | Multi-project orgs get noise otherwise |
| 🟠 9 | **Admin system-wide analytics** — full Recharts charts on admin dashboard | 1 day | Medium | Requested for platform oversight |
| 🟠 10 | **In-app feedback widget** — simple rating + text on dashboard footer | 4 hours | Low/Medium | Replaces WhatsApp feedback loop |
| 🔵 11 | **Dark mode** | 2 days | Low | Nice-to-have; Tailwind already supports it |
| 🔵 12 | **Billing integration (Stripe or Paymob)** | 1 week | High (revenue) | Needed before scaling past 10 customers |

---

*Document generated: 2026-02-23 | GateFlow Engineering*
