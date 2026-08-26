# Phase 4: Resident Mobile & Portal Maintenance Submission Flow

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Resident maintenance forms & timeline views)
- **Tool 2**: Opencode CLI (Resident ticket submission tests)

## Context

- **Focused Apps**: `apps/resident-mobile`, `apps/resident-portal`
- **Scope**: Resident issue reporting, category selection, photo attachments, and real-time status timeline.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Empower residents to submit unit and common-area maintenance requests with category tags and photos, and track repair status through a live milestone timeline.

## Scope (In)

1. Maintenance Request Form:
   - Category picker (Plumbing, Electrical, HVAC, Carpentry, Painting, Other).
   - Description input and optional image upload placeholder.
   - Urgency indicator (Standard vs Urgent leak/power outage).
2. Real-Time Tracking Timeline:
   - Visual progress steps: `Ticket Submitted` $\to$ `Technician Assigned` $\to$ `In Progress` $\to$ `Resolved`.
   - Displays scheduled arrival time window and assigned technician name.
3. Unit tests:
   - Form validation, request payload construction, and timeline step mapping.
4. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] Resident ticket submission validates all required fields.
- [ ] Timeline component accurately reflects backend work order progression.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
