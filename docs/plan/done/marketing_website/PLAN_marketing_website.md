# PLAN: Marketing Website — Full Platform Pages

**Slug:** `marketing_website`
**App:** `apps/marketing`
**Status:** Ready
**Source:** `docs/plan/context/IDEA_marketing_website.md` · PRD v6.0 §3.4
**Port:** 3000

---

## Context snapshot

### Existing state

| Page / Area | Status |
|---|---|
| Homepage (`[locale]/page.tsx`) | ~30% — Hero + TrustBar + 4 feature cards + Security grid + UseCases + CTA. Missing: social proof, screenshots, testimonials, comparison, stats |
| Features page | ~60% — 6 feature cards + tech deep-dive code snippet + CTA. Structurally solid |
| Pricing page | ~70% — 3 tiers (Starter/Pro/Enterprise) + comparison mini grid. Structurally solid |
| Contact page | ~20% — form UI exists, no backend |
| Solutions pages (4) | ~30% — layout shell exists (`solution-layout.tsx`), vertical content thin |
| Blog (`[locale]/blog/`) | ~10% — routes defined, `blog-data.ts` static, no MDX, content placeholder |
| Company page | ~10% — stub |
| Resources page | ~10% — stub |
| Help page | ~10% — stub |
| i18n | EN complete; AR-EG needs content review for new sections |
| SEO infra | `sitemap.ts`, `robots.ts`, `json-ld.tsx` in place |
| Components | Nav, Footer, Hero, PricingCard, TestimonialCard, FeatureCard, sections/* all exist |

### Key architecture constraints

- Next.js 14 App Router with `[locale]` dynamic segment — all pages under `app/[locale]/`
- i18n via `getTranslation(locale, namespace)` — translation strings in `locales/en/*.json` and `locales/ar-EG/*.json`
- Shared UI from `@gate-access/ui` — use existing components, no local copies
- No database, no Prisma — marketing app is fully static/serverless except for contact API route
- pnpm only
- TypeScript strict; `tailwind.config.ts` uses semantic tokens from `packages/ui`
- RTL: Arabic layout via `dir="rtl"` on `<html>` — all new sections must be RTL-safe
- Turbo: `pnpm turbo build --filter=marketing` must pass before each phase merge

---

## Phases

| # | Title | Role | Files changed (est.) | Depends on |
|---|---|---|---|---|
| 1 | Homepage: conversion sections | FRONTEND | 6–10 | — |
| 2 | Solutions pages: vertical content | FRONTEND + i18n | 8–12 | — |
| 3 | Blog: MDX infra + 4 launch posts | FRONTEND + BACKEND | 8–12 | — |
| 4 | Contact form backend (Resend) | BACKEND | 4–6 | — |
| 5 | SEO + content polish (OG, JSON-LD, company, help) | FRONTEND + i18n | 8–14 | 1–4 |

---

## Phase detail

### Phase 1 — Homepage: conversion sections
**Goal:** Transform the homepage into a world-class B2B SaaS landing page with social proof, product screenshots, how-it-works, testimonials, comparison table, and stats strip.

**New sections to add (in order after existing hero):**
1. **Stats strip** — "< 500ms scan", "100% offline-capable", "HMAC-signed QRs", "Arabic-first"
2. **Social proof bar** — logo placeholders + "trusted by X compounds" copy
3. **How it works** — 3-step horizontal flow: Create QR → Guest scans → Admin sees log
4. **Screenshot / product mockup** — 3-panel stacked (dashboard, scanner, resident portal)
5. **Testimonials** — 3 cards (property manager, event organizer, security head personas)
6. **Comparison table** — GateFlow vs. paper logbook vs. WhatsApp QR (3 columns, 6 rows)
7. Update existing hero copy — tighten headline and sub-headline for MENA B2B

**Acceptance criteria:**
- All 7 sections render in EN and AR-EG without layout breaks
- RTL: comparison table and how-it-works section correct
- `pnpm turbo build --filter=marketing` passes
- `pnpm turbo typecheck --filter=marketing` passes

---

### Phase 2 — Solutions pages: vertical content
**Goal:** Make each solutions sub-page a compelling, vertical-specific pitch with real pain points, feature highlights, and a case-study quote.

**Pages to complete (each follows this structure):**
- Vertical hero (headline + sub + CTA)
- Pain points (3 bullets, icon-list)
- 3 key features (icon + title + description)
- Mini case-study quote block (persona quote + attribution)
- Bottom CTA → contact

**Verticals:**
- `/solutions/compounds` — unit quotas, resident self-service, recurring visitor rules, 24/7 gate
- `/solutions/events` — bulk CSV QR upload, offline scanning, per-event analytics, post-event export
- `/solutions/clubs` — membership QR, recurring access schedules, scan history per member
- `/solutions/schools` — parent pre-approval flow, guard-only scanner role, audit logs, RBAC

**Acceptance criteria:**
- All 4 pages have real content (no placeholder text)
- Translation keys added to `locales/en/solutions.json` and `locales/ar-EG/solutions.json`
- RTL correct on all pages
- `pnpm turbo build --filter=marketing` passes

---

### Phase 3 — Blog: MDX infra + 4 launch posts
**Goal:** Replace static `blog-data.ts` with MDX-based blog using `@next/mdx`, with proper index page, post pages, reading time, and 4 real launch articles.

**Infrastructure:**
- Install `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter`
- Create `content/blog/*.mdx` directory
- Update `next.config.js` to enable MDX
- Create MDX utility: `lib/blog.ts` — reads frontmatter (title, date, slug, author, tags, excerpt, readingTime)
- Blog index: card grid with tag filter, reading time, date
- Blog post page: author avatar placeholder, date, reading time, related posts (by tag)

**4 launch posts:**
1. `whatsapp-qr-security-risk.mdx` — "Why WhatsApp QR codes are a security risk for gated communities"
2. `cut-gate-wait-time.mdx` — "How GateFlow cuts gate wait time by 60%"
3. `zero-trust-real-estate.mdx` — "Zero-trust access for real estate compounds — a technical overview"
4. `mena-property-managers-guide.mdx` — "MENA property managers: your guide to digital gate infrastructure"

**Acceptance criteria:**
- Blog index renders 4 cards with correct metadata
- Individual post pages render with MDX content
- Reading time calculated correctly
- `pnpm turbo build --filter=marketing` passes (static export of blog)
- TypeScript strict: zero errors

---

### Phase 4 — Contact form backend (Resend)
**Goal:** Wire the existing contact form UI to a working email backend using Resend, with rate limiting, honeypot spam protection, and auto-reply.

**Deliverables:**
- `app/api/contact/route.ts` — POST handler
- Resend SDK: `pnpm add resend --filter=marketing`
- Fields: name, email, company, phone (optional), message, planInterest (dropdown: Starter / Pro / Enterprise / Not sure)
- Honeypot field (`website` hidden input — reject if filled)
- In-memory rate limiter: max 3 submissions per IP per hour
- On success: send notification email to `CONTACT_NOTIFY_EMAIL` + auto-reply to submitter
- Graceful degradation: if `RESEND_API_KEY` missing → log + return 503 with "contact@gateflow.site" fallback message
- Add `RESEND_API_KEY` and `CONTACT_NOTIFY_EMAIL` to `apps/marketing/.env.example`
- Update contact form component to POST to `/api/contact`, show success/error states

**Acceptance criteria:**
- Form submits and emails arrive (testable with Resend sandbox)
- Honeypot rejects bots silently (200 response, no email)
- Rate limiter blocks 4th submission in window
- Missing API key returns 503 with fallback message
- `pnpm turbo typecheck --filter=marketing` passes

---

### Phase 5 — SEO + content polish
**Goal:** Add OG images, JSON-LD structured data, hreflang, complete company/resources/help pages, and do a full AR-EG translation pass on all new Phase 1–4 content.

**Deliverables:**
- `opengraph-image.tsx` for: homepage, `/features`, `/pricing`, `/solutions`, `/blog`
- JSON-LD schemas: `Organization` (homepage), `WebSite` (homepage), `FAQPage` (pricing + help)
- `<link rel="alternate" hreflang="...">` in `[locale]/layout.tsx`
- `company/page.tsx` — mission statement, 3-value cards, founding story paragraph, team placeholder (3 cards)
- `resources/page.tsx` — PDF guide download (placeholder), blog section (latest 3 posts), integrations placeholder grid
- `help/page.tsx` — FAQ accordion with 10 questions (drawn from PRD personas: property managers, event organizers, security heads, residents)
- AR-EG translation review: all new locale keys from Phases 1–4 filled in `locales/ar-EG/`
- Lighthouse audit run; address any score < 90 Performance or < 95 SEO

**Acceptance criteria:**
- OG image renders for each major route
- JSON-LD validates at schema.org validator
- Company, Resources, Help pages have real content (no placeholder text)
- AR-EG strings complete — no missing translation keys in console
- `pnpm turbo build --filter=marketing` passes
- Lighthouse desktop: Performance >= 90, SEO >= 95

---

## TASKS tracking file
`docs/plan/execution/TASKS_marketing_website.md`
