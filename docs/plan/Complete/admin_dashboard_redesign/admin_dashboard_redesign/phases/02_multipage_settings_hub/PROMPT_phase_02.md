# Phase 2: Categorized Multi-Page Settings Hub

## Primary Role

FRONTEND / BACKEND-API

## Tool Selection

- **Tool 1**: Cursor IDE (Sub-nav shell & form components)
- **Tool 2**: Opencode CLI (Settings validation tests)

## Context

- **Focused App**: `apps/admin-dashboard`
- **Scope**: `/settings` sub-pages: `general`, `security`, `organizations`, `integrations`.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Transform the single flat settings page into a categorized, multi-page settings hub with sub-navigation tabs, allowing super admins to manage platform-wide defaults.

## Scope (In)

1. Settings Shell Layout:
   - Horizontal tab or sidebar sub-navigation for settings sections.
2. Sub-Pages:
   - `/settings/general`: Platform name, branding assets, default timezone/locale.
   - `/settings/security`: Global 2FA enforcement, session timeout rules, IP allowlists.
   - `/settings/organizations`: Default tenant quota tiers and feature flag assignments.
   - `/settings/integrations`: Webhooks, SMS/WhatsApp gateways, audit exports.
3. Unit tests:
   - Form state management, tab routing, and schema validation.
4. Write `phase_logs/PHASE_LOG_phase_02.md`.

## Acceptance Criteria

- [ ] Settings pages navigate smoothly with sub-route URLs.
- [ ] Form validations prevent invalid configurations.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_02.md` created.
