# Phase 3: Contact Picker + Share Sheet

## Primary role
MOBILE

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/resident-mobile`
- **Refs**:
  - `apps/resident-mobile/app/qrs/new.tsx` — create form (Phase 2 output)
  - `apps/resident-mobile/lib/api.ts` — fetch helper (Phase 2 output)
  - `EXPO_PUBLIC_API_URL` — base URL
  - Expo docs: `expo-contacts`, `expo-sharing`

## Goal
Let the resident pick a phone contact to pre-populate the visitor creation form, then automatically open the OS share sheet with the QR link after a visitor pass is created.

## Scope (in)

**New dependencies** (add to `apps/resident-mobile/package.json`):
- `expo-contacts`
- `expo-sharing`

**`app/contact-picker.tsx`** — contact picker screen:
- Request `Contacts.requestPermissionsAsync()` on mount
- If denied: show "Enter manually" CTA and navigate back to form; no crash
- FlatList of contacts (display name + phone number)
- Search bar to filter by name
- On contact tap: navigate back to `qrs/new` with `{ name, phone }` params
- Handle contacts with no phone number: skip or show greyed-out

**Update `app/qrs/new.tsx`**:
- Add "Pick from contacts" button at top of form
- If `name` + `phone` are passed as route params (from contact picker), pre-fill fields
- After successful POST (visitor QR created):
  - Extract short QR link from API response
  - Call `Sharing.shareAsync(message)` where message is `"Your gate pass: {shortLink}"`
  - If `expo-sharing` not available (web), copy link to clipboard as fallback

**`components/ContactPickerButton.tsx`** — reusable button:
- Shows contact icon + "Pick from contacts" label
- Handles permission check before navigating

## Steps (ordered)
1. Run `pnpm add expo-contacts expo-sharing --filter=resident-mobile`.
2. Add permissions to `apps/resident-mobile/app.json`:
   - iOS: `NSContactsUsageDescription`
   - Android: `READ_CONTACTS` permission
3. Create `apps/resident-mobile/components/ContactPickerButton.tsx`.
4. Create `apps/resident-mobile/app/contact-picker.tsx`:
   - Permission request → granted: show list; denied: show fallback
   - Filtered FlatList with search input
   - On select: `router.back()` + pass params via shared state or URL params
5. Update `apps/resident-mobile/app/qrs/new.tsx`:
   - Import `ContactPickerButton`
   - Read name/phone from route params if present
   - After POST success: call `Sharing.shareAsync(...)`
6. Run `pnpm --filter=resident-mobile typecheck`.
7. Run `pnpm --filter=resident-mobile lint`.
8. Commit: `feat(resident-mobile): contact picker + share sheet after QR creation (phase 3)`.

## Scope (out)
- Push notifications (Phase 4)
- GPS guide (Phase 5)

## Acceptance criteria
- [ ] "Pick from contacts" button appears on create form
- [ ] Tapping opens contact list with search
- [ ] Selecting a contact pre-fills name + phone in form
- [ ] Denying contacts permission shows manual-entry fallback, no crash
- [ ] After QR creation, share sheet opens with pre-filled message + link
- [ ] `pnpm --filter=resident-mobile typecheck` passes
- [ ] `pnpm --filter=resident-mobile lint` passes

## Files likely touched
- `apps/resident-mobile/package.json`
- `apps/resident-mobile/app.json` (permissions)
- `apps/resident-mobile/components/ContactPickerButton.tsx` (new)
- `apps/resident-mobile/app/contact-picker.tsx` (new)
- `apps/resident-mobile/app/qrs/new.tsx` (updated)

## Git commit
```
feat(resident-mobile): contact picker + share sheet after QR creation (phase 3)
```
