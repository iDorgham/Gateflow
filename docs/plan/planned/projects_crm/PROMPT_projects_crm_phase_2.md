# Pro Prompt — projects_crm — Phase 2

## Phase 2: WhatsApp & SMS Invitation Flow

### Primary role

`backend-api.md`

### Tool Selection

|                            | Tool     | Why                                          |
| -------------------------- | -------- | -------------------------------------------- |
| **Tool 1** (best quality)  | Kiro CLI | High-quality for API routing and deep-links. |
| **Tool 2** (free fallback) | Cursor   | Shared logic & integration.                  |

### Skills to load

- [x] `gf-api` — Auth, validation, rate limiting
- [x] `gf-i18n` — Localized message templates
- [x] `gf-qr-crypto-security` — ShortId generation
- [x] `using-superpowers`
- [x] `verification-before-completion`

### Goal

Implement the end-to-end flow for generating and delivering QR invitations via SMS/WhatsApp with regional MENA support.

### Scope (in)

- **Integration**: Create `apps/client-dashboard/src/app/api/contacts/[id]/invite/route.ts` with WhatsApp (Meta) and SMS (Twilio) support.
- **Deep Linking**: Implement a utility for WhatsApp deep-Link generation `wa.me/number/?text=encoded_message`.
- **Localization**: Add `invitation` templates in `packages/i18n/` for both AR and EN.

### Steps (ordered)

1. Register `invitation` templates in the `i18n` package.
2. Implement `apps/client-dashboard/src/lib/crm/invite-service.ts` to manage template interpolation.
3. Build the `POST /api/contacts/[id]/invite` endpoint with proper `POST` body (type: 'SMS' | 'WA').
4. Add a "Send Invite" button with a choice dropdown to the Contact detail view in the dashboard.
5. Create an integration test to verify that the invite log is created and the message is "sent" (mocked).
6. Verify RTL for the new invitation modal.

### Acceptance criteria

- [ ] Invitation messages successfully interpolated with the correctly signed 8-hex `ShortId`.
- [ ] User can trigger the invite flow from the Contact detail view.
- [ ] 0 Design System violations for the new "Send Invite" UI.
- [ ] `CommunicationLog` entry correctly mirrors the invitation type and outcome.

### Files likely touched

- `apps/client-dashboard/src/app/api/contacts/[id]/invite/route.ts`
- `apps/client-dashboard/src/lib/crm/invite-service.ts`
- `apps/client-dashboard/src/components/dashboard/contacts/ContactDetailPanel.tsx` (UI)
- `packages/i18n/src/dictionaries/[locale]/crm.json`
