# Structure — admin_dashboard_evolution

## Route Architecture (Target State)

```
apps/admin-dashboard/src/app/[locale]/
├── (auth)/                         # Auth group
│   ├── login/                      # Admin login
│   └── layout.tsx
└── (dashboard)/                    # Protected dashboard group
    ├── layout.tsx                  # Root dashboard layout (auth check + sidebar)
    ├── page.tsx                    # Dashboard home (/)
    │
    ├── organizations/              # Platform — Orgs
    │   ├── page.tsx                # Global org list
    │   └── [orgId]/
    │       ├── layout.tsx          # Org context provider + nested nav
    │       ├── page.tsx            # Org overview dashboard
    │       ├── users/page.tsx
    │       ├── projects/page.tsx
    │       ├── gates/page.tsx
    │       ├── tasks/page.tsx
    │       ├── crm/page.tsx        # ← exists but gets redesigned
    │       ├── analytics/page.tsx
    │       ├── monitoring/page.tsx
    │       ├── branding/page.tsx
    │       ├── authorization-keys/page.tsx
    │       ├── finance/page.tsx
    │       ├── scans/page.tsx
    │       ├── audit-logs/page.tsx
    │       └── settings/page.tsx
    │
    ├── cms/                        # NEW — Global CMS
    │   ├── layout.tsx
    │   ├── pages/page.tsx
    │   ├── landing-pages/page.tsx
    │   ├── blog/page.tsx
    │   ├── menus/page.tsx
    │   └── settings/page.tsx
    │
    ├── crm/                        # NEW — Global CRM
    │   ├── layout.tsx
    │   ├── contacts/page.tsx
    │   ├── companies/page.tsx
    │   └── deals/page.tsx
    │
    ├── support/                    # NEW — Support
    │   ├── layout.tsx
    │   └── tickets/page.tsx
    │
    ├── analytics/                  # NEW — Global Analytics
    │   ├── layout.tsx
    │   └── dashboard/page.tsx
    │
    └── team-roles/                 # NEW — Team Roles
        └── page.tsx
```

## Component Structure (Target)

```
apps/admin-dashboard/src/components/
├── admin-sidebar.tsx              # NEW — replaces Sidebar.tsx
├── admin-shell.tsx                # KEEP — outer shell
├── admin-ai-assistant.tsx         # KEEP — AI panel
├── admin-side-panel.tsx           # KEEP
│
├── organizations/
│   ├── org-nested-nav.tsx         # NEW — in-org nav
│   ├── org-switcher.tsx           # ENHANCE — improve existing
│   └── ...existing
│
├── cms/
│   ├── PageBuilder.tsx            # ENHANCE — drag-and-drop iterations
│   ├── BlogEditor.tsx             # ENHANCE — AI-enhanced
│   ├── landing-page-editor.tsx    # NEW — AI LP editor
│   ├── menu-builder.tsx           # NEW — visual menu editor
│   ├── cms-settings.tsx           # NEW — site-wide settings panel
│   └── version-history.tsx        # NEW — Phase 9
│
├── crm/
│   ├── crm-dashboard.tsx          # ENHANCE — global CRM view
│   ├── contact-list.tsx           # NEW
│   ├── company-list.tsx           # NEW
│   └── deal-pipeline.tsx          # NEW — Kanban board
│
├── tasks/
│   ├── task-hub.tsx               # KEEP + enhance
│   └── task-bot-config.tsx        # NEW — AI bot setup
│
├── ai/
│   └── confirmation-gate.tsx      # NEW — Phase 9
│
└── analytics/
    └── platform-analytics.tsx     # NEW — Global analytics view
```

## Key Layout Chain

```
[locale]/layout.tsx                 → i18n + dir="rtl|ltr"
  └── (dashboard)/layout.tsx       → session check + sidebar
        └── organizations/[orgId]/layout.tsx  → OrgContext
              └── page.tsx
```

## Provider Hierarchy

```
<I18nProvider locale={locale}>
  <ThemeProvider>
    <SessionProvider>
      <AdminShell>
        <AdminSidebar />
        <main>
          <OrgContextProvider>  ← only under [orgId] routes
            {children}
          </OrgContextProvider>
        </main>
      </AdminShell>
    </SessionProvider>
  </ThemeProvider>
</I18nProvider>
```

## Monorepo Dependencies

```
apps/admin-dashboard
  ├── @gate-access/ui         (shared components)
  ├── @gate-access/db         (Prisma)
  ├── @gate-access/types      (TypeScript)
  ├── @gate-access/i18n       (translations)
  ├── @gate-access/api-client (fetch utils)
  └── @gate-access/config     (shared config)
```
