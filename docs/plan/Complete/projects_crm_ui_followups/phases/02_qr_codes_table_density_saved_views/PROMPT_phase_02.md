# PROMPT — Phase 02: QR Codes Table Density & User Preferences (UI/UX)

**Slug:** `projects_crm_ui_followups`  
**Phase:** 02  
**Target App:** `apps/client-dashboard`  
**Primary Role:** FRONTEND  
**Preferred Tool:** Cursor (or Gemini CLI / OpenCode)

---

## 1. Objective

Upgrade the QR Codes management table toolbar with density controls (compact / default / comfortable) and saved views synchronized via `useUserPreferences` to achieve full UX parity with CRM Contacts and Units tables.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/src/components/qrcodes/` (QR codes table and toolbar)
- `apps/client-dashboard/src/hooks/use-user-preferences.ts`
- `apps/client-dashboard/src/components/residents/table-customizer-modal.tsx` (reference / reuse)
- `packages/types/src/` (user preference schema definitions if applicable)

---

## 3. Invariants & Rules

- **Design System**: Use `@atlaskit/tokens` and `nativeTokens` for padding, row height, and spacing tokens.
- **Offline / Fallback Safety**: If the user preferences API fails or user is offline, gracefully fall back to `localStorage`.
- **RTL / Localization**: Ensure density dropdown and column customizer modal support Arabic RTL layouts seamlessly.
- **Performance**: No layout shift (CLS) or unmemoized re-renders on row density changes.

---

## 4. Implementation Steps

1. **Row Density Control**:
   - Implement density selector (`compact` = 36px / `default` = 48px / `comfortable` = 60px row height) in the QR Codes table toolbar.
2. **Column Customizer & Saved Views**:
   - Integrate `TableCustomizerModal` or equivalent for column reordering and visibility.
   - Sync column state and active density to `useUserPreferences` under `tableViews.qrcodes`.
3. **Local Storage Fallback**:
   - Ensure local storage persistence fallback is active when not authenticated or offline.
4. **Testing**:
   - Add component tests for table density state changes and column preference persistence.
5. **Phase Log**:
   - Document results in `phase_logs/PHASE_LOG_phase_02.md`.

---

## 5. Verification Command

```bash
pnpm turbo test --filter=client-dashboard
pnpm turbo lint typecheck --filter=client-dashboard
```
