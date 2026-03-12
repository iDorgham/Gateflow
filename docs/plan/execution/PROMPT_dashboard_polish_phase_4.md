# Phase 4: AI Panel + Side Panel Tab Refinement

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/side-panel.tsx`
  - `apps/client-dashboard/src/components/dashboard/ai-assistant.tsx`
  - `apps/client-dashboard/src/components/dashboard/tasks-panel.tsx`
  - `apps/client-dashboard/src/components/dashboard/team-chat.tsx`

## Goal
Polish the side panel and all three tabs to look premium: better tab bar, cleaner AI panel header, touch-friendly task rows, consistent avatar sizes.

## Scope (in)
- **`side-panel.tsx`**:
  - Tab bar height: change `h-9` to `h-10`.
  - Tab trigger padding: `px-3` → `px-4`.
  - Add a subtle top border accent on the active tab: use `data-[state=active]:border-b-2 data-[state=active]:border-primary` or a bottom indicator via `relative after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-primary after:rounded-full`.
  - Tab icons: increase to `h-4 w-4`.
  - Close button: right side of tab bar (already there, just ensure spacing is `ml-2`).
- **`ai-assistant.tsx`**:
  - Remove the inner header (`border-b border-border px-4 py-3 bg-muted/20`) — the close button is already in side-panel; the AI header duplicates chrome. Replace with a simpler welcome area that only shows when `hasOnlyWelcome`.
  - Welcome card (when `hasOnlyWelcome`): centered `Sparkles` icon (h-10 w-10), title, "Gemini" badge, subtitle — all inside a `rounded-2xl bg-muted/20 p-6 text-center` card in the messages area.
  - Message avatars: increase from `h-6 w-6` to `h-8 w-8`.
  - Input area: textarea `min-h-[48px]` and `rounded-2xl`; send button `h-11 w-11 rounded-2xl`.
- **`tasks-panel.tsx`**:
  - Task rows: add `min-h-[44px]` for touch targets.
  - "Open tasks" badge in header: use `bg-primary/10 text-primary` for non-zero count.
- **`team-chat.tsx`**:
  - Chat user avatars: `h-8 w-8` (was h-7 w-7).
  - Input: `rounded-2xl` to match AI assistant.

## Steps (ordered)
1. Update `side-panel.tsx`:
   - Tab trigger classes: add `h-10`, `px-4`, `data-[state=active]:text-primary` active accent.
   - Icon sizes: `h-4 w-4`.
2. Update `ai-assistant.tsx`:
   - Remove the static `<div className="... border-b ...">` header block (lines ~169–192).
   - Move the Gemini + title info into the welcome state card in the messages area (only shown when `hasOnlyWelcome`).
   - Increase message avatar sizes: `h-6 w-6` → `h-8 w-8`.
   - Input: `min-height: 48px`, `rounded-2xl`.
   - Send button: `h-11 w-11 rounded-2xl`.
3. Update `tasks-panel.tsx`: task row `min-h-[44px]`.
4. Update `team-chat.tsx`: avatar `h-8 w-8`.
5. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.
6. Commit: `feat(panel): refined AI panel, side panel tabs, tasks and chat polish (phase 4)`.

## Acceptance criteria
- [ ] Side panel tabs are taller (h-10) with clear active indicator.
- [ ] AI panel has no duplicate header — the Gemini badge/title appears only in the welcome card.
- [ ] Message avatars are h-8 w-8.
- [ ] Input area uses rounded-2xl and min-h-[48px].
- [ ] Typecheck and lint pass.
