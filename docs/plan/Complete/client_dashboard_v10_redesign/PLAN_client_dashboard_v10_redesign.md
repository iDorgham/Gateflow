# PLAN: Client Dashboard V10 Redesign (ADS Premium)

**Initiative:** `client_dashboard_v10_redesign`
**Status:** 🗺️ Planned
**Target:** Q4 2026

---

## Phase 0: Design System Foundation (SYNCED) ✅

- [x] Full audit of Atlassian Design System (ADS) tokens.
- [x] Update `packages/ui/src/globals.css` with full Light/Dark mode token set.
- [x] Expand `packages/ui/src/tokens.ts` for type-safe CSS variable access.

---

## Phase 1: Global Shell & Premium Navigation

**Goal:** Implement a world-class navigation experience with shared layout morphs and glassmorphism.

- **Steps:**
  1. Refactor `Sidebar` to use `framer-motion` for collapse/expand states.
  2. Implement `layoutId` transitions between side-menu active states.
  3. Apply glassmorphism effects to the top navigation header and sidebar backgrounds.
  4. Ensure 100% RTL compliance for the new sidebar mechanics.

- **Acceptance Criteria:**
  - `pnpm turbo lint && pnpm turbo typecheck`
  - Sidebar feels "buttery-smooth" on toggle.
  - Active states morph positions without jank.

---

## Phase 2: Dashboard Home & Real-time Analytics

**Goal:** High-density command center with live metrics and premium chart animations.

- **Steps:**
  1. Redesign Dashboard KPI cards using `elevation.surface.raised`.
  2. Integrate smooth SSE value transitions (counting animations).
  3. Refactor Recharts to use ADS semantic colors and custom tooltips (`gf-ads-data-density`).

- **Acceptance Criteria:**
  - Charts are fully responsive.
  - No hardcoded hex values in analytics view.

---

## Phase 3: High-Density Scan & QR Operations

**Goal:** World-class data management for high-volume logs.

- **Steps:**
  1. Implement a unified "High Density" filter bar at the top of Scans/QRCodes.
  2. Redesign tables using `density="compact"` and ADS lozenges.
  3. Use `AnimatePresence` for drawer-based detail views.

- **Acceptance Criteria:**
  - Tables handle 50+ rows per view with zero visual lag.
  - Row details pop out with a smooth spring animation.

---

## Phase 4: Resource & Relationship Management

**Goal:** Card-grid and list views for Projects, Gates, and Residents.

- **Steps:**
  1. Redesign Projects/Gates grid with premium hover-actions.
  2. Implement a unified "Resident Card" for high-density contact management.
  3. Add staggers to grid entry animations.

- **Acceptance Criteria:**
  - Grid layouts are perfectly responsive (xs to xl).

---

## Phase 5: Settings V10 - The Administrative Node

**Goal:** Redesign all settings tabs with premium cards and form morphs.

- **Steps:**
  1. Refactor `SettingsClient` to use Framer Motion for tab switching.
  2. Redesign each tab (Workspace, Billing, Team, etc.) into a cohesive "Card-as-a-Page" layout.
  3. Implement "Success Morphs" for save buttons (from "Save" to "Success" icon).

- **Acceptance Criteria:**
  - 11/11 settings tabs redesigned.
  - Tab switching uses `AnimatePresence`.

---

## Phase 6: Global Polish & RTL Audit

**Goal:** Final zero-jank verification and accessibility check.

- **Steps:**
  1. Run `pnpm preflight` across the entire workspace.
  2. Perform a full RTL walkthrough for Saudi (ar-SA) and Egyptian (ar-EG) locales.
  3. Optimize bundle size by checking dynamic imports for heavy animation tracks.
