# IDEA: Marketing Website — Full Platform Pages

**Slug:** `marketing_website`
**Status:** Ready to plan
**Created:** 2026-03-12
**PRD Reference:** PRD v6.0 §3.4 (Marketing Website), §11 (Marketing Intelligence Suite)

---

## Problem

The marketing site (`apps/marketing`, port 3000) has all routes wired and a solid structural foundation — i18n (EN + AR-EG), dark/light theme, sitemap, robots.txt, shared UI components. But the actual content is thin, several pages lack conversion-focused sections, and the contact form has no working backend.

PRD status: landing ~30%, features ~60% (structurally complete), pricing ~70% (structurally complete), contact ~20% (no backend), blog 0% (data file exists, content placeholder), solutions ~30% (layout exists, vertical content thin).

The site is not yet ready to send prospects to. The gap is content depth, missing conversion sections (screenshots, testimonials, social proof, product demo), and a non-functional contact form.

---

## Vision

A world-class B2B SaaS marketing site that:
- Makes a compelling case for GateFlow in the first scroll — targeting property managers, event organizers, and security heads in the MENA region
- Converts visitors to demo requests via a working contact form
- Showcases the platform's 5 apps with real screenshots and use-case framing
- Establishes credibility through testimonials, social proof, and vertical-specific solution pages
- Is fully bilingual (EN + AR-EG RTL) and SEO-optimised

---

## Existing Assets

| Asset | Location | Status |
|---|---|---|
| All page routes | `app/[locale]/*/page.tsx` | Defined — content thin |
| Features page | `[locale]/features/page.tsx` | ~60% — structure + 6 cards + code snippet |
| Pricing page | `[locale]/pricing/page.tsx` | ~70% — 3 tiers + comparison mini |
| Contact page | `[locale]/contact/page.tsx` | UI exists, no form backend |
| Solutions pages | `[locale]/solutions/*/page.tsx` | Layout exists, vertical content thin |
| Blog | `[locale]/blog/page.tsx` + `lib/blog-data.ts` | Static data, placeholder content |
| Homepage | `[locale]/page.tsx` | Hero + TrustBar + 4 features + Security + UseCases + CTA |
| i18n | `locales/en/` + `locales/ar-EG/` | EN complete, AR-EG needs content review |
| Components | `components/` + `components/sections/` | Nav, Footer, Hero, PricingCard, TestimonialCard, FeatureCard, etc. |
| SEO infra | `sitemap.ts`, `robots.ts`, `json-ld.tsx` | In place |

---

## Scope

### In scope

**Phase 1 — Homepage: conversion-focused sections**
- Social proof bar: logo strip ("trusted by X compounds / Y events / Z monthly gates")
- Product screenshot/mockup section: 3-panel carousel or stacked screenshots (dashboard, scanner, resident portal)
- "How it works" 3-step section: Create QR → Guest scans → Admin sees log
- Testimonials section: 3–4 real-feeling testimonials (property manager, event organizer, security head personas)
- Comparison table: GateFlow vs. paper logbook vs. WhatsApp QR (3-column)
- Stats strip: e.g. "500ms scan time", "100% offline capable", "HMAC-signed every QR"
- Homepage CTA copy pass — tighten hero headline and sub-headline

**Phase 2 — Solutions pages: vertical-specific content**
- `/solutions/compounds` — unit quotas, resident portal, 24/7 gate control, recurring visitor rules
- `/solutions/events` — bulk CSV QR, per-event analytics, offline scanning, post-event export
- `/solutions/clubs` — membership QR, recurring access, scan history per member
- `/solutions/schools` — parent pre-approval, guard-only scanner, audit logs
- Each page: vertical hero, pain points, 3 key features, mini case study quote, CTA

**Phase 3 — Blog: real content (static MDX)**
- Migrate blog from `blog-data.ts` to MDX files under `content/blog/` (no CMS, no DB)
- Use `next-mdx-remote` or `@next/mdx` for rendering
- Write 4 launch blog posts:
  1. "Why WhatsApp QR codes are a security risk for gated communities"
  2. "How GateFlow cuts gate wait time by 60%"
  3. "Zero-trust access for real estate compounds — a technical overview"
  4. "MENA property managers: your guide to digital gate infrastructure"
- Blog index with card grid, tags, reading time
- Individual post page with author, date, related posts

**Phase 4 — Contact form backend**
- Wire contact form to Resend (email API, free tier sufficient)
- Add `RESEND_API_KEY` env var to `apps/marketing/.env.local`
- POST `/api/contact` route in marketing app
- Fields: name, email, company, phone (optional), message, plan interest (dropdown)
- Rate limiting via simple in-memory limiter (no Redis needed for marketing app)
- Success/error state in UI, honeypot field for spam
- Auto-reply email to submitter + notification email to team inbox

**Phase 5 — Content polish + SEO pass**
- Per-page OG image metadata (`opengraph-image.tsx` per major route)
- JSON-LD structured data: Organization, WebSite, FAQPage (for pricing/features)
- Canonical URLs, hreflang for EN/AR-EG
- Missing AR-EG translation strings filled in
- `company/page.tsx` — mission, founding story, team section (3 cards), values
- `resources/page.tsx` — downloadable PDF guide, links to blog, integration docs placeholder
- `help/page.tsx` — FAQ accordion (10 questions from PRD personas)

### Out of scope
- Documentation site (P2, separate initiative)
- Marketing Intelligence Suite pixel/UTM injection (P2, requires client-dashboard changes)
- Live chat integration (placeholder `chat-widget.tsx` exists — keep as is)
- Video production / hosted demo video
- CMS integration (Contentful, Sanity, etc.)
- A/B testing infrastructure

---

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Blog | Static MDX files | No DB, no CMS dependency, fast builds |
| Contact backend | Resend API | Free tier, simple HTTPS, works in Next.js API route |
| Screenshots | Static images in `public/screenshots/` | No external image host needed |
| OG images | `next/og` (ImageResponse) | Built-in, no external service |
| Rate limiting | Simple in-memory counter | Marketing app has no Redis; low traffic |

---

## Success Criteria

| Metric | Target |
|---|---|
| Homepage scroll depth | All conversion sections visible before fold 3 |
| Contact form submission | Email delivered within 30 seconds |
| Blog renders | 4 posts with correct metadata, RTL, reading time |
| Solutions pages | 4 pages with vertical-specific content, no placeholder text |
| AR-EG RTL | All new sections correct in Arabic |
| Lighthouse (desktop) | Performance >= 90, SEO >= 95 |
| TypeScript strict | Zero errors |
| Lint + build | Green |

---

## Risks & Open Questions

| Risk | Mitigation |
|---|---|
| Screenshots don't exist yet | Use high-quality mockup frames with placeholder UI until real screenshots are taken |
| AR-EG translation completeness | Phase 1–4 can ship EN-only sections initially; AR-EG pass is Phase 5 |
| Resend account not set up | Document in `.env.example`; form shows "coming soon" if key missing |
| MDX dependency adds build complexity | Use `@next/mdx` (official, minimal config) |

---

## Proposed Phase Breakdown (for /plan)

| Phase | Deliverable |
|---|---|
| 1 | Homepage: social proof, screenshots, "how it works", testimonials, comparison table, stats |
| 2 | Solutions pages: 4 verticals with real content (compounds, events, clubs, schools) |
| 3 | Blog: MDX infra + 4 launch posts + index + post page |
| 4 | Contact form backend: Resend API route + rate limiting + auto-reply |
| 5 | SEO + content polish: OG images, JSON-LD, company/resources/help pages, AR-EG pass |
