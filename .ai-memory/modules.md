# Key Modules

## Scanner App

Flow:

1. Scan barcode → if URL, fetch `/s/{shortId}` to resolve full payload
2. Local verify: `verifyScanQR(payload, QR_SECRET)` from `packages/types`
3. POST `/api/qrcodes/validate` with Bearer JWT
4. 4xx = rejection → show rejected (do NOT queue)
5. 5xx / network = offline → queue, show "accepted offline"
6. Online + scanId → Pass/Deny dialog (`phase: 'decision'`)
7. Deny → POST `/api/scans/{scanId}/deny`

Key libs:

- `apps/scanner-app/src/lib/scan-history.ts` — AsyncStorage history, key `scan_history_v1`
- `apps/scanner-app/src/lib/preferences.ts` — prefs, key `app_preferences_v1`
  Fields: `hapticsEnabled` (default true), `locationEnabled` (default true)

---

## Residents Module

Models: `Contact` + `Unit` + `ContactUnit` (junction)
UnitType enum: STUDIO | ONE_BR | TWO_BR | THREE_BR | FOUR_BR | VILLA | PENTHOUSE | COMMERCIAL

Pages:

- `[locale]/dashboard/residents/contacts/page.tsx`
- `[locale]/dashboard/residents/units/page.tsx`

Notification bell: fetches `/api/notifications/expired-qrs`, shows red dot + dropdown

---

## CRM Extensions (2026-03-02)

Contact new fields: `jobTitle`, `source` (ContactSource), `companyWebsite`, `notes`
Project new fields: `galleryJson` (Json?), `externalUrl`, `gateMode` (GateMode, default MULTI)

Enums:

- `ContactSource`: MANUAL | IMPORT | QR_SCAN | REFERRAL | OTHER
- `GateMode`: SINGLE | MULTI

```ts
import { ContactSource, GateMode } from '@gate-access/db';
```

---

## AI Assistant (client-dashboard)

Route: `apps/client-dashboard/src/app/api/ai/assistant/route.ts`
Model: `claude-haiku-4-5-20251001`
5 tools: `createProject`, `createUnit`, `createQR`, `listRecentScans`, `getProjectStats`

Component: `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`

- Floating button + slide-in panel
- `useChat` from `ai/react`, localStorage key: `gateflow-ai-chat-v1`
- RTL (ar-EG): panel appears on left side
- Mounted in `shell.tsx` as `<AIAssistant locale={locale} />` after `<Toaster>`
- `ANTHROPIC_API_KEY` required — returns 503 if missing

---

## LoginShell Component

File: `packages/ui/src/components/auth/login-shell.tsx`
Props: `variant: 'client' | 'admin'`, `topRight`, `footerExtra`, `errorKey` (triggers shake)
Exported from: `packages/ui/src/index.ts`

Notes:

- `animate-shake` keyframe required in BOTH app tailwind configs
- `LoginControls` uses inline dropdown (not `DropdownMenu` from UI)

---

## Short URL System

Model: `QrShortLink` — `{ shortId (8-hex), fullPayload, orgId, projectId, qrId, expiresAt }`
Route: `/s/[shortId]` in `apps/client-dashboard/src/app/s/` (NOT under `/api/`)

- Browser (Accept: text/html) → HTML info page
- Scanner / API client → raw payload as text/plain

---

## Analytics Cache (current state)

Only `/api/analytics/heatmap` is Redis-cached (10 min TTL).
16 other analytics endpoints are uncached — all candidates.
Helper: `apps/client-dashboard/src/lib/analytics-cache.ts`
Functions: `getCached<T>`, `setCached<T>`, `cacheKey(prefix, parts)`

---

## GateFlow Design System (ADS Successor)

Packages:
- `@gateflow/tokens` — Foundations (Color, Space, Typography)
- `@gateflow/theme` — Multi-mode (Light/Dark/System)
- `@gateflow/ui` — Atomic components
- `@gateflow/components` — Molecule/Pattern components
- `@gateflow/ai` — Agentic UI specifically for chat/streaming

App: `apps/design-system` (Port 3003)
Stack: Tailwind v4 (experimental) + Next.js 15

---

## Admin Dashboard Evolution (2026-04-06)

Context: `docs/plan/Ready/admin_dashboard_evolution/`

Key areas:
- Organizations rebuild (nested sets)
- Side menu reorganization (dynamic icons)
- CMS Front Builder (Webflow-like core)
- AI Task Automation for Blog/Landing Page generation
