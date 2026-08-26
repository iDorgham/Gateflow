# Draft — `admin_dashboard_redesign`

**Slug:** `admin_dashboard_redesign`  
**Last updated:** 2026-08-24  
**Champion:** Enterprise & Admin Platform Team  
**Initiative Link:** `docs/development/initiatives/IDEA_admin_dashboard_redesign.md`  
**Target:** Q3 2026

> Raw planning notes for Admin Dashboard Redesign (V10 Parity, Navigation Refactor, Multi-Page Settings & High-Density Operational Hubs). When this feels complete, run **`/prompt admin_dashboard_redesign`** then **`/plan admin_dashboard_redesign`**.

---

## 1. What I Want

- **V10 Design System & Token Parity with Client Dashboard**:
  - Full alignment with Client Dashboard styling, color tokens, typography scales, and high-density layouts.
  - Consistent light/dark mode surfaces (`bg-surface`, `border-subtle`, `text-primary`).
  - Strict ADS tokens usage from `@gate-access/ui/tokens` (`nativeTokensNewEra`).
- **Global Shell & Header/Sidebar Polish**:
  - **Header**: Move side panel toggle, remove redundant Super Admin badge, add contextual Help Center icon, and refine notification center.
  - **Sidebar**: Clean minimalism — remove duplicate avatar/help widgets, keep clean navigation hierarchy with unified Sign Out in footer.
- **Categorized Multi-Page Settings Experience**:
  - Reorganize flat settings into a sub-navigated multi-page hub:
    - `/settings/general` (Platform branding, default locale, timezones)
    - `/settings/security` (Global 2FA, session timeouts, IP allowlists)
    - `/settings/organizations` (Default tenant quotas, feature flags)
    - `/settings/integrations` (Webhooks, SMS/WhatsApp gateways, audit exports)
- **High-Density Operational Hubs**:
  - Wide-format layouts for Organizations, Projects, CRM, and Intelligence hubs.
  - Standardized CRUD action toolbars: top-right "Add" primary action with secondary filter/export actions.
  - Table row action menus (Edit, Impersonate / Emulate, Suspend, Delete).
- **100% Bilingual Arabic / English RTL Parity**:
  - Natural enterprise Arabic terminology.
  - Directional layout tokens (`marginStart`, `paddingStart`, `borderStart`) across all grid and flex components.

---

## 2. Constraints & Guardrails

- **Stack**: Next.js App Router (`apps/admin-dashboard`), Tailwind CSS, `@gate-access/ui`, `@gate-access/i18n`.
- **Database & API Safety**: No breaking schema changes in `packages/db`; preserve existing RBAC guards (`SUPER_ADMIN` role required).
- **Accessibility**: WCAG 2.2 AA color contrast in both light and dark themes.

---

## 3. Suggested 5-Phase Plan Sketch

1. **Phase 1: Shell & Navigation Refactor (Header & Sidebar V10 Parity)**:
   - Modernize dashboard layout shell, header toolbar, and collapsible sidebar matching Client Dashboard V10 standards.
2. **Phase 2: Categorized Multi-Page Settings Hub**:
   - Implement sub-navigation layout for `/settings` with General, Security, Organizations, and Integrations tabs.
3. **Phase 3: Operational Hubs & High-Density Tables**:
   - Refactor Organizations, Projects, and CRM views with unified action headers, search/filters, and row action dropdowns.
4. **Phase 4: Intelligence, Emulation & System Telemetry Views**:
   - Enhance Super Admin emulation controls, AI system prompts editor, and platform health telemetry.
5. **Phase 5: Arabic RTL Localization, ADS Tokens Audit & Full Test Certification**:
   - Comprehensive RTL review, design token audit, and automated test suite verification (`jest`, `tsc --noEmit`).

---

## 4. Open Questions

- [ ] Should organization impersonation / emulation support a top-banner banner with a quick "Exit Emulation" button?
- [ ] Do we need audit log search directly embedded within the Admin Settings security tab?

---

## 5. Changelog

- **2026-08-24**: Initialized draft from `IDEA_admin_dashboard_redesign.md` covering V10 parity, multi-page settings, operational hubs, and RTL audit.
