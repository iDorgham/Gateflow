# Phase 1: Header Notifications + Side Panel Shell Refine

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/shell.tsx` — header section (lines ~224–252) renders the bell trigger; expired QRs fetched via `fetchExpiredQRs()`
  - `apps/client-dashboard/src/components/dashboard/side-panel.tsx` — current SidePanel with Notifications tab
  - `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx` — chat UI to polish
  - `apps/client-dashboard/src/app/api/notifications/expired-qrs/route.ts` — returns `{ success, items: ExpiredQR[] }`

## Goal
Move notifications out of the side panel and into the header as a bell icon with a dropdown. Refine the AI assistant UI. Side panel becomes AI-only for now (Tasks and Chat tabs come in Phases 3 & 4).

## Scope (in)
- **Notification bell in header**: bell icon (`Bell` from lucide-react) + red badge with `expiredQRs.length`. Clicking opens a `NotificationDropdown` popover.
- **`NotificationDropdown` component** (new file `notification-dropdown.tsx`): popover with a scrollable list of expired QRs (code prefix, gate, project, expired date). "View all" link to `/dashboard/qrcodes`. Empty state when no expired QRs.
- **Remove Notifications tab** from `side-panel.tsx`. Side panel now renders only the AI assistant (single panel, no tabs header needed yet).
- **AI assistant UI polish**:
  - Message bubbles: `whitespace-pre-wrap` for multi-line AI responses
  - Better spacing between messages (increase gap)
  - Improved example prompt chips: rounded-xl with subtle hover
  - Header: add "Powered by Gemini" badge next to title
  - Clear button: move to top-right, use `RotateCcw` icon instead of `Trash2`

## Scope (out)
- Tasks tab (Phase 3)
- Chat tab (Phase 4)
- WebSocket/real-time (Phase 4)

## Steps (ordered)
1. Create `apps/client-dashboard/src/components/dashboard/notification-dropdown.tsx`:
   - Props: `items: ExpiredQR[], locale: string`
   - Use `Popover`/`PopoverTrigger`/`PopoverContent` from `@gate-access/ui` (or a `DropdownMenu` pattern)
   - Bell icon trigger with red badge `{items.length}` when > 0
   - Popover content: header "Notifications", list of expired QRs (code short prefix, gate name, `expiresAt` formatted), "View all QR codes" link at the bottom
   - Empty state: "All clear" with check icon
2. Update `shell.tsx`:
   - Import `NotificationDropdown`
   - Replace the existing notification bell button (lines ~228–245) with `<NotificationDropdown items={expiredQRs} locale={locale} />`
   - Remove `sidePanelTab`, `setSidePanelTab` state if no longer needed
   - Update `SidePanel` call — remove `notificationsCount` and `activeTab` props (if they existed)
3. Update `side-panel.tsx`:
   - Remove the Notifications tab and its content
   - The panel now just wraps `<AIAssistant locale={locale} />` directly (no Tabs component needed; keep the close button)
4. Update `ai-assistant.tsx`:
   - Add `whitespace-pre-wrap` class to AI message bubble
   - Increase `space-y-4` to `space-y-5` in messages container
   - Replace `Trash2` with `RotateCcw` on clear button
   - Add `<span className="text-[9px] ...">Gemini</span>` badge next to the Sparkles icon in the header
   - Update example prompt chips to `rounded-xl` with `hover:shadow-sm`
5. Run `pnpm turbo lint --filter=client-dashboard`.
6. Commit: `feat(shell): move notifications to header bell dropdown; refine AI panel (phase 1)`.

## Acceptance criteria
- [ ] Bell icon visible in header with red badge when expired QRs exist.
- [ ] Clicking bell opens a dropdown listing expired QRs with code, gate, and date.
- [ ] Side panel no longer has a Notifications tab — renders AI chat directly.
- [ ] AI message bubbles support multi-line text.
- [ ] `pnpm turbo lint` passes.
