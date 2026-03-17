# Pro Prompt — Phase 6: Mutation Safety Layer + Confirmation UX Pattern

**Primary role:** SECURITY — Follow SUBAGENT_HIERARCHY.md
**Preferred tool:** Multi-CLI (Claude + Cursor)

### Context
- **Project**: GateFlow (Zero-Trust)
- **Security**: Load gf-security/SKILL.md and CONTRACTS.md.
- **Rules**: Mutations REQUIRE explicit confirmation. Audit ALL actions.

### Goal
Establish a secure bridge between AI intent and database execution, ensuring user control.

### Scope (in)
- Confirmation UI component for AI mutations.
- Server-side validation for "intent confirmation".
- Audit logging infrastructure for `AiActionLog`.

### Scope (out)
- No actual bulk QR creation yet (that's Phase 7).

### Steps
1. Create `AiActionLog` model in `packages/db/prisma/schema.prisma`. Trace `who`, `prompt`, `intent`, `results`, `metadata`.
2. Run `pnpm prisma migrate dev` via shell subagent.
3. Implement a `ConfirmationDialog` component in `@gate-access/ui` that can show a preview table of proposed changes.
4. Update the chat interface to handle "Tool Calls" that require local confirmation.
5. Create an API utility to sign/verify mutation intents.
6. Run `pnpm turbo build` to verify monorepo integrity.
7. `/github` — feat(gateai): phase 6 — mutation safety & audit logging.

### Acceptance Criteria
- [ ] Every AI intent to change data MUST show a confirmation UI.
- [ ] No mutation API can be called without a valid confirmation token/flag.
- [ ] Every prompt and tool call is logged in `AiActionLog`.
