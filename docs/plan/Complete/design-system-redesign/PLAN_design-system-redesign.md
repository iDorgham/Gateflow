# Plan — design-system-redesign

**Slug:** design-system-redesign  
**Vision:** Redesign and expand the GateFlow design system into a premium, serious, enterprise-grade PropTech platform (ADS-inspired).

## 🚀 Phases Breakdown

### Phase 1: Foundation Token Overhaul

- **Role:** Architecture
- **Tool:** Opencode
- **Goals:** Implement primitive OKLCH scales and full semantic `--ds-*` level in `packages/tokens`. Map Tailwind/CSS logical properties.
- **Depends on:** `N/A`
- **Acceptance Criteria:** `pnpm preflight` passes; all new tokens visible in `packages/tokens/css/tokens.css`.

### Phase 2: Core Foundation Pages (1-6)

- **Role:** Frontend
- **Tool:** Gemini
- **Goals:** Build first 6 "Foundation" docs pages (Colors, Type, Icon, Space, Depth, Motion) in `apps/design-system`.
- **Depends on:** Phase 1
- **Acceptance Criteria:** Pages load at `/colors`, `/typography`, etc. with live token tables.

### Phase 3: Pattern Documentation (7-12)

- **Role:** Frontend
- **Tool:** Gemini
- **Goals:** Build remaining 6 "Component/Pattern" docs pages (AI, Analytics, Forms, Complex UI, Auth, Date Picker).
- **Depends on:** Phase 2
- **Acceptance Criteria:** All 12 specialized pages present and functional in the documentation site.

### Phase 4: Monorepo Enforcement & Migration

- **Role:** Architecture/Security
- **Tool:** Kiro
- **Goals:** Update `enforce-ads-design.js` to block primitives. Standardize `packages/ui` and `packages/components` to consume new tokens.
- **Depends on:** Phase 1
- **Acceptance Criteria:** `pnpm lint` catches hardcoded values in UI components.

### Phase 5: Marketing & Auth Redesign

- **Role:** Creative/Frontend
- **Tool:** Cursor
- **Goals:** Apply high-flair premium redesign to `apps/www` and Auth flows. Implement cinematic staggered entrances.
- **Depends on:** Phase 1, 4
- **Acceptance Criteria:** Visual review matches ADS-inspired premium vision.

### Phase 6: Dashboards & Portal Redesign

- **Role:** Frontend
- **Tool:** Cursor
- **Goals:** Redesign Admin Dashboard, Client Dashboard, and Resident Portal with high-density operational focus.
- **Depends on:** Phase 1, 4
- **Acceptance Criteria:** Operational dashboards show consistent Satin-Charcoal depth and refined density.

### Phase 7: Mobile Optimization

- **Role:** Mobile
- **Tool:** Cursor
- **Goals:** Redesign Scanner and Resident mobile apps with compact, performant touch primitives.
- **Depends on:** Phase 1, 4
- **Acceptance Criteria:** Mobile apps show 100% RTL parity and touch-friendly (44px) targets.

### Phase 8: Final Polish & Certification

- **Role:** Architecture/QA
- **Tool:** Kilo
- **Goals:** Final accessibility audit, performance profiling, and PRD sync.
- **Depends on:** All phases
- **Acceptance Criteria:** WCAG AA certified; no design system drift; sync with `docs/PRD.md`.
