# IDEA: projects_crm — Core CRM Extensions & Operations v2.0

## Goal

Extend the **Unified Real Estate CRM** (established in `projects_crm_ui`) with high-demand MENA-specific communication channels, resident safety features, and enterprise-grade audit/reporting capabilities. This initiative bridges the gap between the "UI Foundation" and the "v0.2.0 Reach & Intelligence" vision.

## Background

The `projects_crm_ui` initiative successfully unified Projects, Contacts, Units, and Gate Operations under a single high-density interface. However, several core "Product Vision" items from the PRD v10.0 and critical "Follow-up" items from recent sprints remain open. To achieve **Market Mastery in Egypt & the Gulf**, we must enable frictionless communication (WhatsApp/SMS) and proactive security (Watchlists).

## Constraints

- **Multi-tenancy**: Every communication event (SMS/WhatsApp) must be strictly scoped by `organizationId`.
- **Privacy (GDPR/MENA)**: No PII (names, phone numbers) should be logged in audit metadata.
- **Cost Controls**: SMS/WhatsApp gateways require quota management and rate-limiting at the organization level.
- **ADS Compliance**: All new UI components (Watchlist modals, preference toggles) must use Atlassian Design System tokens.

## Scope

### Phase 1: Communication Gateway & Notification Schema (P0)

- **Schema**: Add `NotificationSettings` and `CommunicationLog` models to `schema.prisma`.
- **Gateway**: Implement a unified provider interface for SMS (Twilio/Vonage) and WhatsApp (Infobip/Meta).
- **Audit**: Implement the "Export Audit Logging" pattern for Contacts and Units CSV exports.

### Phase 2: WhatsApp & SMS Invitation Flow (P0)

- **Integration**: Generate and deliver QR invitation links directly via WhatsApp/SMS from the CRM.
- **Deep Linking**: Implement WhatsApp deep-link generation for "One-Tap Share" inside the browser.
- **Template Context**: Support localized (AR/EN) invitation templates per project.

### Phase 3: Visitor Watchlist & Security Alerts (P1)

- **CRUD**: Enable Residents and Property Managers to flag specific visitors/contacts as "Blocked" or "Requires Escort."
- **Scanner Sync**: Push watchlist status to the `scanner-app` during QR verification.
- **Alerts**: Fire real-time SSE alerts (and push notifications) if a blacklisted visitor attempts a scan.

### Phase 4: CRM Density & Table Intelligence (P1)

- **UI**: Implementation of "Density Toggles" (Compact/Comfortable) across all high-density CRM tables.
- **Persistence**: Migrate `localStorage` table preferences to the `UserPreferences` API for cross-device consistency.
- **Saved Views**: Enable property managers to save custom filter/sort presets (e.g., "Active Units," "Recently Added Contacts").

### Phase 5: Operations Polish & Final Audit (P2)

- **RTL**: Comprehensive audit of RTL alignment for new CRM modals and notification banners.
- **Performance**: Optimize the `CommunicationLog` to ensure high-volume log writes don't block the main database.

## Success Criteria

- [ ] Invitation delivery via WhatsApp/SMS successful for 99% of valid regional numbers.
- [ ] Scanner app correctly identifies "Blacklisted" visitors in < 200ms during an offline/online scan event.
- [ ] Every Contact/Unit export is logged with a compliant Audit entry.
- [ ] Property managers report "Reduced Friction" by managing table density and saved views.

## Risks

- **Gateway Latency**: Regional carrier delays in Egypt/KSA may impact real-time invitation delivery.
- **PII Leakage**: Risk of sensitive visitor data leaking into audit metadata without strict `Prisma.JsonArray` casting hygiene.
- **Usage Costs**: High volume of SMS/WhatsApp events could exceed tenant budgets without strict quota headers.
