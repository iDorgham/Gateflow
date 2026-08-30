# TASKS — `design_system_impeccable_revamp`

**Version:** 7.1 (Trunk Branching, 3-Slice Rollout, Automated A11y & Visual Regression)  
**Status:** ✅ Complete (Certified & Verified)  
**Current Phase:** Complete (All 6 Phases Finished)  

---

### Phase 1 — Tokens & Dual-Mode Foundations `[Med Effort / Low Risk]`
- [x] Align and sync tokens with repository root [DESIGN.md](DESIGN.md)
- [x] Implement three-tier token architecture (Foundations → Semantic → Component) in `packages/tokens` (evolving existing CSS tokens while preserving aliases)
- [x] Implement switchable Accent Profiles (Kimchi default, Cobalt, Emerald) + Density + `layer-01`…`04`
- [x] Implement Satin-Charcoal Dark mode elevations + Porcelain Light mode (OKLCH only, zero pure black/white)
- [x] Explicitly enforce rim-light edge-glow on `layer-03`/`layer-04` while strictly banning default card glassmorphism
- [x] Generate typed, type-safe `nativeTokens` for Expo from the same source in `packages/ui/src/tokens.ts`
- [x] Build automated contrast checker script (`pnpm --filter @gateflow/tokens check-contrast`) failing the build on any semantic pair below WCAG AA
- [x] Wire contrast checker into Turbo / root build pipeline
- [x] Verify typecheck + build green in `packages/tokens` and `@gateflow/ui`
- [x] Update tokens viewer in `apps/design-system` to preview modes, accents, densities, and layers
- [x] Branch from `main` (`feat/design-system-phase-1-tokens`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 2 — Core Primitives + API, State Matrix, FormField, A11y & Visual Gates `[High Effort / Med Risk]`
- [x] Implement all base primitives using semantic tokens in `@gateflow/ui`
- [x] Enforce Component API consistency (`variant`, `size`, `tone`/`intent`, `isDisabled`, `isLoading`, `isSelected`, `asChild`)
- [x] Build and render live **State Coverage Matrix** in `apps/design-system` for all interactive components (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`, `selected`, `error`)
- [x] Implement complete Badge/Tag system (Solid, Soft, Outline, Ghost, Dot + 3 sizes + interactive/removable)
- [x] Implement Button (with FAB variant, soft top-edge highlight, press scale, disabled states)
- [x] Implement Card variants (Interactive, Selectable, Metric) with procedural edge glow
- [x] Implement density-aware Input + composable `FormField` (`label` + `control` + `helperText` + `errorMessage`)
- [x] FormField composition unit tests with `jest-axe`
- [x] Generate Playwright baseline visual regression snapshots across Light/Dark + LTR/RTL
- [x] Verify `eslint-plugin-jsx-a11y` clean and `jest-axe` / `vitest-axe` unit tests green on every primitive
- [x] Enforce $\ge 44\text{px} \times 44\text{px}$ mobile touch targets and motion / anti-slop rules
- [x] Branch from `main` (`feat/design-system-phase-2-primitives`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 3 — Domain Patterns + Content System + Mobile Primitives `[Med Effort / Low Risk]`
- [x] Implement DynamicTable with automatic transformation to Card list on mobile viewports ($< 768\text{px}$)
- [x] Implement first-class BottomSheet with snap points, drag handle, and safe-area support
- [x] Implement EmptyState following short-copy + single CTA standard
- [x] Implement Banner/Flag and navigation items consuming new Badge system
- [x] Implement AI side-panel and message components using Virtual Lab Orchid palette (`#8B5CF6`) exclusively
- [x] Define Content/Microcopy patterns and short Voice & Tone guidelines (EN + AR)
- [x] Add axe coverage on new patterns where applicable
- [x] Branch from `main` (`feat/design-system-phase-3-patterns`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 4 — Showcase, Docs, Prompt Guide & Self-Healing Audit (HARD GATE) `[Med Effort / Med Risk]`
- [x] Restructure `apps/design-system` IA:
  - **Foundations**: Color (Accent Profiles), Typography, Icons, Motion, Density/Elevation
  - **Components/Patterns**: Forms, Tables, AI, Analytics/Charts, Auth/Shells, Feedback/Empty, Menus/Overlays, Date Picker
  - **Guidelines**: Prompt Writing Guide, Content/Voice, A11y/RTL, Contribution
  - **Sandboxes**: Vibe-Check Sandbox & Theme Studio
- [x] Author Atlassian-grade documentation pages with live examples, token-correct code, Do/Don't visual pairs, and a11y notes
- [x] Author the **Prompt Writing Guide** and "Copy for AI" button on every component story
- [x] Implement interactive **Vibe-Check Sandbox** (`/sandboxes/vibe-check`) for 1-click AI code sanitization
- [x] Generate public `llms.txt` and `ai-context.json` endpoints from `DESIGN.md`
- [x] Run Playwright+axe across design-system key surfaces
- [x] Run full audit (Light/Dark + LTR/RTL + both densities) with 0 contrast failures and 100/100 heuristic score
- [x] Generate and attach `AUDIT_REPORT_design_system.md` with automated a11y test receipts
- [x] Branch from `main` (`feat/design-system-phase-4-showcase-audit`) → PR against `main` → 5-Gate Review → squash-merge → delete branch  
  *(Phase 5 is strictly blocked until this gate closes)*

---

### Phase 5A — Dashboards Rollout (`client-dashboard` & `admin-dashboard`) `[Med Effort / Med Risk]`
- [x] Additive migration: consume `@gateflow/ui` primitives and semantic tokens in `apps/client-dashboard` and `apps/admin-dashboard`
- [x] Set default density to **Compact** (36px control height, dense tabular views)
- [x] Replace ad-hoc tables with `<DynamicTable>` and form inputs with `<FormField>`
- [x] Run visual regression comparison and screenshot diff review before merge
- [x] Run `@axe-core/playwright` on critical dashboard flows (e.g. Visitors table, Access passes, Activity feed)
- [x] Branch from `main` (`feat/design-system-phase-5a-dashboards`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 5B — Web & Portals Rollout (`marketing` & `resident-portal`) `[Med Effort / Low Risk]`
- [x] Migrate `apps/marketing` and `apps/resident-portal` to `@gateflow/ui` tokens and Comfortable density
- [x] Implement bento grid feature showcases with subtle rim-light glows
- [x] Verify Arabic RTL layout rendering and font scaling on public marketing and resident portal pages
- [x] Run visual regression comparison and screenshot diff review before merge
- [x] Branch from `main` (`feat/design-system-phase-5b-portals`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 5C — Mobile Apps Rollout (`scanner-app` & `resident-mobile`) `[Med Effort / Med Risk]`
- [x] Migrate Expo mobile apps to typed `nativeTokens` from `@gateflow/ui/tokens`
- [x] Implement `BottomSheet` drawers, `FAB` floating action triggers, and `BiometricHUD` feedback cards
- [x] Enforce touch target minimums $\ge 44\text{px} \times 44\text{px}$ across all mobile screens
- [x] Run visual regression comparison and screenshot diff review before merge
- [x] Branch from `main` (`feat/design-system-phase-5c-mobile`) → PR against `main` → 5-Gate Review → squash-merge → delete branch

---

### Phase 6 — Monorepo Certification & Release Handoff `[Med Effort / Low Risk]`
- [x] Perform comprehensive sample end-to-end audit: all 6 apps × Light/Dark × LTR/RTL × densities (24 matrix combinations)
- [x] Verify critical user journeys across all 6 applications
- [x] Verify automated a11y gates green on design-system and critical app routes
- [x] Ensure full monorepo `pnpm preflight` is 100% green
- [x] Publish dated **Walkthrough Certification** artifact to `docs/development/certification/CERTIFICATION_design_system_impeccable_revamp.md`
- [x] Final 5-Gate review sign-off, squash-merge to `main`, and delete branch
- [x] Move plan folder to `docs/plan/Complete/design_system_impeccable_revamp/` and update `TASKS` + `SESSION_MEMORY`
