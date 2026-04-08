# PLAN_pattern-docs — Pattern Documentation (Design System Phase 9)

**Initiative:** `IDEA_pattern-docs.md`  
**Status:** Draft  
**Owner:** Frontend + Design System  
**Timeline:** 4 Phases

---

## Phase 1: Analytics Pattern Documentation

- **Goal:** Document the interactive analytics dashboard patterns.
- **Primary Role:** `frontend`
- **Steps:**
  1. Revitalize `apps/design-system/src/app/(docs)/patterns/analytics/page.tsx`.
  2. Implement an interactive `AnalyticsDashboard` lab showing `StatGrid` and `ChartLab`.
  3. Document the design rationale for "Institutional Data Density" (Satin UI).
- **Acceptance Criteria:**
  - Page renders without errors.
  - Interactive chart toggles (Line/Bar) work correctly.
  - Passes `pnpm turbo build --filter=@gateflow/design-system`.

## Phase 2: AI UI Pattern Documentation

- **Goal:** Document the GateAI chat interface and tool patterns.
- **Primary Role:** `frontend`
- **Steps:**
  1. Update `apps/design-system/src/app/(docs)/patterns/ai-ui/page.tsx`.
  2. Implement a `GateAILab` using components from `@gateflow/ai`.
  3. Document the "Cortex" design language for AI interactions.
- **Acceptance Criteria:**
  - `MessageAvatar` and `ToolCallCard` are showcased with live examples.
  - Mobile responsiveness of the chat shell is verified.

## Phase 3: Entity & Composition Documentation

- **Goal:** Document high-level composition patterns for management UI.
- **Primary Role:** `frontend`
- **Steps:**
  1. Create or update `apps/design-system/src/app/(docs)/patterns/entity-management/page.tsx`.
  2. Showcase the `EntityCard` and `FilterBar` combined with `StatGrid`.
  3. Document "The Project View" pattern (Project/CRM/Resident lists).
- **Acceptance Criteria:**
  - Reusable code snippets for a "Standard List Page" are provided.

## Phase 4: Final Certification & Hardening

- **Goal:** Ensure all patterns are accessible, documented, and build-stable.
- **Primary Role:** `qa`
- **Steps:**
  1. Verify all pattern pages have `'use client';` and correct metadata.
  2. Run `pnpm preflight` across the monorepo.
  3. Move Plan from `Draft/` to `Complete/`.
- **Acceptance Criteria:**
  - 100% build success on Vercel.
  - No hydration mismatches in any pattern page.
