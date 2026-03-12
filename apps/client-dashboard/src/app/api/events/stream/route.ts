import { NextRequest } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // setInterval requires Node.js runtime, not Edge

// How often to poll the EventLog table for new events (ms)
const POLL_INTERVAL_MS = 3_000;

// How often to send a keepalive comment when there are no new events (ms)
// Must be less than typical proxy/load-balancer idle timeouts (60–90 s)
const KEEPALIVE_INTERVAL_MS = 15_000;

// Max connection lifetime before the client is asked to reconnect.
// Prevents memory leaks from long-lived connections in serverless environments.
const MAX_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/events/stream
 *
 * Server-Sent Events endpoint. Polls the EventLog table every 3 s for new
 * org-scoped events and streams them to the connected browser tab.
 *
 * Auth: uses the gf_access_token cookie (sent automatically by EventSource).
 * Security: all queries are scoped to auth.orgId — no cross-tenant leakage.
 * Stateless: no in-memory pub/sub; works across multiple serverless instances.
 */
export async function GET(request: NextRequest): Promise<Response> {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return new Response('Unauthorized', { status: 401 });
  }
  const orgId = claims.orgId;

  // ── SSE stream ──────────────────────────────────────────────────────────────
  const encoder = new TextEncoder();

  // Track the timestamp of the last event we delivered.
  // Start from now so we only push events that happen after the client connects.
  let lastEventAt = new Date();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      // ── Max lifetime timer ─────────────────────────────────────────────────
      // After MAX_LIFETIME_MS the connection closes with a `retry:` hint so
      // the browser reconnects immediately.
      const lifetimeTimer = setTimeout(() => {
        if (!closed) {
          closed = true;
          try {
            // Hint client to reconnect in 1 s
            controller.enqueue(encoder.encode('retry: 1000\n\n'));
            controller.close();
          } catch {
            // Already closed — ignore
          }
        }
      }, MAX_LIFETIME_MS);

      // ── Poll loop ──────────────────────────────────────────────────────────
      let keepaliveCounter = 0;
      const pollsPerKeepalive = Math.ceil(KEEPALIVE_INTERVAL_MS / POLL_INTERVAL_MS);

      const pollTimer = setInterval(async () => {
        if (closed) {
          clearInterval(pollTimer);
          clearTimeout(lifetimeTimer);
          return;
        }

        try {
          const events = await prisma.eventLog.findMany({
            where: {
              organizationId: orgId,
              createdAt: { gt: lastEventAt },
            },
            orderBy: { createdAt: 'asc' },
            take: 50, // cap to prevent huge bursts
          });

          if (events.length > 0) {
            // Advance cursor
            lastEventAt = events[events.length - 1].createdAt;
            keepaliveCounter = 0; // reset keepalive counter on real events

            for (const event of events) {
              if (closed) break;
              const data = JSON.stringify({ type: event.type, payload: event.payload });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } else {
            // No events — send keepalive comment on schedule
            keepaliveCounter++;
            if (keepaliveCounter >= pollsPerKeepalive) {
              keepaliveCounter = 0;
              try {
                controller.enqueue(encoder.encode(': keepalive\n\n'));
              } catch {
                // Stream closed — stop polling
                closed = true;
                clearInterval(pollTimer);
                clearTimeout(lifetimeTimer);
              }
            }
          }
        } catch {
          // DB error or stream closed: send keepalive and continue
          // (next poll may succeed; client will reconnect on hard failure)
          try {
            controller.enqueue(encoder.encode(': keepalive\n\n'));
          } catch {
            closed = true;
            clearInterval(pollTimer);
            clearTimeout(lifetimeTimer);
          }
        }
      }, POLL_INTERVAL_MS);

      // ── Client disconnect cleanup ──────────────────────────────────────────
      request.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(pollTimer);
        clearTimeout(lifetimeTimer);
        try {
          controller.close();
        } catch {
          // Already closed — ignore
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Disable Nginx/proxy response buffering so events reach the client immediately
      'X-Accel-Buffering': 'no',
    },
  });
}
