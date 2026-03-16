# Pro Prompt — Phase 7: Bulk QR Creation Agent – MVP

**Primary role:** BACKEND-API
**Preferred tool:** Cursor

### Goal
Enable natural language bulk QR creation with safety guards.

### Steps
1. Expose bulk QR creation logic as a tool for Gemini.
2. Update system prompt: Gemini must extract `type`, `validFrom`, `validUntil`, `tag`, and `assignTo` from prompts.
3. Integrate with the Phase 6 Confirmation logic.
4. Implement the "creation sequence": Prompt → Preview Table → User Clicks "Confirm" → Success message + download link.
5. `/github` — feat(gateai): phase 7 — bulk QR creation agent.
