# CONTEXT — `guard_shift_visual_map`

## Schema References

### `Gate` (`packages/db/prisma/schema.prisma`)

- `id`: String (cuid)
- `name`: String
- `location`: String?
- `organizationId`: String
- `isActive`: Boolean
- `lastAccessedAt`: DateTime?
- `latitude`: Float?
- `longitude`: Float?
- `locationRadiusMeters`: Int?
- `locationEnforced`: Boolean?
- `deletedAt`: DateTime?

### `GateAssignment` (`packages/db/prisma/schema.prisma`)

- `id`: String (cuid)
- `userId`: String (relation to `User`)
- `gateId`: String (relation to `Gate`)
- `organizationId`: String
- `shiftStart`: String? (HH:mm)
- `shiftEnd`: String? (HH:mm)
- `startTime`: DateTime?
- `endTime`: DateTime?
- `scheduleJson`: Json?
- `deletedAt`: DateTime?

### `ShiftLog` (`packages/db/prisma/schema.prisma`)

- `id`: String (cuid)
- `guardId`: String (relation to `User`)
- `gateId`: String (relation to `Gate`)
- `organizationId`: String
- `startTime`: DateTime
- `endTime`: DateTime?

---

## Live Shift Status Enum

```typescript
export type GateShiftStatus =
  | 'ACTIVE' // Guard currently clocked in (ShiftLog active)
  | 'SCHEDULED' // Guard assigned by GateAssignment but not clocked in yet
  | 'UNMANNED' // Gate is active, but no guard is assigned or clocked in
  | 'OVERRUN' // Active shift exceeding 8 hours without rotation
  | 'OFFLINE'; // Scanner terminal hasn't sent heartbeat in >5 min
```
