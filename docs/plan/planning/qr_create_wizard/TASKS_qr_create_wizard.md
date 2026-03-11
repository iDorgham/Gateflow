# TASKS: QR Create Wizard — Guest Details & UI Refinement

**Plan**: [PLAN_qr_create_wizard.md](PLAN_qr_create_wizard.md)
**Status**: Planning Approved / Ready

## Phases

- [x] **Phase 1: Schema & API — Guest Metadata**
  - [x] Add `guestName`, `guestEmail`, `guestPhone`, `contactId` to `QRCode` model
  - [x] `prisma db push` applied
  - [x] POST `/api/qrcodes` accepts and persists guest fields
  - [x] GET `/api/qrcodes` returns guest fields
  - [x] `createQRCode()` action updated

- [x] **Phase 2: Wizard Shell & Steps 1–2**
  - [x] `StepIndicator` component (4 steps, animated active pill)
  - [x] Step 1: type selection cards (SINGLE / RECURRING / PERMANENT)
  - [x] Step 2: gate selector + expiry + max uses
  - [x] `AnimatePresence` slide transitions between steps
  - [x] Steps 3–4 placeholders

- [ ] **Phase 3: Steps 3–4, Guest Details & Review**
  - [ ] Step 3: contact picker (search + auto-fill) + manual entry + skip
  - [ ] Step 4: summary card + generate + inline QR display + send email pre-filled
  - [ ] `page.tsx` passes contacts from Prisma
  - [ ] Guest fields persisted to DB
  - [ ] Lint and typecheck pass

---
*Created: 2026-03-11*
