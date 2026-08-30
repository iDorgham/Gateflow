# FOR_PLAN_PROMPT — design_system_impeccable_revamp
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Version:** 7.0 (Rewired – Trunk Branching, No Version Tags)  
**Slug:** `design_system_impeccable_revamp`  
**Repository:** https://github.com/iDorgham/Gateflow  
**Target agent:** Antigravity / Cursor planning agent  
**Goal:** Produce a complete, executable plan package for a world-class GateFlow design-system overhaul with strict trunk-based branching, automation, and accessibility gates.

---

## 1. Mission

Build a design-system-first, token-driven, self-healing UI overhaul across:

- Light + Dark
- LTR + RTL (Arabic)
- Desktop (Compact) + Mobile (Comfortable)
- All apps in the GateFlow monorepo (`client-dashboard`, `admin-dashboard`, `marketing`, `resident-portal`, `scanner-app`, `resident-mobile`)

The system must feel premium, calm, and consistent — never generic, never AI-slop.

**Inspiration (adapt, do not copy):** Carbon (tokens & layers), Atlassian (docs & APIs), Material 3 (density, motion, touch).

**Outcome:** A certified, documented, accessibility-gated design system consumed by all apps, shipped through short-lived branches into `main`.

---

## 2. In Scope / Out of Scope

**In scope**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Three-tier token architecture (Primitive → Semantic → Component)
- Accent Profiles, Density, Elevation/Layers
- Primitives + patterns with explicit Desktop/Mobile behavior
- Component API consistency, State Coverage Matrix, FormField, Content/Microcopy
- Automated accessibility (lint, unit axe, Playwright+axe, token contrast)
- Design-system website (IA, docs, Prompt Writing Guide)
- Package structure (`packages/tokens`, `@gateflow/ui` in `packages/ui`)
- Trunk-based branching, CI gates, preflight, enforcers
- Migration of all apps + final certification

**Out of scope**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- New product features / business logic
- Backend / API / DB changes
- Full visual rewrite of every screen
- Brand identity redesign
- Native UIKit / SwiftUI
- Version tagging or semver bumps as part of this plan (handle releases separately)

---

## 3. Design DNA (Non-Negotiable)

- OKLCH only. No pure `#000` / `#fff`.
- Satin-Charcoal layers (`layer-01` … `layer-04`) + Porcelain light.
- Kimchi (`#ED4B00`) for primary actions only; Cobalt (`#0052CC`) / Emerald (`#10B981`) / Ruby (`#EF4444`) / Virtual Lab (`#8B5CF6`) as defined.
- Components and apps use **semantic tokens only**.
- Motion: `cubic-bezier(0.4, 0, 0.2, 1)`; respect `prefers-reduced-motion`.
- Touch targets ≥ 44 px. Logical properties for RTL (`ms-*`, `me-*`, `ps-*`, `pe-*`).
- Anti-slop: no default glassmorphism, no colored `border-left` accents, no gradient text noise.
- Shared component polish rules (Button, Input, Card, Table, Badge, Empty state).

---

## 4. First-Class Systems

### 4.1 Token Architecture
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```
packages/tokens/
  foundations/     # Primitive (OKLCH)
  semantic/        # Themeable (color, layer, density, interaction)
  component/       # Thin, optional
```
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Alias direction: Component → Semantic → Primitive
- Themes only remap the semantic layer
- Generate typed `nativeTokens` for Expo from the same source
- Automated contrast checker on semantic pairs (fail build on WCAG AA failures)

### 4.2 Component API + State + FormField + Content
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Shared props: `variant`, `size`, `tone`/`intent`, `isDisabled`, `isLoading`, `isSelected`, `asChild`
- Full State Coverage Matrix on every interactive component
- `FormField` = label + control + helper + error
- Content/microcopy patterns + short Voice & Tone (EN + AR)

### 4.3 Automated Accessibility
<<<<<<< Updated upstream
| Layer | Tool | When |
|-------|------|------|
| Lint | `eslint-plugin-jsx-a11y` | Every PR |
| Component | `jest-axe` / `vitest-axe` | Unit tests |
| Showcase | Storybook a11y or Playwright+axe | Phase 4 gate |
| Apps | `@axe-core/playwright` on critical routes | Phase 5–6 |
| Tokens | Contrast checker on semantic pairs | Token build |
=======

| Layer     | Tool                                      | When         |
| --------- | ----------------------------------------- | ------------ |
| Lint      | `eslint-plugin-jsx-a11y`                  | Every PR     |
| Component | `jest-axe` / `vitest-axe`                 | Unit tests   |
| Showcase  | Storybook a11y or Playwright+axe          | Phase 4 gate |
| Apps      | `@axe-core/playwright` on critical routes | Phase 5–6    |
| Tokens    | Contrast checker on semantic pairs        | Token build  |
>>>>>>> Stashed changes

Standard: WCAG 2.2 AA. Progressive enforcement → hard gate on design-system + critical routes.

### 4.4 Automations
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- `pnpm preflight` (lint + typecheck + test) must be green
- Run existing enforcers (`enforce-ads-design.js`, `enforce-security-invariants.js`) plus token contrast + a11y
- CI fails on preflight failure, token contrast failure, and critical/serious a11y violations

---

## 5. Branching Model (Trunk-Based / GitHub Flow Hybrid)

**Repository:** https://github.com/iDorgham/Gateflow  
**Default branch:** `main` (always green, always releasable)

```
main
 ├── feat/design-system-phase-1-tokens
 ├── feat/design-system-phase-2-primitives
 ├── feat/design-system-phase-3-patterns
 ├── feat/design-system-phase-4-showcase-audit
 ├── feat/design-system-phase-5-multi-app
 └── feat/design-system-phase-6-certification
```

### Rules (mandatory)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. **One short-lived branch per phase.** Name: `feat/design-system-phase-N-<short-title>`.
2. Branch **from latest `main`** at the start of the phase.
3. Keep the branch alive only until that phase’s acceptance criteria pass.
4. **Squash-merge into `main`.** Delete the branch after merge.
5. **Never** merge phase → phase. Always: phase → `main` → next phase from `main`.
6. **No long-lived `develop` branch.** No `release/*` branches for this initiative.
7. PR title: `feat(design-system): phase N – <title>`.
8. PR must be green: preflight, relevant enforcers, token contrast (when applicable), a11y gates, and **5-Gate review** (Design · A11y-RTL · Anti-slop · Perf · Security).
9. Conventional commits. Prefer a clean history after squash.
10. Hotfixes: short branch from `main` → PR → merge to `main`.

### Per-phase branching steps
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. `git fetch origin && git checkout main && git pull origin main`
2. `git checkout -b feat/design-system-phase-N-<title>`
3. Implement + run all phase gates locally
4. Push branch, open PR against `main`
5. Ensure CI + 5-Gate review pass
6. Squash-merge, delete branch
7. Update `SESSION_MEMORY.md` and phase log with merge commit hash
8. Start next phase from a fresh checkout of `main`

---

## 6. Phase Breakdown

### Phase 1 — Tokens & Dual-Mode Foundations
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-1-tokens`  
**Goal:** Three-tier tokens, layers, density, accent profiles, token contrast automation.

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] Three-tier architecture implemented (foundations / semantic / component).
- [ ] Accent Profiles (Kimchi default, Cobalt, Emerald) + Density + `layer-01`…`04`.
- [ ] Zero pure black/white. OKLCH only.
- [ ] Typed `nativeTokens` generated and type-safe.
- [ ] Automated contrast checker fails the build on any semantic pair below WCAG AA.
- [ ] Typecheck + build green. Tokens viewer shows modes + accent + density + layers.
- [ ] Branch from `main` → PR → 5-Gate → squash-merge → delete branch.

### Phase 2 — Core Primitives + API, State, FormField, A11y Unit Gates
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-2-primitives`  
**Goal:** Premium primitives with strict API, full state matrix, FormField, component-level a11y.

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] All primitives use only semantic tokens.
- [ ] Component API consistency + State Coverage Matrix visible in showcase.
- [ ] Badge/Tag system complete; Button (incl. FAB); Card variants; density-aware Input.
- [ ] FormField shipped.
- [ ] `eslint-plugin-jsx-a11y` clean; `jest-axe`/`vitest-axe` green on every primitive.
- [ ] Touch targets ≥ 44 px. Motion + anti-slop rules followed.
- [ ] Lint / typecheck / test green.
- [ ] Branch from `main` → PR → 5-Gate → squash-merge → delete branch.

### Phase 3 — Domain Patterns + Content System + Mobile
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-3-patterns`  
**Goal:** Adaptive patterns, content/microcopy, mobile primitives.

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] Table → card list on mobile. BottomSheet first-class (snap points, safe area).
- [ ] EmptyState + Banner use content system.
- [ ] AI components use only Virtual Lab colors.
- [ ] Content/microcopy + Voice & Tone defined.
- [ ] Axe coverage on new patterns where applicable.
- [ ] Lint / typecheck / test green. Zero anti-slop.
- [ ] Branch from `main` → PR → 5-Gate → squash-merge → delete branch.

### Phase 4 — Showcase, Docs, Prompt Guide & Self-Healing Audit (HARD GATE)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-4-showcase-audit`  
**Goal:** Atlassian-quality docs + Prompt Guide + full automated/manual audit.  
**No Phase 5 work may start until this gate closes.**

**Required pages**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Foundations, Components (State Matrix + AI Prompt snippet), Patterns
- Guidelines: Accessibility, RTL, Do/Don’t, Contribution, Component API, Content & Microcopy, **Prompt Writing Guide**

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] New IA + Prompt Writing Guide + API + Content pages live.
- [ ] Storybook a11y (or Playwright+axe) green on design-system key surfaces.
- [ ] Full audit: Light/Dark + LTR/RTL + both densities.
- [ ] 0 contrast failures. Anti-slop PASS. Heuristic 100/100 (or residuals backlogged with owner).
- [ ] `AUDIT_REPORT_design_system.md` includes automated a11y results.
- [ ] Preflight green.
- [ ] Branch from `main` → PR → 5-Gate → squash-merge → delete branch.

### Phase 5 — Multi-App Rollout
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-5-multi-app`  
**Goal:** All apps consume the certified system.

**Parts**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- 5A Dashboards (Compact): `client-dashboard`, `admin-dashboard`
- 5B Web & Portals (Comfortable): `marketing`, `resident-portal`
- 5C Mobile: `scanner-app`, `resident-mobile` (`nativeTokens` + BottomSheet + FAB)

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] Semantic tokens + UI package used on migrated surfaces.
- [ ] FormField + content patterns used where applicable.
- [ ] Playwright+axe (or equivalent) on critical journeys.
- [ ] Builds green for all app filters. No visual regressions on critical flows.
- [ ] Lint / typecheck green.
- [ ] Branch from `main` → PR → 5-Gate → squash-merge → delete branch.

### Phase 6 — Monorepo Certification
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
**Branch:** `feat/design-system-phase-6-certification`  
**Goal:** Final proof that the product family feels like one premium system; close the initiative.

**Hard Acceptance Criteria**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- [ ] Sample end-to-end audit: all apps × Light/Dark × LTR/RTL × densities.
- [ ] Critical journeys verified (dashboards, portals, mobile scan/home).
- [ ] Automated a11y gates green on design-system + critical app routes.
- [ ] Zero remaining contrast / anti-slop violations on audited screens.
- [ ] Full monorepo `pnpm preflight` green.
- [ ] Dated **Walkthrough Certification** artifact published (screenshots, a11y summary, 5-Gate sign-offs) and linked from the PR / docs.
- [ ] Final 5-Gate review signed off.
- [ ] Squash-merge to `main`, delete branch.
- [ ] Plan moved to `Complete/design_system_impeccable_revamp/`.
- [ ] TASKS + SESSION_MEMORY updated with final merge commit and “all phases complete”.

**Certification artifact must include**
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Executive summary
- Screenshot grid
- Token + anti-slop + a11y automation results
- State Matrix / API / FormField spot-checks
- 5-Gate sign-off section

---

## 7. Cross-Cutting Rules

1. Primary role: `frontend` (or `qa` for Phases 4 & 6). Preferred tool: Cursor.  
   Invoke: Impeccable, theme-auditor, anti-slop-validator, design-guide, ads-a11y-rtl.
2. Restate Design DNA + Token + API + A11y rules in every phase prompt.
3. Acceptance criteria are binary and require evidence.
4. Self-correction: fail → debug → fix → re-verify.
5. **Branching:** Follow section 5 exactly. No version tags as part of this plan.
6. Update `SESSION_MEMORY.md` + `phase_logs/PHASE_LOG_phase_NN.md` after every phase (include merge commit hash).
7. No scope creep — extra ideas go to backlog.

---

## 8. Required Output Structure

```
docs/plan/Draft/design_system_impeccable_revamp/
├── PLAN_design_system_impeccable_revamp.md
├── TASKS_design_system_impeccable_revamp.md
├── CONTEXT_design_system_impeccable_revamp.md
├── PLAN_FEEDBACK.md
└── phases/
    ├── 01_tokens_foundations/PROMPT_phase_01.md
    ├── 02_core_primitives/PROMPT_phase_02.md
    ├── 03_domain_patterns/PROMPT_phase_03.md
    ├── 04_showcase_audit/PROMPT_phase_04.md
    ├── 05_multi_app_rollout/PROMPT_phase_05.md
    └── 06_monorepo_certification/PROMPT_phase_06.md
```
