# Phase 1: Homepage — Conversion Sections

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/marketing`
- **Refs**:
  - `apps/marketing/app/[locale]/page.tsx` — current homepage
  - `apps/marketing/components/sections/` — existing section components (hero, trust-bar, bottom-cta, etc.)
  - `apps/marketing/components/testimonial-card.tsx` — existing TestimonialCard
  - `apps/marketing/locales/en/landing.json` — landing page translations
  - `apps/marketing/locales/ar-EG/landing.json` — Arabic translations
  - `@gate-access/ui` — shared components (Button, Card, Badge)
  - PRD v6.0 §3.4 — marketing website requirements

## Goal
Transform the homepage into a world-class B2B SaaS landing page by adding 7 new conversion-focused sections: stats strip, social proof bar, how-it-works, screenshot mockups, testimonials, comparison table, and a copy pass on the hero.

## Scope (in)

**7 new sections** (insert into `page.tsx` in order after existing hero):

**1. `components/sections/stats-strip.tsx`**
- 4 stat items in a horizontal row: `< 500ms scan time` | `100% offline-capable` | `HMAC-signed every QR` | `Arabic & English`
- Dark background strip (`bg-slate-900 text-white`), full-width
- Translation key: `landing.stats.*`

**2. `components/sections/social-proof.tsx`**
- "Trusted by X compounds, Y events, Z monthly gates" sub-headline
- Row of 4 grey logo placeholder boxes (image placeholders — real logos added later)
- Translation key: `landing.socialProof.*`

**3. `components/sections/how-it-works.tsx`**
- 3-step horizontal flow with connector lines: Create QR → Guest scans → Admin sees log
- Each step: number circle + icon + title + one-line description
- Responsive: vertical stack on mobile, horizontal on md+
- Translation key: `landing.howItWorks.*`

**4. `components/sections/product-screenshots.tsx`**
- 3-panel layout: Dashboard | Scanner App | Resident Portal
- Each panel: device frame (`rounded-[2rem] shadow-2xl border`) + placeholder image (`bg-muted aspect-video`)
- Caption below each frame
- Note in code: `// TODO: replace with real screenshots at public/screenshots/`
- Translation key: `landing.screenshots.*`

**5. `components/sections/testimonials.tsx`**
- 3 `TestimonialCard` components in a 3-column grid
- Personas: "Property Manager — Palm Hills Compound", "Event Director — Cairo Tech Summit", "Security Head — Marassi Resort"
- Quote, name, title, company for each
- Translation key: `landing.testimonials.*`

**6. `components/sections/comparison-table.tsx`**
- 3-column table: GateFlow | Paper logbook | WhatsApp QR
- 6 rows: Cryptographic signing | Offline capable | Audit trail | Guest quota | Real-time analytics | RTL Arabic support
- GateFlow column: green checkmarks; others: red X or yellow partial
- Translation key: `landing.comparison.*`

**7. Hero copy pass**
- Update `landing.hero.headline` and `landing.hero.subHeadline` in both `locales/en/landing.json` and `locales/ar-EG/landing.json`
- Tighten to MENA B2B tone: "Zero-trust gate access for MENA compounds and events"

**Update `app/[locale]/page.tsx`** to include all 7 new sections in the correct order:
`Hero → StatsStrip → SocialProof → HowItWorks → ProductScreenshots → (existing features) → Testimonials → ComparisonTable → (existing security grid) → BottomCTA`

## Steps (ordered)
1. Add all new translation keys to `locales/en/landing.json` and `locales/ar-EG/landing.json`.
2. Create `components/sections/stats-strip.tsx`.
3. Create `components/sections/social-proof.tsx`.
4. Create `components/sections/how-it-works.tsx`.
5. Create `components/sections/product-screenshots.tsx`.
6. Create `components/sections/testimonials.tsx`.
7. Create `components/sections/comparison-table.tsx`.
8. Update `app/[locale]/page.tsx` — import and place all new sections.
9. Update `components/index.ts` barrel to export new section components.
10. RTL check: test each section with `lang="ar"` in browser; fix any `ml-/mr-` or `text-left` issues.
11. Run `pnpm turbo build --filter=marketing`.
12. Run `pnpm turbo typecheck --filter=marketing` (add `"typecheck": "tsc --noEmit"` to marketing's `package.json` scripts if missing).
13. Commit: `feat(marketing): homepage conversion sections — stats, social proof, how-it-works, screenshots, testimonials, comparison (phase 1)`.

## Scope (out)
- Solutions pages (Phase 2)
- Blog (Phase 3)
- Contact form backend (Phase 4)
- OG images (Phase 5)

## Acceptance criteria
- [ ] All 7 new sections render on homepage in correct order
- [ ] No placeholder text visible (all copy in translation files)
- [ ] RTL: all sections layout correctly in Arabic
- [ ] Responsive: no overflow or layout breaks on mobile (375px) or desktop (1440px)
- [ ] `pnpm turbo build --filter=marketing` passes
- [ ] `pnpm turbo typecheck --filter=marketing` passes

## Files likely touched
- `apps/marketing/app/[locale]/page.tsx`
- `apps/marketing/components/sections/stats-strip.tsx` (new)
- `apps/marketing/components/sections/social-proof.tsx` (new)
- `apps/marketing/components/sections/how-it-works.tsx` (new)
- `apps/marketing/components/sections/product-screenshots.tsx` (new)
- `apps/marketing/components/sections/testimonials.tsx` (new)
- `apps/marketing/components/sections/comparison-table.tsx` (new)
- `apps/marketing/components/index.ts`
- `apps/marketing/locales/en/landing.json`
- `apps/marketing/locales/ar-EG/landing.json`

## Git commit
```
feat(marketing): homepage conversion sections — stats, social proof, how-it-works, screenshots, testimonials, comparison (phase 1)
```
