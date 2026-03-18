# Phase 2: Solutions Pages — Vertical Content

## Primary role
FRONTEND + i18n

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/marketing`
- **Refs**:
  - `apps/marketing/app/[locale]/solutions/compounds/page.tsx` — current stub
  - `apps/marketing/app/[locale]/solutions/events/page.tsx` — current stub
  - `apps/marketing/app/[locale]/solutions/clubs/page.tsx` — current stub
  - `apps/marketing/app/[locale]/solutions/schools/page.tsx` — current stub
  - `apps/marketing/components/sections/solution-layout.tsx` — shared solution layout
  - `apps/marketing/locales/en/solutions.json` — solutions translations
  - `apps/marketing/locales/ar-EG/solutions.json` — Arabic translations
  - PRD v6.0 §2 (persona table) — vertical pain points per market segment

## Goal
Replace the thin placeholder content on all 4 solutions pages with compelling, vertical-specific pitches that speak directly to each persona's pain points and highlight the GateFlow features that matter most to them.

## Scope (in)

**Each solutions page follows this structure:**
1. **Vertical hero** — large headline (bold value prop for that vertical) + sub-headline + 2 CTAs (Get demo / See pricing)
2. **Pain points** — 3 bullets with icons: "Before GateFlow" pain framing
3. **3 key features** — icon + title + 2-line description (features most relevant to the vertical)
4. **Mini case-study quote** — blockquote with persona quote + attribution (role + venue type)
5. **Bottom CTA** — "Ready to upgrade your gate?" → /contact

**Page content per vertical:**

`/solutions/compounds`
- Hero: "Give every resident control. Keep every gate secure."
- Pain points: Manual logbook chaos | WhatsApp QR links shared without control | No audit trail for management
- Features: Resident self-service visitor QRs | Unit-based access quotas | Full audit log + analytics
- Quote: "We eliminated our paper logbook and now have a real-time view of every entry." — Property Manager, Palm Hills

`/solutions/events`
- Hero: "From ticket list to gate control — in minutes."
- Pain points: Long entry queues from manual checks | No offline backup if internet drops | Zero post-event data
- Features: Bulk CSV QR generation | 100% offline scanning | Post-event analytics export
- Quote: "We scanned 2,000 guests in 90 minutes with zero queue." — Event Director, Cairo Tech Summit

`/solutions/clubs`
- Hero: "Membership access that runs itself."
- Pain points: Lost/shared membership cards | No way to restrict days/times | Can't see who came when
- Features: Recurring access schedules (days + time windows) | HMAC-signed membership QR | Per-member scan history
- Quote: "Members love the QR pass on their phone. We love the audit trail." — Operations Manager, Club 24

`/solutions/schools`
- Hero: "Every parent pre-approved. Every entry recorded."
- Pain points: Unknown visitors showing up at the gate | Guards overwhelmed with verification | No record of who entered
- Features: Parent pre-approval flow (visitor QR per pickup) | Guard-only scanner role (no admin access) | Immutable audit log
- Quote: "The gate team finally has a process that doesn't depend on memory." — Head of Security, Cairo International School

**Translation**: add all content strings to `locales/en/solutions.json` (and stub keys in `locales/ar-EG/solutions.json` — full AR-EG copy in Phase 5).

**Update `solution-layout.tsx`** if it lacks support for pain-points or quote block sections; otherwise use it as-is.

## Steps (ordered)
1. Audit `components/sections/solution-layout.tsx` — identify what it supports; extend or create variant as needed.
2. Add all EN content strings to `locales/en/solutions.json` under `compounds.*`, `events.*`, `clubs.*`, `schools.*`.
3. Add stub keys (same structure, empty strings or placeholder) to `locales/ar-EG/solutions.json`.
4. Rewrite `solutions/compounds/page.tsx` with full content structure.
5. Rewrite `solutions/events/page.tsx`.
6. Rewrite `solutions/clubs/page.tsx`.
7. Rewrite `solutions/schools/page.tsx`.
8. Verify `/solutions/page.tsx` (overview) links to all 4 verticals correctly.
9. RTL pass: test each page in `lang="ar"` — fix quote alignment, icon positions, text alignment.
10. Run `pnpm turbo build --filter=marketing`.
11. Run `pnpm turbo typecheck --filter=marketing`.
12. Commit: `feat(marketing): solutions pages — vertical content for compounds, events, clubs, schools (phase 2)`.

## Scope (out)
- Blog (Phase 3)
- Contact form backend (Phase 4)
- OG images per solutions page (Phase 5)

## Acceptance criteria
- [ ] All 4 solutions pages have real content — no placeholder text
- [ ] Each page has: vertical hero, 3 pain points, 3 features, case-study quote, bottom CTA
- [ ] EN translation keys complete; AR-EG stubs in place (no runtime missing-key errors)
- [ ] RTL: all 4 pages layout correctly in Arabic
- [ ] `/solutions` overview page links to all 4 sub-pages
- [ ] `pnpm turbo build --filter=marketing` passes
- [ ] `pnpm turbo typecheck --filter=marketing` passes

## Files likely touched
- `apps/marketing/app/[locale]/solutions/compounds/page.tsx`
- `apps/marketing/app/[locale]/solutions/events/page.tsx`
- `apps/marketing/app/[locale]/solutions/clubs/page.tsx`
- `apps/marketing/app/[locale]/solutions/schools/page.tsx`
- `apps/marketing/components/sections/solution-layout.tsx` (possibly extended)
- `apps/marketing/locales/en/solutions.json`
- `apps/marketing/locales/ar-EG/solutions.json`

## Git commit
```
feat(marketing): solutions pages — vertical content for compounds, events, clubs, schools (phase 2)
```
