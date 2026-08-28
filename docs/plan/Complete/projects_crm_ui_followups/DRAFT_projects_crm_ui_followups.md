# Draft — `projects_crm_ui_followups`

**Slug:** `projects_crm_ui_followups`  
**Last updated:** 2026-08-28  
**Champion:** Client Dashboard Core Team  
**Initiative Link:** `docs/development/initiatives/IDEA_projects_crm_ui_followups.md`  
**Target:** Q3/Q4 2026

> Refined planning notes for Projects CRM UI follow-ups (Contacts & Units CSV export audit logging, rate limiting, and QR Codes table density toggles with saved views). When this feels complete, run **`/prompt projects_crm_ui_followups`** then **`/plan projects_crm_ui_followups`**.

---

## Changelog

- **2026-08-28 (Initial)**: Draft created from `docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md` and focused `client-dashboard` backlog.

---

## 1. Executive Summary & Goals

### Problem Statement

In `apps/client-dashboard`, QR Codes export is rate-limited and audited, but Contacts and Units CSV exports currently lack structured `AuditLog` records and formal rate limiting. Additionally, Contacts and Units tables support advanced density controls, column customization, and persisted saved views via `user preferences`, whereas the QR Codes table only supports basic local storage column reordering.

### Strategic Goals

- **Compliance Parity**: Ensure all bulk CSV export operations (`/api/contacts?format=csv` and `/api/units?format=csv`) emit structured `AuditLog` rows (`CONTACTS_EXPORT`, `UNITS_EXPORT`) without leaking PII in log metadata.
- **Abuse Prevention**: Apply standard rate-limiting on export endpoints matching the `/api/qrcodes/export` pattern.
- **UX Alignment**: Provide consistent table toolbar UX across all operational tables by adding density toggles (compact, default, comfortable) and user-preference-persisted saved views to the QR Codes table.

### Non-Goals

- Modifying the underlying database schema for `Contact`, `Unit`, or `QRCode` models.
- Changing HMAC signature verification logic for QR code generation or validation.
- Overhauling global export formats beyond standard RFC 4180 CSV compliance.

---

## 2. Target Users & Personas

- **Property Security / Community Managers**: Need fast, customizable tables with density toggles and saved view presets when managing hundreds of QR passes daily.
- **Enterprise Compliance & Auditing Officers**: Require immutable, non-PII audit trail logs of every contact, unit, and pass data export.

---

## 3. Technical Architecture & Invariants

```
+-----------------------------------------------------------------------------------+
|                            apps/client-dashboard                                  |
|                                                                                   |
|  [ Contacts Table / Units Table ]           [ QR Codes Table ]                    |
|            |                                        |                             |
|            v                                        v                             |
|  GET /api/contacts?format=csv             GET /api/qrcodes/export                 |
|  GET /api/units?format=csv                          |                             |
|            |                                        |                             |
|            +-------------------+--------------------+                             |
|                                |                                                  |
|                                v                                                  |
|                   [ Rate Limiter Middleware ]                                     |
|                                |                                                  |
|                                v                                                  |
|                  [ AuditLog Service (prisma) ]                                    |
|                   - action: CONTACTS_EXPORT / UNITS_EXPORT                        |
|                   - metadata: { filters, rowCount } (No PII)                      |
|                   - organizationId scoped                                         |
+-----------------------------------------------------------------------------------+
```

### Technical Constraints

- **Stack**: Next.js 14 App Router, TypeScript, Prisma ORM, `@atlaskit/tokens` / `nativeTokens`.
- **Multi-tenancy**: Mandatory `organizationId` scoping on all queries and `AuditLog` entries.
- **Security & PII**: Strictly no raw PII (names, phone numbers, emails) in `AuditLog.metadata`.
- **User Preferences**: Save table views via `useUserPreferences` (`tableViews.qrcodes`) synced to user profile.
- **RTL/i18n**: Support bidirectional layout (Arabic / English) for table customizer and density toolbar controls.

---

## 4. In Scope vs Out of Scope

### In Scope:

- **API Audit Logging**: Emitting `AuditLog` entries for `CONTACTS_EXPORT` and `UNITS_EXPORT` in `apps/client-dashboard/src/app/api/contacts/route.ts` and `apps/client-dashboard/src/app/api/units/route.ts`.
- **Export Rate Limiting**: Applying rate limiting helper to contacts and units export endpoints.
- **QR Codes Table Density Controls**: Toolbar controls for row density (compact / default / comfortable).
- **QR Codes Table Customizer & Saved Views**: Integrating column visibility, ordering, and user preferences persistence (`TableCustomizerModal` parity).
- **Unit & Integration Tests**: Verifying rate limits, audit log creation, and preference persistence.

### Out of Scope:

- Full table pagination redesign or virtual scrolling rewrite.
- Schema migrations on `Contact` or `Unit` entities.

---

## 5. Suggested Phased Roadmap

1. **Phase 1 — Export Audit Logging & Rate Limiting (API & Security)**:
   - Wire audit log creation on contacts & units CSV export with `organizationId` scoping.
   - Sanitize metadata to record only filter keys and export row counts (zero PII).
   - Apply export rate-limiting middleware.
   - Add unit/API integration tests.

2. **Phase 2 — QR Codes Table Density & User Preferences (UI/UX)**:
   - Add row density toggle to QR Codes table toolbar.
   - Connect column customizer modal and user preferences API (`tableViews.qrcodes`).
   - Audit RTL layout and ADS token alignment.
   - Add component tests for saved view persistence.

3. **Phase 3 — Verification, Documentation & Changelog**:
   - Run end-to-end audit verification for table exports and preference syncing.
   - Update `docs/audits/` and `CHANGELOG.md`.
   - Complete preflight checks (`pnpm preflight`).

---

## 6. Open Questions & Risks

- [ ] **Saved Views Storage**: Should QR Codes column preferences sync via localStorage fallback when offline or always through `useUserPreferences` API? _(Recommendation: Use `useUserPreferences` with localStorage fallback matching Contacts/Units pattern)_.
- [ ] **Export Rate Limit Threshold**: Standardize limit to 10 exports per 5-minute window per user/org to match QR codes export.

---

## 7. References

- **Backlog Source**: [`docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md)
- **Completed PR Reference**: PR #38 (`feat/projects-crm-ui`)
- **Table Security Audit**: `docs/plan/Complete/projects_crm_ui/AUDIT_tables_security.md`
- **Existing User Preferences**: `apps/client-dashboard/src/hooks/use-user-preferences.ts`
- **Table Customizer**: `apps/client-dashboard/src/components/residents/table-customizer-modal.tsx`
