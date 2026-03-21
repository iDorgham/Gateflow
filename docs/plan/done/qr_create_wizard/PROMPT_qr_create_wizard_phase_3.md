# Phase 3: Steps 3–4 — Guest Details, Review & Polish

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui
- **Rules**: Contact search is client-side only (contacts loaded server-side and passed as props); no additional API calls for search.
- **Refs**:
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx` — wizard from Phase 2 (steps 1–2 done, steps 3–4 are placeholders)
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/page.tsx` — ensure contacts are passed
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/actions.ts` — updated in Phase 1 to accept guest fields
  - Existing `Contact` interface in `create-qr-client.tsx`

## Goal
Replace the placeholder content in Steps 3 and 4 with full implementations. Wire guest data to the server action. Ensure email send is pre-filled. Apply final visual polish.

## Scope (in)
- **Step 3 — Guest Details:**
  - Toggle row: "From Contact" | "Manual Entry" (two pill buttons, active state).
  - **From Contact mode:** `<Input>` search field that filters contacts by name/email in real-time (client-side, no API call). Scrollable list of matched contacts — each row shows avatar initials, full name, email, phone. Clicking a row selects it: sets `guestName`, `guestEmail`, `guestPhone`. Selected contact row highlighted.
  - **Manual mode:** Three `<Input>` fields — Guest Name, Email, Phone (all optional).
  - Skip button: "Skip & Continue →" advances to Step 4 without filling any guest data.
  - "← Back" + "Next →" buttons.
- **Step 4 — Review & Generate:**
  - Summary card with 5 rows: Type badge, Gate (or "Any gate"), Expiry (or "No expiry"), Max Uses (or "—"), Guest Name + Email (or "Anonymous").
  - "Generate QR" button — calls `createQRCode()` server action with all fields including guest data.
  - After success: QR code display (`react-qr-code`) + download SVG/JPG buttons + copy short URL button (all moved from original file).
  - **Send email section** (inline, below QR): Input pre-filled with `guestEmail` if provided, send button calls `/api/qr/send-email`. Success/error toast.
  - "← Edit" button resets to Step 1.
  - "Create Another" button resets all state and returns to Step 1.
- Update `page.tsx` to load contacts via Prisma and pass to `<CreateQRClient contacts={contacts} />` (may already be done — verify).
- Visual polish: consistent card rounding, subtle shadow on the active step card, `text-[10px] font-black uppercase tracking-widest` for labels throughout.

## Scope (out)
- Inline contact creation (link to `/dashboard/residents/contacts` instead).
- Editing an existing QR code (separate feature).

## Steps (ordered)
1. Read the Phase 2 output of `create-qr-client.tsx` to understand current state shape and prop types.
2. Add guest state variables if not already present from Phase 1 work:
   ```ts
   const [guestName, setGuestName] = useState('');
   const [guestEmail, setGuestEmail] = useState('');
   const [guestPhone, setGuestPhone] = useState('');
   const [selectedContactId, setSelectedContactId] = useState('');
   const [contactSearch, setContactSearch] = useState('');
   const [guestMode, setGuestMode] = useState<'contact' | 'manual'>('contact');
   ```
3. Implement `Step3` sub-component:
   - Mode toggle: two pill `<button>` elements ("From Contact" / "Manual Entry") with `guestMode` state.
   - **Contact mode:** Search `<Input>` + filtered list. Each item: 2-letter initials avatar, `firstName + lastName`, email, phone. `onClick` sets all 3 guest fields + `selectedContactId` + advances to step 4 on double-click or via "Next →".
   - **Manual mode:** Name / Email / Phone inputs (all optional).
   - "Skip & Continue →" sets step to 4 without setting any guest data.
4. Implement `Step4` sub-component:
   - Summary rows using a `dl` / definition list or card grid.
   - "Generate QR" button: calls `createQRCode({ ..., guestName, guestEmail, guestPhone, contactId: selectedContactId || null })`.
   - On success: render existing QR display JSX (moved from original code) — `<QRCode>` SVG, download buttons, copy button.
   - Send email row: `<Input value={sendEmail || guestEmail} onChange={...} />` + "Send" button.
5. Verify `page.tsx` loads contacts:
   ```ts
   const contacts = await prisma.contact.findMany({
     where: { organizationId: org.id, deletedAt: null },
     select: { id: true, firstName: true, lastName: true, email: true, phone: true },
     orderBy: { firstName: 'asc' },
   });
   ```
6. Run `pnpm turbo lint --filter=client-dashboard`.
7. Run `pnpm turbo typecheck --filter=client-dashboard`.
8. Commit: `feat(qrcodes): wizard steps 3–4 — guest details, review, and send email (phase 3)`.

## Acceptance criteria
- [ ] Step 3 contact picker filters in real-time and auto-fills guest name/email/phone on selection.
- [ ] Step 3 manual mode accepts name, email, phone independently.
- [ ] "Skip" advances without requiring guest data.
- [ ] Step 4 summary accurately reflects all choices from steps 1–3.
- [ ] Guest fields are sent to `createQRCode()` and stored in DB (verify with Prisma Studio or a GET /api/qrcodes call).
- [ ] Send email input is pre-filled from `guestEmail` when guest data was entered in Step 3.
- [ ] Typecheck and lint both pass.
