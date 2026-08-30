# Pro Prompt — Phase 1: Tokens & Dual-Mode Foundations

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 1 — Tokens & Dual-Mode Foundations  
**Target Paths:** `packages/tokens`, `packages/ui/src/tokens.ts`, `packages/ui/src/globals.css`, `apps/design-system`  
**Branch:** `feat/design-system-phase-1-tokens` (branches from `main`, merges into `main`)  
**Status:** ⏳ Ready for Execution  
<<<<<<< Updated upstream
**Effort / Risk:** 🟢 Med Effort / Low Risk  
=======
**Effort / Risk:** 🟢 Med Effort / Low Risk
>>>>>>> Stashed changes

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `FRONTEND` (`frontend.md`) / `ARCHITECTURE` (`architecture.md`)
- **Preferred Tool:** Cursor / Claude Code CLI / Gemini CLI
- **Skills to Invoke:** `tokens-design`, `ads-foundations`, `design-guide`, `impeccable-bridge`, `anti-slop-validator`, `ads-a11y-rtl`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable colorize tokens` — Three-tier architecture (Foundations → Semantic → Component), Satin-Charcoal (`layer-01`…`04`) + Porcelain, switchable Accent Profiles (Kimchi default, Cobalt, Emerald).
- [ ] `/impeccable typeset fonts` — Fluid `clamp()` scale, Inter/Outfit (LTR) + Cairo/Tajawal (RTL).
- [ ] `/impeccable layout spacing` — 4px base grid, Compact vs Comfortable density tokens, `--ds-touch-target-min: 44px`.

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/ACCESSIBILITY_AND_A11Y_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `packages/ui/src/tokens.ts`
- `packages/ui/src/globals.css`
- `packages/tokens/`

---

## 🛠️ 4. Numbered Step-by-Step Instructions

1. **Trunk Branch Setup**:
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git checkout -b feat/design-system-phase-1-tokens
   ```
2. **Three-Tier Token Structure**:
   - Create `packages/tokens/foundations/` (primitive OKLCH and spacing scales).
   - Create `packages/tokens/semantic/` (`layer-01`…`layer-04`, `text-primary`, `text-subtle`, `border-subtle`, `border-bold`, density scales).
   - Create `packages/tokens/component/` (thin component bindings).
   - Evolve existing `packages/tokens/css/tokens.css` to import these tiers while preserving legacy CSS variable aliases for backwards compatibility.
3. **Dual-Mode Physics & Glassmorphism Resolution**:
   - Implement OKLCH Satin-Charcoal surfaces for Dark Mode.
   - Implement Porcelain surfaces for Light Mode.
   - Add procedural rim-light edge-glow (`--ds-glow-subtle`) for `layer-03`/`layer-04`.
   - Explicitly ban heavy backdrop-blur and default glassmorphism on basic cards.
4. **Synchronize Expo / React Native Bridge**:
   - Update `packages/ui/src/tokens.ts` so `nativeTokens` exports resolved, type-safe hex values.
5. **Build & Wire Automated Contrast Checker**:
   - Implement `packages/tokens/scripts/check-contrast.ts` checking all semantic pairs against WCAG 2.2 AA.
   - Add script to `packages/tokens/package.json`:
     ```bash
     pnpm --filter @gateflow/tokens check-contrast
     ```
   - Wire into Turbo pipeline and root verification.
6. **Showcase Token Viewer**:
   - Update `apps/design-system/src/app/foundations/colors` and `elevation-layers` to live-preview the new token engine.
7. **Preflight Verification**:
   ```bash
   pnpm turbo typecheck lint --filter=@gateflow/tokens --filter=@gateflow/ui
   pnpm --filter @gateflow/tokens check-contrast
   ```

---

## 🛡️ 5. Hard Acceptance Criteria

- [ ] 3-tier structure live: `foundations/`, `semantic/`, `component/`.
- [ ] Light mode Porcelain + Dark mode Satin-Charcoal implemented.
- [ ] Rim-light edge-glow enabled; default card glassmorphism banned.
- [ ] Accent profiles switchable (Kimchi, Cobalt, Emerald).
- [ ] `nativeTokens` exports type-safe, resolved hex for Expo.
- [ ] Automated contrast checker fails on WCAG AA violations; passes green.
- [ ] Lint / typecheck / build green. Anti-slop PASS.
- [ ] Branch from `main` → PR against `main` → 5-Gate Review → squash-merge → delete branch.

---

## 🚀 6. Commit, PR & Merge (No Version Tags)

```bash
git add .
git commit -m "feat(design-system): phase 1 - tokens, dual-mode foundations and automated contrast checker"
git push -u origin feat/design-system-phase-1-tokens
gh pr create --base main --title "feat(design-system): phase 1 – tokens & dual-mode foundations" --body "Phase 1 complete. 3-tier tokens, Satin-Charcoal + Porcelain elevations, nativeTokens bridge, and automated contrast checker implemented."
# After PR passes 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
