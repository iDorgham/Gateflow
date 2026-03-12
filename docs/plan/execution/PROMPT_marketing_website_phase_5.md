# Phase 5: SEO + Content Polish (OG Images, JSON-LD, Company, Help, AR-EG)

## Primary role
FRONTEND + i18n

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/marketing`
- **Refs**:
  - `apps/marketing/components/json-ld.tsx` — existing JSON-LD component
  - `apps/marketing/app/[locale]/layout.tsx` — root layout (add hreflang here)
  - `apps/marketing/app/[locale]/company/page.tsx` — current stub
  - `apps/marketing/app/[locale]/resources/page.tsx` — current stub
  - `apps/marketing/app/[locale]/help/page.tsx` — current stub
  - `apps/marketing/lib/blog.ts` — blog utility (Phase 3 output)
  - `apps/marketing/locales/` — all namespaces
  - Next.js `ImageResponse` docs — for `opengraph-image.tsx`

## Goal
Complete the marketing site: add OG images and JSON-LD to key routes, add hreflang for EN/AR-EG, write real content for company/resources/help pages, and do a full AR-EG translation pass on all new content from Phases 1–4.

## Scope (in)

**OG images** using Next.js `ImageResponse` (`next/og`):

Create `opengraph-image.tsx` files at:
- `app/[locale]/opengraph-image.tsx` — homepage OG
- `app/[locale]/features/opengraph-image.tsx`
- `app/[locale]/pricing/opengraph-image.tsx`
- `app/[locale]/solutions/opengraph-image.tsx`
- `app/[locale]/blog/opengraph-image.tsx`

Each OG image: 1200×630px, dark background, GateFlow logo text, page title, tagline. Use `ImageResponse` with inline styles (no Tailwind in OG images).

**JSON-LD schemas** — update `components/json-ld.tsx` or add inline to pages:
- Homepage: `Organization` schema (name, url, logo, contactPoint, sameAs) + `WebSite` schema (with `SearchAction`)
- Pricing page: `FAQPage` schema with 5 pricing FAQs
- Help page: `FAQPage` schema with 10 help FAQs

**hreflang** — add to `app/[locale]/layout.tsx`:
```html
<link rel="alternate" hreflang="en" href="https://gateflow.io/en{pathname}" />
<link rel="alternate" hreflang="ar" href="https://gateflow.io/ar-EG{pathname}" />
<link rel="alternate" hreflang="x-default" href="https://gateflow.io/en{pathname}" />
```

**`company/page.tsx`** — full content:
- Mission section: 2-paragraph mission statement + vision
- 3 value cards: "Security first" | "Built for MENA" | "Resident-centered"
- Founding story: 1 paragraph
- Team placeholder: 3 avatar cards (Founder, CTO, Head of Product) with title + placeholder photo
- Translation keys: `locales/en/company.json` (new namespace)

**`resources/page.tsx`** — full content:
- "GateFlow Platform Overview" PDF download link (placeholder — links to `/downloads/gateflow-overview.pdf` with a note PDF TBD)
- "Latest from the blog" section: last 3 posts from `getAllPosts()` (Phase 3 output)
- Integrations placeholder grid: Webhook API | CSV Export | Resend Email | HubSpot (coming soon) | Salesforce (coming soon)
- Translation keys: `locales/en/resources.json` (new namespace)

**`help/page.tsx`** — FAQ accordion:
- 10 questions drawn from PRD personas:
  1. How do I create a visitor QR code?
  2. What happens if the scanner has no internet?
  3. Can residents manage their own visitors?
  4. How are QR codes secured against tampering?
  5. What roles are available in GateFlow?
  6. How do I export scan history?
  7. Can I set time-limited access for recurring visitors?
  8. Is GateFlow available in Arabic?
  9. How do webhooks work?
  10. What's the difference between Starter, Pro, and Enterprise?
- Accordion component: open/close per question
- Translation keys: `locales/en/help.json` (new namespace)
- JSON-LD `FAQPage` schema on this page

**AR-EG translation pass** — fill in all missing keys from Phases 1–4:
- `locales/ar-EG/landing.json` — all Phase 1 keys
- `locales/ar-EG/solutions.json` — all 4 verticals
- `locales/ar-EG/blog.json` — blog UI strings (not post content)
- `locales/ar-EG/contact.json` — all Phase 4 keys
- `locales/ar-EG/company.json`, `resources.json`, `help.json` (new)

**Lighthouse audit** — run after build:
```bash
npx lighthouse http://localhost:3000/en --output=json --output-path=./lighthouse-report.json
```
Target: Performance >= 90, SEO >= 95. Fix any issues found.

## Steps (ordered)
1. Create OG image files for 5 routes.
2. Update `components/json-ld.tsx` + add FAQ JSON-LD to pricing and help pages.
3. Add hreflang tags to `app/[locale]/layout.tsx`.
4. Write `company/page.tsx` full content + `locales/en/company.json`.
5. Write `resources/page.tsx` full content + `locales/en/resources.json`.
6. Write `help/page.tsx` FAQ accordion + `locales/en/help.json`.
7. AR-EG translation pass: fill all missing keys across all namespaces.
8. Run `pnpm turbo build --filter=marketing`.
9. Start local server + run Lighthouse; fix Performance/SEO issues.
10. Create `docs/plan/execution/TASKS_marketing_website.md` — all 5 phases marked complete.
11. Commit: `feat(marketing): SEO polish — OG images, JSON-LD, hreflang, company/resources/help pages, AR-EG pass (phase 5)`.

## Scope (out)
- Marketing Intelligence Suite (separate initiative)
- Video production
- CMS integration

## Acceptance criteria
- [ ] OG images render for homepage, features, pricing, solutions, blog
- [ ] JSON-LD validates at schema.org validator (Organization, WebSite, FAQPage)
- [ ] hreflang tags present in `<head>` for EN and AR-EG
- [ ] Company page: mission, 3 values, story, team cards — no placeholder text
- [ ] Resources page: PDF link, latest 3 blog posts, integrations grid
- [ ] Help page: 10 FAQ accordion items, all answerable
- [ ] AR-EG: no missing-translation console warnings in any locale
- [ ] Lighthouse desktop: Performance >= 90, SEO >= 95
- [ ] `pnpm turbo build --filter=marketing` passes
- [ ] `pnpm turbo typecheck --filter=marketing` passes

## Files likely touched
- `apps/marketing/app/[locale]/opengraph-image.tsx` (new)
- `apps/marketing/app/[locale]/features/opengraph-image.tsx` (new)
- `apps/marketing/app/[locale]/pricing/opengraph-image.tsx` (new)
- `apps/marketing/app/[locale]/solutions/opengraph-image.tsx` (new)
- `apps/marketing/app/[locale]/blog/opengraph-image.tsx` (new)
- `apps/marketing/components/json-ld.tsx` (updated)
- `apps/marketing/app/[locale]/layout.tsx` (hreflang added)
- `apps/marketing/app/[locale]/company/page.tsx` (rewrite)
- `apps/marketing/app/[locale]/resources/page.tsx` (rewrite)
- `apps/marketing/app/[locale]/help/page.tsx` (rewrite)
- `apps/marketing/locales/en/company.json` (new)
- `apps/marketing/locales/en/resources.json` (new)
- `apps/marketing/locales/en/help.json` (new)
- `apps/marketing/locales/ar-EG/*.json` (all updated)
- `docs/plan/execution/TASKS_marketing_website.md` (new)

## Git commit
```
feat(marketing): SEO polish — OG images, JSON-LD, hreflang, company/resources/help pages, AR-EG pass (phase 5)
```
