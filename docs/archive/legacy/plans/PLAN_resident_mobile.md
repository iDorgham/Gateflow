# PLAN: Resident Mobile App — Phase 2 Flagship

**Slug:** `resident_mobile`
**App:** `apps/resident-mobile` + `apps/client-dashboard` (API layer)
**Status:** Ready
**Source:** `docs/plan/context/IDEA_resident_mobile.md` · PRD v6.0 §4, §14
**Port:** 8083 (mobile Metro), 3001 (client-dashboard API)

---

## Context snapshot

### Existing state

| Area | Status |
|---|---|
| App skeleton (`apps/resident-mobile/`) | 3-tab shell (QRs / History / Settings), expo-router, Ionicons |
| Auth libs | `expo-jwt`, `expo-secure-store` in place |
| Login screen | `app/login.tsx` exists — no backend wiring |
| QRs tab | `app/(tabs)/qrs/index.tsx` — stub only |
| History tab | `app/(tabs)/history/index.tsx` — stub only |
| Settings tab | `app/(tabs)/settings/index.tsx` — stub only |
| Visitor detail | `app/visitors/[id].tsx` — stub only |
| Resident Portal web | `apps/resident-portal/` — live, pages only, no API routes |
| Resident API routes | `apps/client-dashboard/src/app/api/resident/` — does not exist |
| DB models | Unit, VisitorQR, AccessRule, ResidentLimit — verify in schema.prisma |
| Push infra | Not integrated anywhere |
| expo-contacts | Not in package.json |
| expo-sharing | Not in package.json |
| expo-notifications | Not in package.json |

### Key architecture constraints

- Resident APIs live in `apps/client-dashboard` under `/api/resident/*` — not in resident-portal
- All routes require `requireAuth` + `role === 'RESIDENT'` check
- Tokens stored in `expo-secure-store` (already a dep); same 15-min access / 30-day refresh pattern as scanner-app
- Database: always filter `deletedAt: null`; scope by `organizationId` (via unit → org relationship)
- QR landing page (`/s/[shortId]`) must not break — extend only
- pnpm only; imports via `@gate-access/db`, `@gate-access/types`
- No direct DB access from mobile — all via client-dashboard REST API
- `expo-notifications` requires physical device or simulator with push entitlements; test with Expo Go where possible

---

## Phases

| # | Title | Role | Files changed (est.) | Depends on |
|---|---|---|---|---|
| 1 | Schema verify + Resident API layer | BACKEND-API + SECURITY | 10–14 | — |
| 2 | QRs tab: list, create, delete, offline cache | MOBILE + FRONTEND | 5–8 | Phase 1 |
| 3 | Contact picker + share sheet | MOBILE | 4–6 | Phase 2 |
| 4 | Push notifications: token + scan event | MOBILE + BACKEND-API | 6–8 | Phase 1 |
| 5 | GPS guide + arrival notification | MOBILE + FULLSTACK | 5–7 | Phase 4 |
| 6 | History tab, Settings, RTL polish, tests | QA + i18n | 6–10 | All |

---

## Phase detail

### Phase 1 — Schema verify + Resident API layer
**Goal:** Verify DB models are correct, add missing fields, and build all `/api/resident/*` routes in client-dashboard with RESIDENT auth guard.

**Key deliverables:**
- Schema: Unit (+ lat/lng optional), VisitorQR, AccessRule, ResidentLimit — verified or patched
- User model: `expoPushToken String?` field added
- 9 new API routes in `apps/client-dashboard/src/app/api/resident/`
- `requireResident()` helper (extends `requireAuth` with role check)
- Jest tests for at least 3 routes

**Acceptance criteria:**
- All routes return 401 without RESIDENT JWT
- Unit + quota returned correctly from `/api/resident/me`
- `pnpm turbo lint --filter=client-dashboard` passes
- `pnpm turbo typecheck --filter=client-dashboard` passes
- Tests pass

---

### Phase 2 — QRs tab: list, create, delete, offline cache
**Goal:** Wire the QRs tab to real data — list visitor QRs, create new ones with access rule selection, delete, and cache for offline QR display.

**Key deliverables:**
- QRs tab: `FlatList` of VisitorQR cards with access rule badge + status
- Create form: name, phone, access rule selector (one-time / date range / recurring / permanent)
- Delete with confirmation
- AsyncStorage cache (`resident_qrs_v1`) for offline display
- QR code image render using `react-native-qrcode-svg`

**Acceptance criteria:**
- QRs load from API on mount, cached locally
- Create form validates required fields before submit
- Offline: QRs render from cache with "offline" badge
- TypeScript strict: zero errors
- `pnpm --filter=resident-mobile typecheck` passes

---

### Phase 3 — Contact picker + share sheet
**Goal:** Let resident select a phone contact to pre-populate visitor form, then share the QR link via the OS share sheet.

**Key deliverables:**
- Add `expo-contacts`, `expo-sharing` to `resident-mobile/package.json`
- Contact picker screen (`app/contact-picker.tsx`) with search + FlatList
- Pre-populate name/phone in create form from contact
- Post-create: trigger `expo-sharing` with message "Your gate pass: [link]"
- Permission handling: graceful fallback to manual input if denied

**Acceptance criteria:**
- Contact picker opens with permission prompt on first use
- Deny → manual input fallback shown, no crash
- Share sheet opens immediately after QR creation
- TypeScript strict: zero errors

---

### Phase 4 — Push notifications: token registration + scan event
**Goal:** Register resident's Expo push token on login, then send a push notification when their visitor scans at the gate.

**Key deliverables:**
- Add `expo-notifications` to `resident-mobile/package.json`
- Permission request on first login, token stored via `/api/resident/push-token`
- Backend: extend QR validation route to resolve resident from VisitorQR → send Expo Push on SUCCESS
- Deep link from notification → History tab
- In-app notification handler when app is foregrounded

**Acceptance criteria:**
- Token POSTed to API after permission grant
- Scan event triggers push (testable with Expo Push Tool)
- Foreground notification shows in-app banner
- TypeScript strict: zero errors
- `pnpm turbo typecheck --filter=client-dashboard` passes (push logic)

---

### Phase 5 — GPS guide + arrival notification
**Goal:** After a visitor scans at the gate, show a "Get directions" button on the QR landing page, and a "I've arrived" button that notifies the resident.

**Key deliverables:**
- Extend `/s/[shortId]` landing page in client-dashboard:
  - "Get directions" button (shown post-scan if Unit has lat/lng)
  - "I've arrived" button (shown post-successful scan)
- `/api/resident/arrived` route: receives visitor arrival → sends Expo push to resident
- Maps deep link: `maps://` on iOS, `https://maps.google.com/?q=` on Android
- Graceful degradation: buttons hidden if no coords / no push token

**Acceptance criteria:**
- Directions button opens Maps app with correct coordinates
- "I've arrived" POST succeeds and resident receives push
- No scanner-app regression (validate endpoint still works)
- `pnpm turbo lint --filter=client-dashboard` passes
- TypeScript strict: zero errors

---

### Phase 6 — History tab, Settings, RTL polish, tests
**Goal:** Complete the app — wire History and Settings tabs, audit RTL layout, and add Jest tests for API routes.

**Key deliverables:**
- History tab: scan log list from `/api/resident/history`, grouped by date
- Settings tab: notification toggle (POST preference to push-token endpoint), sign out
- RTL audit: all screens correct in Arabic locale (RN I18nManager)
- Jest tests: 5+ tests covering resident API routes
- Lint + typecheck green across both apps

**Acceptance criteria:**
- History tab loads and groups entries by day
- Settings notification toggle persists preference
- RTL layout visually verified for QRs, History, Settings screens
- `pnpm turbo lint && pnpm turbo typecheck` passes (all workspaces)
- All tests pass

---

## TASKS tracking file
`docs/plan/execution/TASKS_resident_mobile.md`
