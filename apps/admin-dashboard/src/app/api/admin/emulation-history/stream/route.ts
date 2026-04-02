import { NextRequest } from 'next/server';
import { prisma, AiActionStatus } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const POLL_INTERVAL_MS = 3_000;
const KEEPALIVE_INTERVAL_MS = 15_000;
const MAX_LIFETIME_MS = 5 * 60 * 1000;

/**
 * ## GET /api/admin/emulation-history/stream
 *
 * Server-Sent Events endpoint for the Admin Monitoring Hub.
 * Polls AiActionLog for new emulation/seeding events.
 *
 * Auth: Internal Admin session.
 */
export async function GET(request: NextRequest): Promise<Response> {
  if (!(await isAdminAuthorized(request))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  if (!organizationId) {
    return new Response('organizationId required', { status: 400 });
  }

  const encoder = new TextEncoder();
  let lastEventAt = new Date();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const lifetimeTimer = setTimeout(() => {
        if (!closed) {
          closed = true;
          try {
            controller.enqueue(encoder.encode('retry: 1000\n\n'));
            controller.close();
          } catch {}
        }
      }, MAX_LIFETIME_MS);

      let keepaliveCounter = 0;
      const pollsPerKeepalive = Math.ceil(
        KEEPALIVE_INTERVAL_MS / POLL_INTERVAL_MS
      );

      const pollTimer = setInterval(async () => {
        if (closed) {
          clearInterval(pollTimer);
          clearTimeout(lifetimeTimer);
          return;
        }

        try {
          // skip-organization-check (Admin Management)
          const logs = await prisma.aiActionLog.findMany({
            where: {
              organizationId,
              actionType: { in: ['EMULATE_TRAFFIC', 'SEED_HIERARCHY'] },
              createdAt: { gt: lastEventAt },
            },
            orderBy: { createdAt: 'asc' },
            take: 20,
          });

          if (logs.length > 0) {
            lastEventAt = logs[logs.length - 1].createdAt;
            keepaliveCounter = 0;

            for (const log of logs) {
              if (closed) break;
              const data = JSON.stringify(log);
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } else {
            keepaliveCounter++;
            if (keepaliveCounter >= pollsPerKeepalive) {
              keepaliveCounter = 0;
              try {
                controller.enqueue(encoder.encode(': keepalive\n\n'));
              } catch {
                closed = true;
                clearInterval(pollTimer);
                clearTimeout(lifetimeTimer);
              }
            }
          }
        } catch (err) {
          try {
            controller.enqueue(encoder.encode(': keepalive\n\n'));
          } catch {
            closed = true;
            clearInterval(pollTimer);
            clearTimeout(lifetimeTimer);
          }
        }
      }, POLL_INTERVAL_MS);

      request.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(pollTimer);
        clearTimeout(lifetimeTimer);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
