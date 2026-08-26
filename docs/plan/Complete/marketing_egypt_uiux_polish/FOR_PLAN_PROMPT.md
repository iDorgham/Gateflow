# FOR_PLAN_PROMPT: marketing_egypt_uiux_polish

> Handoff prompt for `/plan marketing_egypt_uiux_polish` compiled from `DRAFT_marketing_egypt_uiux_polish.md`.

---

## 1. Mission

Elevate GateFlow's marketing website (`apps/marketing`) into an elite, high-converting B2B acquisition platform for the Egyptian and MENA property security market. Upgrade the Egyptian Arabic (`ar-EG`) localization with authentic compound and security enterprise vernacular (بوابات ذكية مشفرة للكمبوندات، تصاريح واتساب بدون تطبيق، ربط BFT/Came/Nice), resolve deep package import anomalies and orphan directories, align design tokens to ADS standards, and optimize Hero LCP/CLS Core Web Vitals to deliver sub-1.2s load times.

---

## 2. In Scope vs Out of Scope

### In Scope:

- **Arabic Egypt (`ar-EG`) Copy Overhaul**: `landing.json`, `solutions.json`, `pricing.json`, `navigation.json`, and `contact.json` in `apps/marketing/locales/ar-EG/`.
- **Code & Package Cleanliness**: Replace deep relative import in `apps/marketing/components/nav.tsx` with `@gate-access/ui`; delete orphan directory `apps/marketing/app/[locale`.
- **UI/UX & ADS Token Polish**: Standardize ADS tokens (`--ds-background-brand-bold`, `--ds-text-subtle`, `--ds-border-selected`), refine Framer Motion micro-interactions and mobile drawer layout.
- **Performance & CWV**: Optimize LCP on hero landing, lazy-load non-critical client animations, lock CLS < 0.02.

### Out of Scope:

- Client dashboard and admin dashboard internal APIs/middleware.
- Prisma schema migrations (marketing is a stateless web application).

---

## 3. Users & Constraints

- **Primary Users**: Egyptian Real Estate Developers, Compound Board of Directors, Facility Managers, Security Chiefs (New Cairo, Sheikh Zayed, 6th October, New Capital, Red Sea, North Coast).
- **Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, `@gate-access/ui` tokens.
- **RTL/i18n Invariants**: Full bidirectional support (`dir="rtl"`, CSS logical properties, phone numbers and codes in `dir="ltr"`).
- **Performance Budget**: Hero LCP < 1.2s, CLS < 0.02, 100% typecheck and lint pass.

---

## 4. Definition of Done

- [ ] All `ar-EG` marketing dictionaries updated with authentic Egyptian compound & gate security terminology.
- [ ] No cross-boundary relative imports (`../../../packages/ui/...` replaced with `@gate-access/ui`).
- [ ] Orphan directory `apps/marketing/app/[locale` removed.
- [ ] Responsive RTL navigation and mobile drawer tested and verified.
- [ ] `pnpm turbo lint typecheck --filter=marketing` passes with 0 errors.

---

## 5. Suggested Phase Breakdown

1. **Phase 1 — Code Hygiene & Package Normalization**: Clean orphan folders, normalize `@gate-access/ui` imports in `nav.tsx`, enforce ADS token consistency.
2. **Phase 2 — Egyptian Arabic (`ar-EG`) Content & Value Proposition Upgrade**: Upgrade `landing.json`, `solutions.json`, `pricing.json`, `contact.json`, and `navigation.json` for high-intent Egyptian B2B conversion.
3. **Phase 3 — UI/UX Polish & Fluid RTL Layout**: Polish Framer Motion hero animations, trust bars, interactive pricing cards, and mobile navigation drawer.
4. **Phase 4 — Core Web Vitals Optimization & Performance Verification**: Optimize hero bundle size, lazy-hydrate heavy visual effects, test LCP/CLS, and verify full build/typecheck.

---

## 6. References

- **Draft Document**: `docs/plan/Draft/marketing_egypt_uiux_polish/DRAFT_marketing_egypt_uiux_polish.md`
- **Application**: `apps/marketing/`
- **Design Tokens**: `@gate-access/ui/tokens`, `.antigravity/skills/ads-foundations/`
- **RTL & A11y Guidelines**: `.antigravity/skills/ads-a11y-rtl/`

---

Copy and paste into your next prompt to generate the phased plan:

```text
/plan marketing_egypt_uiux_polish
```
