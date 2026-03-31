# IDEA: Resident Portal — Responsive & Mobile App Experience

**Initiative:** `resident_portal_responsive`
**Status:** 🆕 New — Ready to refine
**Target:** Q2 2026
**Champion:** TBD

---

## 1. Problem Statement

The Resident Portal (`apps/resident-portal`) is currently a **mobile-only web experience** hard-coded to `max-w-md` (448px). On desktop screens, residents see a narrow phone-width column floating in vast empty whitespace. The portal has:

- **No desktop layout** — no sidebar, no multi-column grids, no adaptive content
- **No PWA support** — not installable, no offline capability, no push notifications
- **Duplicated bottom navigation** — copied inline in every page with inconsistent icons and missing items
- **No shared navigation component** — each page builds its own header and bottom nav
- **No quick-create FAB** — creating a visitor QR requires navigating through multiple pages
- **Broken desktop UX** — residents accessing from laptops/tablets get a phone-sized UI with no adaptation

The resident mobile app (`apps/resident-mobile`) has a proper 5-tab native layout but is a separate Expo codebase. The portal should bridge the gap: feel like a native app on phones AND adapt gracefully to desktop screens — **one unified experience across devices**.

---

## 2. Strategic Goal

Transform the Resident Portal from a mobile-only web page into a **unified, responsive, installable Progressive Web App** that:

- On **mobile (< 992px):** Feels like a native app — bottom tab bar, smooth page transitions, swipe gestures, quick-create FAB
- On **desktop (≥ 992px):** Sidebar navigation + multi-column content layout (hybrid approach matching the client-dashboard's visual language)
- On **all devices:** Installable as PWA, works offline for QR display, supports push notifications

### Success Metrics

| Metric             | Target                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| Desktop layout     | Sidebar + multi-column grid on ≥ 992px                                      |
| Mobile feel        | Bottom tab bar with active states, smooth transitions                       |
| Quick-create       | Visitor QR in ≤ 2 taps from any screen (FAB)                                |
| PWA install        | Passes Chrome Lighthouse PWA audit                                          |
| Offline QR         | Cached QRs display without network                                          |
| Push notifications | Scan + arrival events delivered via Web Push                                |
| Shared navigation  | Zero duplicated nav markup — single `<BottomNav>` and `<Sidebar>` component |
| RTL Arabic         | Perfect RTL layout on all breakpoints                                       |
| Shared components  | 0 inline nav blocks, all from `@gate-access/ui` or `src/components/layout/` |

---

## 3. Current State & Existing Assets

| Asset                  | Location                            | Status                                          |
| ---------------------- | ----------------------------------- | ----------------------------------------------- |
| Portal app             | `apps/resident-portal/`             | Live, mobile-only, max-w-md                     |
| Bottom nav             | Duplicated inline in 3 pages        | Inconsistent icons, missing on 6 pages          |
| Login                  | `src/app/login/page.tsx`            | Redirects to `app.gateflow.site/login`          |
| Auth guard             | `(portal)/layout.tsx`               | JWT cookie + unit check                         |
| Components             | `src/components/`                   | 7 components, most unused                       |
| API proxy              | `next.config.js` rewrites           | Proxies `/api/resident/*` → `localhost:3001`    |
| Tailwind tokens        | `tailwind.config.ts`                | Extends shared tokens but no custom screens     |
| Mobile app (reference) | `apps/resident-mobile/`             | 5-tab Expo layout for pattern reference         |
| Shared UI              | `packages/ui/`                      | Sheet, SideNavigationShell, tokens, breakpoints |
| Custom breakpoints     | `packages/ui/src/tokens.ts:169-174` | xs:600, sm:768, md:992, lg:1200                 |

### Key Gaps

- No `manifest.json`, no service worker, no `next-pwa`
- No `<BottomNav />` shared component
- No `<Sidebar />` for desktop layout
- No `<PortalShell />` wrapping layout with responsive logic
- No FAB / quick-create button
- No `useMediaQuery` or `useBreakpoint` hook
- No page transitions or gesture handling
- Pages have no `loading.tsx`, `error.tsx`, or `not-found.tsx`

---

## 4. Scope

### In Scope

#### Phase 1 — Foundation: Shared Layout & Navigation Components

- Create `<BottomNav />` shared component with dynamic active state (5 tabs: Home, Visitors, History, Maintenance, Profile)
- Create `<Sidebar />` desktop navigation (collapsible, matching client-dashboard visual language)
- Create `<PortalShell />` responsive wrapper: Sidebar on desktop, BottomNav on mobile
- Extract duplicated header into shared `<PageHeader />` component
- Add `<QuickCreateFAB />` floating action button (mobile: above bottom nav; desktop: in sidebar or header)
- Custom breakpoint hook: `useBreakpoint()` returning `{ isMobile, isTablet, isDesktop }`

#### Phase 2 — PWA: Install, Offline, Push

- Add `manifest.json` with app name, icons, theme color, display: standalone
- Add `next-pwa` or manual service worker setup
- Implement offline QR cache (IndexedDB / Cache API) for previously viewed QRs
- Web Push notification support (Push API + Service Worker)
- Background sync for visitor creation when offline

#### Phase 3 — Responsive Pages: Home & Visitors

- **Home dashboard:** Adaptive layout — mobile stacks vertically, desktop shows 2-column (unit card + quota left, quick actions + active visitors right)
- **Visitors list:** Mobile: list with FAB. Desktop: table/grid view with sidebar filters
- **Visitors/new:** Mobile: full-screen form. Desktop: side panel / modal overlay
- **Visitor detail:** Mobile: full page. Desktop: expanded card or slide-over panel
- Quick-create FAB opens visitor form with 1-tap preset options

#### Phase 4 — Responsive Pages: History, Maintenance, Profile & Settings

- **History:** Mobile: timeline list. Desktop: filterable table with date range picker
- **Maintenance:** Mobile: list + form wizard. Desktop: split view (list left, form/detail right)
- **Profile & Settings:** Mobile: vertical list. Desktop: card grid with inline editing
- **Notification settings:** Wire toggles to actual API (currently static)

#### Phase 5 — Polish: Transitions, Gestures, RTL, A11y

- Page transitions (Framer Motion or CSS View Transitions API)
- Swipe-to-go-back gesture on mobile
- Pull-to-refresh on mobile list views
- Perfect RTL layout on all breakpoints
- Accessibility audit: ARIA labels, keyboard navigation, focus management
- Loading skeletons, error boundaries, 404 page

### Out of Scope

- GateAI chat integration (separate initiative)
- Smart guest templates (future feature)
- Biometric authentication (FaceID/TouchID)
- Native app features requiring device APIs (contacts, GPS) — those belong in `resident-mobile`
- Admin/management features (those belong in `client-dashboard`)
- Marketplace tab (not part of portal currently)

---

## 5. Technical Architecture

### Navigation Architecture

```
<PortalShell>
  ├── <Sidebar />           # Desktop only (≥ 992px)
  │   ├── Logo + org name
  │   ├── Nav items (Home, Visitors, History, Maintenance, Profile)
  │   ├── <QuickCreateFAB />
  │   └── User avatar + sign out
  ├── <main>
  │   ├── <PageHeader />    # Shared: back/title/action
  │   └── {children}
  └── <BottomNav />         # Mobile only (< 992px)
      ├── Home
      ├── Visitors
      ├── [+ Create]        # Center FAB tab
      ├── History
      └── Profile
</PortalShell>
```

### Breakpoint Strategy

Use custom breakpoints from `packages/ui/src/tokens.ts`:

- `xs` (600px): Large phones
- `sm` (768px): Tablets portrait
- `md` (992px): Sidebar/BottomNav switch point
- `lg` (1200px): Full desktop layout

### PWA Architecture

```
public/
  manifest.json             # App manifest
  icons/                    # PWA icons (192, 512, maskable)
sw.js                       # Service worker (or auto-generated by next-pwa)
src/
  lib/
    sw-register.ts          # Service worker registration
    push-notifications.ts   # Web Push subscription + handling
    offline-cache.ts        # IndexedDB wrapper for QR cache
  hooks/
    use-breakpoint.ts       # Responsive detection hook
    use-offline.ts          # Network status hook
    use-push.ts             # Push notification hook
  components/
    layout/
      portal-shell.tsx      # Responsive shell wrapper
      bottom-nav.tsx        # Shared bottom navigation
      sidebar.tsx           # Desktop sidebar
      page-header.tsx       # Shared page header
      quick-create-fab.tsx  # Floating action button
```

### Dependencies (New)

```
next-pwa                  # PWA support for Next.js
framer-motion             # Page transitions (or use CSS View Transitions API)
workbox-*                 # Service worker tooling (if not using next-pwa)
```

---

## 6. Risks & Open Questions

| Risk                                                     | Mitigation                                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Service worker conflicts with Next.js App Router caching | Use `next-pwa` which handles App Router compatibility                      |
| Web Push requires HTTPS + Vercel domain setup            | Already deployed on Vercel with HTTPS; use VAPID keys                      |
| Desktop sidebar may feel disconnected from mobile tabs   | Use same nav items, icons, and active states in both layouts               |
| Offline QR cache may show stale data                     | Show "cached" indicator + last-updated timestamp; auto-refresh when online |
| FAB may obstruct content on small screens                | Position above bottom nav with safe-area-inset; collapse on scroll         |
| PWA install prompt may be intrusive                      | Use deferred install prompt pattern; show after 2nd visit                  |
| RTL layout doubling the CSS surface                      | Use Tailwind `rtl:` variants; test with Arabic locale from start           |

---

## 7. Proposed Phase Breakdown (for /plan)

| Phase | Deliverable                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1     | Foundation: Shared layout components (`PortalShell`, `BottomNav`, `Sidebar`, `PageHeader`, `QuickCreateFAB`, `useBreakpoint`) |
| 2     | PWA: manifest, service worker, offline QR cache, Web Push registration                                                        |
| 3     | Home + Visitors responsive redesign (adaptive grids, FAB, desktop table view)                                                 |
| 4     | History + Maintenance + Profile & Settings responsive (adaptive layouts, wire notification toggles)                           |
| 5     | Polish: transitions, gestures, RTL audit, a11y, loading/error boundaries, final QA                                            |

---

## 8. How This Connects to Other Initiatives

- **`resident_mobile`** — Shares API endpoints (`/api/resident/*`); portal acts as web fallback when native app is not installed
- **`client_dashboard_v10_redesign`** — Portal sidebar should share visual language (ADS tokens, icon style) but be simpler (resident-focused)
- **`gateai`** — Future: GateAI chat could be added as a tab or drawer in the portal (out of scope now)
- **`pagespeed_100`** — PWA and service worker must not degrade Lighthouse scores; lazy-load non-critical assets

---

## 9. Open Questions for Refinement

- [ ] Should the center FAB open a full visitor form or a quick-select menu (last visitor, template, open QR)?
- [ ] Should desktop sidebar be collapsible (like client-dashboard) or fixed?
- [ ] Should we support offline visitor creation (queue + sync) or just offline QR display?
- [ ] Should notification settings wire to the same API as `resident-mobile` push tokens?
- [ ] Do we need a loading skeleton system or just simple spinners for Phase 1?
