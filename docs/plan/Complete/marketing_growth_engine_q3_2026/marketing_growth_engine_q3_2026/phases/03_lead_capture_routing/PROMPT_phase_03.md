# Phase 3: Adaptive Intent Lead Capture & Qualification Engine

## Primary Role

BACKEND-API / FRONTEND

## Tool Selection

- **Tool 1**: Cursor IDE (Modal flow & API endpoints)
- **Tool 2**: Opencode CLI (API route integration tests)

## Context

- **Focused App**: `apps/marketing`, `apps/client-dashboard`
- **Scope**: Lead capture modal, `/api/leads` route, CRM webhook dispatcher.
- **Packages**: `@gate-access/types`, `packages/db`.

## Goal

Implement a multi-step adaptive qualification modal that categorizes inbound leads by property type, gate count, and timeline, safely storing qualified leads and notifying sales via webhooks.

## Scope (In)

1. Multi-Step Intent Modal:
   - Step 1: Property Type & Scale (Villa compound, high-rise, mixed-use, event).
   - Step 2: Key Operational Pain Point (Long vehicle queues, unauthorized visitors, lost paper logs).
   - Step 3: Contact & Demo Time Preference.
2. REST API `/api/leads`:
   - Zod schema validation, rate-limiting, and DB persistence into `Lead` model.
   - Dispatch to configured CRM webhook (or Slack notification) with fallback retry.
3. Unit tests:
   - Form validation, multi-step state transitions, and API mock tests.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Multi-step modal guides users smoothly without form loss.
- [ ] `/api/leads` validates payload and handles errors cleanly.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
