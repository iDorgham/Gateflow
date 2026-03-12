# GateFlow Task Backlog

---

## resident_mobile — Resident Mobile App (Phase 2 Flagship)

**IDEA:** `docs/plan/context/IDEA_resident_mobile.md`
**Priority:** High — Phase 2 flagship
**Target:** Q3 2026

### Phase 1 — Schema verify + Resident API layer
- [ ] Verify Unit, VisitorQR, AccessRule, ResidentLimit models in schema.prisma
- [ ] Add `lat`/`lng` optional fields to Unit if missing
- [ ] Add `expoPushToken` field to User model
- [ ] Create `/api/resident/me` — unit info + quota
- [ ] Create `/api/resident/visitors` — GET (list) + POST (create with AccessRule)
- [ ] Create `/api/resident/visitors/[id]` — GET + DELETE
- [ ] Create `/api/resident/open-qr` — POST
- [ ] Create `/api/resident/history` — scan logs scoped to resident's QRs
- [ ] Create `/api/resident/push-token` — register/update Expo push token
- [ ] Create `/api/resident/arrived` — guest arrival event + push dispatch
- [ ] Auth guard: all routes require `role === RESIDENT`

### Phase 2 — QRs tab
- [ ] Wire QRs tab to `/api/resident/visitors` (list)
- [ ] Create visitor QR form (name, phone, access rule selector)
- [ ] Delete visitor QR
- [ ] AsyncStorage offline cache for QR display
- [ ] QR code image rendering (react-native-qrcode-svg or similar)

### Phase 3 — Contact picker + share sheet
- [ ] Add `expo-contacts` dependency
- [ ] Add `expo-sharing` dependency
- [ ] Contact picker screen with search
- [ ] Pre-populate visitor form from selected contact
- [ ] Post-create: open OS share sheet with pre-filled message + QR link

### Phase 4 — Push notifications
- [ ] Add `expo-notifications` dependency
- [ ] Request push permission on first login
- [ ] POST push token to `/api/resident/push-token`
- [ ] Backend: on QR scan success, resolve owning resident, send Expo push
- [ ] Deep link from push → History tab filtered to that scan entry
- [ ] Handle push while app is foregrounded (in-app banner)

### Phase 5 — GPS guide + arrival notification
- [ ] Extend `/s/[shortId]` landing page: show "Get directions" button after scan
- [ ] Directions link: `maps://` (iOS) or Google Maps URL with unit coordinates
- [ ] Extend landing page: show "I've arrived" button (visible post-scan)
- [ ] Wire "arrived" button to `/api/resident/arrived`
- [ ] Backend: send push to resident on arrival event
- [ ] Graceful degradation when Unit has no coordinates

### Phase 6 — History, Settings, RTL, tests
- [ ] Wire History tab to `/api/resident/history`
- [ ] Wire Settings tab notification toggles to `/api/resident/push-token` preferences
- [ ] RTL layout pass (all screens correct in Arabic)
- [ ] Jest unit tests for API route handlers
- [ ] TypeScript strict mode: zero errors
- [ ] Lint + typecheck green

---

## marketing_website — Marketing Website Full Platform Pages

**IDEA:** `docs/plan/context/IDEA_marketing_website.md`
**Priority:** High — biggest MVP coverage gap (~20%)
**Target:** Q3 2026

### Phase 1 — Homepage: conversion sections
- [ ] Social proof bar (logo strip, trust numbers)
- [ ] Product screenshot/mockup section (3-panel)
- [ ] "How it works" 3-step section
- [ ] Testimonials section (3–4 cards)
- [ ] Comparison table (GateFlow vs paper vs WhatsApp QR)
- [ ] Stats strip (scan time, offline, HMAC)
- [ ] Hero headline + sub-headline copy pass

### Phase 2 — Solutions pages: vertical content
- [ ] `/solutions/compounds` — unit quotas, resident portal, recurring visitor rules
- [ ] `/solutions/events` — bulk CSV QR, per-event analytics, offline, post-event export
- [ ] `/solutions/clubs` — membership QR, recurring access, scan history per member
- [ ] `/solutions/schools` — parent pre-approval, guard-only scanner, audit logs
- [ ] Each page: vertical hero, pain points, 3 key features, case study quote, CTA

### Phase 3 — Blog: MDX + 4 launch posts
- [ ] Install `@next/mdx` and configure in `next.config.js`
- [ ] Create `content/blog/` directory with MDX files
- [ ] Update blog rendering to read from MDX frontmatter
- [ ] Blog index: card grid, tags, reading time
- [ ] Individual post page: author, date, related posts
- [ ] Write 4 launch posts (WhatsApp QR risks, gate wait time, zero-trust explainer, MENA guide)

### Phase 4 — Contact form backend
- [ ] Add `RESEND_API_KEY` to `apps/marketing/.env.local` + `.env.example`
- [ ] Create `app/api/contact/route.ts` in marketing app
- [ ] Fields: name, email, company, phone (optional), message, plan interest
- [ ] In-memory rate limiter (no Redis needed)
- [ ] Honeypot field for spam prevention
- [ ] Auto-reply email to submitter + notification to team inbox
- [ ] Success/error UI state

### Phase 5 — SEO + content polish
- [ ] `opengraph-image.tsx` for homepage, features, pricing, solutions
- [ ] JSON-LD: Organization, WebSite, FAQPage schemas
- [ ] Canonical URLs + hreflang EN/AR-EG
- [ ] AR-EG translation review for all new sections
- [ ] `company/page.tsx` — mission, team cards, values
- [ ] `resources/page.tsx` — PDF guide link, blog links, integrations placeholder
- [ ] `help/page.tsx` — FAQ accordion (10 questions)
- [ ] Lighthouse audit: Performance >= 90, SEO >= 95

---

## realtime_updates — Real-Time Live Updates (SSE + TanStack Query)

**IDEA:** `docs/plan/context/IDEA_realtime_updates.md`
**Priority:** High — cross-cutting UX improvement
**Target:** Q3 2026

### Phase 1 — EventLog schema + emitEvent utility
- [ ] Add `EventLog` model + `EventType` enum to `packages/db/prisma/schema.prisma`
- [ ] Run `prisma db push` + `prisma generate`
- [ ] Create `apps/client-dashboard/src/lib/realtime/emit-event.ts` utility
- [ ] Add `emitEvent` to QR create route (`/api/qrcodes` POST)
- [ ] Add `emitEvent` to QR delete route (`/api/qrcodes/[id]` DELETE)
- [ ] Add `emitEvent` to scan validate route (`/api/qrcodes/validate` POST)
- [ ] Add `emitEvent` to resident visitor create/delete (`/api/resident/visitors`)
- [ ] Add `emitEvent` to contact create/update routes
- [ ] EventLog pruning: delete rows older than 24h on each SSE request

### Phase 2 — SSE endpoint
- [ ] Create `apps/client-dashboard/src/app/api/events/stream/route.ts`
- [ ] Cookie-based auth via `requireAuth` (EventSource sends cookies automatically)
- [ ] DB-polling loop every 3s for new EventLog rows since `lastEventAt`
- [ ] SSE keepalive comment every 15s
- [ ] Max connection lifetime 5 minutes (client reconnects)
- [ ] Org-scoped: only events for `auth.orgId`

### Phase 3 — Client hook + shell integration
- [ ] Create `apps/client-dashboard/src/lib/realtime/use-realtime-events.ts`
- [ ] EventSource open + reconnect with exponential backoff
- [ ] Map event types to `queryClient.invalidateQueries()` calls
- [ ] Mount `useRealtimeEvents()` once in `components/dashboard/shell.tsx`
- [ ] Add `refetchInterval: 30_000` fallback to `useQRCodes`
- [ ] Reduce analytics `refetchInterval` from 45s to 20s

### Phase 4 — Optimistic updates
- [ ] QR create: add to `['qrcodes']` cache immediately on submit
- [ ] QR delete: remove from `['qrcodes']` cache immediately
- [ ] Scan deny: update row status in cache immediately
- [ ] Rollback + toast on API error for all three
