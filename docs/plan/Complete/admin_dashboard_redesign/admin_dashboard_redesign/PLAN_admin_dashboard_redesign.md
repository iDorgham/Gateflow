# PLAN: Admin Dashboard Redesign (V10 Parity & Operational Hubs)

- **Initiative:** `admin_dashboard_redesign`
- **Application:** `apps/admin-dashboard`
- **Status:** ✅ Complete — all phases 1–5 complete (verified)
- **Priority:** P1 — Enterprise Administration & Platform Operations
- **Branch:** `feat/admin-dashboard-redesign-v10`

---

## Strategic Goals

1. **V10 Design System & Token Parity**:
   - Align all surfaces, borders, typography, and badge tokens with Client Dashboard V10 standards.
   - Enforce dark/light mode surface tokens (`bg-surface`, `border-subtle`, `text-primary`).
2. **Global Shell & Header/Sidebar Polish**:
   - Modernize the global header toolbar, remove redundant badges, add contextual Help Center access, and streamline sidebar navigation with footer sign out.
3. **Categorized Multi-Page Settings Hub**:
   - Reorganize flat settings into structured tabs: General, Security, Organizations, and Integrations.
4. **High-Density Operational Hubs & Standardized CRUD**:
   - Wide-format layouts for Organizations, Projects, and CRM with action headers and table row action menus.
5. **Arabic RTL Localization & Full Test Certification**:
   - Comprehensive RTL review, WCAG 2.2 AA contrast compliance, and 100% automated test coverage.

---

## Ordered Phases

### Phase 1: Global Shell & Header/Sidebar Modernization

- **Scope**: Modernize dashboard layout shell, top header navigation, and collapsible sidebar matching Client Dashboard V10.
- **Deliverables**: Shell layout component, header toolbar, sidebar navigation, unit tests.
- **Primary Role**: FRONTEND / DESIGN

### Phase 2: Categorized Multi-Page Settings Hub

- **Scope**: Build `/settings` multi-tab layout with sub-navigation for General, Security, Organizations, and Integrations.
- **Deliverables**: Settings shell layout, settings sub-pages, validation schemas, unit tests.
- **Primary Role**: FRONTEND / BACKEND-API

### Phase 3: Operational Hubs & High-Density Table Actions

- **Scope**: Refactor Organizations, Projects, and CRM views with standardized CRUD headers, filters, and row action dropdowns.
- **Deliverables**: Table action bars, bulk action modals, row action dropdowns, unit tests.
- **Primary Role**: FRONTEND / FULLSTACK

### Phase 4: Super Admin Intelligence & Emulation Hub

- **Scope**: Upgrade Organization Impersonation/Emulation banner, AI prompts editor, and platform health telemetry monitors.
- **Deliverables**: Emulation active banner, AI config editor, system metrics cards, unit tests.
- **Primary Role**: BACKEND-API / SECURITY

### Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification

- **Scope**: Complete Arabic RTL layout review, semantic design tokens audit, and full automated test suite certification.
- **Deliverables**: RTL styling audit, zero TypeScript errors (`tsc --noEmit`), 100% passing test suite.
- **Primary Role**: QA / DESIGN / MOBILE

---

## Invariants & Guardrails

1. **Multi-Tenancy & RBAC**: Strict `SUPER_ADMIN` role guards across all admin routes.
2. **ADS Semantic Tokens**: Strict usage of `@gate-access/ui/tokens` (`nativeTokensNewEra`).
3. **Bilingual Parity**: 100% visual and functional parity between English (`en`) and Arabic (`ar-EG`).
