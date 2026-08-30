# Pro Prompt — Phase 3: Domain Patterns + Content System + Mobile Primitives

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 3 — Domain Patterns + Content System + Mobile Primitives  
**Target Paths:** `packages/ui/src/patterns/`, `packages/ui/src/mobile/`, `apps/design-system`  
**Branch:** `feat/design-system-phase-3-patterns` (branches from `main`, merges into `main`)  
**Status:** ⏳ Pending Phase 2  
**Effort / Risk:** 🟢 Med Effort / Low Risk  

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `FRONTEND` (`frontend.md`) / `MOBILE` (`mobile.md`)
- **Preferred Tool:** Cursor / Claude Code CLI
- **Skills to Invoke:** `ads-data`, `shadcn-composable`, `expo-mobile-optimization`, `ai-ux-patterns`, `content-creation`, `impeccable-bridge`, `anti-slop-validator`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable shape [patterns]` — Dashboard DynamicTable, KPI Cards, Filter Bar, Command Palette, Marketing Bento, AI Virtual Lab panels.
- [ ] `/impeccable adapt mobile` — DynamicTable-to-Card transformation on mobile, BottomSheet, TouchList, FAB, BiometricHUD.
- [ ] `/impeccable clarify` — Define Content/Microcopy patterns and short Voice & Tone standard (EN + AR).

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `packages/ui/src/primitives/`
- `packages/ui/src/globals.css`

---

## 🛠️ 4. Numbered Step-by-Step Instructions

1. **Trunk Branch Setup**:
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git checkout -b feat/design-system-phase-3-patterns
   ```
2. **DynamicTable with Responsive Card Transformation**:
   - Build `DynamicTable` with sorting, filtering, selection, pagination, and density toggle.
   - Implement automatic layout transformation on viewports $< 768\text{px}$ converting table rows into stacked interactive card lists (no horizontal scroll).
3. **Mobile First-Class Primitives**:
   - Implement `BottomSheet` with snap points, drag handles, backdrop blur, and safe-area insets.
   - Implement `TouchList`, `FAB`, and `BiometricHUD` status feedback cards.
4. **Forms & Operational Patterns**:
   - `EmptyState`: short concise copy + single clear CTA.
   - `Banner` / `Flag`: integrate with the Badge/Tag system.
   - `CommandPalette`: `cmd+k` accessible modal with keyboard search.
5. **Content & Microcopy Standards**:
   - Define GateFlow Voice & Tone guide (calm, precise, reassuring in both English and Arabic).
   - Standardize error messages and helper text microcopy.
6. **AI Assistant Panel (Virtual Lab Palette)**:
   - Build AI chat panel, streaming message containers, and action cards strictly using Orchid/Violet (`#8B5CF6`).
7. **Verification**:
   - Run unit tests and axe scans on new pattern components.

---

## 🛡️ 5. Hard Acceptance Criteria

- [ ] Table → card list on mobile. BottomSheet first-class (snap points, safe area).
- [ ] EmptyState + Banner use content system.
- [ ] AI components use only Virtual Lab colors.
- [ ] Content/microcopy + Voice & Tone defined.
- [ ] Axe coverage on new patterns where applicable.
- [ ] Lint / typecheck / test green. Zero anti-slop.
- [ ] Branch from `main` → PR against `main` → 5-Gate Review → squash-merge → delete branch.

---

## 🚀 6. Commit, PR & Merge (No Version Tags)

```bash
git add .
git commit -m "feat(design-system): phase 3 - domain patterns, content system and mobile"
git push -u origin feat/design-system-phase-3-patterns
gh pr create --base main --title "feat(design-system): phase 3 – domain patterns + content + mobile" --body "Phase 3 complete. DynamicTable mobile conversion, BottomSheet, Content/Voice&Tone, and Virtual Lab AI components implemented."
# After PR passes 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
