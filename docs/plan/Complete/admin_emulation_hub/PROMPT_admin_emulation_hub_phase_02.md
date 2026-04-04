# PROMPT: Admin Emulation Hub — Phase 2: Emulation & Seeding Hub (UI)

## Goal

Build the primary "Ops Hub" monitoring interface and a dedicated Seeding page in the Admin Dashboard, following Atlassian Design System (ADS) patterns.

## Role & Tool

- **Primary Role**: Frontend Engineer
- **Preferred Tool**: Cursor / Gemini CLI

## Context

- `apps/admin-dashboard/src/components/Sidebar.tsx`: Sidebar navigation.
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/emulation/page.tsx`: Existing emulation page.
- `apps/admin-dashboard/src/components/emulation/emulation-wizard.tsx`: Current wizard (re-use or split).

## Steps

### 1. Create Monitoring Hub Page

Create `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/hub/page.tsx`:

- Header: "Operational Ops Hub" (localized).
- Content:
  - High-density table of recent emulation runs using `GET /api/admin/emulation-history`.
  - Summary stats: "Total Scans Generated", "Active Runs", etc. (mocked initially).
  - Quick action to "Start Emulation" (link to existing page) and "Advanced Seeding".

### 2. Dedicated Seeding Page

Create `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/seeding/page.tsx`:

- Header: "Advanced Seeding Control" (localized).
- Content:
  - Re-use or adapt Step 3 of `EmulationWizard` for a focused Hierarchy Seeding flow.
  - Form to define `organizationId`, `projectId`, and hierarchy `ranges`.
  - "Seed Now" action (calling new API from Phase 1).

### 3. Sidebar Organization

Update `apps/admin-dashboard/src/components/Sidebar.tsx`:

- Create a new section named "OPERATIONAL HUB" (or localized "Operations").
- Items:
  - "Ops Hub" -> `/monitoring/hub`
  - "Traffic Emulation" -> `/monitoring/emulation`
  - "Advanced Seeding" -> `/monitoring/seeding`
- Ensure all items have unique icons (Activity, Zap, Database).

### 4. Localization

Update `packages/i18n`:

- Add `admin.nav.ops_hub`, `admin.nav.seeding`, `admin.monitoring.hub.title`, etc.
- Sync for both `en.json` and `ar-EG.json`.
- Ensure RTL layouts in the new pages are robust.

## Acceptance Criteria

- [ ] Navigation works through all Ops Hub links.
- [ ] Ops Hub table displays history from the API.
- [ ] Seeding page UI follows ADS compact density (compact spacing, simple tokens).
- [ ] No layout regressions on mobile (sidebar collapses properly).
