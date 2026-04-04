# Pro Prompt Phase 2: Sidebar Integration (Chat Drawer)

### Primary role

[FRONTEND | i18n]

### Preferred tool

- [x] OpenCode CLI — Scaffold complex UI from tokens
- [ ] Cursor — Refine animations & accessibility

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard (3001) for sidebar components
- **Package**: ui for ADS tokens (Atlassian Design System)
- **Rules**: pnpm only; 100% ADS token alignment; no hardcoded hexes (#18191a / #1f1f21).
- **Refs**: `CLAUDE.md`, `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`

### Goal

Implement the `TeamSidebarChat` drawer within the existing dashboard shell to enable team communication from any page.

### Scope (in)

- **UI Component:** `TeamSidebarChat.tsx` in `apps/client-dashboard`.
- **UI Flow:** Sidebar remains toggleable (existing behavior), but add a "Team Chat" icon or floating button that opens a high-density chat panel.
- **Components (ADS):** Chat bubbles (sent/received), avatar with status indicator, message input with emoji/send buttons.
- **Logic:** Fetch initial history on mount and allow manual refresh of the message stream.
- **RTL:** Perfect mirroring for Arabic layout (`dir="rtl"`).

### Scope (out)

- No real-time SSE yet (just manual pull or simple interval refresh).
- No member management UI (that's Phase 3).

### Steps (ordered)

2. **Component Scaffold:** Create `apps/client-dashboard/src/components/dashboard/team/TeamSidebarChat.tsx`. Use Shadcn/UI and ADS tokens.
3. **Sidebar Update:** Modify `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`. Add a toggle button for the chat panel (likely a drawer or fixed sidebar overlay).
4. **Implementation:** Use `const messages = useQuery({ queryKey: ["team-messages"], ... })` to load history from Phase 1.
5. **Logic:** Implement `sendMessage` using `POST /api/team/messages` from Phase 1.
6. **Polish:** Ensure it follows the desaturated gray palette (`#18191a` background, `#1f1f21` elevated areas).
7. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] Chat drawer opens smoothly with Framer Motion animations.
- [ ] Messages from the database are displayed correctly in the UI.
- [ ] Send button persists a new message to the database (verify with manual refresh).
- [ ] 0 raw hexes: 100% token usage (including the new gray theme).
- [ ] RTL layout mirrors correctly in Arabic mode.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`
- `apps/client-dashboard/src/components/dashboard/team/TeamSidebarChat.tsx`
- `apps/client-dashboard/src/components/dashboard/team/TeamSidebarToggleButton.tsx` (new)
