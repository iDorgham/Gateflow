# Phase 7: Connectivity (API, Webhooks, Integrations)

## Primary role
BACKEND-API

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: db, api-client, config
- **Rules**: Secrets must never be stored in plain text if possible; organization scoping.
- **Refs**: `PRD_v6.0.md` Section: Marketing & Integrations.

## Goal
Implement API access, real-time webhooks, and third-party marketing integrations.

## Scope (in)
- API Key management table with generation and revocation logic.
- Webhook configuration sheet (URL, Secret, specific events).
- Integration grid cards for Google Tag Manager, HubSpot, etc.
- Custom domain verification UI (DNS verification status).

## Scope (out)
- Live webhook debugging console (Phase 11).

## Steps (ordered)
1. Build the sub-tabbed structure for Connectivity.
2. Implement the API keys management table and generation flow (one-time reveal).
3. Create the Webhook management UI and "Add Webhook" sheet.
4. Build the Integrations UI with cards for various marketing pixels and CRMs.
5. Implement the "Verify Domain" logic (API call to backend DNS service).
6. Verify that integration secrets (API keys for external services) are handled securely.
7. Run `pnpm turbo build --filter=client-dashboard` to ensure no environment variable regressions.
8. After verification: `/github` — commit as `feat(settings): connectivity, api keys, and integrations (phase 7)`.

## Acceptance criteria
- [ ] API keys are generated and correctly revoked.
- [ ] Webhooks can be configured for specific event types.
- [ ] Integration cards save their respective IDs/Secrets.
- [ ] Domain verification UI reflects the real-time status of DNS checks.
- [ ] All organization-level secrets are accurately scoped.
