# Phase 3: WhatsApp Concierge Bot & Automated Guest Approval

## Primary Role

BACKEND-API / FRONTEND

## Tool Selection

- **Tool 1**: Cursor IDE (WhatsApp webhook router & 1-tap push dispatch)
- **Tool 2**: Opencode CLI (Conversational state tests)

## Context

- **Focused Apps**: `apps/client-dashboard`, `apps/resident-mobile`
- **Scope**: WhatsApp guest registration router, resident verification, 1-tap mobile push notification.
- **Packages**: `@gate-access/types`, `@gate-access/ui`.

## Goal

Build a conversational guest access concierge routing WhatsApp guest requests through 1-tap resident mobile approvals to produce instantaneous visitor QR passes.

## Scope (In)

1. WhatsApp Webhook Router:
   - Ingests inbound visitor messages (e.g. "I am visiting Villa 104 - Ahmed").
   - Resolves target resident from property unit registry.
2. Resident 1-Tap Approval Workflow:
   - Emits push notification to resident's device: "Ahmed requests access to Villa 104 [Approve] [Deny]".
   - Resident approval generates HMAC-signed visitor QR pass and returns direct WhatsApp pass link to visitor.
3. Unit tests:
   - Inbound message parsing, resident matching, and approval state transitions.
4. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] WhatsApp message parser extracts guest intent and target unit number.
- [ ] Approval workflow triggers signed QR pass generation on resident confirmation.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
