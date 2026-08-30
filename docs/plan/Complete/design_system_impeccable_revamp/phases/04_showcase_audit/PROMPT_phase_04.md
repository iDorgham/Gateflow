# Pro Prompt — Phase 4: Showcase, Docs, Vibe-Check Sandbox & Self-Healing Audit (HARD GATE)

**Initiative:** `design_system_impeccable_revamp`  
**Phase:** Phase 4 — Showcase, Docs, Vibe-Check Sandbox & Self-Healing Audit  
**Target Paths:** `apps/design-system`, `packages/ui/`  
**Branch:** `feat/design-system-phase-4-showcase-audit` (branches from `main`, merges into `main`)  
**Status:** ⏳ HARD GATE (Blocks Phase 5)  
**Effort / Risk:** 🟡 Med Effort / Med Risk  

---

## 🎭 1. Primary Role & Tool Selection

- **Primary Role:** `QA` (`qa.md`) / `IMPECCABLE-CRITIC` (`impeccable-bridge`)
- **Preferred Tool:** Cursor / Claude Code CLI / Gemini CLI
- **Skills to Invoke:** `theme-auditor`, `anti-slop-validator`, `ads-foundations`, `ads-a11y-rtl`, `impeccable-bridge`

---

## 🎨 2. Impeccable Commands to Execute

- [ ] `/impeccable audit apps/design-system` — Automated Playwright+axe accessibility scan, contrast validation, and anti-AI-slop check.
- [ ] `/impeccable critique` — Heuristic scoring against 30 UX laws, State Matrix completeness, and cognitive load rating.
- [ ] `/impeccable polish` — Final sub-pixel rendering and focus-ring calibration.
- [ ] `/impeccable document` — Author Prompt Writing Guide and Do/Don't visual comparison stories.
- [ ] `/impeccable live` — Visual verification across Light, Dark, LTR, RTL, and both densities.
- [ ] `/impeccable teach ai` — Generate public `llms.txt` and `ai-context.json` endpoint.

---

## 🏛️ 3. Context to Load

- `DESIGN.md` (Root AI Design Specification)
- `docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md`
- `docs/plan/Draft/design_system_impeccable_revamp/AI_CONTEXT_PACK.md`
- `docs/plan/Draft/design_system_impeccable_revamp/VIBE_CODER_QUICKSTART.md`
- `docs/plan/Draft/design_system_impeccable_revamp/CONTEXT_design_system_impeccable_revamp.md`
- `apps/design-system/src/app/`
- `.agents/skills/theme-auditor/SKILL.md`

---

## 🛠️ 4. Numbered Step-by-Step Instructions

1. **Trunk Branch Setup**:
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git checkout -b feat/design-system-phase-4-showcase-audit
   ```
2. **Implement Complete Information Architecture**:
   - **Foundations**: Color (Accent Profiles, OKLCH Satin/Porcelain), Typography, Icons, Motion, Density & Elevation.
   - **Components & Patterns**: Forms (Input, Select, FormField), Tables (DynamicTable), AI (Virtual Lab Assistant), Analytics/Charts, Auth/Shells, Feedback/EmptyState, Menus/Overlays, Date Picker.
   - **Guidelines**: Prompt Writing Guide, Content & Voice/Tone (EN + AR), Accessibility & RTL, Contribution Guide.
   - **Sandboxes**: Vibe-Check Sandbox (`/sandboxes/vibe-check`) for live AST sanitization + Theme Studio.
3. **Author the Prompt Writing Guide & AI Integrations**:
   - Add the dedicated AI Prompt Writing Guide page with "Copy for Cursor/Claude" buttons on every component doc story.
   - Generate `apps/design-system/public/llms.txt` and `ai-context.json` matching `DESIGN.md`.
4. **Automated Accessibility Testing with Playwright + Axe**:
   - Run `@axe-core/playwright` across all design-system showcase routes.
   - Ensure zero critical/serious accessibility violations.
5. **Self-Healing Iteration Cycle**:
   - Generate `AUDIT_REPORT_design_system.md` containing automated a11y test receipts.
   - If any contrast, a11y, or layout flaw is detected, patch `packages/ui/` immediately and re-run audits until 100/100 heuristic score is achieved.
6. **Preflight & Gate Closure**:
   - Run full verification:
     ```bash
     pnpm turbo build --filter=design-system
     pnpm --filter @gateflow/tokens check-contrast
     pnpm preflight
     ```

---

## 🛡️ 5. Hard Acceptance Criteria (HARD GATE)

- [ ] Complete IA live (Foundations, Components, Patterns, Guidelines, Sandboxes).
- [ ] Vibe-Check Sandbox & Prompt Writing Guide live.
- [ ] Public `llms.txt` and `ai-context.json` served.
- [ ] Playwright+axe green across all showcase routes.
- [ ] Full audit: Light/Dark + LTR/RTL + both densities.
- [ ] 0 contrast failures (`pnpm check-contrast`). Anti-slop PASS. Heuristic 100/100.
- [ ] `AUDIT_REPORT_design_system.md` published with automated a11y results.
- [ ] Preflight green.
- [ ] Branch from `main` → PR against `main` → 5-Gate Review → squash-merge → delete branch.  
  *(Phase 5A/5B/5C are strictly blocked until this gate closes)*

---

## 🚀 6. Commit, PR & Merge (No Version Tags)

```bash
git add .
git commit -m "feat(design-system): phase 4 - showcase, docs, vibe-check sandbox and self-healing audit"
git push -u origin feat/design-system-phase-4-showcase-audit
gh pr create --base main --title "feat(design-system): phase 4 – showcase, docs, vibe-check & audit (HARD GATE)" --body "Phase 4 complete. Full IA live, Vibe-Check Sandbox live, llms.txt served, Playwright+axe clean, 100/100 heuristic score."
# After PR passes 5-Gate review and CI:
gh pr merge --squash --delete-branch
```
