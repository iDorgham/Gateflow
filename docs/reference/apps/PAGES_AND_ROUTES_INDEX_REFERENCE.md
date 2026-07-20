# Pages and Routes Index Reference (Deep Pass)

This file is the route/page inventory anchor for planning and UI impact analysis.

## Coverage Scope

- Live counts for page routes per app.
- Route-tree conventions and high-impact route families.
- Regeneration commands for full route extraction.

## 1) Live Page Counts (Current Snapshot)

- `admin-dashboard`: 61 `page.tsx` routes
- `client-dashboard`: 44 `page.tsx` routes
- `marketing`: 28 `page.tsx` routes
- `resident-portal`: 11 `page.tsx` routes

Notes:

- Dashboard apps are locale-scoped (`[locale]` route root).
- `resident-portal` mixes `(portal)` grouped routes plus explicit login/status pages.
- Mobile apps (`scanner-app`, `resident-mobile`) use mobile app navigation (not Next.js `page.tsx` structure).

## 2) Route Topologies by App

### Client Dashboard

- Base pattern: `src/app/[locale]/dashboard/organizations/[orgId]/...`
- High-density route families:
  - `analytics`
  - `gateai` / `ai`
  - `residents` (contacts, units)
  - `settings` (team, integrations, billing, notifications, API)
  - `workspace` (API keys, webhooks)
  - `qrcodes` / scans / maintenance / team

### Admin Dashboard

- Base pattern: `src/app/[locale]/(dashboard)/...`
- High-density route families:
  - `organizations/[orgId]/*` (monitoring, tasks, scans, CMS, intelligence, finance)
  - `settings/*` (security/compliance/auth/database/localization/style)
  - global operations (`monitoring`, `analytics`, `crm`, `projects`, `gates`, `audit-logs`)

### Marketing

- Base pattern: `app/[locale]/...`
- Core page families:
  - core website pages (`page`, `features`, `pricing`, `contact`, `company`)
  - SEO/resource routes (`resources`, `resources/playbooks/[vertical]`)
  - solution verticals (`solutions/*`)
  - legal pages and short-link resolver routes

### Resident Portal

- Portal pattern: `src/app/(portal)/...`
- Core page families:
  - dashboard home
  - visitor flows (list, detail, create/open-qr)
  - auth and account-state pages (`login`, `no-unit-linked`)

## 3) Route Ownership Guidance

- Route UI logic stays in app-local page/components modules.
- Shared UI primitives should be imported from `packages/ui`.
- Route-level data fetching and auth checks should remain close to route boundaries.

## 4) Full Route Extraction Commands

- All page routes:
  - `rg --files apps -g "**/app/**/page.tsx"`
- Per app:
  - `rg --files apps/client-dashboard -g "**/app/**/page.tsx"`
  - `rg --files apps/admin-dashboard -g "**/app/**/page.tsx"`
  - `rg --files apps/marketing -g "**/app/**/page.tsx"`
  - `rg --files apps/resident-portal -g "**/app/**/page.tsx"`

## 5) Planning Notes for AI Tools

- For large UX changes, use route-family batching rather than global edits.
- Treat `[locale]` and `[orgId]` as first-class context variables in plan prompts.
- For dashboard changes, always include navigation and settings route impact checks.
