# Pro Prompt — Phase 6: Monorepo Certification & Release Handoff

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 6 — Monorepo Certification & Release Handoff  
**Target Scope:** Full Monorepo (All 6 apps + packages)  
**Branch:** `feat/design-system-phase-6-certification` (branches from `main`, merges into `main`)  
**Status:** ⏳ Pending Phase 5  
<<<<<<< Updated upstream
**Effort / Risk:** 🟢 Med Effort / Low Risk  
=======
**Effort / Risk:** 🟢 Med Effort / Low Risk
>>>>>>> Stashed changes

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `QA` (`qa.md`) / `DEVOPS` (`devops.md`) / `IMPECCABLE-CRITIC` (`impeccable-bridge`)
- **Preferred Tool:** Cursor / Claude Code CLI
- **Skills to Invoke:** `github-pr-review`, `merge-gatekeeper`, `theme-auditor`, `anti-slop-validator`, `testing`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable audit all` — Monorepo-wide visual and automated quality audit across 6 apps × 2 themes × 2 directions × 2 densities (24 configuration matrix combinations).
- [ ] `/impeccable polish final` — Final pixel-perfection pass across all application shells.
- [ ] `/impeccable critique final` — Final heuristic sign-off and consistency check.

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `docs/plan/Draft/design_system_impeccable_revamp/TASKS_design_system_impeccable_revamp.md`

---

## 🛠️ 4. Numbered Step-by-Step Instructions

1. **Trunk Branch Setup**:
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git checkout -b feat/design-system-phase-6-certification
   ```
2. **Comprehensive Monorepo End-to-End Sample Audit**:
   - Audit 6 apps across Light, Dark, LTR, and RTL modes (24 configuration matrix combinations).
   - Verify that all surfaces feel like one cohesive, premium product family.
   - Run `@axe-core/playwright` on critical journeys across all apps.
3. **Resolve Any Remaining Edge-Case Quirks**:
   - Patch any subtle contrast, typography, or alignment discrepancies.
4. **Full Monorepo Preflight Check**:
   ```bash
   pnpm preflight
   ```
5. **Publish Dated Walkthrough Certification Artifact**:
   - Create dated `docs/development/certification/CERTIFICATION_design_system_impeccable_revamp.md` containing:
     - Executive summary
     - Screenshot grid (Light/Dark + LTR/RTL)
     - Token contrast + anti-slop + a11y automation results
     - State Matrix / API / FormField spot-checks
     - 5-Gate sign-off section
6. **Move Plan Lifecycle**:
   - Move plan folder from `docs/plan/Draft/design_system_impeccable_revamp/` to `docs/plan/Complete/design_system_impeccable_revamp/`.
   - Update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` status to ✅ Complete.
   - Update `SESSION_MEMORY.md` with final merge commit and all phases complete note.
7. **Final Merge**:
   - Squash-merge PR #6 into `main` and delete the branch.

---

## 🛡️ 5. Hard Acceptance Criteria

- [ ] Sample end-to-end audit: all apps × Light/Dark × LTR/RTL × densities.
- [ ] Critical journeys verified (dashboards, portals, mobile scan/home).
- [ ] Automated a11y gates green on design-system + critical app routes.
- [ ] Zero remaining contrast / anti-slop violations on audited screens.
- [ ] Full monorepo `pnpm preflight` green.
- [ ] Dated **Walkthrough Certification** artifact published (`docs/development/certification/CERTIFICATION_design_system_impeccable_revamp.md`).
- [ ] Final 5-Gate review signed off.
- [ ] Squash-merge to `main`, delete branch.
- [ ] Plan moved to `Complete/design_system_impeccable_revamp/`.
- [ ] TASKS + SESSION_MEMORY updated with final merge commit and “all phases complete”.

---

## 🚀 6. Commit, PR & Merge (No Version Tags)

```bash
git add .
git commit -m "chore(certification): complete phase 6 - design system certification across monorepo"
git push -u origin feat/design-system-phase-6-certification
gh pr create --base main --title "feat(design-system): phase 6 – monorepo certification and completion" --body "Final certification for Design System overhaul across all 6 GateFlow apps. Walkthrough certification artifact attached."
# After PR passes final 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
