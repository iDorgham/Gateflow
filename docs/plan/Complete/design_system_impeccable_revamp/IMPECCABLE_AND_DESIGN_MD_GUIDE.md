# Impeccable & DESIGN.md Engineering Handbook

**Document:** `IMPECCABLE_AND_DESIGN_MD_GUIDE.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Standards:** [Impeccable Design Methodology](https://impeccable.style/) · [Google Labs DESIGN.md](https://github.com/google-labs-code/design.md)  
<<<<<<< Updated upstream
**Target:** AI Assistants (Antigravity, Cursor, Claude Code, Gemini CLI, OpenCode) & Engineering Team  
=======
**Target:** AI Assistants (Antigravity, Cursor, Claude Code, Gemini CLI, OpenCode) & Engineering Team
>>>>>>> Stashed changes

---

## 1. What is `DESIGN.md`?

`DESIGN.md` is an open standard created by Google Labs to bridge the gap between design vision and AI code generation. It serves as the **machine-readable design source of truth** for your repository.

When an AI agent starts a UI task, it reads `DESIGN.md` to instantly learn:
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Design DNA & Registers**: Console/Dashboard Precision vs Marketing Brand Register.
- **Physical Surfaces & Shaders**: OKLCH satin-charcoal layers (`layer-01`…`04`) and rim-light glows.
- **Color Geometry**: Semantic palette rules and the strict 60-30-10 distribution law.
- **Typography & Localization**: Fluid `clamp()` scale, bilingual Inter/Cairo font stacks, and Arabic RTL rules.
- **Anti-AI-Slop Invariants**: Hard rules that immediately fail generated UI if broken.
- **Component Recipes**: Standardized blueprints for Buttons, FormField, DynamicTable, and BottomSheet.

---

## 2. Complete `/impeccable` Command & Subcommand Taxonomy

Impeccable provides 24+ specialized design intelligence commands. AI agents can execute these commands directly or as sub-instructions within plan prompts:

### 🛠️ Group A: Creation, Structure & Scaffolding
<<<<<<< Updated upstream
| Command | Purpose | When to Use in Prompts |
| :--- | :--- | :--- |
| `/impeccable shape [entity]` | Synthesizes structural layout, component boundaries, and spatial hierarchy from requirements. | Use at the start of building a new screen or widget. |
| `/impeccable craft [component]` | Produces end-to-end pixel-perfect component implementation with full token bindings. | Use when implementing primitives (`Button`, `Card`, `Badge`). |
| `/impeccable layout [pattern]` | Enforces 4px/8px rhythm, container queries, and responsive grid geometry. | Use when designing dashboard headers, sidebars, or bento grids. |
| `/impeccable onboard [flow]` | Crafts stepped onboarding wizards, tour tooltips, and first-mile UX flows. | Use for scanner guard onboarding or tenant setup wizards. |

### 🔬 Group B: Review, Critique & Self-Healing
| Command | Purpose | When to Use in Prompts |
| :--- | :--- | :--- |
| `/impeccable critique [file]` | Evaluates UI against 30 UX laws, Fitts's Law, cognitive load, and visual hierarchy. | Use as pre-commit review before claiming a task is done. |
| `/impeccable audit [target]` | Systematic inspection of WCAG 2.2 AA contrast, responsive breakpoints, and Anti-Slop laws. | Mandatory execution in **Phase 4 (Hard Gate)** and **Phase 6**. |
| `/impeccable polish [target]` | Final sub-pixel pass: optical alignments, focus rings, border crispness, and hover physics. | Use after implementing a component to reach 100/100 visual quality. |
| `/impeccable harden [app]` | Strips hardcoded colors/classes and refactors legacy code into strict semantic tokens. | Use during **Phase 5 Multi-App Rollout**. |

### 🎨 Group C: Aesthetic Calibration & Style Tuning
| Command | Purpose | When to Use in Prompts |
| :--- | :--- | :--- |
| `/impeccable colorize [intent]` | Maps semantic colors (`layer-01`…`04`, `text-primary`, Kimchi Vermilion) to components. | Use when theming or fixing contrast in Dark/Light modes. |
| `/impeccable typeset [spec]` | Applies fluid `clamp()` type scale, line-height ratios, and bilingual font pairings. | Use when standardizing typography across screens. |
| `/impeccable animate [element]` | Implements physics-based easing (`cubic-bezier(0.4, 0, 0.2, 1)`), 2px lifts, and press states. | Use when adding micro-interactions and transitions. |
| `/impeccable bolder` | Increases visual contrast, weight, and prominence of primary calls to action. | Use when a screen feels too muted or washed out. |
| `/impeccable quieter` | Softens visual noise, reduces border saturation, and increases breathing room. | Use when high-density data tables feel cluttered. |
| `/impeccable distill` | Eliminates unnecessary UI chrome, extraneous borders, and redundant text. | Use to declutter complex forms or dense dashboards. |
| `/impeccable delight` | Injects subtle, premium micro-delights (e.g. glowing border sweeps, biometric HUD animations). | Use on key milestone moments (access granted, shift clocked in). |
| `/impeccable overdrive` | Pushes visual fidelity and shader physics to state-of-the-art keynote quality. | Use on marketing landing pages and hero bento cards. |

### 🌐 Group D: Adaptation, Documentation & AI Education
| Command | Purpose | When to Use in Prompts |
| :--- | :--- | :--- |
| `/impeccable adapt [device]` | Transforms desktop layouts to mobile touch patterns (DynamicTable $\to$ Card list, BottomSheets). | Mandatory in **Phase 3 & Phase 5**. |
| `/impeccable clarify [copy]` | Refines microcopy, Voice & Tone, and clear error diagnostics in English and Arabic. | Use for form helper texts, empty states, and banner alerts. |
| `/impeccable live [url]` | Runs live visual browser verification across Light/Dark and LTR/RTL modes. | Use during Phase 4 and Phase 6 verification. |
| `/impeccable document` | Generates component documentation, Do/Don't visual pairs, and API prop tables. | Use when adding showcase stories in `apps/design-system`. |
| `/impeccable extract` | Analyzes existing UI code and extracts reusable tokens or component patterns into `packages/ui`. | Use when finding repeated patterns across apps. |
| `/impeccable teach [ai]` | Emits structured, machine-readable `DESIGN.md` snippets to update AI knowledge. | Use to update workspace AI memory after major design changes. |
=======

| Command                         | Purpose                                                                                       | When to Use in Prompts                                          |
| :------------------------------ | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `/impeccable shape [entity]`    | Synthesizes structural layout, component boundaries, and spatial hierarchy from requirements. | Use at the start of building a new screen or widget.            |
| `/impeccable craft [component]` | Produces end-to-end pixel-perfect component implementation with full token bindings.          | Use when implementing primitives (`Button`, `Card`, `Badge`).   |
| `/impeccable layout [pattern]`  | Enforces 4px/8px rhythm, container queries, and responsive grid geometry.                     | Use when designing dashboard headers, sidebars, or bento grids. |
| `/impeccable onboard [flow]`    | Crafts stepped onboarding wizards, tour tooltips, and first-mile UX flows.                    | Use for scanner guard onboarding or tenant setup wizards.       |

### 🔬 Group B: Review, Critique & Self-Healing

| Command                       | Purpose                                                                                     | When to Use in Prompts                                              |
| :---------------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------ |
| `/impeccable critique [file]` | Evaluates UI against 30 UX laws, Fitts's Law, cognitive load, and visual hierarchy.         | Use as pre-commit review before claiming a task is done.            |
| `/impeccable audit [target]`  | Systematic inspection of WCAG 2.2 AA contrast, responsive breakpoints, and Anti-Slop laws.  | Mandatory execution in **Phase 4 (Hard Gate)** and **Phase 6**.     |
| `/impeccable polish [target]` | Final sub-pixel pass: optical alignments, focus rings, border crispness, and hover physics. | Use after implementing a component to reach 100/100 visual quality. |
| `/impeccable harden [app]`    | Strips hardcoded colors/classes and refactors legacy code into strict semantic tokens.      | Use during **Phase 5 Multi-App Rollout**.                           |

### 🎨 Group C: Aesthetic Calibration & Style Tuning

| Command                         | Purpose                                                                                        | When to Use in Prompts                                           |
| :------------------------------ | :--------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `/impeccable colorize [intent]` | Maps semantic colors (`layer-01`…`04`, `text-primary`, Kimchi Vermilion) to components.        | Use when theming or fixing contrast in Dark/Light modes.         |
| `/impeccable typeset [spec]`    | Applies fluid `clamp()` type scale, line-height ratios, and bilingual font pairings.           | Use when standardizing typography across screens.                |
| `/impeccable animate [element]` | Implements physics-based easing (`cubic-bezier(0.4, 0, 0.2, 1)`), 2px lifts, and press states. | Use when adding micro-interactions and transitions.              |
| `/impeccable bolder`            | Increases visual contrast, weight, and prominence of primary calls to action.                  | Use when a screen feels too muted or washed out.                 |
| `/impeccable quieter`           | Softens visual noise, reduces border saturation, and increases breathing room.                 | Use when high-density data tables feel cluttered.                |
| `/impeccable distill`           | Eliminates unnecessary UI chrome, extraneous borders, and redundant text.                      | Use to declutter complex forms or dense dashboards.              |
| `/impeccable delight`           | Injects subtle, premium micro-delights (e.g. glowing border sweeps, biometric HUD animations). | Use on key milestone moments (access granted, shift clocked in). |
| `/impeccable overdrive`         | Pushes visual fidelity and shader physics to state-of-the-art keynote quality.                 | Use on marketing landing pages and hero bento cards.             |

### 🌐 Group D: Adaptation, Documentation & AI Education

| Command                      | Purpose                                                                                           | When to Use in Prompts                                        |
| :--------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------ |
| `/impeccable adapt [device]` | Transforms desktop layouts to mobile touch patterns (DynamicTable $\to$ Card list, BottomSheets). | Mandatory in **Phase 3 & Phase 5**.                           |
| `/impeccable clarify [copy]` | Refines microcopy, Voice & Tone, and clear error diagnostics in English and Arabic.               | Use for form helper texts, empty states, and banner alerts.   |
| `/impeccable live [url]`     | Runs live visual browser verification across Light/Dark and LTR/RTL modes.                        | Use during Phase 4 and Phase 6 verification.                  |
| `/impeccable document`       | Generates component documentation, Do/Don't visual pairs, and API prop tables.                    | Use when adding showcase stories in `apps/design-system`.     |
| `/impeccable extract`        | Analyzes existing UI code and extracts reusable tokens or component patterns into `packages/ui`.  | Use when finding repeated patterns across apps.               |
| `/impeccable teach [ai]`     | Emits structured, machine-readable `DESIGN.md` snippets to update AI knowledge.                   | Use to update workspace AI memory after major design changes. |
>>>>>>> Stashed changes

---

## 3. How AI Tools Use `DESIGN.md` in Plan Prompts

In every phase prompt (`PROMPT_phase_01.md` through `PROMPT_phase_06.md`), the AI agent is instructed to:

1. **Read `DESIGN.md` first**:
   ```markdown
   Load and obey the rules in repository root `DESIGN.md`.
   ```
2. **Execute specific `/impeccable` commands**:
   ```markdown
   Execute:
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
   - `/impeccable shape [target]`
   - `/impeccable adapt mobile`
   - `/impeccable audit [target]`
   - `/impeccable polish`
   ```
3. **Verify Anti-AI-Slop Compliance**:
   Run the 6-point anti-slop check defined in `DESIGN.md` before claiming success.

---

## 4. Example: Full Impeccable Component Prompt

```markdown
# Role: GateFlow Impeccable Frontend Specialist
<<<<<<< Updated upstream
# Context: Read DESIGN.md

## Task
Execute `/impeccable craft DynamicTable` in `packages/ui/src/patterns/dynamic-table.tsx`.

## Instructions
=======

# Context: Read DESIGN.md

## Task

Execute `/impeccable craft DynamicTable` in `packages/ui/src/patterns/dynamic-table.tsx`.

## Instructions

>>>>>>> Stashed changes
1. `/impeccable shape table`: Sticky header, column sort, row selection, density toggle (Compact 36px vs Comfortable 44px).
2. `/impeccable colorize`: Header `bg-[var(--ds-layer-01)]`, Row `bg-[var(--ds-layer-02)]`, Hover `bg-[var(--ds-layer-03)]`.
3. `/impeccable adapt mobile`: On viewports < 768px, automatically convert table rows to stacked interactive `<Card>` items (zero horizontal scroll).
4. `/impeccable polish`: Add 2px focus ring, sub-pixel border transitions, and keyboard navigation.
5. `/impeccable audit`: Ensure zero WCAG contrast errors, zero Anti-AI-slop violations, and 100% `jest-axe` unit test pass.
```
