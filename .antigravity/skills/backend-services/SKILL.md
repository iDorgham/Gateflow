# SKILL: Scalable Next.js Backend Services

## Purpose
Define the architecture and implementation standards for server-side logic in GateFlow v9.0, focusing on Server Actions and API Routes.

## Core Principles
1.  **Stateless Execution**: Services should not rely on local server state; use Redis or DB for persistence.
2.  **Result Object Pattern**: Always return a consistent `{ data, error, success }` object.
3.  **Atomic Operations**: Use Prisma transactions for multi-step updates to ensure database integrity.

## Implementation Rules
- **Validation**: Use Zod for every input.
- **Error Handling**: Custom `AppError` class with status codes and logging.
- **Service Layer**: Decouple business logic from API/Action entry points (use `src/services/`).

## Anti-Patterns
- Fetching data directly in Client Components.
- Large, monolithic API routes (split by sub-resource).
- Storing secrets or persistent state in global variables.

## Code Examples

### Zod Validated Server Action
```typescript
"use server";
import { z } from "zod";

const Schema = z.object({ missionId: z.string(), status: z.enum(["OPEN", "CLOSED"]) });

export async function updateMissionStatus(rawInput: unknown) {
  try {
    const input = Schema.parse(rawInput);
    const result = await prisma.mission.update({ where: { id: input.missionId }, data: { status: input.status } });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Validation failed" };
  }
}
```

### Transactional Service Layer
```typescript
export const closeShift = async (shiftId: string) => {
  return await prisma.$transaction(async (tx) => {
    const shift = await tx.shift.update({ where: { id: shiftId }, data: { endedAt: new Date() } });
    await tx.log.create({ data: { type: "SHIFT_CLOSED", shiftId } });
    return shift;
  });
};
```
