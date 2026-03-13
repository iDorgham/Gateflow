import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3_600_000);
  const fifteenMinAgo = new Date(now.getTime() - 15 * 60_000);

  // ── DB health ─────────────────────────────────────────────────────────────
  let dbStatus: 'ok' | 'error' = 'error';
  let dbLatencyMs = 0;
  let dbMessage: string | undefined;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbStatus = 'ok';
  } catch (err) {
    dbMessage = err instanceof Error ? err.message : 'Connection failed';
  }

  // ── Redis health ──────────────────────────────────────────────────────────
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  let redisStatus: 'ok' | 'error' | 'unconfigured' = 'unconfigured';
  let redisLatencyMs: number | undefined;
  let redisMessage: string | undefined;

  if (redisUrl && redisToken) {
    try {
      const start = Date.now();
      const res = await fetch(`${redisUrl}/ping`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        signal: AbortSignal.timeout(3000),
      });
      redisLatencyMs = Date.now() - start;
      const json = await res.json() as { result?: string };
      redisStatus = json.result === 'PONG' ? 'ok' : 'error';
      if (redisStatus === 'error') redisMessage = 'Unexpected ping response';
    } catch (err) {
      redisStatus = 'error';
      redisMessage = err instanceof Error ? err.message : 'Connection failed';
    }
  }

  // ── Scan metrics ──────────────────────────────────────────────────────────
  const [scansLastHour, failedScansLastHour, activeScanners, recentScans, totalOrgs, totalUsers] =
    await Promise.all([
      prisma.scanLog.count({ where: { scannedAt: { gte: oneHourAgo } } }),
      prisma.scanLog.count({ where: { scannedAt: { gte: oneHourAgo }, status: { in: ['FAILED', 'EXPIRED'] } } }),
      prisma.scanLog.groupBy({
        by: ['userId'],
        where: { scannedAt: { gte: fifteenMinAgo }, userId: { not: null } },
        _count: true,
      }).then((r) => r.length),
      prisma.scanLog.count({ where: { scannedAt: { gte: new Date(now.getTime() - 5 * 60_000) } } }),
      prisma.organization.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null } }),
    ]);

  const errorRate = scansLastHour > 0 ? failedScansLastHour / scansLastHour : 0;

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    services: {
      database: { status: dbStatus, latencyMs: dbLatencyMs, message: dbMessage },
      redis: { status: redisStatus, latencyMs: redisLatencyMs, message: redisMessage },
    },
    metrics: {
      scansLastHour,
      failedScansLastHour,
      errorRate: Math.round(errorRate * 1000) / 1000,
      activeScanners,
      pendingQueueEstimate: recentScans,
    },
    platform: {
      totalOrgs,
      totalUsers,
      uptime: Math.round(process.uptime()),
    },
  });
}
