# Phase 2: SSE Endpoint — /api/events/stream

## Primary role
BACKEND-API + SECURITY

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/client-dashboard`
- **Refs**:
  - `apps/client-dashboard/src/lib/require-auth.ts` — auth helper (reads cookies)
  - `apps/client-dashboard/src/lib/realtime/emit-event.ts` — Phase 1 output (EventLog schema)
  - `apps/client-dashboard/src/app/api/qrcodes/route.ts` — reference for auth + response pattern
  - Next.js App Router `Response` + `ReadableStream` docs — SSE transport

## Goal
Build the `GET /api/events/stream` endpoint — a stateless, org-scoped Server-Sent Events stream that polls the EventLog table every 3 seconds and forwards new events to the browser. Works in serverless environments because there is no in-memory state.

## Scope (in)

**`src/app/api/events/stream/route.ts`**:

```ts
import { requireAuth } from '@/lib/require-auth';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // SSE requires Node.js runtime, not Edge

export async function GET(request: NextRequest) {
  // 1. Auth check
  const auth = await requireAuth(request);
  if (!auth.success) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { orgId } = auth;

  // 2. Set up SSE stream
  const encoder = new TextEncoder();
  let lastEventAt = new Date(); // start: only events from now onwards
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Max lifetime: 5 minutes
      const maxLifetime = setTimeout(() => {
        closed = true;
        controller.close();
      }, 5 * 60 * 1000);

      // Keepalive + poll loop
      const interval = setInterval(async () => {
        if (closed) {
          clearInterval(interval);
          clearTimeout(maxLifetime);
          return;
        }
        try {
          // Poll for new events
          const events = await prisma.eventLog.findMany({
            where: {
              organizationId: orgId,
              createdAt: { gt: lastEventAt },
            },
            orderBy: { createdAt: 'asc' },
          });

          if (events.length > 0) {
            lastEventAt = events[events.length - 1].createdAt;
            for (const event of events) {
              const data = JSON.stringify({ type: event.type, payload: event.payload });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } else {
            // Keepalive comment (prevents proxy timeouts)
            controller.enqueue(encoder.encode(`: keepalive\n\n`));
          }
        } catch {
          // DB error: send keepalive, don't crash
          controller.enqueue(encoder.encode(`: keepalive\n\n`));
        }
      }, 3000); // poll every 3 seconds

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(interval);
        clearTimeout(maxLifetime);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx buffering
    },
  });
}
```

**Security checklist:**
- `requireAuth` called first — returns 401 if no valid cookie
- `orgId` from JWT claims — never from query params (prevents org spoofing)
- EventLog query always includes `organizationId: orgId` — no cross-tenant leakage
- No user input used in DB query (no SQL injection surface)
- `export const runtime = 'nodejs'` — required for `setInterval` in App Router

**Manual test procedure** (document in PR description):
```bash
# 1. Login to client-dashboard, copy the accessToken cookie value
# 2. In terminal:
curl -N \
  -H "Cookie: accessToken=<your_token>" \
  http://localhost:3001/api/events/stream

# 3. In another terminal, create a QR via API or UI
# 4. Verify SSE stream outputs: data: {"type":"QR_CREATED","payload":{...}}
```

## Steps (ordered)
1. Create `apps/client-dashboard/src/app/api/events/stream/route.ts` with the full implementation above.
2. Verify `runtime = 'nodejs'` and `dynamic = 'force-dynamic'` are exported.
3. Test manually with `curl` as described above:
   - Without cookie → should return 401
   - With cookie → should receive keepalive comments every 3s
   - Create a QR → should receive `data: {"type":"QR_CREATED",...}` within 3s
4. Verify no events from a different org appear (test with two org accounts if possible).
5. Run `pnpm turbo typecheck --filter=client-dashboard`.
6. Run `pnpm turbo lint --filter=client-dashboard`.
7. Commit: `feat(realtime): SSE endpoint /api/events/stream — DB-polling, org-scoped (phase 2)`.

## Scope (out)
- Client hook (Phase 3)
- Optimistic updates (Phase 4)
- Admin dashboard SSE (future)

## Acceptance criteria
- [ ] `GET /api/events/stream` without auth cookie returns 401
- [ ] `GET /api/events/stream` with valid cookie: stream opens, keepalive comments arrive every ~3s
- [ ] After a QR is created in the same org: `data: {"type":"QR_CREATED",...}` arrives within 3s
- [ ] After a scan: `data: {"type":"SCAN_RECORDED",...}` arrives within 3s
- [ ] Events from other orgs never appear in the stream
- [ ] Connection closes cleanly after 5 minutes (or on client disconnect)
- [ ] `export const runtime = 'nodejs'` present (not Edge)
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] `pnpm turbo lint --filter=client-dashboard` passes

## Files likely touched
- `apps/client-dashboard/src/app/api/events/stream/route.ts` (new)

## Git commit
```
feat(realtime): SSE endpoint /api/events/stream — DB-polling, org-scoped (phase 2)
```
