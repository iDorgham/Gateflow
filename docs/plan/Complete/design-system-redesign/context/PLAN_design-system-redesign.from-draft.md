# PLAN: GateFlow Design System Redesign — Enterprise Grade (slug: design-system-redesign)

**Mission:** Completely redesign and expand the GateFlow Design System into a
**premium, serious, enterprise-grade** system inspired by Atlassian Design
System (ADS). Transform the current UI into a cohesive, high-trust PropTech
platform with refined Satin-Charcoal dark mode, professional depth,
Kimchi/Cobalt/Emerald accent profiles, and sophisticated micro-animations.

**Status:** Planning (Ready)  
**Prerequisites:** None  
**Design DNA:** Premium, Satin-Charcoal Dark Mode, Kimchi/Cobalt/Emerald Accents,
Glassmorphism, 8pt Grid, Perceptually Uniform OKLCH colors, Expressive Motion.

---

## 🏗 Phase 1: Foundation Tokens Overhaul (The Engine)

**Goal:** Define the core semantic token layer for the entire platform.

- [ ] **Step 1.1: Color Profiles & Accent Logic**
  - Update `packages/tokens/css/tokens.css` with Accent Profiles (Kimchi, Cobalt, Emerald).
  - Implement semantic mapping for `--ds-accent-*` and `--ds-accent-foreground-*`.
- [ ] **Step 1.2: Depth & Surface Hierarchy**
  - Refine Satin-Charcoal levels (8-14-18-24 L) and Glassmorphism layers.
- [ ] **Step 1.3: Typography & Iconography**
  - Fluid typography scale (Cairo for Arabic, Inter for Latin).
  - Iconography scale (stroke weights, box sizes) for Lucide integration.
- [ ] **Step 1.4: Spacing, Grid & Layering**
  - 8-pixel spacing system and standard layout grids.
  - Z-index layering architecture (Toast > Modal > Overlay > Popover).
- [ ] **Step 1.5: Advanced Motion & Easing**
  - Define motion primitives (fast, base, slow) and expressive-yet-serious easings.

---

## 🎨 Phase 2: Core Foundation Documentation

**Goal:** Redesign existing foundation pages and add new ones for the
"New Era" look.

- [ ] **Step 2.1: Colors & Typography Pages**
  - Redesigned with live token explorers and contrast audits.

- [ ] **Step 2.2: New Icons & Spacing Pages**
  - Documentation for usage, scale, and grid alignment.
- [ ] **Step 2.3: Layering & Motion Pages**
  - Interactive examples of stack order and easing curves.

---

## ✨ Phase 3: AI & Analytics Patterns

**Goal:** Document the intelligent and data-dense parts of GateFlow.

- [ ] **Step 3.1: Enhanced AI Elements**
  - AI Side Panel, Sentinel patterns, and AI-Mesh visuals.

- [ ] **Step 3.2: Analytics & Charts**
  - Recharts token mapping, data-density guides, and staggered entrance animations.

---

## 🛠 Phase 4: Forms & Feedback (High-Trust)

**Goal:** Document the core interactive layer with premium micro-animations.

- [ ] **Step 4.1: New Forms & Input Page**
  - Grouping Input, Select, Checkbox, Radio with semantic label support.

- [ ] **Step 4.2: New Date Picker Page**
  - Range selection and calendar patterns.
- [ ] **Step 4.3: Errors & Status Feedback**
  - Status indicators, empty states, and skeleton loading patterns.

---

## 📋 Phase 5: Complex Data & Navigation

**Goal:** Tables, Overlays, and Modals.

- [ ] **Step 5.1: New Tables & Data Lists**
  - High-density DynamicTable patterns (sorting, filtering, sticky headers).

- [ ] **Step 5.2: Menus & Overlays**
  - DropdownMenu, ContextMenu, and Tooltip documentation.
- [ ] **Step 5.3: Panels & Modals**
  - Dialog and Sheet (Drawer) patterns with staggered entrance animations.

---

## 🔒 Phase 6: Auth, Shell & Enterprise Polish

**Goal:** Finalize the core user journeys and platform-wide enforcement.

- [ ] **Step 6.1: Auth & Login Experience**
  - Login layout, multi-tenant branding, and 2FA patterns.

- [ ] **Step 6.2: Global Admin Shell**
  - Documentation for the Sidebar, TopNav, and Shell compositions.
- [ ] **Step 6.3: Enforcement & Final Audit**
  - Update `enforce-ads-design.js` to strictly catch hardcoded values.
  - Final WCAG 2.1 AA and RTL/Arabic audit.

---

## 📱 Phase 7: Mobile Optimization

**Goal:** Redesign Scanner & Resident apps with compact, performant touch primitives.

- [ ] **Step 7.1: Mobile Primitives & Touch Targets**
  - High-performance touch controls and compact surface hierarchy for mobile devices.
  - All mobile touch controls must provide at least 44px touch targets.
- [ ] **Step 7.2: Mobile RTL & Language Parity**
  - Verify complete Arabic RTL and locale switching across Scanner and Resident apps.
  - Scanner and Resident must achieve 100% Arabic RTL and locale-switching parity.

---

## 🏁 Phase 8: Final Polish & PRD Sync

**Goal:** Conduct final cross-platform audits and synchronize product documentation.

- [ ] **Step 8.1: Accessibility & Performance Profiling**
  - Complete WCAG 2.1 AA compliance verification.
  - Meet defined LCP and CLS thresholds.
  - Complete GPU profiling for animation frame-rate validation.
- [ ] **Step 8.2: PRD Alignment & Version Lock**
  - Run `scripts/enforce-ads-design.js` to verify zero hardcoded values.
  - Update `docs/PRD.md` with the locked design-system version.
  - Sync implementation state with product documentation.

---

## ✅ Acceptance Criteria (AC)

- **Token Discipline**: 100% semantic token usage across all 12+ pages.
- **Coverage**: All foundation areas (Color, Type, Spacing, Grid, Motion) documented.
- **Profiles**: Supports simple toggling between Kimchi/Cobalt/Emerald accents.
- **Premium Feel**: Satin-Charcoal hierarchy and motion feel enterprise-grade.
- **Verification**: `pnpm preflight` passes and enforcer scripts are GREEN.
