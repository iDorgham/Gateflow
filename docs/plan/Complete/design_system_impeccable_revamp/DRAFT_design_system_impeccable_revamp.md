# Draft — `design_system_impeccable_revamp`

**Slug:** `design_system_impeccable_revamp`  
**Title:** GateFlow Premier Brand & Product Design System (Impeccable Overhaul)  
**Version:** 7.1 (Trunk Branching, 3-Slice Rollout, Automated A11y & Visual Regression)  
**Last updated:** 2026-08-30  
**Champion:** Core Design & UI Platform Team  
**Repository:** https://github.com/iDorgham/Gateflow  
**Initiative Link:** [IDEA_design_system_impeccable_revamp.md](docs/development/initiatives/IDEA_design_system_impeccable_revamp.md)  
**Target:** Q3/Q4 2026  
<<<<<<< Updated upstream
**Status:** 💡 Refined Master Plan & Brand Blueprint  
=======
**Status:** 💡 Refined Master Plan & Brand Blueprint
>>>>>>> Stashed changes

> The definitive blueprint for GateFlow’s token-driven, accessibility-gated, dual-mode Brand and Product Design System. Built on the rigor of **Carbon Design System**, the documentation excellence of **Atlassian Design System**, and the adaptive density of **Material Design 3**, tailored to GateFlow’s unmistakable **Satin-Charcoal + Kimchi** identity.

---

## Changelog

- **2026-08-30 (Version 7.1 Splitting & Visual Hardening)**: Split Phase 5 into 3 sequential, independently mergeable sub-PRs (5A Dashboards, 5B Portals, 5C Mobile), added Live State Coverage Matrix in showcase, Playwright baseline visual regression snapshot suite, explicit glassmorphism resolution, and converted all markdown links to repository-relative format.
- **2026-08-30 (Version 7.0 Trunk Rewire)**: Converted branching to strict trunk-based model targeting `main`, removed internal version tags, and embedded multi-layer a11y gates.

---

## 1. Brand Identity & Design DNA

### 1.1 Brand Essence & Archetype
<<<<<<< Updated upstream
GateFlow is the digital security infrastructure for modern gated communities, commercial perimeters, and smart properties in the MENA region.
=======

GateFlow is the digital security infrastructure for modern gated communities, commercial perimeters, and smart properties in the MENA region.

>>>>>>> Stashed changes
- **Brand Archetype**: The Guardian Architect — Calm, High-Precision, Reassuring, Uncompromising on Security.
- **Aesthetic DNA**: Deep Satin-Charcoal surfaces with subtle glowing rim-light borders, illuminated by energetic Kimchi Vermilion primary accents, and crisp typography optimized for bidirectional Latin/Arabic reading.

### 1.2 Glassmorphism & Rim-Light Shaders
<<<<<<< Updated upstream
*Subtle rim-light / edge-glow on `layer-03`/`layer-04` is allowed and encouraged for Dark mode depth. Default glassmorphism (heavy backdrop-blur + translucent panels on standard cards) is strictly banned.*

### 1.3 Voice & Tone (EN + AR)
| Context | Voice & Tone (English) | Voice & Tone (Arabic) | Do | Don't |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication & Gate** | Immediate, authoritative, secure. | فوري، حاسم، وآمن تماماً. | "Access Granted · Gate 04" | "Yay! You can come in now!" |
| **Operational Dashboards** | Clear, data-dense, objective. | واضح، غني بالبيانات، ومباشر. | "24 active visitors across 3 zones" | "Lots of people entered today" |
| **Error & Exception** | Calm, diagnostic, actionable. | هادئ، تشخيصي، وقابل للإجراء. | "PIN verification failed. Retry in 30s." | "Oops! Something went wrong :(" |
| **Marketing & Brand** | Visionary, enterprise, empowering. | ملهم، ريادي، وموثوق. | "Autonomous perimeter intelligence" | "Cheap QR code passes" |

### 1.4 Color Geometry & 60-30-10 Distribution Rule
We enforce strict color hierarchy across every screen:
=======

_Subtle rim-light / edge-glow on `layer-03`/`layer-04` is allowed and encouraged for Dark mode depth. Default glassmorphism (heavy backdrop-blur + translucent panels on standard cards) is strictly banned._

### 1.3 Voice & Tone (EN + AR)

| Context                    | Voice & Tone (English)             | Voice & Tone (Arabic)        | Do                                       | Don't                           |
| :------------------------- | :--------------------------------- | :--------------------------- | :--------------------------------------- | :------------------------------ |
| **Authentication & Gate**  | Immediate, authoritative, secure.  | فوري، حاسم، وآمن تماماً.     | "Access Granted · Gate 04"               | "Yay! You can come in now!"     |
| **Operational Dashboards** | Clear, data-dense, objective.      | واضح، غني بالبيانات، ومباشر. | "24 active visitors across 3 zones"      | "Lots of people entered today"  |
| **Error & Exception**      | Calm, diagnostic, actionable.      | هادئ، تشخيصي، وقابل للإجراء. | "PIN verification failed. Retry in 30s." | "Oops! Something went wrong :(" |
| **Marketing & Brand**      | Visionary, enterprise, empowering. | ملهم، ريادي، وموثوق.         | "Autonomous perimeter intelligence"      | "Cheap QR code passes"          |

### 1.4 Color Geometry & 60-30-10 Distribution Rule

We enforce strict color hierarchy across every screen:

>>>>>>> Stashed changes
- **60% Dominant Neutral**: Dark Mode = Satin-Charcoal (`layer-01` #0b0d11 to `layer-03` #191d26) / Light Mode = Porcelain (`layer-01` #f8f9fa to `layer-02` #ffffff).
- **30% Structural Secondary**: Surface borders (`border-subtle` #232834 / #e2e6eb), muted control backgrounds, table alternating headers, and card containers.
- **10% Semantic Accent (Focal Point)**:
  - **Primary / Brand Action**: Kimchi Vermilion (`#ED4B00` → Dark hover `#FF5C0A`). Used strictly for primary CTAs, active tab indicators, and verified gate states.
  - **Information / Telemetry**: Cobalt Blue (`#0052CC` / `#2563EB`).
  - **Success / Validated Access**: Emerald Forest (`#10B981` / `#059669`).
  - **Warning / Security Flag**: Solar Amber (`#F59E0B` / `#D97706`).
  - **Danger / Unauthorized Breach**: Ruby Crimson (`#EF4444` / `#DC2626`).
  - **Virtual Lab AI**: Orchid Violet (`#8B5CF6` / `#7C3AED`) reserved exclusively for AI chat, copilot summaries, and predictive telemetry.

### 1.5 Optical Iconography System
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- Standardized icon library: `@hugeicons/react` + Lucide Icons.
- **Stroke Width**: Consistent 1.5px (standard) and 2.0px (active / selected).
- **Bounding Boxes**: Standardized `16px` (sm), `20px` (md), `24px` (lg) with optical centered padding.
- **Bidirectional Mirroring**: Directional icons (arrows, chevrons, undo/redo, back buttons) automatically flip in RTL Arabic mode via logical CSS transforms.

---

## 2. Token Architecture & Physical Depth

### 2.1 Carbon-Inspired Three-Tier Architecture
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```
packages/tokens/
  foundations/               # Tier 1: Primitive Tokens (raw OKLCH scales, 4px grid steps)
  semantic/                  # Tier 2: Semantic Tokens (layer-01..04, text-primary, border-subtle)
  component/                 # Tier 3: Component Bindings (button-primary-bg, table-header-bg)
```
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Invariant**: Alias flow is strictly `Component` → `Semantic` → `Primitive`.
- **Theming**: Light and Dark modes only remap the Semantic layer; application components never touch raw primitives.
- **Backwards Compatibility**: Evolves `packages/tokens/css/tokens.css` to import these tiers while preserving CSS variable aliases.

### 2.2 Surface Elevation & Lighting Model
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ layer-04 (Overlay / Modal / Drawer): #212633 (Dark) / #ffffff (Light)       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ layer-03 (Raised / Floating Cards): #191d26 (Dark) / #ffffff (Light)    │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ layer-02 (Default Surface / Tables): #12151c (Dark) / #ffffff (Light)│ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ layer-01 (Canvas / Gutter / Sunken): #0b0d11 (Dark) / #f8f9fa   │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Taxonomy & Live State Coverage Matrix

### 3.1 Live State Coverage Matrix
<<<<<<< Updated upstream
Every interactive component in `@gateflow/ui` must explicitly implement and showcase 8 canonical states live in `apps/design-system`:

| Component | Default | Hover | Active / Pressed | Focus-Visible | Disabled | Loading | Selected | Error |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Button** | Rested surface | Top highlight + 2px lift | `scale(0.97)` | 2px Kimchi ring offset | 40% opacity, no cursor | Spinner + text dimmed | Active pill toggle | Ruby shake |
| **Input / Select** | Inset border | Border brightened | Focus ring | 2px Kimchi ring | Sunken bg, uneditable | Skeleton placeholder | Highlighted border | Ruby border + shake |
| **Card** | 1px border | Edge glow (`--ds-glow`) | Sub-pixel press | Keynav ring | Muted contents | Shimmer skeleton | 1.5px Kimchi outline | Red warning flag |
| **Badge / Tag** | Solid / Soft / Outline | Hover tint | Click action | Focus ring | Muted contrast | Pulsing dot | Active checkmark | Critical Ruby pill |
| **TableRow** | Default surface | `layer-03` background | Selected row tint | Keynav row outline | Inactive row style | Skeleton row shimmer | Kimchi side indicator | Flagged row alert |

### 3.2 Badge & Tag Overhaul
Consolidated into 5 clean architectural variants: `Solid`, `Soft`, `Outline`, `Ghost`, `Dot` (with pulsing hardware LED effect).

### 3.3 Composable FormField Architecture
Standardizes all form controls across the monorepo:
=======

Every interactive component in `@gateflow/ui` must explicitly implement and showcase 8 canonical states live in `apps/design-system`:

| Component          |        Default         |          Hover           | Active / Pressed  |     Focus-Visible      |        Disabled        |        Loading        |       Selected        |        Error        |
| :----------------- | :--------------------: | :----------------------: | :---------------: | :--------------------: | :--------------------: | :-------------------: | :-------------------: | :-----------------: |
| **Button**         |     Rested surface     | Top highlight + 2px lift |   `scale(0.97)`   | 2px Kimchi ring offset | 40% opacity, no cursor | Spinner + text dimmed |  Active pill toggle   |     Ruby shake      |
| **Input / Select** |      Inset border      |    Border brightened     |    Focus ring     |    2px Kimchi ring     | Sunken bg, uneditable  | Skeleton placeholder  |  Highlighted border   | Ruby border + shake |
| **Card**           |       1px border       | Edge glow (`--ds-glow`)  |  Sub-pixel press  |      Keynav ring       |     Muted contents     |   Shimmer skeleton    | 1.5px Kimchi outline  |  Red warning flag   |
| **Badge / Tag**    | Solid / Soft / Outline |        Hover tint        |   Click action    |       Focus ring       |     Muted contrast     |      Pulsing dot      |   Active checkmark    | Critical Ruby pill  |
| **TableRow**       |    Default surface     |  `layer-03` background   | Selected row tint |   Keynav row outline   |   Inactive row style   | Skeleton row shimmer  | Kimchi side indicator |  Flagged row alert  |

### 3.2 Badge & Tag Overhaul

Consolidated into 5 clean architectural variants: `Solid`, `Soft`, `Outline`, `Ghost`, `Dot` (with pulsing hardware LED effect).

### 3.3 Composable FormField Architecture

Standardizes all form controls across the monorepo:

>>>>>>> Stashed changes
```tsx
<FormField
  label="Resident National ID"
  helperText="Encrypted using AES-256-GCM"
  errorMessage={errors.nationalId?.message}
  isRequired
  isInvalid={!!errors.nationalId}
>
  <Input placeholder="Enter 14-digit National ID" />
</FormField>
```

---

## 4. Adaptive Domain Patterns (Desktop vs Mobile)

### 4.1 DynamicTable to Mobile Card List Transformation
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Desktop ($\ge 768\text{px}$)**: Dense tabular data, multi-column sorting, sticky header with backdrop blur, column visibility dropdown, density toggle (`Compact` 36px vs `Comfortable` 44px), and bulk action bar.
- **Mobile ($< 768\text{px}$)**: Automatically transforms table rows into swipeable, stacked interactive Card items with summary badges, primary identifier headers, and slide-over actions, eliminating horizontal scroll entirely.

### 4.2 Mobile-First Primitives (Expo & Web)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **BottomSheet**: Spring-animated bottom drawer with snap points (25%, 50%, 90%), smooth drag handle, backdrop blur, and iPhone safe-area inset handling.
- **Floating Action Button (FAB)**: Primary bottom-corner action with expanding speed-dial menu for quick guard logs or visitor creation.
- **BiometricHUD**: Status overlay card for scanner camera viewfinders with instant visual validation feedback.

---

## 5. Extended Design System Showcase IA (`apps/design-system`)

The standalone design system portal in `apps/design-system` is structured with a comprehensive, developer-friendly Information Architecture:

```
apps/design-system/src/app/
├── (showcase)/
│   ├── brand/
│   │   ├── personality/       # Mission, Archetype, Guardian DNA
│   │   ├── voice-and-tone/    # Bilingual Voice & Tone guidelines (EN + AR)
│   │   ├── logo-and-marks/    # Logo clearspace, lockups, SVG downloads
│   │   └── iconography/       # Optical icon grid, stroke standards, RTL rules
│   ├── foundations/
│   │   ├── colors/            # 3-tier palette, contrast validator, accent switcher
│   │   ├── typography/        # Fluid type scale, Inter/Cairo specimens
│   │   ├── elevation-layers/  # Layer-01..04 depth visualizer & shadow physics
│   │   ├── density/           # Compact vs Comfortable spatial comparisons
│   │   └── motion/            # Cubic-bezier curves, duration tokens, easing sandbox
│   ├── components/
│   │   ├── primitives/        # Button, Badge, Input, Card, Dialog, Drawer, Tabs...
│   │   ├── patterns/          # DynamicTable, FormField, EmptyState, Banner, Command...
│   │   └── mobile/            # BottomSheet, FAB, TouchList, BiometricHUD...
│   ├── guidelines/
│   │   ├── accessibility/     # WCAG 2.2 AA rules, keyboard traps, screen readers
│   │   ├── rtl-localization/  # Arabic layout rules, bidi mirroring, font tweaks
│   │   ├── do-and-dont/       # Visual pairs of correct vs anti-slop patterns
│   │   └── prompt-guide/      # Dedicated AI Prompt Writing Guide for UI agents
│   └── sandboxes/
│       ├── vibe-check/        # Interactive prompt testbed with live AST anti-slop check
│       └── theme-studio/      # Live custom palette generator & token exporter
```

---

## 6. Automated Multi-Layer Accessibility & Visual Pipeline

We enforce visual and accessibility quality through 6 automated gates:

```
[Layer 1: Static Lint] ──► eslint-plugin-jsx-a11y (Enforced on every commit/PR)
         │
[Layer 2: Token Build]  ──► pnpm --filter @gateflow/tokens check-contrast (Fails build on WCAG AA failures)
         │
[Layer 3: Unit Tests]   ──► jest-axe / vitest-axe (Unit test on every primitive & FormField composition)
         │
[Layer 4: Visual Diff]  ──► Playwright Visual Baselines (Captures Light/Dark + LTR/RTL snapshot matrix)
         │
[Layer 5: Showcase Gate]──► Playwright + axe (Automated scan across all showcase routes in Phase 4)
         │
[Layer 6: App Journeys] ──► @axe-core/playwright (E2E journey scans & screenshot diffs on 5A, 5B, 5C)
```

---

## 7. Trunk-Based GitHub Workflow & PR Governance

**Repository:** https://github.com/iDorgham/Gateflow  
**Trunk Branch:** `main` (always green, always releasable). No version tags in this plan.

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

---

## 8. Master Execution Roadmap & Risk Breakdown

### Phase 1 — Tokens & Dual-Mode Foundations `[Med Effort / Low Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-1-tokens`
- **Scope**: 3-tier tokens (`packages/tokens`), Satin `layer-01`…`04`, Accent Profiles (Kimchi, Cobalt, Emerald), Density, `nativeTokens` hex bridge, automated contrast checker script wired to Turbo build.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 2 — Core Primitives + API, State Matrix, FormField, A11y & Visual Gates `[High Effort / Med Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-2-primitives`
- **Scope**: Base primitives, live State Coverage Matrix in showcase, Badge/Tag 5-variant taxonomy, Button FAB, Card edge glow, composable `FormField`, Playwright visual baseline snapshots, `jest-axe` unit test gates.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 3 — Domain Patterns + Content System + Mobile Primitives `[Med Effort / Low Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-3-patterns`
- **Scope**: DynamicTable with responsive card list conversion, BottomSheet, TouchList, EmptyState, Virtual Lab AI palette, bilingual Voice & Tone guide.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 4 — Showcase, Docs, Vibe-Check Sandbox & Self-Healing Audit (HARD GATE) `[Med Effort / Med Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-4-showcase-audit`
- **Scope**: Extended Showcase IA, Prompt Writing Guide, live Vibe-Check Sandbox, `llms.txt`, Playwright+axe scan, 100/100 heuristic audit report.
- **Gate Rule**: Strictly blocks Phase 5A/5B/5C until the design system showcase passes 100% of audits.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 5A — Dashboards Rollout (`client-dashboard` & `admin-dashboard`) `[Med Effort / Med Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-5a-dashboards`
- **Scope**: Additive migration to `@gateflow/ui` tokens, Compact density, FormField, DynamicTable, screenshot diff review, `@axe-core/playwright` green.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 5B — Web & Portals Rollout (`marketing` & `resident-portal`) `[Med Effort / Low Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-5b-portals`
- **Scope**: Comfortable density, bento cards, glass headers, Arabic RTL bidi verification, screenshot diff review.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 5C — Mobile Apps Rollout (`scanner-app` & `resident-mobile`) `[Med Effort / Med Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-5c-mobile`
- **Scope**: `nativeTokens` hex bridge, BottomSheet, touch targets $\ge 44\text{px}$, BiometricHUD feedback cards, screenshot diff review.
- **Merge Target**: Squash-merge to `main`, delete branch.

### Phase 6 — Monorepo Certification & Release Handoff `[Med Effort / Low Risk]`
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Branch**: `feat/design-system-phase-6-certification`
- **Scope**: Monorepo-wide visual sample audit (6 apps × 2 themes × 2 directions × 2 densities = 24 combinations), full `pnpm preflight` verification, dated Walkthrough Certification artifact publishing in `docs/development/certification/`.
- **Merge Target**: Squash-merge to `main`, delete branch, transition plan to `Complete/`.

---

## 9. Development & Architecture Reference Guides

- **Root AI Design Specification**: [DESIGN.md](DESIGN.md)
- **Impeccable Command Handbook**: [IMPECCABLE_AND_DESIGN_MD_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md)
- **Core Architecture & Physical Depth**: [DESIGN_SYSTEM_ARCHITECTURE.md](docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md)
- **Accessibility & Arabic RTL Engineering**: [ACCESSIBILITY_AND_A11Y_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/ACCESSIBILITY_AND_A11Y_GUIDE.md)
- **AI Prompt Writing & Anti-Slop Guide**: [AI_PROMPT_WRITING_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/AI_PROMPT_WRITING_GUIDE.md)
- **Multi-App Migration Recipes & Rollout**: [MIGRATION_AND_ROLLOUT_GUIDE.md](docs/plan/Draft/design_system_impeccable_revamp/MIGRATION_AND_ROLLOUT_GUIDE.md)
- **Vibe Coder Quickstart & CLI Tools**: [VIBE_CODER_QUICKSTART.md](docs/plan/Draft/design_system_impeccable_revamp/VIBE_CODER_QUICKSTART.md)
- **Machine-Readable AI Context Pack**: [AI_CONTEXT_PACK.md](docs/plan/Draft/design_system_impeccable_revamp/AI_CONTEXT_PACK.md)
- **Showcase Portal**: [apps/design-system](apps/design-system)
