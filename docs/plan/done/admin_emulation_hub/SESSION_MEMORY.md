# SESSION_MEMORY: Admin Emulation Hub

## Session Context

- **Date**: 2026-04-02
- **Objective**: Initiating the phased plan for the Admin Emulation Hub (Seeding & Control Panel).
- **Files Loaded**: `PLAN_admin_emulation_hub.md`, `advanced-seed-service.ts`, `route.ts`.

## Decisions Made

1. **Hub Structure**: The hub will be located under `/monitoring/hub` and will provide an overview of emulation history from `AiActionLog`.
2. **V3 Parity**: The plan is fully aligned with the original `advanced_seeding_emulation_v3` logic, encompassing everything from Red Sea data (Phase 2), Rich Contacts (Phase 3), and Gaussian Rush-Hour (Phase 5).
3. **Seeding Separation**: "Advanced Seeding" will have a dedicated page (`/monitoring/seeding`) mirroring the hierarchy configuration (Phase 4 of v3) for Admin control.
4. **Audit Strategy**: Every emulation/seeding run, even dry runs, will be audited in `AiActionLog` using the `actorId: 'system-admin'`.
5. **Stress Testing**: Phase 4 will introduce a "Global" mode for platform-wide traffic spikes.

## Open Questions

- Should "Wipe & Re-Seed" support specific project-level cleanup, or only tenant-level?
- Do we need a real-time SSE feed for the control panel, or is 5s polling sufficient for MVP?

## Planned Steps (Next Session)

1. Run `/plan ready admin_emulation_hub` after approval.
2. Start Phase 1: `PROMPT_admin_emulation_hub_phase_01.md`.
