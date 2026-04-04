# IDEA: Client Dashboard V10 Redesign (ADS Premium)

**Initiative:** `client_dashboard_v10_redesign`
**Status:** ✅ Done (Executed via Claude CLI)
**Target:** Q4 2026
**Champion:** Antigravity (Senior UI/UX Animator)

---

## 1. Problem Statement

The current `client-dashboard` is functional and adheres to basic ADS tokens, but
it lacks the "wow" factor, high-density data management, and premium motion
expected of a Stripe-level physical access platform in 2026. Side menu pages
vary in density, and settings tabs feel static.

## 2. Strategic Goal

Redesign the entire **Client Dashboard** (all 13+ subroutes and 11+ settings
tabs) into a world-class, high-density, beautifully animated experience that
strictly follows the **Atlassian Design System (ADS) Premium** guidelines.

### Success Metrics

- **0% Hardcoded Colors:** 100% adherence to `--ds-*` tokens.
- **Premium Motion:** Every page transition and tab switch uses Framer Motion
  (Balanced premium presets).
- **High Density:** Optimized data views (Tables/Grids) that handle 500+
  records with zero visual clutter.
- **MENA First:** Perfect RTL support for Arabic across all redesigned
  components.

---

## 3. High-Level Scope

### 3.1 Side Menu Pages

- **Dashboard Home:** Real-time KPI cards with micro-animations and smooth SSE
  updates.
- **Analytics:** High-density Recharts with custom ADS tooltips and responsive
  viewport resizing.
- **Scans & QRCodes:** Advanced filtering bars, compact lozenge-based tables,
  and drawer-based detail views.
- **Projects & Gates:** Card-grid layouts with hover-states and smooth entry
  animations.
- **Residents & Team:** High-density user lists with quick-action popovers.
- **GateAI:** Integrated chat interface with hybrid text/chart/action UI.

### 3.2 Settings Tabs

- **Workspace:** Redesigned configuration cards with inline validation and
  progressive disclosure.
- **Billing:** Premium subscription cards with dynamic pricing visualizers.
- **Security (Roles, Keys, Webhooks):** Code-centric UIs with high-density audit
  trails and copy-to-clipboard micro-interactions.
- **Integrations:** Marketplace-style layout with connection-state animations.

---

## 4. Technical Stack & Implementation Details

- **Foundation (Phase 0 - DONE):** Fully synchronized ADS tokens in
  `packages/ui/src/globals.css` and `packages/ui/src/tokens.ts`.
- **Animations:** Framer Motion (Balanced premium presets,
  shared layout morphs, `AnimatePresence`).
- **Data Density:** ADS compact modes for tables and high-density KPI grids.
- **RTL Support:** Native GateFlow `@gate-access/i18n` with mirrored transforms.

---

## 5. Execution Roadmap

The initiative is broken into 6 ordered phases. See the full execution plan here:
[PLAN_client_dashboard_v10_redesign.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Complete/client_dashboard_v10_redesign/PLAN_client_dashboard_v10_redesign.md)

| Phase | Goal                                       | Status     |
| :---- | :----------------------------------------- | :--------- |
| **0** | **ADS Token Synchronization** (Light/Dark) | ✅ Done    |
| **1** | **Global Shell & Premium Navigation**      | 📅 Ready   |
| **2** | **Dashboard Home & Analytics**             | 📅 Planned |
| **3** | **High-Density Scan & QR Operations**      | 📅 Planned |
| **4** | **Resource & Relationship Management**     | 📅 Planned |
| **5** | **Settings V10 Overhaul**                  | 📅 Planned |
| **6** | **Global Polish & RTL Audit**              | 📅 Planned |

---

## 6. Next Steps

1. [x] **Phase 0 Foundational Sync:** Audit and implement full ADS token set.
2. [x] **Implementation Plan:** Create 6-phase ordered execution plan.
3. [x] **Phase 1 Prompt:** Generate high-fidelity PROMPT for Global Shell.
4. [ ] **Execute Phase 1:** Run `/dev client_dashboard_v10_redesign 1`.
