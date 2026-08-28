# Phase 2: Perimeter Visual Map Patrol Telemetry & Real-Time Monitoring

**Initiative:** `guard_patrol_checkpoints`  
**Phase:** 2 of 3  
**Role:** Senior Frontend Engineer & UI/UX Specialist  
**Preferred Tool:** `cursor`

## Objective

Extend `GuardShiftVisualMap.tsx` on `client-dashboard` to display real-time patrol routes, active guard waypoint positions, animated polyline path overlays, and checkpoint pulse nodes. Build SWR live polling hook `use-live-patrols.ts` and route configuration UI.

## Steps

1. **Live Patrol Telemetry Endpoint (`apps/client-dashboard/src/app/api/patrols/live/route.ts`)**:
   - `GET`: Returns active `PatrolRun` records, current checkpoint index, guard avatar, elapsed run duration, and overdue warning flags.
2. **SWR Polling Hook (`apps/client-dashboard/src/lib/patrols/use-live-patrols.ts`)**:
   - Polling with fallback, error boundaries, and helper functions `buildLivePatrolsUrl` and `parseLivePatrolPayload`.
3. **Visual Map Overlay Extension (`GuardShiftVisualMap.tsx`)**:
   - Render SVG checkpoint nodes with status colors (Green: visited, Amber: pending/active, Red: overdue).
   - Render animated dashed bezier/polyline connections representing the active patrol route path.
4. **Patrol Route Manager Drawer (`PatrolRouteManager.tsx` & `PatrolRouteModal.tsx`)**:
   - Slide-over drawer to configure routes, reorder checkpoints, and trigger printable QR tag downloads.
5. **Unit & Component Tests**:
   - `use-live-patrols.test.ts` and `GuardShiftVisualMap.test.tsx` verifying render states and empty fallbacks.

## Acceptance Criteria

- [ ] `GuardShiftVisualMap.tsx` correctly plots checkpoint nodes and animated route paths.
- [ ] `use-live-patrols.ts` handles active polling and parses payloads safely.
- [ ] Route manager modal supports adding/editing checkpoints with drag-and-drop or index reordering.
- [ ] All tests pass without hydration or React warning issues.
