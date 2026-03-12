# PLAN: Admin Dashboard Completion v6

**Slug:** `admin_dashboard_completion_v6`
**App:** `apps/admin-dashboard`
**Status:** Ready
**Source:** PRD v6.0 §3.1 — GateFlow Control (Admin Dashboard)
**Port:** 3002

---

## Context snapshot

### Existing state (~25% complete)

| Area | Status |
|---|---|
| Sidebar + collapse + RTL | ✅ Done (good quality) |
| Login page + ADMIN_ACCESS_KEY auth | ✅ Done |
| Dashboard layout (basic) | ✅ — no AI panel, no side panel |
| Overview page (stats + recent orgs + system health) | ✅ Functional |
| Organizations list page | ⚠️ Partial — list + search exists, no detail/CRUD |
| Analytics page | ⚠️ Partial — data queries exist, no charts |
| Users page | ⚠️ Stub |
| Monitoring page | ⚠️ Stub |
| Settings page | ⚠️ Stub |
| Admins page | ⚠️ Stub |
| Finance / Plans / Billing | ❌ Missing |
| AI right panel | ❌ Missing |
| Recharts / visual charts | ❌ Missing |
| Server-side health API | ❌ Missing |

### Key architecture constraints

- Admin-dashboard has direct Prisma access (`@gate-access/db`) — keep all API routes inside `apps/admin-dashboard/src/app/[locale]/api/admin/`
- Auth: `ADMIN_ACCESS_KEY` cookie via `src/lib/admin-auth.ts` — call `requireAdmin()` in every server component and API route
- Auth pattern: check `isAdminAuthenticated()` in API routes and return 401 if false
- UI: `@gate-access/ui` components only — no local copies
- Shared components from client-dashboard may be imported directly (same monorepo) — prefer extraction to `@gate-access/ui` for reusable ones
- Soft deletes: always filter `deletedAt: null` on tenant data
- Multi-tenancy: admin views span ALL orgs — never accidentally scope to a single `organizationId` unless filtering by it deliberately

---

## Phases

| # | Title | Role | Files changed (est.) | Depends on |
|---|---|---|---|---|
| 1 | Shell Upgrade + Admin Side Panel | FRONTEND | 4–6 | — |
| 2 | Platform Analytics Charts | FULLSTACK | 5–7 | Phase 1 |
| 3 | Organization Management (full CRUD) | FULLSTACK | 5–7 | Phase 1 |
| 4 | Global User Management | SECURITY | 4–6 | Phase 3 |
| 5 | Admin AI Assistant | FULLSTACK | 5–7 | Phase 1 |
| 6 | Finance & Plans / Billing | FULLSTACK | 5–7 | Phase 3 |
| 7 | Server Health Monitoring | FULLSTACK | 4–6 | Phase 1 |
| 8 | Settings + Admins Management | FULLSTACK | 4–5 | Phase 1 |
| 9 | Polish + Tests + PRD Update | QA | 6–10 | All |

---

## Phase Detail

### Phase 1 — Shell Upgrade + Admin Side Panel

**Goal:** Upgrade the dashboard layout to support a collapsible right-side panel (matching client-dashboard UX). Panel has tabs: AI / Tasks / Chat (stubs for now). Header polish.

**Key files:**
- `src/app/[locale]/(dashboard)/layout.tsx` — add `AdminShell` wrapper + side panel slot
- `src/components/admin-shell.tsx` — new shell: sidebar + main + right panel, all in flex row
- `src/components/admin-side-panel.tsx` — collapsible right panel with Tabs (AI | Logs | Chat stubs)
- `src/app/[locale]/(dashboard)/page.tsx` — apply `PageHeader` from `@gate-access/ui` (or local)

**Acceptance:** Shell renders with toggle button; panel opens/closes; all pages load without TS errors; lint passes.

---

### Phase 2 — Platform Analytics Charts

**Goal:** Replace the placeholder analytics page with real Recharts-powered charts: scan volume trends (30d), org growth over time, plan distribution pie, top orgs by scan count.

**Key files:**
- `package.json` — add `recharts`
- `src/app/[locale]/(dashboard)/analytics/page.tsx` — rebuild with chart components
- `src/app/[locale]/api/admin/analytics/route.ts` — new: aggregated analytics data endpoint
- `src/components/analytics/ScanTrendChart.tsx`
- `src/components/analytics/OrgGrowthChart.tsx`
- `src/components/analytics/PlanDistributionChart.tsx`

**Acceptance:** Three charts render with real data; lint + typecheck pass; recharts installed.

---

### Phase 3 — Organization Management (full CRUD)

**Goal:** Complete organizations page: search + filter, full data table with all columns, detail sheet (view stats, plan badge, suspend/restore action, link to users). API routes for listing and patching.

**Key files:**
- `src/app/[locale]/(dashboard)/organizations/page.tsx` — full rebuild
- `src/app/[locale]/api/admin/organizations/route.ts` — GET list with search/filter
- `src/app/[locale]/api/admin/organizations/[id]/route.ts` — GET detail + PATCH (suspend/restore)
- `src/components/organizations/OrgDetailSheet.tsx`
- `src/components/organizations/OrgTable.tsx`

**Acceptance:** Suspend/restore works; search+filter works; detail sheet shows users count, scans count, gates count; lint passes.

---

### Phase 4 — Global User Management

**Goal:** Users page with cross-org user list, search, role badge, org filter. Detail panel: view user info, change role (within admin-allowed roles), deactivate/reactivate.

**Key files:**
- `src/app/[locale]/(dashboard)/users/page.tsx` — full rebuild
- `src/app/[locale]/api/admin/users/route.ts` — GET with search/filter + org filter
- `src/app/[locale]/api/admin/users/[id]/route.ts` — GET + PATCH (role, active status)
- `src/components/users/UserDetailSheet.tsx`

**Acceptance:** Cross-org user list renders; role change API works; deactivation works; SECURITY role loads `gf-security` skill; lint passes.

---

### Phase 5 — Admin AI Assistant

**Goal:** Implement the AI right panel tab. Admin-specific tools: `getOrgStats`, `listRecentOrgs`, `getPlatformMetrics`, `listRecentScans`, `searchUsers`. Uses same `useChat` + `ai` SDK pattern as client-dashboard.

**Key files:**
- `package.json` — add `ai ^4.3.0`, `@ai-sdk/anthropic ^1.1.0`, `zod ^3.22.4`
- `src/app/[locale]/api/admin/ai/assistant/route.ts` — new AI route with admin tools
- `src/components/admin-ai-assistant.tsx` — full AI chat component (port from client-dashboard)
- `src/components/admin-side-panel.tsx` — wire AI tab to real component

**Acceptance:** AI chat sends/receives messages; at least 3 tools work; 503 if `ANTHROPIC_API_KEY` missing; lint + typecheck pass.

---

### Phase 6 — Finance & Plans / Billing

**Goal:** New Finance section: subscriptions list (org + plan + status), per-org revenue summary, invoice placeholder, Stripe webhook placeholder. Add "Finance" nav item to sidebar.

**Key files:**
- `src/app/[locale]/(dashboard)/finance/page.tsx` — new page
- `src/app/[locale]/api/admin/finance/route.ts` — GET: per-org plan + MRR estimate
- `src/components/finance/SubscriptionTable.tsx`
- `src/components/finance/RevenueSummaryCard.tsx`
- `src/components/Sidebar.tsx` — add Finance nav item

**Acceptance:** Finance page loads with org plan data; MRR estimation from plan counts; nav item appears; lint passes.

---

### Phase 7 — Server Health Monitoring

**Goal:** Replace stub monitoring page with real health checks: DB connectivity, Redis connectivity (or graceful degradation), recent scan queue length, rate-limit stats (if Upstash available), error rate from recent logs. Polled every 30s client-side.

**Key files:**
- `src/app/[locale]/(dashboard)/monitoring/page.tsx` — client component with polling
- `src/app/[locale]/api/admin/health/route.ts` — health check endpoint (DB ping, Redis ping, scan backlog, recent error count)
- `src/components/monitoring/ServiceStatusCard.tsx`
- `src/components/monitoring/LiveMetricsGrid.tsx`

**Acceptance:** Health endpoint returns JSON `{ db, redis, scanBacklog, recentErrors }`; page auto-refreshes every 30s; individual service card shows green/amber/red; lint passes.

---

### Phase 8 — Settings + Admins Management

**Goal:** Settings page with platform-wide config (read from `Organization` where type=platform or key-value store), compliance placeholder, notifications preferences. Admins page: list of admin users, ability to add/revoke admin access key.

**Key files:**
- `src/app/[locale]/(dashboard)/settings/page.tsx` — full rebuild
- `src/app/[locale]/(dashboard)/admins/page.tsx` — full rebuild
- `src/app/[locale]/api/admin/settings/route.ts` — GET/PATCH platform settings
- `src/components/settings/PlatformSettingsForm.tsx`
- `src/components/settings/CompliancePlaceholder.tsx`

**Acceptance:** Settings form renders and submits; compliance section has placeholder; admins page shows current admin token (hashed); lint passes.

---

### Phase 9 — Polish + Tests + PRD Update

**Goal:** Visual polish (consistent design tokens, dark mode, spacing), add `typecheck` script, basic tests for all API routes and key components, update `docs/PRD_v6.0.md` admin dashboard status.

**Key files:**
- `package.json` — add `typecheck` script + Jest config
- All pages — consistent `PageHeader`, `space-y-6` section spacing
- `src/app/[locale]/(dashboard)/layout.tsx` — final layout adjustments
- `*.test.ts` — API route tests for health, organizations, users, analytics
- `docs/PRD_v6.0.md` — update admin dashboard completion %

**Acceptance:** `pnpm turbo typecheck --filter=admin-dashboard` passes; `pnpm turbo test --filter=admin-dashboard` passes; all pages visually consistent; PRD updated.

---

## API Route Map

All routes under `apps/admin-dashboard/src/app/[locale]/api/admin/`:

| Route | Method | Purpose |
|---|---|---|
| `analytics/route.ts` | GET | Platform metrics (KPIs, trends) |
| `organizations/route.ts` | GET | List orgs with search/filter/pagination |
| `organizations/[id]/route.ts` | GET, PATCH | Org detail + suspend/restore |
| `users/route.ts` | GET | List users cross-org |
| `users/[id]/route.ts` | GET, PATCH | User detail + role/status |
| `finance/route.ts` | GET | Plan/MRR breakdown |
| `health/route.ts` | GET | DB/Redis/queue health |
| `settings/route.ts` | GET, PATCH | Platform settings |
| `ai/assistant/route.ts` | POST | AI assistant (admin tools) |

All routes call `isAdminAuthenticated()` and return 401 if false.

---

## Shared Component Reuse

| Component | Source | Action |
|---|---|---|
| `PageHeader` | `apps/client-dashboard/src/components/dashboard/page-header.tsx` | Copy or import directly |
| `FilterBar` | `apps/client-dashboard/src/components/dashboard/filter-bar.tsx` | Import from `@gate-access/ui` (after extraction) or copy |
| `SidePanel` pattern | `apps/client-dashboard/src/components/dashboard/side-panel.tsx` | New admin version |
| `AIAssistant` pattern | `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx` | New admin version |
| All shadcn-style UI | `@gate-access/ui` | Import directly |
| Recharts components | `recharts` | Install in admin-dashboard |

---

## Key Constraints (enforced in every phase)

1. `requireAdmin()` at top of every server component; `isAdminAuthenticated()` in every API route
2. Never hard-delete — use `deletedAt` for soft deletes
3. Never accidentally scope to single `organizationId` in platform-wide queries
4. All DB access via `@gate-access/db` (Prisma client)
5. `pnpm` only — no npm/yarn
6. `pnpm turbo lint --filter=admin-dashboard` must pass per phase
7. `pnpm turbo typecheck --filter=admin-dashboard` must pass per phase

---

*Created: 2026-03-11*
