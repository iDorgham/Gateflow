# Pro Prompt Template — Phase 3: Home Tab "Express Invite" UI

This phase implements the premium, one-tap widget inside the resident mobile app to trigger sharing.

---

## Phase 3: Home Tab "Express Invite" UI

### Primary role

MOBILE | FRONTEND

### Preferred tool

- [x] Cursor IDE — visual iteration, layout, styling
- [ ] OpenCode CLI — code generation
- [ ] Gemini CLI — i18n analysis

### Context

- **Project**: GateFlow
- **App**: resident-mobile (Expo SDK 54)
- **Library**: Framer Motion (Moti), Reanimated 3
- **Modules**: `expo-sharing`, `expo-contacts`
- **Rules**: Multi-tenant; RTL; premium aesthetics

### Goal

Build an animated "One-Tap Invite" widget on the Home Tab that fetches a signed link and opens the native share sheet.

### Scope (in)

- Create `apps/resident-mobile/components/dashboard/ExpressInviteWidget.tsx`.
- Animation: Smooth entry/exit and press-state morph.
- Logic:
  1. Call `/api/resident/express-invite` (Phase 2).
  2. Pull the returned URL.
  3. Open `Share.share()` native dialog.
- "Recent Guests" horizontal list below the widget.
- Support English and Arabic for the share text.

### Scope (out)

- Redesigning the full resident dashboard (keep widget local).
- Redesigning the landing page (Phase 4).

### Steps (ordered)

1. Create `ExpressInviteWidget.tsx` using `Framer Motion` / `Moti`.
2. Add the widget to `apps/resident-mobile/app/(dashboard)/home/index.tsx`.
3. Integrate native sharing with `expo-sharing`.
4. Logic: Use a "loading" state on the widget while the API is hit.
5. Create localized sharing templates: `sharing.inviteGuest`.
6. Audit RTL (Arabic) layout of the widget.
7. Run `pnpm turbo build --filter=resident-mobile` (to verify no compile errors).
8. **Auto-Sync:** git add, commit, push.

### SuperDesign (optional)

Run *before* implementation:
```bash
superdesign create-design-draft "Premium One-Tap Share widget" --context-file apps/resident-mobile/app/(dashboard)/home/index.tsx
```

### Acceptance criteria

- [ ] Widget is visible and visually premium on the Home tab.
- [ ] Tapping the widget initiates a native share with the correct URL.
- [ ] Recent Guests list is populated correctly (if data exists).
- [ ] RTL layout is perfect (Arabic mode).

### Files likely touched

- `apps/resident-mobile/components/dashboard/ExpressInviteWidget.tsx`
- `apps/resident-mobile/app/(dashboard)/home/index.tsx`
- `apps/resident-mobile/locales/en/common.json`
- `apps/resident-mobile/locales/ar/common.json`
