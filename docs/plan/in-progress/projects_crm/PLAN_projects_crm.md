# PLAN: projects_crm — Core CRM Extensions & Operations v2.0

**IDEA:** [IDEA_projects_crm.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/context/IDEA_projects_crm.md)

## Phased Execution Roadmap

### Phase 1: Communication Gateway & Notification Schema (P0)

**Primary role:** `backend-database.md`
**Preferred tool:** `Gemini` (Prisma/Schema focus)

**Scope:**

- **Schema**: Extend `schema.prisma` with `OrganizationCommunicationConfig` (config) and `CommunicationLog` models. [x] **Manual Implementation Complete**
- **Provider API**: Implement an internal utility `/lib/crm/communication-provider.ts` for abstraction (SMS/WhatsApp). [ ] **Next Step**
- **Audit**: Add `AuditLog` creation to the existing Contacts/Units CSV export endpoints. [ ] **In Progress**

**Deliverables:**

- `packages/db/prisma/schema.prisma` update + migration.
- `apps/client-dashboard/src/lib/crm/communication-provider.ts`.
- Audit logs visible in `Admin Dashboard` or `Settings`.

**Acceptance:**

- [ ] `pnpm prisma generate` successful.
- [ ] `AuditLog` entry created with `rowCount` and `userId` on every Contacts/Units CSV export.
- [ ] Security Enforcers GREEN (`node scripts/enforce-security-invariants.js`).

---

### Phase 2: WhatsApp & SMS Invitation Flow (P0)

**Primary role:** `backend-api.md`
**Preferred tool:** `Kiro` (Integration focused)

**Scope:**

- **Routes**: New API endpoint `POST /api/contacts/[id]/invite` to trigger delivery.
- **WhatsApp**: Implement Meta/Infobip deep-link generation logic for client-side sharing.
- **SMS**: Integrate Twilio/Vonage connector in the communication provider.

**Deliverables:**

- `apps/client-dashboard/src/app/api/contacts/[id]/invite/route.ts`.
- Invitation button in the `ContactDetail` view.
- Deep-link generation hook for the `resident-mobile` share-sheet.

**Acceptance:**

- [ ] Successful trigger of an invitation log on request.
- [ ] WhatsApp Deep link correctly encodes the 8-hex ShortId.
- [ ] Integration tests pass for the invitation route.

---

### Phase 3: Visitor Watchlist & Security Alerts (P1)

**Primary role:** `security.md`
**Preferred tool:** `Claude` (Audit & Invariants focus)

**Scope:**

- **Status**: Add `watchlistStatus` (Enum: NONE, BLOCKED, ESCORT) to the `Contact` model.
- **Scanner API**: Update `GET /api/qrcodes/validate` to include the contact's watchlist status in the verification payload.
- **SSE Alerts**: Emit a real-time event when a BLOCKED visitor is scanned.

**Deliverables:**

- `Contact` model update + Prisma migration.
- Scanner API response schema update.
- Real-time notification toast in the `client-dashboard`.

**Acceptance:**

- [ ] Scanner app displays "BLOCKED" warning during an offline/online scan of a watchlisted visitor.
- [ ] Dashboard SSE feed reflects the security alert instantly.
- [ ] `organizationId` guard verified for all watchlist lookups.

---

### Phase 4: CRM Density & Table Intelligence (P1)

**Primary role:** `frontend.md`
**Preferred tool:** `Opencode` (UI generation speed)

**Scope:**

- **UI Toggles**: Add a "Density" button to the CRM toolbar (Contacts, Units).
- **Persistence**: Refactor table state to use `useUserPreferences` API instead of `localStorage`.
- **Saved Views**: Implement "Save Current View" to store filter/sort presets in the user profile.

**Deliverables:**

- Updated table components with density classes (ADS tokens).
- `UserPreferences` API extension for table views.
- "Saved Views" dropdown/manager in the CRM sidebar.

**Acceptance:**

- [ ] Table density persists across page reloads and different devices.
- [ ] ADS Token compliance checked via `node scripts/enforce-ads-design.js`.
- [ ] RTL layout alignment verified for the new Preference modals.

---

### Phase 5: Operations Polish & Final Audit (P2)

**Primary role:** `qa.md`
**Preferred tool:** `Kilo` (Fast terminal verification)

**Scope:**

- **Performance**: Audit `CommunicationLog` traversal time for 100k+ rows.
- **Security Audit**: Final pass on PII leakage in export metadata.
- **RTL Refinement**: Fix any layout shifts in Arabic for the new CRM views.

**Deliverables:**

- Compliance report `AUDIT_crm_v2.md`.
- RTL fixes and performance patches (if any).

**Acceptance:**

- [ ] `pnpm preflight` is 100% green.
- [ ] 0 Design System violations found.
- [ ] 0 Security Invariant violations found.
