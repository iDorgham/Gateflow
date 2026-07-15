# PHASE LOG: Phase 5 (Contextual Modules)

## Summary

Refactored the core resource management modules (Units, Contacts, Maintenance) and the QR creation wizard to utilize vertical-specific terminology and conditional visibility logic.

## Key Changes

- **Units & Contacts**: Integrated `useOrganizationFeatures` to dynamically swap hardcoded labels with i18n keys (e.g., "Classroom" for SCHOOL, "Booth" for NIGHTCLUB).
- **Maintenance Hub**: Adapted server-side rendering to reflect vertical-specific descriptions and terminology for work orders.
- **QR Creation Wizard**: Refactored the multi-step form to be context-aware, updating step labels and descriptions based on the organization type.
- **i18n Registry**: Expanded `en.json` with 10+ new vertical-specific keys for module descriptions and empty states.
- **Module Visibility**: Verified that `Maintenance` is automatically hidden for `NIGHTCLUB` and `EVENT_ORGANISER` verticals via the configuration registry.

## Verification

- Checked `en.json` for all 5 vertical definitions.
- Refactored `units/page.tsx`, `contacts/page.tsx`, and `qrcodes/create/create-qr-client.tsx`.
- Verified server-side terminology in `maintenance/page.tsx`.
- Security: All queries maintain strict multi-tenant isolation (`organizationId` + `deletedAt: null`).

## Next Steps

- Transition to **Phase 6: Settings Integration** to adapt the Advanced Settings (v6) tabs/sections contextual per type.
