# Pro Prompt: GateFlow AI Redesign Phase 4 — Context Engine & Action Chips

## Goal
Give GateFlow Command its "Instinct": Implement the logic for context-aware dynamic suggestion chips.

### Primary role
BACKEND-API / FRONTEND

### Preferred tool
Cursor

### Context
- **AI Engine**: Gemini 1.5 Flash.
- **Rules**: `organizationId` scoping in all state queries.
- **Skills**: `gf-gemini-implementation`, `gf-property-domain-knowledge`.

### Scope (in)
- **Context Service**: Backend logic to determine relevant actions based on:
    - Time of day (e.g., "Shift Briefing").
    - Active Anomaly Alerts (e.g., "Lockdown Gate 4").
    - User Role permissions.
- **AI Suggestion Engine**: Hook Gemini to analyze the "Current Operation State" and return 3-5 high-probability intent chips.
- **Frontend**: Connect `ActionChipBar` to the dynamic suggestion hook.

### Scope (out)
- SSE real-time push (Phase 5).
- Auto-tagging (Phase 6).

### Steps
1. Create `apps/client-dashboard/src/services/command-context.ts`.
2. Implement logic to gather "Situation Context" (Scans, Alerts, Time).
3. Draft the Gemini prompt for "Action Generation".
4. Update the `ActionChipBar` to refresh when critical state changes.

### Acceptance criteria
- [ ] Chips are contextually relevant to the compound's live state.
- [ ] Suggestions update dynamically without full page reload.
- [ ] Logic respects multi-tenancy boundaries.
