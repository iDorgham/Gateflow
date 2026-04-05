# Plan: Admin Dashboard Redesign

## Overview

Modernize the Admin Dashboard to match the Client Dashboard's premium style, colors, typography, and high-density components based on Atlassian Design System (ADS).

## Context

The Admin Dashboard currently uses a legacy layout. We are transitioning to a multi-page settings structure, refined CRUD entry points, and high-fidelity detail sheets for Organizations, Users, Projects, and Gates.

---

## 🚀 Phases

### Phase 1 — Foundation & Token Audit

**Scope:** Audit `admin-dashboard` theme and tokens for ADS consistency.
**Deliverables:**

- Ensure `globals.css` and `tailwind.config.ts` align with `@gate-access/ui` constants.
- Correct any hardcoded colors or missing dark mode tokens.

### Phase 2 — Header & Sidebar Refinement

**Scope:** Reorganize header and sidebar layouts for a cleaner experience.
**Deliverables:**

- **Header**: Move side panel toggle before avatar; remove "Super Admin" badge; add Help icon.
- **Sidebar**: Remove footer avatar/help; keep only "Sign out"; reorganize group labels.

### Phase 3 — Settings: Multi-Page & Sidebar Navigation

**Scope:** Transition the flat Settings page into a multi-page app.
**Deliverables:**

- Create `settings/layout.tsx` for sidebar + content wrapper.
- Segment settings into sub-pages: Database, Auth, QR, etc.
- Implement breadcrumbs and sub-navigation consistency.

### Phase 4 — Wide-Format Operational Hub

**Scope:** Redesign "Ops Hub", "Emulation", and "Seeding" pages.
**Deliverables:**

- Expand layout width to `max-w-screen-2xl` or similar for high-density monitoring.
- Introduce advanced options and filters for platform operations.

### Phase 5 — CRUD Refinement: Add, Edit, Remove

**Scope:** Standardize action entry points for main resource pages.
**Deliverables:**

- Add "Add [Resource]" button to the top-right header on all list pages.
- Add "Edit" and "Remove" (Delete) actions within tables or detail views.
- Ensure unified confirmation flows for destructive actions.

### Phase 6 — Organization Panel Fix (OrgDetailSheet)

**Scope:** Fix the organization drawer component for visual parity.
**Deliverables:**

- Localized header: "Edit Organization".
- Fix contrast issues and background colors in dark mode.
- Improve data density and spacing.

### Phase 7 — i18n & RTL Mastery

**Scope:** 100% translation and RTL layout verification for English/Arabic.
**Deliverables:**

- Complete missing translations in `admin:nav`, `admin:settings`, and `admin:organizations`.
- Fix any layout shift or alignment issues in RTL mode.

### Phase 8 — Global Polish & Dark Mode Review

**Scope:** Final visual pass and theme validation.
**Deliverables:**

- Verify all pages match Client Dashboard v10 style.
- Finalize contrast and shadow consistency site-wide.

---

## 🚦 Acceptance Criteria

- [ ] UI visually matches Client Dashboard (V10) in typography and space.
- [ ] Settings is multi-page with sidebar navigation.
- [ ] Operational pages are wide-format with advanced options.
- [ ] Header/Sidebar cleaned up (Signout-only in sidebar footer).
- [ ] All CRUD pages have "Add", "Edit", and "Delete" actions.
- [ ] 100% Arabic/English support with perfect RTL.
- [ ] Light/Dark mode consistency is 100% verified.
