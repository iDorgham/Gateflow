# Context — `guard_patrol_checkpoints`

## Relevant Existing Codebase Files

- **Visual Map**: [`apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx)
- **Live Telemetry Endpoint**: [`apps/client-dashboard/src/app/api/shifts/live/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/shifts/live/route.ts)
- **Handover Endpoint**: [`apps/client-dashboard/src/app/api/shifts/handover/route.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/apps/client-dashboard/src/app/api/shifts/handover/route.ts)
- **Database Schema**: [`packages/db/prisma/schema.prisma`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/db/prisma/schema.prisma)
- **QR Signing & Crypto**: [`packages/db/src/lib/crypto.ts`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/db/src/lib/crypto.ts)
- **ADS Tokens & Design**: [`@gate-access/ui/tokens`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/packages/ui)

## Key Technical Decisions

1. **HMAC-SHA256 Checkpoint QR Tags**:
   - Encodes `{ orgId, routeId, checkpointId, nonce, hmac }`.
   - Prevents screenshot replay or malicious spoofing without physical proximity to the physical placard.
2. **Compound SVG Overlay**:
   - Waypoint nodes plotted on top of the SVG perimeter radar map.
   - Guard's active leg rendered as an animated dashed bezier / polyline.
3. **Multi-Tenancy & Permissions**:
   - `requireSessionIdentity` with `orgId` scoping on all queries.
   - `deletedAt: null` filter on soft-deleted routes and checkpoints.
