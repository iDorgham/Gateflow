# TASKS: marketing_egypt_uiux_polish

**Slug:** `marketing_egypt_uiux_polish`  
**Plan:** `PLAN_marketing_egypt_uiux_polish.md`

---

## Phase 1: Code Hygiene & Package Normalization

- [x] Remove orphan directory `apps/marketing/app/[locale`
- [x] Replace deep relative import in `apps/marketing/components/nav.tsx` (`../../../packages/ui/...` → `@gateflow/ui`)
- [x] Audit component token imports across `apps/marketing/components/` to match `@gate-access/ui/tokens`
- [x] `phase_logs/PHASE_LOG_phase_01.md` created

---

## Phase 2: Egyptian Arabic (`ar-EG`) Localization Upgrade

- [x] Upgrade `apps/marketing/locales/ar-EG/landing.json` with authentic Egyptian compound & security vocabulary
- [x] Upgrade `apps/marketing/locales/ar-EG/solutions.json` with Egypt geographic hubs (New Cairo, Sheikh Zayed, 6th October, Red Sea)
- [x] Upgrade `apps/marketing/locales/ar-EG/pricing.json` with EGP enterprise security tiers and billing clarity
- [x] Upgrade `apps/marketing/locales/ar-EG/contact.json` and `navigation.json` for high-intent Egyptian lead capture
- [x] Verify dictionary consistency with `apps/marketing/locales/en/` counterparts
- [x] `phase_logs/PHASE_LOG_phase_02.md` created

---

## Phase 3: UI/UX & Responsive RTL Polish

- [x] Refine Hero section animations and trust badges for instant visual engagement
- [x] Audit RTL alignment across navigation dropdowns, mobile menu drawer, and footer links
- [x] Ensure directional chevrons flip in RTL while logos and search icons stay fixed
- [x] Ensure phone numbers, short codes, and metrics counters are encapsulated in `dir="ltr"`
- [x] `phase_logs/PHASE_LOG_phase_03.md` created

---

## Phase 4: Core Web Vitals & Performance Verification

- [x] Optimize `HeroAnimatedContent` bundle footprint and ensure critical LCP text elements paint immediately
- [x] Add explicit width, height, and priority attributes to hero images and trust logos to guarantee CLS < 0.02
- [x] Dynamically import below-the-fold interactive components (e.g. simulation widgets)
- [x] Run preflight checks (`pnpm turbo lint typecheck --filter=marketing`) and confirm zero regressions
- [x] `phase_logs/PHASE_LOG_phase_04.md` created
