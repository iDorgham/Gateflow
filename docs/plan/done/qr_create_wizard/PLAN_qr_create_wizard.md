# PLAN: QR Create Wizard — Guest Details & UI Refinement

**Slug:** `qr_create_wizard`
**Initiative:** Refactor the single-page QR creation form into a polished multi-step wizard; add guest name, contact selection, and email in the last step.
**App:** `client-dashboard`
**Status:** Ready

---

## Problem

The current QR creation page (`qrcodes/create/`) is a flat form with toggled tabs — no clear step progression, no guest metadata stored with the QR (guest name/email live only in the send-email field and are lost after submission), and no visual guidance through the 4 decisions a user must make (type → gate → guest → review).

## Goal

- **Multi-step wizard** (4 steps) with a progress indicator and smooth animated transitions.
- **Guest metadata** (name, email, phone, linked contact) persisted on the `QRCode` record so it can be displayed in scan logs, exports, and the QR detail view.
- **Step 3 — Guest Details:** contact picker (search org contacts, auto-fill name/email) OR manual entry.
- **Step 4 — Review & Generate:** summary card → generate → inline QR display with download + send email (pre-filled from guest email).

---

## Phases

### Phase 1 — Schema & API: Guest Metadata on QRCode
**Role:** BACKEND-API | **Tool:** Cursor
**Scope:**
- Add `guestName String?`, `guestEmail String?`, `guestPhone String?`, `contactId String?` to `QRCode` model.
- `prisma db push` + regenerate.
- Update `POST /api/qrcodes` and server action `createQRCode()` to accept and persist guest fields.
- Update `GET /api/qrcodes` select to return guest fields.
- Update `QrShortLink` payload to include guest name for the landing page display.

**Acceptance criteria:**
- `prisma db push` applies cleanly.
- POST body accepts `{ guestName, guestEmail, guestPhone, contactId }` (all optional).
- Guest fields returned in GET list response.
- Typecheck and tests pass.

---

### Phase 2 — Wizard Shell & Steps 1–2
**Role:** FRONTEND | **Tool:** Cursor
**Scope:**
- Rewrite `create-qr-client.tsx` as a 4-step wizard with a `step` state variable (1–4).
- Step progress bar component at the top (step number + label, animated active indicator).
- **Step 1 — Access Type:** Three large visual cards for SINGLE / RECURRING / PERMANENT with icon, title, and description. Selected card highlighted with primary border + checkmark.
- **Step 2 — Gate & Schedule:** Gate selector dropdown, expiry datetime (conditional on type), max uses input (RECURRING only). "Back" + "Next" navigation.
- Framer Motion `AnimatePresence` for slide-left/right between steps.
- All existing logic (defaultExpiry, validation) preserved.

**Acceptance criteria:**
- Wizard renders steps 1 and 2 with correct validation.
- Type selection cards are keyboard-navigable (arrow keys or tab+space).
- Step indicator correctly marks active/completed steps.
- `pnpm turbo lint` passes.

---

### Phase 3 — Steps 3–4: Guest Details, Review & Polish
**Role:** FRONTEND | **Tool:** Cursor
**Scope:**
- **Step 3 — Guest Details:**
  - Toggle: "From Contact" (search-as-you-type list from org contacts, shows name+email+phone) vs "Manual Entry" (name, email, phone fields).
  - Selecting a contact auto-fills name/email/phone fields.
  - All fields optional (step can be skipped with "Skip & Generate").
- **Step 4 — Review & Generate:**
  - Summary card showing all choices (type badge, gate, expiry, max uses, guest name/email).
  - "Generate QR" button triggers server action with full payload (including guest fields).
  - After generation: inline QR display (existing SVG component) with download buttons and send-email input pre-filled with guest email.
  - "Create Another" resets wizard to Step 1.
- Update `createQRCode()` call to pass guest fields.
- Update `page.tsx` to pass contacts to client.

**Acceptance criteria:**
- Contact picker filters contacts by name/email in real-time.
- Guest fields are sent to the server action and persisted in DB.
- Email input in Step 4 is pre-filled from guest email (if provided in Step 3).
- QR appears inline after generation — no full page reload.
- `pnpm turbo lint` and `pnpm turbo typecheck` pass.

---

## Key Files

| File | Change |
|------|--------|
| `packages/db/prisma/schema.prisma` | Add 4 guest fields to `QRCode` |
| `apps/client-dashboard/src/app/api/qrcodes/route.ts` | Accept + return guest fields |
| `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/actions.ts` | Pass guest fields to `prisma.qRCode.create` |
| `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx` | Full rewrite as 4-step wizard |
| `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/page.tsx` | Pass contacts prop |

## Dependencies

- `framer-motion` — already in client-dashboard
- `@gate-access/ui` — existing components (Input, Select, Button, Badge, Card)
- `react-qr-code` — already used for QR display

## Risks

- **Scope creep on Step 3:** Keep contact picker simple — search list + auto-fill; no inline contact creation.
- **Schema migration:** `prisma db push` in dev; production needs a proper migration before deploy.
