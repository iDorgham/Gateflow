# Phase 4: Luxury Invitee Landing Page & Wallet Pass Export

## Primary Role

FRONTEND / FULLSTACK

## Tool Selection

- **Tool 1**: Cursor IDE (Landing page state & digital wallet pass generator)
- **Tool 2**: Opencode CLI (Wallet schema tests)

## Context

- **Focused App**: `apps/marketing`
- **Scope**: Guest landing view (`/s/[id]`), compound GPS directions, Apple Wallet / Google Pay pass schemas.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Build a luxury guest landing page experience featuring organization branding, 1-tap Google/Apple Maps routing, and Apple Wallet / Google Pay pass generation.

## Scope (In)

1. Invitee Landing Page State:
   - Fetches verified pass metadata (Host resident, Unit, Compound name, Validity window, Gate rules).
   - Generates 1-tap navigation URL (`maps.google.com/?q=...`).
2. Digital Wallet Pass Generator:
   - Constructs Apple Wallet (`PKPass`) and Google Wallet JSON payloads with barcode, primary colors, and relevant gate fields.
3. Unit tests:
   - Landing page metadata resolution, GPS navigation URL formatting, and wallet pass payload structures.
4. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] Landing page resolves pass metadata accurately.
- [ ] Wallet pass generator outputs compliant Apple/Google wallet schemas.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
