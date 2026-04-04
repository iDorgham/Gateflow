# PLAN: Resident Portal — Responsive & Mobile App Experience

**Slug:** `resident_portal_responsive`
**Initiative:** Bridge the gap between a mobile-only web experience and a full, responsive PWA.
**Goal:** Unified, installable, and responsive experience (Sidebar for Desktop, BottomNav for Mobile).
**Status:** Planned — canonical layout: `TASKS_*.md`, `CONTEXT_*.md`, `context/`, `phase_logs/`, `assets/`, `phases/NN_*/PROMPT_phase_NN.md` (see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`).  
**Primary app:** `apps/resident-portal`  
**Target:** Q2 2026  
**Branch:** `feat/resident_portal_responsive`

---

## 🏗️ Architecture & Invariants

- **Component Library**: Use ADS tokens from `@gate-access/ui` and established layout patterns.
- **Responsive Logic**: Unified `useBreakpoint` hook for layout switching.
- **PWA**: Manifest, service worker registration, and offline-first QR display.
- **RTL/i18n**: Support Arab/English on all new layout components.
- **Security**: Maintain organization-scoped tenant isolation in all data-fetching components.

---

## 📈 Success Metrics

- 🏆 **Lighthouse**: 90+ Score for Performance, Accessibility, and PWA criteria.
- 📱 **Mobile Feel**: Bottom tab bar navigation and smooth page transitions.
- 💻 **Desktop Logic**: Collapsible sidebar and multi-column grid layouts for larger screens.
- ⚡ **Offline Access**: View active QR codes without network connectivity.

---

## 🏁 Phased Roadmap

| Phase  | Phase Title                   | Primary Role | Tool         | Goal                                                     |
| :----- | :---------------------------- | :----------- | :----------- | :------------------------------------------------------- |
| **01** | **Foundation: Shared Layout** | FRONTEND     | Cursor       | Responsive shells (BottomNav/Sidebar) + useBreakpoint    |
| **02** | **PWA: Install & Offline**    | BACKEND-API  | Claude CLI   | Manifest, Service Worker, Offline QR Cache, Web Push     |
| **03** | **Home & Visitors Redesign**  | FRONTEND     | Cursor       | Adaptive grids, FAB engagement, desktop table view       |
| **04** | **History & Maintenance**     | FRONTEND     | Cursor       | Timeline/Table switching, Split view for maintenance     |
| **05** | **Polish & Verification**     | QA           | Opencode CLI | Transitions, Swipe gestures, RTL Audit, Error Boundaries |

---

## 🛠️ Phases Breakdown

### Phase 1: Foundation – Shared Layout & Navigation

**Goal:** Transition from narrow mobile-fixed layout to responsive shell.

- Create shared navigation components (`BottomNav`, `Sidebar`, `PageHeader`).
- Implement `PortalShell` to switch based on `useBreakpoint`.
- Add `QuickCreateFAB` for Engagement.
- **Status:** [ ] Planned

### Phase 2: PWA – Install & Offline Intelligence

**Goal:** Make the portal installable as an app and give it offline capabilities.

- `manifest.json` and service worker setup.
- IndexedDB cache for active QR codes.
- Web Push notification registration for scan/arrival events.
- **Status:** [ ] Planned

### Phase 3: Home & Visitors Redesign

**Goal:** Modernize core pages with adaptive layouts.

- Dashboard with multi-column desktop widgets.
- Mobile FAB for express visitor creation.
- Table view/Filter sidebar for Desktop visitors.
- **Status:** [ ] Planned

### Phase 4: History & Maintenance Redesign

**Goal:** Complete the responsive rollout for secondary pages.

- Adaptive timeline for history.
- Split-view for maintenance logs (List-Detail pattern).
- Wire notification settings toggles to API.
- **Status:** [ ] Planned

### Phase 5: Polish & Final QA

**Goal:** Premium interactions and full-stack verification.

- Framer Motion page transitions.
- Swipe gestures for mobile navigation.
- Full RTL audit across all breakpoints.
- Loading skeletons and error boundaries.
- **Status:** [ ] Planned

---

## Phase prompts (`phases/NN_<slug>/PROMPT_phase_NN.md`)

| Phase | Folder                           | Prompt               |
| ----- | -------------------------------- | -------------------- |
| 1     | `phases/01_foundation/`          | `PROMPT_phase_01.md` |
| 2     | `phases/02_pwa/`                 | `PROMPT_phase_02.md` |
| 3     | `phases/03_home_visitors/`       | `PROMPT_phase_03.md` |
| 4     | `phases/04_history_maintenance/` | `PROMPT_phase_04.md` |
| 5     | `phases/05_polish/`              | `PROMPT_phase_05.md` |

Supporting artifacts: `TASKS_resident_portal_responsive.md`, `CONTEXT_resident_portal_responsive.md`, `context/`, `phase_logs/`, `assets/` — see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`.

---

## After each phase

- Append or update **`phase_logs/PHASE_LOG_phase_NN.md`** (template: `docs/development/plan-templates/PHASE_LOG_template.md`).
- Tick **`TASKS_resident_portal_responsive.md`** in the same pass as the phase commit.

---

## ⚠️ Dependencies & Risks

- **Next.js PWA**: Service worker compatibility with App Router.
- **Logical CSS**: Ensure all new layout components use `ms-*` / `me-*` for RTL support.
- **Token Drift**: Align sidebar design with `client-dashboard` while maintaining resident-focused simplicity.

---

_Created: 2026-03-31 | Initial Planning phase_
