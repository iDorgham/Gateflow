# PLAN — `design_system_impeccable_revamp`

**Slug:** `design_system_impeccable_revamp`  
**Title:** GateFlow Premier Brand & Product Design System (Impeccable Overhaul)  
**Version:** 7.1 (Trunk Branching, 3-Slice Rollout, Automated A11y & Visual Regression)  
**Repository:** https://github.com/iDorgham/Gateflow  
**Initiative Link:** [IDEA_design_system_impeccable_revamp.md](docs/development/initiatives/IDEA_design_system_impeccable_revamp.md)  
<<<<<<< Updated upstream
**Status:** ⏳ Ready for Phased Execution  
=======
**Status:** ⏳ Ready for Phased Execution
>>>>>>> Stashed changes

---

## 1. Architectural Blueprint & Invariants

### 1.1 Design DNA
<<<<<<< Updated upstream
- **Surface Elevation**: Carbon-inspired 4-layer model (`layer-01` #0b0d11, `layer-02` #12151c, `layer-03` #191d26, `layer-04` #212633 in Dark mode; Porcelain in Light mode). OKLCH only, zero pure `#000`/`#fff`.
- **Glassmorphism & Rim-Light Rule**: *Subtle rim-light / edge-glow on `layer-03`/`layer-04` is allowed and encouraged for Dark mode depth. Default glassmorphism (heavy backdrop-blur + translucent panels on standard cards) is strictly banned.*
=======

- **Surface Elevation**: Carbon-inspired 4-layer model (`layer-01` #0b0d11, `layer-02` #12151c, `layer-03` #191d26, `layer-04` #212633 in Dark mode; Porcelain in Light mode). OKLCH only, zero pure `#000`/`#fff`.
- **Glassmorphism & Rim-Light Rule**: _Subtle rim-light / edge-glow on `layer-03`/`layer-04` is allowed and encouraged for Dark mode depth. Default glassmorphism (heavy backdrop-blur + translucent panels on standard cards) is strictly banned._
>>>>>>> Stashed changes
- **Palettes**: Kimchi Vermilion (`#ED4B00`) primary accent (strictly restrained to 10% focal elements), Cobalt (`#0052CC`), Emerald (`#10B981`), Ruby (`#EF4444`), Virtual Lab Orchid (`#8B5CF6`).
- **Typography**: Fluid `clamp()` scale, Inter/Outfit (LTR) + Cairo/Tajawal (RTL with $1.6\times$ line height). Weight 500–600 for UI text.
- **Density**: Compact (Dashboards: 36px control height) vs Comfortable (Marketing/Portals/Mobile: 48px control height) with $\ge 44\text{px} \times 44\text{px}$ touch targets.
- **Motion**: `cubic-bezier(0.4, 0, 0.2, 1)`, max 2px hover lift, 0.97 press scale, zero layout property animations (`width`, `height`, `margin`). Respect `prefers-reduced-motion`.
- **Anti-AI-Slop**: Strict ban on colored `border-left` callouts, default glassmorphism, decorative gradient text in console UI, and identical card grids.

### 1.2 First-Class Systems
<<<<<<< Updated upstream
- **Three-Tier Tokens (`packages/tokens`)**: `Primitive` (OKLCH) → `Semantic` (themeable colors, layers, density) → `Component` (thin). Evolves existing `packages/tokens` while maintaining backwards-compatible CSS alias exports.
- **Component API Consistency**: Shared props (`variant`, `size`, `tone`/`intent`, `isDisabled`, `isLoading`, `isSelected`, `asChild`), Live State Coverage Matrix rendered in showcase, composable `FormField` (`label` + `control` + `helperText` + `errorMessage`), Voice & Tone microcopy (EN + AR).
- **Automated Accessibility & Visual Regression Gates**:
  - *Lint*: `eslint-plugin-jsx-a11y` on every PR.
  - *Tokens*: Automated contrast checker script (`pnpm --filter @gateflow/tokens check-contrast`) failing build on any semantic pair below WCAG 2.2 AA.
  - *Component Unit Axe*: `jest-axe` / `vitest-axe` unit tests on all primitives and `FormField` compositions in Phase 2.
  - *Visual Regression*: Playwright baseline snapshots for all primitives across Light/Dark + LTR/RTL.
  - *Showcase Hard Gate*: Playwright+axe on Phase 4 gate (`apps/design-system`).
  - *App Journeys*: `@axe-core/playwright` on critical journeys in Phase 5A, 5B, 5C.
=======

- **Three-Tier Tokens (`packages/tokens`)**: `Primitive` (OKLCH) → `Semantic` (themeable colors, layers, density) → `Component` (thin). Evolves existing `packages/tokens` while maintaining backwards-compatible CSS alias exports.
- **Component API Consistency**: Shared props (`variant`, `size`, `tone`/`intent`, `isDisabled`, `isLoading`, `isSelected`, `asChild`), Live State Coverage Matrix rendered in showcase, composable `FormField` (`label` + `control` + `helperText` + `errorMessage`), Voice & Tone microcopy (EN + AR).
- **Automated Accessibility & Visual Regression Gates**:
  - _Lint_: `eslint-plugin-jsx-a11y` on every PR.
  - _Tokens_: Automated contrast checker script (`pnpm --filter @gateflow/tokens check-contrast`) failing build on any semantic pair below WCAG 2.2 AA.
  - _Component Unit Axe_: `jest-axe` / `vitest-axe` unit tests on all primitives and `FormField` compositions in Phase 2.
  - _Visual Regression_: Playwright baseline snapshots for all primitives across Light/Dark + LTR/RTL.
  - _Showcase Hard Gate_: Playwright+axe on Phase 4 gate (`apps/design-system`).
  - _App Journeys_: `@axe-core/playwright` on critical journeys in Phase 5A, 5B, 5C.
>>>>>>> Stashed changes

---

## 2. Trunk-Based Branching Model

**Default branch:** `main` (always green, always releasable). No version tags in this plan.

```
main
 ├── feat/design-system-phase-1-tokens ──────────► [PR #1: 5-Gate + Contrast] ──► Squash Merge to main (Delete)
 ├── feat/design-system-phase-2-primitives ──────► [PR #2: 5-Gate + Unit Axe] ──► Squash Merge to main (Delete)
 ├── feat/design-system-phase-3-patterns ────────► [PR #3: 5-Gate + Content] ──► Squash Merge to main (Delete)
 ├── feat/design-system-phase-4-showcase-audit ──► [PR #4: HARD GATE (axe)] ────► Squash Merge to main (Delete)
 │
 ├── feat/design-system-phase-5a-dashboards ─────► [PR #5A: Dashboards + Diff] ─► Squash Merge to main (Delete)
 ├── feat/design-system-phase-5b-portals ────────► [PR #5B: Portals + Diff] ────► Squash Merge to main (Delete)
 ├── feat/design-system-phase-5c-mobile ─────────► [PR #5C: Mobile + Diff] ─────► Squash Merge to main (Delete)
 │
 └── feat/design-system-phase-6-certification ───► [PR #6: Preflight + Cert] ──► Squash Merge to main (Delete)
```

### Mandatory Branching Rules
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. **One short-lived branch per phase/slice**: `feat/design-system-phase-<N>-<short-title>`.
2. Branch **from latest `main`** at the start of each phase (`git fetch origin && git checkout main && git pull origin main`).
3. **Squash-merge into `main`** and delete the feature branch immediately after merge.
4. **Never** merge phase → phase. Always: phase → `main` → next phase branched from fresh `main`.
5. PR title format: `feat(design-system): phase <N> – <title>`.
6. PR must pass all 5 gates (Design · A11y-RTL · Anti-slop · Perf · Security) and `pnpm preflight`.

---

## 3. Phase Execution Matrix

<<<<<<< Updated upstream
| Phase | Title | Branch | Primary Role & Tools | Effort / Risk | Key Deliverables & Gates |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Tokens & Dual-Mode Foundations | `feat/design-system-phase-1-tokens` | `frontend.md` (Cursor) | 🟢 Med Effort / Low Risk | 3-tier tokens (`packages/tokens`), Satin `layer-01`…`04`, Accent Profiles, Density, `nativeTokens`, automated contrast checker script wired into build. |
| **Phase 2** | Core Primitives + API, State Matrix, FormField, A11y Gates | `feat/design-system-phase-2-primitives` | `frontend.md` (Cursor) | 🟡 High Effort / Med Risk | Primitives with strict API, Live State Coverage Matrix in showcase, Badge/Tag 5-variant taxonomy, Button FAB, FormField, visual regression snapshots, `jest-axe` unit gates. |
| **Phase 3** | Domain Patterns + Content System + Mobile Primitives | `feat/design-system-phase-3-patterns` | `frontend.md` (Cursor) | 🟢 Med Effort / Low Risk | DynamicTable (auto-converts to Card list on mobile), BottomSheet, EmptyState, Virtual Lab AI palette, bilingual Voice & Tone guide. |
| **Phase 4** | Showcase, Docs, Vibe-Check Sandbox & Self-Healing Audit | `feat/design-system-phase-4-showcase-audit` | `impeccable-bridge` / `qa.md` | 🟡 Med Effort / Med Risk | **HARD GATE**: Extended IA in `apps/design-system` (Foundations, Components, Patterns, Guidelines, Sandboxes), Prompt Writing Guide, Vibe-Check Sandbox, `llms.txt`, Playwright+axe green, 100/100 heuristic score. |
| **Phase 5A** | Dashboards Rollout (`client-dashboard` & `admin-dashboard`) | `feat/design-system-phase-5a-dashboards` | `frontend.md` (Cursor) | 🟡 Med Effort / Med Risk | Additive migration to `@gateflow/ui` tokens, Compact density, FormField, DynamicTable, screenshot diff review, `@axe-core/playwright` green. |
| **Phase 5B** | Web & Portals Rollout (`marketing` & `resident-portal`) | `feat/design-system-phase-5b-portals` | `frontend.md` (Cursor) | 🟢 Med Effort / Low Risk | Comfortable density, bento cards, glass headers, Arabic RTL bidi verification, visual diff review. |
| **Phase 5C** | Mobile Apps Rollout (`scanner-app` & `resident-mobile`) | `feat/design-system-phase-5c-mobile` | `mobile.md` (Cursor) | 🟡 Med Effort / Med Risk | `nativeTokens` hex bridge, BottomSheet, touch targets $\ge 44\text{px}$, BiometricHUD feedback cards, visual diff review. |
| **Phase 6** | Monorepo Certification & Release Handoff | `feat/design-system-phase-6-certification` | `qa.md` / `github-pr-review` | 🟢 Med Effort / Low Risk | Monorepo E2E sample audit (6 apps × 2 themes × 2 directions × 2 densities), full `pnpm preflight` green, dated Walkthrough Certification artifact in `docs/development/certification/`. |
=======
| Phase        | Title                                                       | Branch                                      | Primary Role & Tools          | Effort / Risk             | Key Deliverables & Gates                                                                                                                                                                                            |
| :----------- | :---------------------------------------------------------- | :------------------------------------------ | :---------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Phase 1**  | Tokens & Dual-Mode Foundations                              | `feat/design-system-phase-1-tokens`         | `frontend.md` (Cursor)        | 🟢 Med Effort / Low Risk  | 3-tier tokens (`packages/tokens`), Satin `layer-01`…`04`, Accent Profiles, Density, `nativeTokens`, automated contrast checker script wired into build.                                                             |
| **Phase 2**  | Core Primitives + API, State Matrix, FormField, A11y Gates  | `feat/design-system-phase-2-primitives`     | `frontend.md` (Cursor)        | 🟡 High Effort / Med Risk | Primitives with strict API, Live State Coverage Matrix in showcase, Badge/Tag 5-variant taxonomy, Button FAB, FormField, visual regression snapshots, `jest-axe` unit gates.                                        |
| **Phase 3**  | Domain Patterns + Content System + Mobile Primitives        | `feat/design-system-phase-3-patterns`       | `frontend.md` (Cursor)        | 🟢 Med Effort / Low Risk  | DynamicTable (auto-converts to Card list on mobile), BottomSheet, EmptyState, Virtual Lab AI palette, bilingual Voice & Tone guide.                                                                                 |
| **Phase 4**  | Showcase, Docs, Vibe-Check Sandbox & Self-Healing Audit     | `feat/design-system-phase-4-showcase-audit` | `impeccable-bridge` / `qa.md` | 🟡 Med Effort / Med Risk  | **HARD GATE**: Extended IA in `apps/design-system` (Foundations, Components, Patterns, Guidelines, Sandboxes), Prompt Writing Guide, Vibe-Check Sandbox, `llms.txt`, Playwright+axe green, 100/100 heuristic score. |
| **Phase 5A** | Dashboards Rollout (`client-dashboard` & `admin-dashboard`) | `feat/design-system-phase-5a-dashboards`    | `frontend.md` (Cursor)        | 🟡 Med Effort / Med Risk  | Additive migration to `@gateflow/ui` tokens, Compact density, FormField, DynamicTable, screenshot diff review, `@axe-core/playwright` green.                                                                        |
| **Phase 5B** | Web & Portals Rollout (`marketing` & `resident-portal`)     | `feat/design-system-phase-5b-portals`       | `frontend.md` (Cursor)        | 🟢 Med Effort / Low Risk  | Comfortable density, bento cards, glass headers, Arabic RTL bidi verification, visual diff review.                                                                                                                  |
| **Phase 5C** | Mobile Apps Rollout (`scanner-app` & `resident-mobile`)     | `feat/design-system-phase-5c-mobile`        | `mobile.md` (Cursor)          | 🟡 Med Effort / Med Risk  | `nativeTokens` hex bridge, BottomSheet, touch targets $\ge 44\text{px}$, BiometricHUD feedback cards, visual diff review.                                                                                           |
| **Phase 6**  | Monorepo Certification & Release Handoff                    | `feat/design-system-phase-6-certification`  | `qa.md` / `github-pr-review`  | 🟢 Med Effort / Low Risk  | Monorepo E2E sample audit (6 apps × 2 themes × 2 directions × 2 densities), full `pnpm preflight` green, dated Walkthrough Certification artifact in `docs/development/certification/`.                             |
>>>>>>> Stashed changes

---

## 4. Development & Architecture Reference Guides

All phase implementations are backed by these detailed engineering documents:
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Root AI Design Specification**: [DESIGN.md](DESIGN.md)
- **Impeccable Command Handbook**: [IMPECCABLE_AND_DESIGN_MD_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md)
- **Core Architecture & Physical Depth**: [DESIGN_SYSTEM_ARCHITECTURE.md](docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md)
- **Accessibility & Arabic RTL Engineering**: [ACCESSIBILITY_AND_A11Y_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/ACCESSIBILITY_AND_A11Y_GUIDE.md)
- **AI Prompt Writing & Anti-Slop Guide**: [AI_PROMPT_WRITING_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/AI_PROMPT_WRITING_GUIDE.md)
- **Multi-App Migration Recipes & Rollout**: [MIGRATION_AND_ROLLOUT_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/MIGRATION_AND_ROLLOUT_GUIDE.md)
- **Vibe Coder Quickstart & CLI Tools**: [VIBE_CODER_QUICKSTART.md](docs/plan/Draft/design_system_impeccable_revamp/VIBE_CODER_QUICKSTART.md)
- **Machine-Readable AI Context Pack**: [AI_CONTEXT_PACK.md](docs/plan/Draft/design_system_impeccable_revamp/AI_CONTEXT_PACK.md)
- **Showcase Portal**: [apps/design-system](apps/design-system)
