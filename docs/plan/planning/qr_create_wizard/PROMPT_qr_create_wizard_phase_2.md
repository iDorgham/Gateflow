# Phase 2: Wizard Shell & Steps 1–2 (Access Type + Gate & Schedule)

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui
- **Rules**: Use existing `@gate-access/ui` components; `framer-motion` already installed.
- **Refs**:
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx` — current flat form (610 lines) to rewrite
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/page.tsx` — server wrapper
  - `apps/client-dashboard/src/components/project-wizard.tsx` — reference multi-step pattern with `AnimatePresence`
  - `packages/ui/src/index.ts` — available UI components

## Goal
Rewrite `create-qr-client.tsx` as a 4-step wizard shell. Implement Steps 1 and 2 fully. Steps 3 and 4 render placeholder content (to be filled in Phase 3).

## Scope (in)
- Wizard shell with `step` state (1–4), `StepIndicator` component, and `AnimatePresence` slide transitions.
- **Step 1 — Access Type:** Three full-width visual cards (SINGLE / RECURRING / PERMANENT) with icon, title, description, and selected state. Keyboard-accessible (tab + space/enter to select). "Next →" button.
- **Step 2 — Gate & Schedule:** Gate selector (`<Select>`), expiry datetime (hidden for PERMANENT), max uses input (only for RECURRING). "← Back" + "Next →" buttons. Form validation before advancing.
- Steps 3 and 4: render a placeholder `<div>Coming in Phase 3</div>` so the shell is testable end-to-end.
- Preserve all existing state variables and logic from the original file; just reorganize them behind step gating.

## Scope (out)
- Step 3 guest details (Phase 3).
- Step 4 review + generate (Phase 3).
- No new API calls in this phase.

## Steps (ordered)
1. Read `create-qr-client.tsx` in full and understand all existing state, functions, and JSX.
2. Create a `StepIndicator` sub-component inside the file:
   ```tsx
   // steps: { label: string }[]
   // current: 1-indexed current step
   // Renders horizontal bar with numbered circles + connecting lines + labels
   ```
   Use `primary` color for active/completed, `muted` for upcoming.
3. Rewrite the component body:
   - Keep all existing `useState` declarations at the top.
   - Replace the single return JSX block with a step-gated render:
     ```tsx
     <AnimatePresence mode="wait">
       <motion.div key={step} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.2 }}>
         {step === 1 && <Step1 ... />}
         {step === 2 && <Step2 ... />}
         {step === 3 && <div>Guest details — coming soon</div>}
         {step === 4 && <div>Review — coming soon</div>}
       </motion.div>
     </AnimatePresence>
     ```
4. Implement `Step1` (type selection cards):
   - Three `<button>` or `<Card>`-based cards in a vertical stack (or 3-col grid on lg).
   - Each card: icon (`QrCode` / `RefreshCw` / `Infinity`), bold title, 1-line description.
   - Active: `border-primary bg-primary/5` + `CheckCircle2` badge in top-right corner.
   - On select: `setType(selectedType)`.
   - "Next" button: `onClick={() => setStep(2)}`.
5. Implement `Step2` (gate & schedule):
   - Gate `<Select>` — `value={gateId}` + "No gate restriction" option.
   - Expiry `<Input type="datetime-local">` — hidden when `type === PERMANENT`.
   - Max uses `<Input type="number">` — shown only when `type === RECURRING`.
   - Back/Next buttons with validation: expiry must be future, maxUses ≥ 1.
6. Run `pnpm turbo lint --filter=client-dashboard` — fix any warnings.
7. Commit: `feat(qrcodes): wizard shell with steps 1–2 — type selection and gate schedule (phase 2)`.

## Acceptance criteria
- [ ] Wizard renders with `StepIndicator` showing 4 steps.
- [ ] Step 1 cards are selectable and keyboard-navigable; selected card is visually distinct.
- [ ] Step 2 shows/hides expiry and max-uses correctly based on QR type.
- [ ] "Back" and "Next" navigate correctly; "Next" validates before advancing.
- [ ] `AnimatePresence` slide-in/out animations play between steps.
- [ ] `pnpm turbo lint` passes.
