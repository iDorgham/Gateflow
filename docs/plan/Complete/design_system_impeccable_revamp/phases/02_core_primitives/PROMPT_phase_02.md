# Pro Prompt — Phase 2: Core Primitives + API, State Matrix, FormField, A11y & Visual Gates

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 2 — Core Primitives + API, State Matrix, FormField, A11y & Visual Gates  
**Target Paths:** `packages/ui/src/primitives/`, `packages/ui/src/form-field/`, `apps/design-system`  
**Branch:** `feat/design-system-phase-2-primitives` (branches from `main`, merges into `main`)  
**Status:** ⏳ Pending Phase 1  
<<<<<<< Updated upstream
**Effort / Risk:** 🟡 High Effort / Med Risk  
=======
**Effort / Risk:** 🟡 High Effort / Med Risk
>>>>>>> Stashed changes

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `FRONTEND` (`frontend.md`)
- **Preferred Tool:** Cursor / Claude Code CLI / Gemini CLI
- **Skills to Invoke:** `shadcn-ads`, `uiux-animator`, `impeccable-bridge`, `anti-slop-validator`, `ads-a11y-rtl`, `testing`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable craft [primitives]` — Button (incl. FAB), Badge/Tag, Input, Select, Textarea, Label, Checkbox, Switch, Card, Dialog, Drawer, Dropdown, Tabs, Tooltip, Skeleton, Spinner, Avatar, Progress, FormField.
- [ ] `/impeccable animate motion` — `cubic-bezier(0.4, 0, 0.2, 1)` easing, 200–300ms interactions, 0 layout property animations.
- [ ] `/impeccable delight` — Soft inner top-edge highlight on buttons, card edge glows, gentle input shake on error.

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/ACCESSIBILITY_AND_A11Y_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `packages/ui/src/globals.css`
- `packages/ui/src/tokens.ts`

---

## 🛠️ 4. Numbered Step-by-Step Instructions

1. **Trunk Branch Setup**:
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git checkout -b feat/design-system-phase-2-primitives
   ```
2. **Component API Consistency & Live State Matrix**:
   - Enforce shared props: `variant`, `size`, `tone`/`intent`, `isDisabled`, `isLoading`, `isSelected`, `asChild`.
   - Render a live **State Coverage Matrix** in `apps/design-system` for all interactive primitives showcasing 8 canonical states (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`, `selected`, `error`).
3. **Badge/Tag System Overhaul**:
   - 5 variants: `Solid`, `Soft`, `Outline`, `Ghost`, `Dot` (with pulsing status indicator).
   - 3 sizes: `sm` (20px), `md` (24px), `lg` (28px).
   - Interactive / removable support with keyboard accessibility.
4. **Button & Card Physics**:
   - Button: soft top-edge highlight in dark mode, active press `scale(0.97)`, FAB variant for mobile.
   - Card: 1px subtle border with procedural edge-glow (`--ds-glow-subtle`).
5. **Composable `FormField` Primitive**:
   - Implement `<FormField label helperText errorMessage isRequired isInvalid>` with automatic ARIA linkage (`aria-describedby`, `aria-invalid`) and Ruby error shake animation.
6. **Visual Regression Snapshot Suite**:
   - Create Playwright visual baseline snapshot tests capturing every primitive across Light/Dark + LTR/RTL viewports.
7. **Accessibility Unit Gates**:
   - Implement `[component].test.tsx` for every primitive asserting zero `jest-axe` violations.
   - Test `FormField` compositions (label + control + helper + error).

---

## 🛡️ 5. Hard Acceptance Criteria

- [ ] All base primitives consume semantic tokens.
- [ ] Live State Coverage Matrix rendered in showcase.
- [ ] Badge/Tag overhaul complete (5 variants, 3 sizes).
- [ ] FormField composable + accessible + tested.
- [ ] Playwright visual regression snapshots generated.
- [ ] `eslint-plugin-jsx-a11y` clean; `jest-axe` / `vitest-axe` unit tests green on every primitive.
- [ ] Mobile touch targets $\ge 44\text{px} \times 44\text{px}$.
- [ ] Branch from `main` → PR against `main` → 5-Gate Review → squash-merge → delete branch.

---

## 🚀 6. Commit, PR & Merge (No Version Tags)

```bash
git add .
git commit -m "feat(design-system): phase 2 - core primitives, live state matrix, formfield and a11y visual gates"
git push -u origin feat/design-system-phase-2-primitives
gh pr create --base main --title "feat(design-system): phase 2 – core primitives, live state matrix & formfield" --body "Phase 2 complete. Base primitives, live State Matrix, Badge overhaul, FormField, Playwright visual baselines, and jest-axe unit tests implemented."
# After PR passes 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
