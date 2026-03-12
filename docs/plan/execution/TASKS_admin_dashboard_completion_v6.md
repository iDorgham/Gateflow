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

- [ ] **Phase 2: Platform Analytics Charts**
  - [ ] `recharts` installed
  - [ ] Analytics API route (`/api/admin/analytics`)
  - [ ] 4 chart components: ScanTrend, OrgGrowth, PlanDistribution, TopOrgs
  - [ ] Analytics page rebuilt with real data
  - [ ] Lint + typecheck pass

- [ ] **Phase 3: Organization Management (Full CRUD)**
  - [ ] Organizations API routes (list + detail + suspend/restore)
  - [ ] `OrgTable` component
  - [ ] `OrgDetailSheet` component
  - [ ] Search + filter + pagination working
  - [ ] Lint + typecheck pass

- [ ] **Phase 4: Global User Management**
  - [ ] Users API routes (list + detail + role change + deactivate)
  - [ ] `UserTable` component
  - [ ] `UserDetailSheet` component
  - [ ] Security: admin cannot deactivate themselves
  - [ ] Lint + typecheck pass

- [ ] **Phase 5: Admin AI Assistant**
  - [ ] `ai`, `@ai-sdk/anthropic`, `zod` installed
  - [ ] AI assistant API route with 5 platform tools
  - [ ] `AdminAIAssistant` component
  - [ ] Side panel AI tab wired up
  - [ ] Lint + typecheck pass

- [ ] **Phase 6: Finance & Plans / Billing**
  - [ ] Finance nav item in sidebar
  - [ ] Finance page with MRR, subscriptions table, plan chart
  - [ ] Finance API route
  - [ ] Stripe placeholder section
  - [ ] Lint + typecheck pass

- [ ] **Phase 7: Server Health Monitoring**
  - [ ] Health API route (DB + Redis + metrics)
  - [ ] Monitoring page with 30s polling
  - [ ] `ServiceStatusCard` component
  - [ ] Redis graceful degradation when unconfigured
  - [ ] Lint + typecheck pass

- [ ] **Phase 8: Settings + Admins Management**
  - [ ] Settings page (platform info, compliance placeholder, session info)
  - [ ] Admins page (key fingerprint, session management, security checklist)
  - [ ] Lint + typecheck pass

- [ ] **Phase 9: Polish + Tests + PRD Update**
  - [ ] `PageHeader` on all pages
  - [ ] Dark mode tokens — no hardcoded colors
  - [ ] `typecheck` + `test` scripts in package.json
  - [ ] 5 API route test files passing
  - [ ] `PRD_v6.0.md` admin dashboard updated to ≥ 85%
  - [ ] Lint + typecheck + test all pass

---
*Created: 2026-03-11*
