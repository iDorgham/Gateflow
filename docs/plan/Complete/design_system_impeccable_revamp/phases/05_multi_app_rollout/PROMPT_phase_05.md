# Pro Prompt — Phase 5: Multi-App Rollout (3-Slice Phased Execution)

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 5 — Multi-App Rollout (5A, 5B, 5C Sequential Slices)  
<<<<<<< Updated upstream
**Target Applications:**  
- **5A (Dashboards)**: `apps/client-dashboard`, `apps/admin-dashboard` (`feat/design-system-phase-5a-dashboards`)  
- **5B (Web & Portals)**: `apps/marketing`, `apps/resident-portal` (`feat/design-system-phase-5b-portals`)  
- **5C (Mobile Apps)**: `apps/scanner-app`, `apps/resident-mobile` (`feat/design-system-phase-5c-mobile`)  
**Status:** ⏳ Pending Phase 4 Hard Gate  
**Effort / Risk:** 🔴 High Effort / High Overall Risk (5A Med/Med, 5B Med/Low, 5C Med/Med)  
=======
**Target Applications:**

- **5A (Dashboards)**: `apps/client-dashboard`, `apps/admin-dashboard` (`feat/design-system-phase-5a-dashboards`)
- **5B (Web & Portals)**: `apps/marketing`, `apps/resident-portal` (`feat/design-system-phase-5b-portals`)
- **5C (Mobile Apps)**: `apps/scanner-app`, `apps/resident-mobile` (`feat/design-system-phase-5c-mobile`)  
  **Status:** ⏳ Pending Phase 4 Hard Gate  
  **Effort / Risk:** 🔴 High Effort / High Overall Risk (5A Med/Med, 5B Med/Low, 5C Med/Med)
>>>>>>> Stashed changes

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `FRONTEND` (`frontend.md`) for 5A/5B, `MOBILE` (`mobile.md`) for 5C
- **Preferred Tool:** Cursor / Claude Code CLI
- **Skills to Invoke:** `design-guide`, `theme-auditor`, `ads-a11y-rtl`, `expo-mobile-optimization`, `impeccable-bridge`, `shadcn-composable`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable adapt client-dashboard admin-dashboard marketing resident-portal scanner-app resident-mobile`
- [ ] `/impeccable harden apps` — Clean up legacy hardcoded colors, replace with semantic tokens and FormField.
- [ ] `/impeccable clarify` — Verify microcopy, Voice & Tone, and clear button labels across migrated screens.

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/MIGRATION_AND_ROLLOUT_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/VIBE_CODER_QUICKSTART.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `packages/ui/src/`
- Target apps `package.json` and layout files.

---

## 🛡️ 4. Rollback, Safety & Additive Migration Rules

1. **Additive Migration**: Introduce new `@gateflow/ui` components and tokens first alongside legacy layouts before removing old code.
2. **Backwards-Compatible Aliases**: Ensure `packages/tokens` maintains CSS variable aliases (`--color-background` $\to$ `var(--ds-layer-01)`) to avoid sudden blank screens during partial migration.
3. **Mandatory Screenshot Diff Review**: Before squash-merging each slice (5A, 5B, 5C), generate Playwright visual diffs comparing before/after screens.

---

## 🛠️ 5. Sequential Execution Steps

### Slice 5A: Dashboards Migration (`client-dashboard` & `admin-dashboard`)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```bash
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/design-system-phase-5a-dashboards
```
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. Update imports to consume `@gateflow/ui` primitives and patterns (`DynamicTable`, KPI cards, Filter drawers).
2. Enforce **Compact** density (36px control height) as default.
3. Replace raw forms with `<FormField>`.
4. Run `@axe-core/playwright` on critical dashboard flows (Visitors table, pass generator).
5. Generate screenshot diffs, create PR #5A, pass 5-Gate Review, squash-merge into `main`, and delete branch.

### Slice 5B: Web & Portals Migration (`marketing` & `resident-portal`)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```bash
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/design-system-phase-5b-portals
```
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. Apply `@gateflow/ui` bento cards, glass headers, and interactive feature blocks.
2. Enforce **Comfortable** density (48px control height) as default.
3. Verify Arabic RTL rendering on public marketing and resident portal pages.
4. Generate screenshot diffs, create PR #5B, pass 5-Gate Review, squash-merge into `main`, and delete branch.

### Slice 5C: Mobile Apps Migration (`scanner-app` & `resident-mobile`)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```bash
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/design-system-phase-5c-mobile
```
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
1. Update Expo apps to consume typed `nativeTokens` directly from `@gateflow/ui/tokens`.
2. Implement `BottomSheet`, `FAB`, `BiometricHUD`, and ensure touch targets $\ge 44\text{px} \times 44\text{px}$.
3. Verify guard camera scanner viewfinder HUD feedback in Light/Dark modes.
4. Generate screenshot diffs, create PR #5C, pass 5-Gate Review, squash-merge into `main`, and delete branch.

---

## 🛡️ 6. Hard Acceptance Criteria

- [ ] All 3 slices (5A, 5B, 5C) merged sequentially via independent PRs into `main`.
- [ ] Semantic tokens + `@gateflow/ui` package used across all 6 apps.
- [ ] FormField + content patterns standardized.
- [ ] Screenshot diff reviews approved for each slice with zero visual regressions on critical flows.
- [ ] Playwright+axe green on critical app journeys.
- [ ] All app builds green (`pnpm turbo build`). Lint / typecheck 100% clean.

---

## 🚀 7. Commit & PR Template (Per Slice)

```bash
# Example for 5A:
git add .
git commit -m "feat(dashboards): phase 5a - migrate client-dashboard and admin-dashboard to @gateflow/ui"
git push -u origin feat/design-system-phase-5a-dashboards
gh pr create --base main --title "feat(dashboards): phase 5A – client and admin dashboards design system migration" --body "Phase 5A complete. Dashboards migrated to Compact density, FormField, and DynamicTable. Screenshot diffs attached."
# After PR passes 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
