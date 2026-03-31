# TASKS: marketing_rebuild_dashboard_parity

**Plan:** `PLAN_marketing_rebuild_dashboard_parity.md`  
**Status:** In progress (Phase 02 complete)

---

## Phase 01 — Token & Tailwind alignment

- [x] Diff `apps/marketing/app/globals.css` vs `packages/ui/src/globals.css`; document strategy in `assets/ARCH_NOTES.md`
- [x] Implement single-source or layered import; remove dead duplicate variables
- [x] Align `apps/marketing/tailwind.config.ts` with `packages/ui` color/spacing/radius maps (already used `tokens` from `packages/ui`; no change required)
- [x] `pnpm --filter marketing lint` + `pnpm preflight` (full preflight run; `packages/ui` not modified)

## Phase 02 — Layout shell & primitives

- [x] Refactor `apps/marketing/app/[locale]/layout.tsx` and global providers to use aligned tokens
- [x] Migrate `Nav`, `Footer`, and shared wrappers to `@gate-access/ui` primitives where it reduces drift
- [x] Verify theme toggle + fonts (Inter/Cairo decision recorded)
- [x] `pnpm --filter marketing lint` + spot manual EN/AR (token-level RTL ordering verified in shell components)

## Phase 03 — Section refactors

- [ ] Refactor homepage and shared sections (`components/sections/*`) to semantic token classes
- [ ] Pricing, features, solutions index — consistent cards, CTAs, borders
- [ ] RTL audit (`ar-EG`) on refactored sections
- [ ] `pnpm preflight` if marketing + ui both touched

## Phase 04 — SEO, motion, verification

- [ ] Metadata / OG templates unchanged or improved; no broken canonical URLs
- [ ] Motion: `prefers-reduced-motion`; no layout thrash on hero
- [ ] Optional: spot Lighthouse on `/` and `/pricing` (local or CI artifact)
- [ ] Final `pnpm preflight`; update this file to **Done**

---

**When complete:** move plan folder per `docs/plan/PLAN_LIFECYCLE.md` and sync `ALL_TASKS_BACKLOG.md`.
