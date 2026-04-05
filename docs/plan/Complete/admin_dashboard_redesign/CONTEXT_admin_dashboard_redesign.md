# Context: Admin Dashboard Redesign (v10 Match)

## Relevant Files

### Core Structure (Redesign Area)

- `apps/admin-dashboard/src/components/AdminShell.tsx` — Main header and wrapper.
- `apps/admin-dashboard/src/components/Sidebar.tsx` — Navigation menu.
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/layout.tsx` — Base layout for localized dashboard.

### Reference Area (Style & Component Library)

- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx` — Reference for V10 style.
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/layout.tsx` — Reference for multi-page settings.
- `@gate-access/ui` — Shared component library for ADS (Atlassian Design System).

### Page Areas (For Updates)

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/settings/page.tsx` — Settings page redesign.
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/page.tsx` — CRUD (Add/Edit/Remove).
- `apps/admin-dashboard/src/components/organizations/OrgsClient.tsx` — Orgs list table.
- `apps/admin-dashboard/src/components/organizations/OrgDetailSheet.tsx` — Organization detail drawer.
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/hub/page.tsx` — Operational Hub pages.
- `apps/admin-dashboard/src/components/monitoring/OpsHubClient.tsx` — Hub client component.

### Localization

- `packages/i18n/locales/en/admin.json` — English translations.
- `packages/i18n/locales/ar/admin.json` — Arabic translations.

## Notes

- **Client Dashboard V10 style** is characterized by high data density, subtle shadows, Atlassian-inspired layout tokens (`--ds-...`), and robust multi-page categorization.
- **RTL Support** is mandatory for all new layouts and components, especially for the multi-page settings sidebar.
- **Dark Mode** must be 100% correct, avoiding hardcoded whites or grays. Use CSS variables defined in `@gate-access/ui`.
