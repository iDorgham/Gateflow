# TASKS: Admin Dashboard Completion v6

**Plan**: [PLAN_admin_dashboard_completion_v6.md](PLAN_admin_dashboard_completion_v6.md)
**Status**: Ready — Phase 1 next

## Phases

- [x] **Phase 1: Shell Upgrade + Admin Side Panel**
  - [x] `AdminShell` component wraps layout
  - [x] `AdminSidePanel` with AI/Logs/Chat stub tabs (h-10 tabs, ChevronRight collapse, X close)
  - [x] `PageHeader` component applied to overview page
  - [x] `h-screen` replaces `h-[105.3vh]`
  - [x] `typecheck` script added to package.json
  - [x] Lint + typecheck pass

- [x] **Phase 2: Platform Analytics Charts**
  - [x] `recharts@2.15.4` installed
  - [x] 3 Recharts chart components: ScanTrendChart (AreaChart), OrgGrowthChart (LineChart), PlanDistributionChart (BarChart)
  - [x] Analytics page rebuilt with PageHeader + org growth query + all charts
  - [x] Existing CSS bar chart replaced with Recharts interactive chart
  - [x] Lint + typecheck pass

- [x] **Phase 3: Organization Management (Full CRUD)**
  - [x] Organizations API routes: GET list + GET detail + PATCH (suspend/restore/plan change)
  - [x] `OrgsClient` client component with clickable table rows
  - [x] `OrgDetailSheet` — stats (users, gates, QR codes, total scans, this month), suspend/restore
  - [x] Search + plan filter + status filter working (server-side)
  - [x] `sonner` Toaster added to root layout
  - [x] Lint + typecheck pass

- [x] **Phase 4: Global User Management**
  - [x] Users API routes: GET list + GET detail + PATCH (deactivate/reactivate/role change)
  - [x] `UsersClient` wrapper with clickable table rows + filters (search, role, status)
  - [x] `UserDetailSheet` — scan stats, role change select, deactivate/reactivate
  - [x] Security: cannot deactivate ADMIN role users; cannot elevate to ADMIN via PATCH
  - [x] Lint + typecheck pass

- [x] **Phase 5: Admin AI Assistant**
  - [x] `ai`, `@ai-sdk/google`, `zod` installed (using Gemini, consistent with client-dashboard)
  - [x] AI route with 5 tools: getPlatformMetrics, listRecentOrgs, getOrgStats, listRecentScans, searchUsers
  - [x] `AdminAIAssistant` component — welcome card, messages, typing indicator, clear button
  - [x] Side panel AI tab wired up (replaced placeholder)
  - [x] Returns 503 if GEMINI_API_KEY missing; 401 if not admin
  - [x] Lint + typecheck pass

- [x] **Phase 6: Finance & Plans / Billing**
  - [x] Finance nav item in sidebar (Revenue group with CreditCard icon)
  - [x] Finance page: 3 KPI cards (MRR, PRO count, FREE count) + PlanTrendChart + SubscriptionTable
  - [x] Finance API route with MRR calculation (FREE=$0, PRO=$99)
  - [x] BillingPlaceholder with "Coming Q4 2026" badge and feature list
  - [x] Lint + typecheck pass

- [x] **Phase 7: Server Health Monitoring**
  - [x] Health API route: DB latency, Redis ping, scan metrics, error rate, uptime
  - [x] `MonitoringClient` polls every 30s, shows last-updated timestamp + spinner
  - [x] `ServiceStatusCard` — colored dot, latency badge, ok/error/unconfigured states
  - [x] `LiveMetricsGrid` — 4-col metric cards with highlight colors
  - [x] Redis shows "unconfigured" (amber) when env vars absent
  - [x] Lint + typecheck pass

- [x] **Phase 8: Settings + Admins Management**
  - [x] Settings page: PageHeader + CompliancePlaceholder (SOC2/GDPR, "Coming Q4 2026")
  - [x] Admins page: PageHeader + key fingerprint card + security checklist (6 items, ✓/○)
  - [x] Key fingerprint shows first 8 chars of SHA-256 hash; key length check vs 32 chars
  - [x] Lint + typecheck pass

- [x] **Phase 9: Polish + Tests + PRD Update**
  - [x] `PageHeader` applied to scans, gates, projects, audit-logs pages (all 8+ pages covered)
  - [x] `space-y-6` on all pages, design tokens used throughout
  - [x] `test` script added; Jest + ts-jest configured (jest.config.js)
  - [x] 5 API test files, 10 test cases — all pass (`pnpm test`)
  - [x] Analytics API route created (`/api/admin/analytics`)
  - [x] `PRD_v7.0.md` admin dashboard updated to ~85%, feature table updated
  - [x] Lint + typecheck + test all pass ✅

---

### ✅ Tests Verified Working

**Node.js 20** is now set as the default. All tests pass:

- Test Suites: 5 passed
- Tests: 10 passed

---

---

_Created: 2026-03-11_
