# TASKS: marketing_rebuild_dashboard_parity

**Plan:** `PLAN_marketing_rebuild_dashboard_parity.md`
**Status:** ✅ Complete (all 4 phases done)

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

- [x] Refactor homepage and shared sections (`components/sections/*`) to semantic token classes
- [x] Pricing, features, solutions index — consistent cards, CTAs, borders
- [x] RTL audit (`ar-EG`) on refactored sections (ordering/layout classes validated in shell + sections)
- [x] `pnpm preflight` if marketing + ui both touched (not required; `packages/ui` untouched)

## Phase 04 — SEO, motion, verification

- [x] Metadata / OG templates unchanged or improved; fixed 11 child pages that double-appended `| GateFlow`; JSON-LD aligned to `NEXT_PUBLIC_SITE_URL`
- [x] Motion: `prefers-reduced-motion` — hero uses CSS hover transitions only (no CLS); contact-form entrance animations wrapped with `motion-safe:`
- [x] Optional: Lighthouse skipped (no browser tooling in session; build-level typecheck sufficient)
- [x] Final `pnpm preflight` — 51 test suites pass, full turbo ✅

---

**When complete:** move plan folder per `docs/plan/PLAN_LIFECYCLE.md` and sync `ALL_TASKS_BACKLOG.md`.
